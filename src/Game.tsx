import minBy from "lodash/minBy";
import * as THREE from "three";
import { useCallback, useMemo, useRef, useState } from "react";
import { quaternions } from "./utils/rotations";
import Grid from "./components/Grid";
import Box from "./components/Box";
import Piece from "./components/Piece";
import Grabbable, { GrabEvent } from "./components/Grabbable";
import PivotBox from "./components/PivotBox";

function quaternionDistance(a: THREE.Quaternion, b: THREE.Quaternion) {
  const dot = a.dot(b);
  return 1 - dot * dot;
}

function isWithinBounds(
  position: { x: number; y: number; z: number },
  size: { x: number; y: number; z: number }
) {
  return (
    Math.abs(position.x) <= (size.x - 1) / 2 &&
    Math.abs(position.z) <= (size.z - 1) / 2 &&
    position.y <= size.y - 0.5 &&
    position.y >= 0.5
  );
}

export default function Game(props: JSX.IntrinsicElements["object3D"]) {
  const [cubePosition, setCubePosition] = useState<[number, number, number]>([
    0.5, 0, 0.5,
  ]);
  const [cubeRotation, setCubeRotation] = useState<[number, number, number]>([
    0, 0, 0,
  ]);
  const groupRef = useRef<THREE.Group>(null!);
  const handleOnStart = useCallback(
    (e: GrabEvent) => {
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
        position.y = 0.5 + Math.round(position.y - 0.5);
        position.z = 0.5 + Math.round(position.z - 0.5);
        const closestQuaternion = minBy(quaternions, (q) =>
          quaternionDistance(q, quaternion)
        );
        if (closestQuaternion) {
          quaternion.copy(closestQuaternion);
        }
        const rotation = new THREE.Euler().setFromQuaternion(quaternion);
        setCubePosition([position.x, position.y, position.z]);
        setCubeRotation([rotation.x, rotation.y, rotation.z]);
      }
    },
    [setCubePosition, setCubeRotation]
  );
  const handleOnEnd = useCallback((e: GrabEvent) => {
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
  const withinBounds = useMemo(() => {
    return isWithinBounds(
      {
        x: cubePosition[0],
        y: cubePosition[1],
        z: cubePosition[2],
      },
      { x: 8, y: 8, z: 8 }
    );
  }, [cubePosition]);
  return (
    <group
      ref={groupRef}
      position={props.position}
      rotation={props.rotation}
      scale={props.scale}
    >
      <Grabbable targetRef={groupRef}>
        <Box position={[0, -0.06, 0]} sizeX={8} sizeY={0.1} sizeZ={8} />
      </Grabbable>
      <Grid size={8} position={[0, 0, 0]}>
        <lineBasicMaterial color="black" />
      </Grid>
      <Grabbable
        position={cubePosition}
        rotation={cubeRotation}
        placeholder={<PivotBox position={[0, 1, 0]} sizeY={2} />}
        onStart={handleOnStart}
        onEnd={handleOnEnd}
        resetOnRelease
      >
        <Piece
          modelType="Knight_Dark_1"
          style={withinBounds ? "black" : "ghost"}
          position={[0, 1, 0]}
        />
      </Grabbable>
    </group>
  );
}
