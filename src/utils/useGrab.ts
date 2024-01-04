import * as THREE from "three";
import React, { useRef, useCallback } from "react";
import { XRInteractionEvent, useInteraction } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";

function resetLocalMatrix(
  object: THREE.Object3D,
  originalMatrix: THREE.Matrix4
) {
  object.matrix.copy(originalMatrix);
  object.matrix.decompose(object.position, object.quaternion, object.scale);
  object.updateWorldMatrix(false, true);
}

interface GrabOptions {
  resetOnRelease?: boolean;
  targetRef?: React.RefObject<THREE.Object3D>;
  interaction?: "onSelect" | "onSqueeze";
  onMove?: (
    matrixWorld: THREE.Matrix4,
    inputSource: XRInputSource | null
  ) => void;
  onStart?: (
    matrixWorld: THREE.Matrix4,
    inputSource: XRInputSource | null
  ) => void;
  onEnd?: (
    matrixWorld: THREE.Matrix4,
    inputSource: XRInputSource | null
  ) => void;
}

interface GrabContext {
  target: THREE.Object3D;
  targetMatrix: THREE.Matrix4;
  controller: THREE.Object3D;
  controllerToTargetMatrix: THREE.Matrix4;
  inputSource: XRInputSource | null;
}

export default function useGrab(
  ref: React.RefObject<THREE.Object3D>,
  options: GrabOptions = {}
) {
  const contextRef = useRef<GrabContext>();
  const {
    onMove,
    onStart,
    onEnd,
    resetOnRelease,
    targetRef,
    interaction = "onSelect",
  } = options;

  useFrame(() => {
    const context = contextRef.current;
    if (context) {
      const { target, controller, inputSource, controllerToTargetMatrix } =
        context;
      controller.updateMatrixWorld();
      const m1 = new THREE.Matrix4()
        .copy(controllerToTargetMatrix)
        .premultiply(controller.matrixWorld);
      if (target.parent) {
        target.parent.updateWorldMatrix(true, false);
        m1.premultiply(
          new THREE.Matrix4().copy(target.parent.matrixWorld).invert()
        );
      }
      resetLocalMatrix(target, m1);
      onMove?.(target.matrixWorld, inputSource);
    }
  });

  const handleSelectStart = useCallback(
    (e: XRInteractionEvent) => {
      const { controller, inputSource } = e.target;
      const target = targetRef ? targetRef.current : ref.current;
      if (target) {
        controller.updateMatrixWorld();
        target.updateMatrixWorld();
        contextRef.current = {
          target,
          // NOTE: If the object is already being grabbed, we use the previously
          //       remembered matrix.
          targetMatrix: contextRef.current
            ? contextRef.current.targetMatrix
            : new THREE.Matrix4().copy(target.matrix),
          controller,
          controllerToTargetMatrix: new THREE.Matrix4()
            .copy(controller.matrixWorld)
            .invert()
            .multiply(target.matrixWorld),
          inputSource,
        };
        onStart?.(target.matrixWorld, inputSource);
      }
    },
    [ref, targetRef, onStart]
  );

  const handleSelectEnd = useCallback(
    (e: XRInteractionEvent) => {
      if (
        contextRef.current &&
        e.target.controller === contextRef.current.controller
      ) {
        const { target, targetMatrix, inputSource } = contextRef.current;
        onEnd?.(target.matrixWorld, inputSource);
        if (resetOnRelease) {
          resetLocalMatrix(target, targetMatrix);
        }
        contextRef.current = undefined;
      }
    },
    [resetOnRelease, onEnd]
  );

  useInteraction(
    ref,
    interaction === "onSelect" ? "onSelectStart" : "onSqueezeStart",
    handleSelectStart
  );

  useInteraction(
    ref,
    interaction === "onSelect" ? "onSelectEnd" : "onSqueezeEnd",
    handleSelectEnd
  );

  useInteraction(
    ref,
    interaction === "onSelect" ? "onSelectMissed" : "onSqueezeMissed",
    handleSelectEnd
  );
}
