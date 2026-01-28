import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const RotatingMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // React to mouse position
      const mouseX = state.mouse.x * 0.5;
      const mouseY = state.mouse.y * 0.5;
      meshRef.current.rotation.z = mouseX * 0.3;
      meshRef.current.position.x = mouseX * 0.5;
      meshRef.current.position.y = mouseY * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <MeshDistortMaterial
          color="#00f3ff"
          wireframe
          distort={0.3}
          speed={2}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh ref={meshRef} scale={1.2}>
        <icosahedronGeometry args={[2.5, 0]} />
        <meshBasicMaterial
          color="#bd00ff"
          wireframe
          transparent
          opacity={0.2}
        />
      </mesh>
    </Float>
  );
};

const WireframeGeometry = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bd00ff" />
        <RotatingMesh />
      </Canvas>
    </div>
  );
};

export default WireframeGeometry;
