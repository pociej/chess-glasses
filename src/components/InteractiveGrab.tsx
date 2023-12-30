import * as THREE from "three";
import React, {
  useRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  ForwardedRef,
} from "react";
import { Interactive, XRInteractionEvent } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";

function resetLocalMatrix(
  object: THREE.Object3D,
  originalMatrix: THREE.Matrix4
) {
  object.matrix.copy(originalMatrix);
  object.matrix.decompose(object.position, object.quaternion, object.scale);
  object.updateWorldMatrix(false, true);
}

interface InteractiveGrabProperties {
  children: React.ReactNode;
  group?: THREE.Group;
  resetOnRelease?: boolean;
  onSelectStart?: (event: XRInteractionEvent) => void;
  onSelectEnd?: (event: XRInteractionEvent) => void;
  onDrag?: (matrixWorld: THREE.Matrix4, inputSource?: XRInputSource) => void;
  onDrop?: (matrixWorld: THREE.Matrix4, inputSource?: XRInputSource) => void;
}

interface GrabbingContext {
  group: THREE.Group;
  groupMatrix: THREE.Matrix4;
  controller: THREE.Object3D;
  controllerToGroupMatrix: THREE.Matrix4;
  inputSource?: XRInputSource;
}

export default forwardRef<THREE.Group, InteractiveGrabProperties>(
  function InteractiveGrab(
    props: InteractiveGrabProperties,
    forwardedRef: ForwardedRef<THREE.Group>
  ) {
    const grabbingContext = useRef<GrabbingContext>();
    const groupRef = useRef<THREE.Group>(null!);
    const { onSelectStart, onSelectEnd, onDrag, onDrop } = props;

    useImperativeHandle(forwardedRef, () => groupRef.current);

    useFrame(() => {
      const context = grabbingContext.current;
      if (context) {
        const { group, controller, inputSource, controllerToGroupMatrix } =
          context;
        controller.updateMatrixWorld();
        const m1 = new THREE.Matrix4()
          .copy(controllerToGroupMatrix)
          .premultiply(controller.matrixWorld);
        if (group.parent) {
          group.parent.updateWorldMatrix(true, false);
          m1.premultiply(
            new THREE.Matrix4().copy(group.parent.matrixWorld).invert()
          );
        }
        resetLocalMatrix(group, m1);
        onDrag?.(group.matrixWorld, inputSource);
      }
    });

    const handleSelectStart = useCallback(
      (e: XRInteractionEvent) => {
        const { controller, inputSource } = e.target;
        const group = props.group ?? groupRef.current;
        controller.updateMatrixWorld();
        group.updateMatrixWorld();
        onSelectStart?.(e);
        grabbingContext.current = {
          group,
          // NOTE: If the object is already dragged,
          //       we use the previously remembered matrix.
          groupMatrix: grabbingContext.current
            ? grabbingContext.current.groupMatrix
            : new THREE.Matrix4().copy(group.matrix),
          controller,
          controllerToGroupMatrix: new THREE.Matrix4()
            .copy(controller.matrixWorld)
            .invert()
            .multiply(group.matrixWorld),
        };
        if (inputSource) {
          grabbingContext.current.inputSource = inputSource;
        }
      },
      [props.group, onSelectStart]
    );

    const handleSelectEnd = useCallback(
      (e: XRInteractionEvent) => {
        if (
          grabbingContext.current &&
          e.target.controller === grabbingContext.current.controller
        ) {
          const { group, groupMatrix, inputSource } = grabbingContext.current;
          onDrop?.(group.matrixWorld, inputSource);
          if (props.resetOnRelease) {
            resetLocalMatrix(group, groupMatrix);
          }
          grabbingContext.current = undefined;
        }
        onSelectEnd?.(e);
      },
      [props.resetOnRelease, onDrop, onSelectEnd]
    );

    return (
      <Interactive
        ref={groupRef}
        onSelectStart={handleSelectStart}
        onSelectEnd={handleSelectEnd}
        onSelectMissed={handleSelectEnd}
      >
        {props.children}
      </Interactive>
    );
  }
);
