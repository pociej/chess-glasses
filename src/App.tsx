import { ARButton, XR, Controllers } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import Game from "./Game";

function App() {
  return (
    <>
      <ARButton />
      <Canvas>
        <XR referenceSpace="local">
          <ambientLight intensity={0.2} />
          <pointLight color="white" intensity={500} position={[10, 10, 10]} />
          <pointLight color="white" intensity={200} position={[-10, 10, -10]} />
          <Controllers />
          <Game position={[0, -0.25, -0.5]} scale={0.05} />
        </XR>
      </Canvas>
    </>
  );
}

export default App;
