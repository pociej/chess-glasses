import * as THREE from "three";
import { useCallback, useRef, useState } from "react";
import useGrab from "../utils/useGrab";

export interface GrabEvent<T = never> {
  payload?: T;
  matrixWorld: THREE.Matrix4;
  inputSource: XRInputSource | null;
}

interface GrabbableProps<T> {
  payload?: T;
  position?: JSX.IntrinsicElements["object3D"]["position"];
  rotation?: JSX.IntrinsicElements["object3D"]["rotation"];
  placeholder?: React.ReactNode;
  onStart?: (e: GrabEvent<T>) => void;
  onEnd?: (e: GrabEvent<T>) => void;
  interaction?: "onSelect" | "onSqueeze";
  children: React.ReactNode;
  targetRef?: React.RefObject<THREE.Object3D>;
  resetOnRelease?: boolean;
}

export default function Grabbable<T>(props: GrabbableProps<T>) {
  const {
    payload,
    children,
    interaction,
    placeholder,
    onStart,
    onEnd,
    targetRef,
    resetOnRelease,
  } = props;
  const groupRef = useRef<THREE.Group>(null!);
  const [isDragging, setIsDragging] = useState(false);

  const handleOnMove = useCallback(
    (matrixWorld: THREE.Matrix4, inputSource: XRInputSource | null) => {
      onStart?.({
        payload,
        inputSource,
        matrixWorld,
      });
    },
    [payload, onStart]
  );

  const handleOnStart = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const handleOnEnd = useCallback(
    (matrixWorld: THREE.Matrix4, inputSource: XRInputSource | null) => {
      setIsDragging(false);
      onEnd?.({
        payload,
        inputSource,
        matrixWorld,
      });
    },
    [payload, onEnd]
  );

  useGrab(groupRef, {
    onMove: handleOnMove,
    onStart: handleOnStart,
    onEnd: handleOnEnd,
    interaction,
    resetOnRelease,
    targetRef,
  });

  return (
    <group position={props.position} rotation={props.rotation}>
      <group ref={groupRef}>{children}</group>
      {isDragging && placeholder}
    </group>
  );
}
