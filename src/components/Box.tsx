import * as THREE from "three";
import { useRef } from "react";

interface BoxProperties {
  sizeX?: number;
  sizeY?: number;
  sizeZ?: number;
  color?: THREE.ColorRepresentation;
}

export default function Box(
  props: JSX.IntrinsicElements["object3D"] & BoxProperties
) {
  const {
    sizeX = 1,
    sizeY = 1,
    sizeZ = 1,
    scale,
    rotation,
    position,
    color = "grey",
  } = props;
  const groupRef = useRef<THREE.Group>(null!);
  return (
    <group ref={groupRef} scale={scale} rotation={rotation} position={position}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[sizeX, sizeY, sizeZ]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}
