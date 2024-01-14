/* eslint-env jest */

import * as THREE from "three";
import * as fc from "fast-check";
import rotations from "./rotations";

const anyRotation = fc.constantFrom(...rotations);

test("should have 24 rotations", () => {
  expect(rotations).toHaveLength(24);
});

test("each rotation is an isometry", () => {
  fc.assert(
    fc.property(anyRotation, (rotation) => {
      const m = new THREE.Matrix3().copy(rotation);
      expect(m.transpose().multiply(rotation)).toEqual(
        new THREE.Matrix3().identity()
      );
    })
  );
});

test("each rotation has positive determinant", () => {
  fc.assert(
    fc.property(anyRotation, (rotation) => {
      const m = new THREE.Matrix3().copy(rotation);
      expect(m.determinant()).toEqual(1);
    })
  );
});

test("each rotation is a permutation", () => {
  fc.assert(
    fc.property(anyRotation, (rotation) => {
      const m = new THREE.Matrix3().copy(rotation);
      expect(
        m
          .toArray()
          .map((x: number) => Math.abs(x))
          .sort()
      ).toEqual([0, 0, 0, 0, 0, 0, 1, 1, 1]);
    })
  );
});

test("a combination of any two rotations is a rotation", () => {
  fc.assert(
    fc.property(anyRotation, anyRotation, (a, b) => {
      const m = new THREE.Matrix3().copy(a).multiply(b);
      expect(rotations).toContainEqual(m);
    })
  );
});
