import { Component, Suspense, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { RiggedStudent } from "./RiggedStudent.jsx";
class PreviewBoundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <p className="avatar-preview-unavailable" role="status">
        3D preview is unavailable. You can still choose an avatar below.
      </p>
    ) : (
      this.props.children
    );
  }
}
function Student({ characterId, pose, greeting, reducedMotion, onStanding }) {
  const motion = useMemo(
    () => ({
      current: {
        velocity: {
          x: 0,
          z: pose === "walk" ? 1.055 : pose === "run" ? 5.84 : 0,
        },
        facing: 0,
        seated: pose === "sit",
        greeting,
        grounded: true,
        studyDesk: pose === "sit",
        reducedMotion,
      },
    }),
    [pose, greeting, reducedMotion],
  );
  return (
    <RiggedStudent
      characterId={characterId}
      motion={motion}
      onStanding={onStanding}
    />
  );
}
// Match the library's floor, seat and desk heights so the preview exercises
// the same seated desk pose rather than an unsupported floating-chair pose.
function StudyFurniture() {
  return (
    <group>
      <mesh position={[0, 0.46, -0.33]} castShadow receiveShadow>
        <boxGeometry args={[0.52, 0.085, 0.49]} />
        <meshStandardMaterial color="#758a6b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.76, -0.56]} castShadow>
        <boxGeometry args={[0.52, 0.42, 0.045]} />
        <meshStandardMaterial color="#758a6b" roughness={0.8} />
      </mesh>
      {[-0.22, 0.22].flatMap((x) =>
        [-0.51, -0.15].map((z) => (
          <mesh key={`${x}:${z}`} position={[x, 0.215, z]} castShadow>
            <boxGeometry args={[0.035, 0.43, 0.035]} />
            <meshStandardMaterial color="#46594d" roughness={0.7} />
          </mesh>
        )),
      )}
      <mesh position={[0, 0.78, 0.62]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.055, 0.72]} />
        <meshStandardMaterial color="#c8ad86" roughness={0.85} />
      </mesh>
      {[-0.42, 0.42].flatMap((x) =>
        [0.31, 0.93].map((z) => (
          <mesh key={`${x}:${z}`} position={[x, 0.375, z]} castShadow>
            <boxGeometry args={[0.035, 0.75, 0.035]} />
            <meshStandardMaterial color="#46594d" roughness={0.7} />
          </mesh>
        )),
      )}
      <mesh position={[0, 0.815, 0.42]} receiveShadow>
        <boxGeometry args={[0.32, 0.012, 0.24]} />
        <meshStandardMaterial color="#f5efdf" roughness={0.95} />
      </mesh>
    </group>
  );
}
function Stage({
  characterId,
  pose,
  greeting,
  cameraRef,
  reducedMotion,
  furniture,
  onStanding,
}) {
  return (
    <>
      <color attach="background" args={["#e4e9df"]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#f7f4e7", "#6e8177", 1.1]} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-normalBias={0.025}
      />
      <directionalLight position={[-3, 3, -2]} intensity={0.5} />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.005, 0]}
        receiveShadow
      >
        <circleGeometry args={[3, 64]} />
        <meshStandardMaterial color="#d0d8c8" roughness={0.9} />
      </mesh>
      {furniture && <StudyFurniture />}
      <Student
        characterId={characterId}
        pose={pose}
        greeting={greeting}
        reducedMotion={reducedMotion}
        onStanding={onStanding}
      />
      <OrbitControls
        ref={cameraRef}
        target={[0, 0.95, 0]}
        enablePan={false}
        minDistance={1.8}
        maxDistance={5}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2 + 0.05}
        enableDamping
      />
    </>
  );
}
const CAMERA = { position: [2.2, 1.65, 3.1], fov: 38, near: 0.05, far: 20 };
export default function CharacterPreview({ characterId }) {
  const [low] = useState(
    () =>
      window.matchMedia("(max-width:760px), (prefers-reduced-motion:reduce)")
        .matches,
  );
  const [reducedMotion] = useState(
    () => window.matchMedia("(prefers-reduced-motion:reduce)").matches,
  );
  const [furniture, setFurniture] = useState(false);
  const [pose, setPose] = useState("idle"),
    [greeting, setGreeting] = useState(false),
    controls = useRef();
  const views = {
    Front: [0, 1.5, 3.4],
    Side: [3.4, 1.5, 0],
    Back: [0, 1.5, -3.4],
    "¾ View": [2.2, 1.65, 3.1],
  };
  const view = (position) => {
    const c = controls.current;
    if (c) {
      c.object.position.set(...position);
      c.target.set(0, 0.95, 0);
      c.update();
    }
  };
  return (
    <section className="avatar-preview" aria-label="Live 3D avatar preview">
      {characterId === "zain" && (
        <p role="status">
          Quaternius Casual Character · native locomotion with authored sitting
          and standing.
        </p>
      )}
      <div className="avatar-preview-stage">
        <PreviewBoundary>
          <Suspense
            fallback={
              <p className="avatar-preview-unavailable" role="status">
                Loading 3D preview…
              </p>
            }
          >
            <Canvas
              shadows={!low}
              dpr={low ? 1 : [1, 1.5]}
              camera={CAMERA}
              resize={{ scroll: false }}
              gl={{ antialias: true, powerPreference: "low-power" }}
            >
              <Stage
                characterId={characterId}
                pose={pose}
                greeting={greeting}
                cameraRef={controls}
                reducedMotion={reducedMotion}
                furniture={furniture}
                onStanding={() => setFurniture(false)}
              />
            </Canvas>
          </Suspense>
        </PreviewBoundary>
      </div>
      <div className="avatar-preview-controls">
        <div role="group" aria-label="Preview camera angle">
          {Object.entries(views).map(([name, position]) => (
            <button key={name} type="button" onClick={() => view(position)}>
              {name}
            </button>
          ))}
        </div>
        <div role="group" aria-label="Preview animation">
          {[
            ["idle", "Idle"],
            ["walk", "Walk"],
            ["run", "Run"],
            ["sit", "Sit"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              disabled={reducedMotion && ["walk", "run"].includes(id)}
              aria-pressed={pose === id}
              onClick={() => {
                if (id === "sit") setFurniture(true);
                setPose(id);
                setGreeting(false);
              }}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={greeting}
            onClick={() => setGreeting((v) => !v)}
          >
            Wave
          </button>
        </div>
      </div>
      <p>
        Drag to rotate · Scroll or pinch to zoom. Walk/run show animation cycles
        in place; movement is controlled in the campus.
      </p>
    </section>
  );
}
