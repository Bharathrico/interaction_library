import { Canvas} from "@react-three/fiber"; 
import { useGLTF } from '@react-three/drei'

//initial thought was if 3d icons are possible thru react three fiber

function Model(props: JSX.IntrinsicElements['group']) {
  const { scene } = useGLTF('/models/cuberotating.glb')
  return <primitive object={scene} {...props} />
}

export default function Icontest() {
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Model position={[0, 0, 0]} />
    </Canvas>
  )
}
