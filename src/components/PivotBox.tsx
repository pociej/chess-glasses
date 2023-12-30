import * as THREE from "three";
import React from "react";
import Pivot from "./Pivot";

interface PivotBox {
  sizeX?: number;
  sizeY?: number;
  sizeZ?: number;
  color?: string | THREE.Color;
  children?: React.ReactNode;
}

const PivotBox: React.FC<JSX.IntrinsicElements["object3D"] & PivotBox> = (props) => {
  const { sizeX = 1, sizeY = 1, sizeZ = 1 } = props;
  const size = Math.min(sizeX, sizeY, sizeZ) / 2;
  return (
    <group position={props.position} rotation={props.rotation} scale={props.scale}>
      <Pivot size={size} position={[-sizeX / 2, -sizeY / 2, -sizeZ / 2]}>
        <lineBasicMaterial color={props.color} />
      </Pivot>
      <Pivot size={size} position={[-sizeX / 2, sizeY / 2, -sizeZ / 2]}>
        <lineBasicMaterial color={props.color} />
      </Pivot>
      <Pivot size={size} position={[sizeX / 2, sizeY / 2, -sizeZ / 2]}>
        <lineBasicMaterial color={props.color} />
      </Pivot>
      <Pivot size={size} position={[sizeX / 2, -sizeY / 2, -sizeZ / 2]}>
        <lineBasicMaterial color={props.color} />
      </Pivot>
      <Pivot size={size} position={[-sizeX / 2, -sizeY / 2, sizeZ / 2]}>
        <lineBasicMaterial color={props.color} />
      </Pivot>
      <Pivot size={size} position={[-sizeX / 2, sizeY / 2, sizeZ / 2]}>
        <lineBasicMaterial color={props.color} />
      </Pivot>
      <Pivot size={size} position={[sizeX / 2, sizeY / 2, sizeZ / 2]}>
        <lineBasicMaterial color={props.color} />
      </Pivot>
      <Pivot size={size} position={[sizeX / 2, -sizeY / 2, sizeZ / 2]}>
        <lineBasicMaterial color={props.color} />
      </Pivot>
    </group>
  );
};

export default PivotBox;
