import * as THREE from "three";

interface MeshProps {
  object: THREE.Object3D;
  materials?: Record<string, THREE.Material>;
}

const invisible = new THREE.MeshBasicMaterial({
  visible: false,
});

export default function Mesh(
  props: JSX.IntrinsicElements["object3D"] & MeshProps
) {
  const { object, materials } = props;

  const children = object.children.map((child) => (
    <Mesh
      key={child.id}
      position={child.position}
      rotation={child.rotation}
      scale={child.scale}
      object={child}
      materials={materials}
    />
  ));

  if (object instanceof THREE.Group) {
    return (
      <group
        position={props.position}
        rotation={props.rotation}
        scale={props.scale}
      >
        {children}
      </group>
    );
  }
  if (object instanceof THREE.Mesh) {
    const material =
      materials?.[object.material.name] ?? materials?.["*"] ?? invisible;
    return (
      <mesh
        position={props.position}
        rotation={props.rotation}
        scale={props.scale}
        geometry={object.geometry}
        material={material}
      >
        {children}
      </mesh>
    );
  }
  return null;
}
