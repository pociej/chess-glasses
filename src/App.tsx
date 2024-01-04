import { XRButton, XR, Controllers, Hands } from "@react-three/xr";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import Game from "./Game";

const buttonStyles = {
  position: "absolute",
  bottom: "24px",
  left: "50%",
  transform: "translateX(-50%)",
  padding: "12px 24px",
  border: "1px solid white",
  borderRadius: "4px",
  background: "rgba(0, 0, 0, 0.1)",
  color: "white",
  font: "normal 0.8125rem sans-serif",
  outline: "none",
  zIndex: 99999,
  cursor: "pointer",
} as const;

function App() {
  return (
    <>
      <XRButton
        mode={"AR"}
        style={buttonStyles}
        sessionInit={{
          domOverlay:
            typeof document !== "undefined"
              ? { root: document.body }
              : undefined,
          optionalFeatures: [
            "hit-test",
            "dom-overlay",
            "dom-overlay-for-handheld-ar",
            "hand-tracking",
          ],
        }}
      />
      <Canvas>
        <XR referenceSpace="local" frameRate={120}>
          <ambientLight intensity={0.2} />
          <pointLight color="white" intensity={500} position={[10, 10, 10]} />
          <pointLight color="white" intensity={200} position={[-10, 10, -10]} />
          <Hands />
          <Controllers />
          <Game position={[0, -0.25, -0.5]} scale={0.05} />
        </XR>
      </Canvas>
    </>
  );
}

export default App;
