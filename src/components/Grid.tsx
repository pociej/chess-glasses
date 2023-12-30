import * as THREE from "three";
import React, { useMemo } from "react";

interface GridProps {
  size: number;
  cellWidth?: number;
  children?: React.ReactNode;
}

const Grid: React.FC<JSX.IntrinsicElements["object3D"] & GridProps> = (
  props
) => {
  const { size, cellWidth = 1 } = props;
  const geometry = useMemo(() => {
    const positions = [];
    for (let i = 0; i <= size; i++) {
      positions.push(
        cellWidth * (-size / 2),
        0,
        cellWidth * (i - size / 2),
        cellWidth * (size / 2),
        0,
        cellWidth * (i - size / 2),
        cellWidth * (i - size / 2),
        0,
        cellWidth * (-size / 2),
        cellWidth * (i - size / 2),
        0,
        cellWidth * (size / 2)
      );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geometry;
  }, [cellWidth, size]);
  return (
    <lineSegments
      position={props.position}
      rotation={props.rotation}
      scale={props.scale}
      geometry={geometry}
    >
      {props.children}
    </lineSegments>
  );
};

export default Grid;
