import * as THREE from "three";
import { useCallback, useState } from "react";
import InteractiveGrab from "./InteractiveGrab";
import PivotBox from "./PivotBox";
import Box from "./Box";

export interface DragEvent {
  elementId?: string;
  matrixWorld: THREE.Matrix4;
  inputSource?: XRInputSource;
}

interface InteractiveElementProps {
  id?: string;
  position?: JSX.IntrinsicElements["object3D"]["position"];
  rotation?: JSX.IntrinsicElements["object3D"]["rotation"];
  showPivotOnDrag?: boolean;
  onElementDrag?: (e: DragEvent) => void;
  onElementDrop?: (e: DragEvent) => void;
}

function getMatrixWorld(
  matrixWorld: THREE.Matrix4,
  position?: JSX.IntrinsicElements["object3D"]["position"],
  rotation?: JSX.IntrinsicElements["object3D"]["rotation"]
) {
  const finalMatrixWorld = new THREE.Matrix4().copy(matrixWorld);
  if (Array.isArray(position)) {
    finalMatrixWorld.multiply(new THREE.Matrix4().makeTranslation(...position));
  } else if (position instanceof THREE.Vector3) {
    finalMatrixWorld.multiply(new THREE.Matrix4().makeTranslation(position));
  }
  if (Array.isArray(rotation)) {
    finalMatrixWorld.multiply(
      new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...rotation))
    );
  } else if (rotation instanceof THREE.Euler) {
    finalMatrixWorld.multiply(
      new THREE.Matrix4().makeRotationFromEuler(rotation)
    );
  }
  return finalMatrixWorld;
}

export default function InteractiveElement(props: InteractiveElementProps) {
  const {
    id,
    showPivotOnDrag,
    onElementDrag,
    onElementDrop,
    position,
    rotation,
  } = props;
  const [isDragging, setIsDragging] = useState(false);
  const handleOnDrag = useCallback(
    (matrixWorld: THREE.Matrix4, inputSource?: XRInputSource) => {
      onElementDrag?.({
        elementId: id,
        inputSource,
        matrixWorld: getMatrixWorld(matrixWorld, position, rotation),
      });
    },
    [id, position, rotation, onElementDrag]
  );
  const handleOnDrop = useCallback(
    (matrixWorld: THREE.Matrix4, inputSource?: XRInputSource) => {
      onElementDrop?.({
        elementId: id,
        inputSource,
        matrixWorld: getMatrixWorld(matrixWorld, position, rotation),
      });
    },
    [id, position, rotation, onElementDrop]
  );
  const handleSelectStart = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);
  const handleSelectEnd = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);
  return (
    <>
      <InteractiveGrab
        onDrag={handleOnDrag}
        onDrop={handleOnDrop}
        onSelectStart={handleSelectStart}
        onSelectEnd={handleSelectEnd}
        resetOnRelease
      >
        <Box color="red" position={props.position} rotation={props.rotation} />
      </InteractiveGrab>
      {isDragging && showPivotOnDrag && (
        <PivotBox position={props.position} rotation={props.rotation} />
      )}
    </>
  );
}
