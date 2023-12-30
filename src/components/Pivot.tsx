import * as THREE from "three";
import React, { useMemo } from "react";

interface PivotProps {
  size?: number;
  innerSize?: number;
  children?: React.ReactNode;
}

const Pivot: React.FC<JSX.IntrinsicElements["object3D"] & PivotProps> = (
  props
) => {
  const { size = 1, innerSize = 0.1 } = props;
  const geometry = useMemo(() => {
    const positions = [
      -size / 2,
      0,
      0,
      -innerSize / 2,
      0,
      0,

      size / 2,
      0,
      0,
      innerSize / 2,
      0,
      0,

      0,
      -size / 2,
      0,
      0,
      -innerSize / 2,
      0,

      0,
      size / 2,
      0,
      0,
      innerSize / 2,
      0,

      0,
      0,
      -size / 2,
      0,
      0,
      -innerSize / 2,

      0,
      0,
      size / 2,
      0,
      0,
      innerSize / 2,
    ];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geometry;
  }, [size, innerSize]);
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

export default Pivot;
