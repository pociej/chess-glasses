import minBy from "lodash/minBy";
import * as THREE from "three";
import { useCallback, useReducer, useRef } from "react";
import { quaternions } from "./utils/rotations";
import Grid from "./components/Grid";
import Box from "./components/Box";
import Piece, { PieceType } from "./components/Piece";
import Grabbable, { GrabEvent } from "./components/Grabbable";
import PivotBox from "./components/PivotBox";

function quaternionDistance(a: THREE.Quaternion, b: THREE.Quaternion) {
  const dot = a.dot(b);
  return 1 - dot * dot;
}

// function isWithinBounds(
//   position: { x: number; y: number; z: number },
//   size: { x: number; y: number; z: number }
// ) {
//   return (
//     Math.abs(position.x) <= (size.x - 1) / 2 &&
//     Math.abs(position.z) <= (size.z - 1) / 2 &&
//     position.y <= size.y - 2 &&
//     position.y >= 0
//   );
// }

type GamePiece = {
  type: PieceType;
  player: "white" | "black";
  position: [number, number, number];
  rotation: [number, number, number];
};

type GameState = {
  board: Record<string, GamePiece>;
};

type ActionMovePiece = {
  type: "MOVE_PIECE";
  payload: {
    position: [number, number, number];
    rotation: [number, number, number];
  };
  meta: {
    id: string;
  };
};

type GameAction = ActionMovePiece;

const initialState: GameState = {
  board: {
    "1": {
      type: "King",
      player: "white",
      position: [0.5, 0, 0.5],
      rotation: [0, 0, 0],
    },
    "2": {
      type: "Queen",
      player: "black",
      position: [2.5, 0, 0.5],
      rotation: [0, 0, 0],
    },
    "3": {
      type: "Bishop",
      player: "white",
      position: [4.5, 0, 0.5],
      rotation: [0, 0, 0],
    },
  },
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "MOVE_PIECE": {
      const { id } = action.meta;
      const { position, rotation } = action.payload;
      return {
        ...state,
        board: {
          ...state.board,
          [id]: {
            ...state.board[id],
            position,
            rotation,
          },
        },
      };
    }
    default:
      return state;
  }
}

export default function Game(props: JSX.IntrinsicElements["object3D"]) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const groupRef = useRef<THREE.Group>(null!);
  const handleOnStart = useCallback(
    (e: GrabEvent<string>) => {
      const { matrixWorld } = e;
      const group = groupRef.current;
      if (group) {
        group.updateMatrixWorld();
        const matrix = new THREE.Matrix4()
          .copy(matrixWorld)
          .premultiply(new THREE.Matrix4().copy(group.matrixWorld).invert());
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        matrix.decompose(position, quaternion, scale);
        position.x = 0.5 + Math.round(position.x - 0.5);
        // position.y = 0.5 + Math.round(position.y - 0.5);
        position.y = Math.round(position.y);
        position.z = 0.5 + Math.round(position.z - 0.5);
        const closestQuaternion = minBy(quaternions, (q) =>
          quaternionDistance(q, quaternion)
        );
        if (closestQuaternion) {
          quaternion.copy(closestQuaternion);
        }
        const rotation = new THREE.Euler().setFromQuaternion(quaternion);
        if (e.payload) {
          dispatch({
            type: "MOVE_PIECE",
            meta: {
              id: e.payload,
            },
            payload: {
              position: [position.x, position.y, position.z],
              rotation: [rotation.x, rotation.y, rotation.z],
            },
          });
        }
      }
    },
    [dispatch]
  );
  const handleOnEnd = useCallback((e: GrabEvent<string>) => {
    const { inputSource } = e;
    if (inputSource?.gamepad?.hapticActuators?.[0]) {
      inputSource.gamepad.hapticActuators[0]
        .playEffect("dual-rumble", {
          duration: 50,
          strongMagnitude: 1,
          weakMagnitude: 0.5,
        })
        .catch(() => {});
    }
  }, []);
  return (
    <group
      ref={groupRef}
      position={props.position}
      rotation={props.rotation}
      scale={props.scale}
    >
      <Grabbable targetRef={groupRef} interaction="onSelect">
        <Box position={[0, -0.06, 0]} sizeX={8} sizeY={0.1} sizeZ={8} />
      </Grabbable>
      <Grid size={8} position={[0, 0, 0]}>
        <lineBasicMaterial color="black" />
      </Grid>
      {Object.entries(state.board).map(([id, piece]) => {
        return (
          <Grabbable
            key={id}
            payload={id}
            position={piece.position}
            rotation={piece.rotation}
            placeholder={<PivotBox position={[0, 1, 0]} sizeY={2} />}
            onStart={handleOnStart}
            onEnd={handleOnEnd}
            resetOnRelease
            interaction="onSelect"
          >
            <Piece type={piece.type} style={piece.player} scale={0.5} />
          </Grabbable>
        );
      })}
    </group>
  );
}
