import * as THREE from "three";
import { XRInteractionHandler } from "@react-three/xr";
import { useGLTF } from "@react-three/drei";
import Mesh from "./Mesh";

export type ModelType =
  | "Bishop_Dark_1"
  | "Bishop_Dark_2"
  | "Bishop_Light_1"
  | "Bishop_Light_2"
  | "Chess_Board"
  | "King_Dark"
  | "King_Light"
  | "Knight_Dark_1"
  | "Knight_Dark_2"
  | "Knight_Light_1"
  | "Knight_Light_2"
  | "Pawn_Dark_1"
  | "Pawn_Dark_2"
  | "Pawn_Dark_3"
  | "Pawn_Dark_4"
  | "Pawn_Dark_5"
  | "Pawn_Dark_6"
  | "Pawn_Dark_7"
  | "Pawn_Dark_8"
  | "Pawn_Light_1"
  | "Pawn_Light_2"
  | "Pawn_Light_3"
  | "Pawn_Light_4"
  | "Pawn_Light_5"
  | "Pawn_Light_6"
  | "Pawn_Light_7"
  | "Pawn_Light_8"
  | "Queen_Dark"
  | "Queen_Light"
  | "Rook_Dark_1"
  | "Rook_Dark_2"
  | "Rook_Light_1"
  | "Rook_Light_2";

export type PieceStyle = "black" | "white" | "ghost" | "active";

const materials: Record<PieceStyle, Record<string, THREE.Material>> = {
  black: {
    "*": new THREE.MeshPhongMaterial({
      color: "#000000",
      side: THREE.FrontSide,
      specular: "#ffffff",
      shininess: 25,
    }),
  },
  white: {
    "*": new THREE.MeshPhongMaterial({
      color: "#e1e1e1",
      side: THREE.FrontSide,
      specular: "#d5fefd",
      shininess: 25,
    }),
  },
  ghost: {
    "*": new THREE.MeshPhongMaterial({
      color: "#dddddd",
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    }),
  },
  active: {
    "*": new THREE.MeshPhongMaterial({
      color: "#0081dd",
      side: THREE.FrontSide,
    }),
  },
};

interface BrickProperties {
  modelType: ModelType;
  style?: PieceStyle;
  scale?: number;
  onSelect?: XRInteractionHandler;
}

const BASE_SCALE = 1.0;

export default function Brick(
  props: JSX.IntrinsicElements["object3D"] & BrickProperties
) {
  const { nodes } = useGLTF("/models/chess.gltf");
  const scale =
    typeof props.scale === "number" ? BASE_SCALE * props.scale : BASE_SCALE;
  return (
    <Mesh
      position={props.position}
      rotation={props.rotation}
      scale={scale}
      object={nodes[props.modelType]}
      materials={materials[props.style ?? "white"]}
    />
  );
}
