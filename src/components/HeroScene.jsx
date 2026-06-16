import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei';

function AnimatedSphere() {
  const sphereRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    sphereRef.current.rotation.x = t * 0.2;
    sphereRef.current.rotation.y = t * 0.3;
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={sphereRef} args={[1, 100, 200]} scale={2.4}>
        <MeshDistortMaterial
          color="#3b82f6"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.2}
          emissive="#1e3a8a"
        />
      </Sphere>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#10b981" intensity={1} />
        <AnimatedSphere />
      </Canvas>
    </div>
  );
}