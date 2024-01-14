import * as THREE from "three";

/*

        Y
        |
        |
        |
        +------- X
       /
      /
     /
    Z


      F-------E
     /|      /|
    / |     / |
   B--|----A  |
   |  G----|--H
   | /     | /
   |/      |/
   C-------D

*/

type VectorType = [number, number, number];

const matrix = (v_1: VectorType, v_2: VectorType, v_3: VectorType) => {
  return new THREE.Matrix3(...v_1, ...v_2, ...v_3);
};

type OrNegatives<T extends string> = T | `n${T}`;

const Base: { [key in OrNegatives<"X" | "Y" | "Z">]: VectorType } = {
  X: [1, 0, 0],
  Y: [0, 1, 0],
  Z: [0, 0, 1],
  nX: [-1, 0, 0],
  nY: [0, -1, 0],
  nZ: [0, 0, -1],
};

const oppositeFacesRotations = {
  X: {
    "90": matrix(Base.X, Base.nZ, Base.Y),
    "180": matrix(Base.X, Base.nY, Base.nZ),
    "270": matrix(Base.X, Base.Z, Base.nY),
  },

  Y: {
    "90": matrix(Base.Z, Base.Y, Base.nX),
    "180": matrix(Base.nX, Base.Y, Base.nZ),
    "270": matrix(Base.nZ, Base.Y, Base.X),
  },

  Z: {
    "90": matrix(Base.nY, Base.X, Base.Z),
    "180": matrix(Base.nX, Base.nY, Base.Z),
    "270": matrix(Base.Y, Base.nX, Base.Z),
  },
};

const oppositeVerticesRotations = {
  A: {
    "120": matrix(Base.Y, Base.Z, Base.X),
    "240": matrix(Base.Z, Base.X, Base.Y),
  },
  B: {
    "120": matrix(Base.nZ, Base.nX, Base.Y),
    "240": matrix(Base.nY, Base.Z, Base.nX),
  },
  C: {
    "120": matrix(Base.Y, Base.nZ, Base.nX),
    "240": matrix(Base.nZ, Base.X, Base.nY),
  },
  D: {
    "120": matrix(Base.Z, Base.nX, Base.nY),
    "240": matrix(Base.nY, Base.nZ, Base.X),
  },
};

const oppositeEdgesRotations = {
  AB: {
    180: matrix(Base.nZ, Base.nY, Base.nX),
  },
  AD: {
    180: matrix(Base.Z, Base.nY, Base.X),
  },
  AE: {
    180: matrix(Base.Y, Base.X, Base.nZ),
  },
  BC: {
    180: matrix(Base.nX, Base.Z, Base.Y),
  },
  BF: {
    180: matrix(Base.nY, Base.nX, Base.nZ),
  },
  CD: {
    180: matrix(Base.nX, Base.nZ, Base.nY),
  },
};

const getRotationMatrices = (obj: object) => {
  return Object.values(obj).reduce((acc, cur) => {
    return acc.concat(Object.values(cur));
  }, []);
};

const identity = matrix(Base.X, Base.Y, Base.Z);

const rotations: THREE.Matrix3[] = [
  identity,
  ...getRotationMatrices(oppositeFacesRotations),
  ...getRotationMatrices(oppositeVerticesRotations),
  ...getRotationMatrices(oppositeEdgesRotations),
];

export const quaternions = rotations.map((m) =>
  new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().setFromMatrix3(m)
  )
);

export default rotations;
