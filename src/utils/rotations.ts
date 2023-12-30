import * as THREE from "three";

const rotations: THREE.Matrix3[] = [
  new THREE.Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1),
  new THREE.Matrix3(1, 0, 0, 0, -1, 0, 0, 0, -1),
  new THREE.Matrix3(-1, 0, 0, 0, -1, 0, 0, 0, 1),
  new THREE.Matrix3(-1, 0, 0, 0, 1, 0, 0, 0, -1),

  new THREE.Matrix3(1, 0, 0, 0, 0, -1, 0, 1, 0),
  new THREE.Matrix3(1, 0, 0, 0, 0, 1, 0, -1, 0),
  new THREE.Matrix3(-1, 0, 0, 0, 0, 1, 0, 1, 0),

  new THREE.Matrix3(0, -1, 0, 1, 0, 0, 0, 0, 1),
  new THREE.Matrix3(0, 1, 0, -1, 0, 0, 0, 0, 1),
  new THREE.Matrix3(0, 1, 0, 1, 0, 0, 0, 0, -1),

  new THREE.Matrix3(0, 1, 0, 0, 0, 1, 1, 0, 0),
  new THREE.Matrix3(0, -1, 0, 0, 0, -1, 1, 0, 0),
  new THREE.Matrix3(0, 1, 0, 0, 0, -1, -1, 0, 0),
  new THREE.Matrix3(0, -1, 0, 0, 0, 1, -1, 0, 0),

  new THREE.Matrix3(0, 0, 1, 1, 0, 0, 0, 1, 0),
  new THREE.Matrix3(0, 0, -1, -1, 0, 0, 0, 1, 0),
  new THREE.Matrix3(0, 0, 1, -1, 0, 0, 0, -1, 0),
  new THREE.Matrix3(0, 0, -1, 1, 0, 0, 0, -1, 0),

  new THREE.Matrix3(0, 0, -1, 0, 1, 0, 1, 0, 0),
  new THREE.Matrix3(0, 0, 1, 0, -1, 0, 1, 0, 0),
  new THREE.Matrix3(0, 0, 1, 0, 1, 0, -1, 0, 0),

  new THREE.Matrix3(0, -1, 0, -1, 0, 0, 0, 0, -1),
  new THREE.Matrix3(-1, 0, 0, 0, 0, -1, 0, -1, 0),
  new THREE.Matrix3(0, 0, -1, 0, -1, 0, -1, 0, 0),
];

export const quaternions = rotations.map((m) =>
  new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().setFromMatrix3(m)
  )
);

export default rotations;
