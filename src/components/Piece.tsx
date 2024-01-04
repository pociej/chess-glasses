import * as THREE from "three";
import { XRInteractionHandler } from "@react-three/xr";
import { useGLTF } from "@react-three/drei";
import Mesh from "./Mesh";

export type ModelType =
  | "Bishop"
  | "King"
  | "Knight"
  | "Pawn"
  | "Queen"
  | "Rook";

export type PieceStyle = "black" | "white" | "ghost" | "active";

const materials: Record<PieceStyle, Record<string, THREE.Material>> = {
  black: {
    Wood: new THREE.MeshPhongMaterial({
      color: "#000000",
      side: THREE.FrontSide,
      specular: "#ffffff",
      shininess: 25,
    }),
    Felt: new THREE.MeshPhongMaterial({
      color: "#185c32",
      side: THREE.FrontSide,
    }),
  },
  white: {
    Wood: new THREE.MeshPhongMaterial({
      color: "#e1e1e1",
      side: THREE.FrontSide,
      specular: "#d5fefd",
      shininess: 25,
    }),
    Felt: new THREE.MeshPhongMaterial({
      color: "#185c32",
      side: THREE.FrontSide,
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
