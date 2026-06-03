import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function Shadercomp() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      <mesh>
        <icosahedronGeometry args={[1, 5]} />
        <meshStandardMaterial color="hotpink" wireframe/>
      </mesh>
    </Canvas>
  );
}