import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Vector3 } from 'three';
import { DOORS, createJourney, getStairsElevation, stepJourney } from './journey.js';
import { RiggedStudent } from '../characters/RiggedStudent.jsx';

/**
 * Classic collegiate campus park bench with dark cast-iron frame and warm polished wood slats.
 */
function CampusBench({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Dark Cast-Iron End Frames & Legs */}
      {[-0.85, 0.85].map(x => (
        <group key={x} position={[x, 0, 0]}>
          {/* Front & Back Legs */}
          <mesh position={[0, 0.22, 0.22]} castShadow receiveShadow>
            <boxGeometry args={[0.05, 0.44, 0.05]} />
            <meshStandardMaterial color="#1a231e" roughness={0.7} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.22, -0.22]} castShadow receiveShadow>
            <boxGeometry args={[0.05, 0.44, 0.05]} />
            <meshStandardMaterial color="#1a231e" roughness={0.7} metalness={0.5} />
          </mesh>
          {/* Seat Bracket */}
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[0.06, 0.04, 0.48]} />
            <meshStandardMaterial color="#1a231e" roughness={0.7} metalness={0.5} />
          </mesh>
          {/* Backrest Upright & Armrest */}
          <mesh position={[0, 0.65, -0.24]} rotation={[-0.15, 0, 0]} castShadow>
            <boxGeometry args={[0.05, 0.5, 0.05]} />
            <meshStandardMaterial color="#1a231e" roughness={0.7} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.52, 0.06]} castShadow>
            <boxGeometry args={[0.06, 0.03, 0.36]} />
            <meshStandardMaterial color="#1a231e" roughness={0.7} metalness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Warm Polished Oak Wood Seat Slats */}
      {[-0.18, -0.06, 0.06, 0.18].map((z, i) => (
        <mesh key={`seat-${i}`} position={[0, 0.44, z]} castShadow receiveShadow>
          <boxGeometry args={[1.86, 0.03, 0.09]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#9b5d35' : '#af6f44'} roughness={0.65} />
        </mesh>
      ))}

      {/* Backrest Wood Slats */}
      {[0.52, 0.64, 0.76, 0.88].map((y, i) => (
        <mesh
          key={`back-${i}`}
          position={[0, y, -0.22 - (y - 0.48) * 0.16]}
          rotation={[-0.15, 0, 0]}
          castShadow
        >
          <boxGeometry args={[1.86, 0.09, 0.028]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#af6f44' : '#9b5d35'} roughness={0.65} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Sculptural campus shade tree with organic trunk and layered canopy.
 */
function CampusTree({ position = [0, 0, 0], scale = 1, foliageTint = '#4f7845', mirror = false }) {
  return (
    <group position={position} scale={scale}>
      {/* Root Flare & Base Trunk */}
      <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.38, 0.65, 2.8, 10]} />
        <meshStandardMaterial color="#423223" roughness={0.9} />
      </mesh>
      {/* Upper Trunk & Main Limbs */}
      <mesh position={[-0.18, 2.9, 0.12]} rotation={[0.15, 0, 0.22]} castShadow>
        <cylinderGeometry args={[0.26, 0.38, 1.8, 8]} />
        <meshStandardMaterial color="#423223" roughness={0.9} />
      </mesh>
      <mesh position={[0.22, 3.1, -0.15]} rotation={[-0.2, 0, -0.26]} castShadow>
        <cylinderGeometry args={[0.24, 0.36, 2.0, 8]} />
        <meshStandardMaterial color="#3b2b1d" roughness={0.9} />
      </mesh>

      {/* Main Canopy Foliage Clusters */}
      <mesh position={[0, 4.4, 0]} castShadow>
        <sphereGeometry args={[1.9, 14, 12]} />
        <meshStandardMaterial color={foliageTint} roughness={0.85} />
      </mesh>
      <mesh position={[-0.8, 4.0, 0.6]} castShadow>
        <sphereGeometry args={[1.4, 12, 10]} />
        <meshStandardMaterial color="#5e884f" roughness={0.88} />
      </mesh>
      <mesh position={[0.9, 4.2, -0.5]} castShadow>
        <sphereGeometry args={[1.45, 12, 10]} />
        <meshStandardMaterial color="#6a9456" roughness={0.85} />
      </mesh>
      <mesh position={[0.1, 5.4, 0.3]} castShadow>
        <sphereGeometry args={[1.3, 12, 10]} />
        <meshStandardMaterial color="#7ba65d" roughness={0.82} />
      </mesh>
      <mesh position={[-0.6, 5.0, -0.6]} castShadow>
        <sphereGeometry args={[1.2, 10, 10]} />
        <meshStandardMaterial color="#476d3e" roughness={0.9} />
      </mesh>

      {/* Inward Overhanging Framing Branch Foliage */}
      <mesh position={[mirror ? -1.6 : 1.6, 4.6, 0.4]} castShadow>
        <sphereGeometry args={[1.3, 12, 10]} />
        <meshStandardMaterial color="#68914e" roughness={0.85} />
      </mesh>
    </group>
  );
}

/**
 * Radiant procedural clouds adding depth to the sunlit collegiate sky.
 */
function SkyClouds() {
  const clouds = useMemo(
    () => [
      { pos: [-6.8, 7.4, -9.0], scale: [3.4, 1.2, 1.2] },
      { pos: [0.2, 8.2, -10.5], scale: [4.6, 1.35, 1.35] },
      { pos: [7.2, 7.6, -9.5], scale: [3.8, 1.25, 1.25] },
    ],
    []
  );

  return (
    <group>
      {clouds.map((c, i) => (
        <group key={i} position={c.pos}>
          <mesh>
            <sphereGeometry args={[c.scale[0] * 0.42, 12, 10]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
          </mesh>
          <mesh position={[-c.scale[0] * 0.28, -0.15, 0]}>
            <sphereGeometry args={[c.scale[0] * 0.32, 10, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.52} />
          </mesh>
          <mesh position={[c.scale[0] * 0.28, -0.12, 0]}>
            <sphereGeometry args={[c.scale[0] * 0.34, 10, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.52} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Functional door portal with rotating leaf, arched surround, and label button.
 */
function DoorPortal({ x, id, label, doorAngle, selection, onChoose }) {
  const pivot = useRef();
  useFrame(() => {
    if (pivot.current) {
      pivot.current.rotation.y = -doorAngle;
    }
  });

  return (
    <group position={[x, 0.28, -2.8]}>
      {/* Classical Arched Stone Surround / Pilasters */}
      <mesh position={[-0.92, 1.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 2.9, 0.44]} />
        <meshStandardMaterial color="#e0d7c2" roughness={0.85} />
      </mesh>
      <mesh position={[0.92, 1.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, 2.9, 0.44]} />
        <meshStandardMaterial color="#e0d7c2" roughness={0.85} />
      </mesh>
      {/* Arch Header & Keystone */}
      <mesh position={[0, 2.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.12, 0.32, 0.46]} />
        <meshStandardMaterial color="#d4cab3" roughness={0.85} />
      </mesh>
      <mesh position={[0, 3.02, 0.08]} castShadow>
        <boxGeometry args={[0.32, 0.44, 0.52]} />
        <meshStandardMaterial color="#c2b79e" roughness={0.8} />
      </mesh>

      {/* Recessed Vestibule Interior & Warm Ambient Glow */}
      <mesh position={[0, 1.4, -0.22]}>
        <boxGeometry args={[1.56, 2.7, 0.2]} />
        <meshStandardMaterial color="#213028" roughness={0.9} />
      </mesh>
      <pointLight position={[0, 2.2, -0.1]} intensity={0.8} color="#ffe8be" distance={3.5} />

      {/* Threshold Stone Step */}
      <mesh position={[0, 0.04, 0.18]} receiveShadow>
        <boxGeometry args={[1.9, 0.08, 0.45]} />
        <meshStandardMaterial color="#cfc6af" roughness={0.8} />
      </mesh>

      {/* Door Leaf Rotating Around Left Hinge Pivot */}
      <group position={[-0.68, 0, 0.02]}>
        <group ref={pivot}>
          {/* Solid Timber Door Panel */}
          <mesh position={[0.68, 1.35, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.36, 2.62, 0.075]} />
            <meshStandardMaterial color="#3a5647" roughness={0.68} />
          </mesh>
          {/* Recessed Molded Door Panels */}
          <mesh position={[0.68, 0.75, 0.042]} castShadow>
            <boxGeometry args={[1.1, 1.05, 0.018]} />
            <meshStandardMaterial color="#2b4336" roughness={0.7} />
          </mesh>
          <mesh position={[0.68, 1.95, 0.042]} castShadow>
            <boxGeometry args={[1.1, 0.95, 0.018]} />
            <meshStandardMaterial color="#4c6e5c" roughness={0.7} />
          </mesh>
          {/* Frosted Transom Glazing Panel */}
          <mesh position={[0.68, 2.05, 0.046]}>
            <boxGeometry args={[0.96, 0.65, 0.014]} />
            <meshStandardMaterial color="#a7c4b6" roughness={0.3} metalness={0.2} transparent opacity={0.85} />
          </mesh>
          {/* Architectural Brass Lever Handle */}
          <mesh position={[1.22, 1.15, 0.065]} castShadow>
            <boxGeometry args={[0.035, 0.18, 0.05]} />
            <meshStandardMaterial color="#d4ae5c" roughness={0.35} metalness={0.7} />
          </mesh>
          <mesh position={[1.18, 1.15, 0.085]} castShadow>
            <boxGeometry args={[0.12, 0.03, 0.035]} />
            <meshStandardMaterial color="#e5c376" roughness={0.35} metalness={0.7} />
          </mesh>
        </group>
      </group>

      {/* Transom Interactive Label Button Positioned Elegantly Above Arch Header */}
      <Html position={[0, 3.22, 0.32]} center distanceFactor={9.0} zIndexRange={[15, 0]}>
        <button
          className={`uni-door-label ${selection === id ? 'uni-door-selected' : ''}`}
          disabled={Boolean(selection)}
          onClick={() => onChoose(id)}
          aria-label={`Enter ${label}`}
        >
          {label} ↗
        </button>
      </Html>
    </group>
  );
}

/**
 * Grand Neoclassical Collegiate Facade:
 * 6 Stately fluted columns, carved pediment frieze, upper reflective arched windows, and wings.
 */
function NeoclassicalFacade() {
  const columnPositions = [-5.0, -3.0, -1.0, 1.0, 3.0, 5.0];
  const windowPositions = [-4.0, -2.0, 0, 2.0, 4.0];

  return (
    <group position={[0, 0, 0]}>
      {/* Main Classical Facade Wall */}
      <mesh position={[0, 2.8, -3.5]} castShadow receiveShadow>
        <boxGeometry args={[18, 5.6, 1.4]} />
        <meshStandardMaterial color="#f0e9d6" roughness={0.82} />
      </mesh>

      {/* Symmetrical Left and Right Wings */}
      {[-11.2, 11.2].map(x => (
        <group key={x} position={[x, 0, -3.5]}>
          <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
            <boxGeometry args={[5.2, 5.0, 1.4]} />
            <meshStandardMaterial color="#e8e0cc" roughness={0.85} />
          </mesh>
          {/* Wing Base Plinth & Cornice Trim */}
          <mesh position={[0, 0.25, 0.72]}>
            <boxGeometry args={[5.3, 0.5, 0.25]} />
            <meshStandardMaterial color="#cfc5ae" roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.9, 0.72]}>
            <boxGeometry args={[5.4, 0.35, 0.35]} />
            <meshStandardMaterial color="#d9cfb8" roughness={0.8} />
          </mesh>
          {/* Classical Wing Windows */}
          {[-1.3, 1.3].flatMap(wx =>
            [1.5, 3.4].map(wy => (
              <group key={`${wx}-${wy}`} position={[wx, wy, 0.72]}>
                <mesh>
                  <boxGeometry args={[0.9, 1.25, 0.06]} />
                  <meshStandardMaterial color="#ded5bd" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0, 0.035]}>
                  <boxGeometry args={[0.74, 1.1, 0.02]} />
                  <meshStandardMaterial color="#7ea5b9" roughness={0.25} metalness={0.3} />
                </mesh>
                <mesh position={[0, 0, 0.046]}>
                  <boxGeometry args={[0.74, 0.035, 0.01]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.5} />
                </mesh>
                <mesh position={[0, 0, 0.046]}>
                  <boxGeometry args={[0.035, 1.1, 0.01]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.5} />
                </mesh>
              </group>
            ))
          )}
        </group>
      ))}

      {/* Second Floor Classical Arched Windows (with Sky Reflective Glass) */}
      {windowPositions.map(x => (
        <group key={`win-${x}`} position={[x, 3.65, -2.78]}>
          {/* Window Surround Arch */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[1.35, 1.85, 0.12]} />
            <meshStandardMaterial color="#dfd6bf" roughness={0.8} />
          </mesh>
          {/* Reflective Sky-Blue Glass Pane */}
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[1.12, 1.62, 0.03]} />
            <meshStandardMaterial color="#7ea9c2" roughness={0.2} metalness={0.4} />
          </mesh>
          {/* Crisp White Architectural Mullions */}
          <mesh position={[0, 0, 0.07]}>
            <boxGeometry args={[1.12, 0.04, 0.015]} />
            <meshStandardMaterial color="#fcfbfa" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.4, 0.07]}>
            <boxGeometry args={[1.12, 0.04, 0.015]} />
            <meshStandardMaterial color="#fcfbfa" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0, 0.07]}>
            <boxGeometry args={[0.04, 1.62, 0.015]} />
            <meshStandardMaterial color="#fcfbfa" roughness={0.5} />
          </mesh>
          {/* Arched Top Accent */}
          <mesh position={[0, 0.72, 0.07]}>
            <cylinderGeometry args={[0.56, 0.56, 0.03, 16, 1, false, 0, Math.PI]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#dfd6bf" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 6 Grand Fluted Classical Columns along the Terrace */}
      {columnPositions.map(x => (
        <group key={`col-${x}`} position={[x, 0.28, -0.95]}>
          {/* Classical Square Pedestal Base */}
          <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.58, 0.4, 0.58]} />
            <meshStandardMaterial color="#dfd6bf" roughness={0.85} />
          </mesh>
          {/* Fluted Round Classical Shaft */}
          <mesh position={[0, 2.25, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.22, 0.25, 3.7, 16]} />
            <meshStandardMaterial color="#fdfaf0" roughness={0.75} />
          </mesh>
          {/* Molded Capital */}
          <mesh position={[0, 4.22, 0]} castShadow>
            <boxGeometry args={[0.62, 0.25, 0.62]} />
            <meshStandardMaterial color="#dfd6bf" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Portico Architrave & Entablature Beam across all 6 columns */}
      <mesh position={[0, 4.75, -0.95]} castShadow receiveShadow>
        <boxGeometry args={[11.6, 0.45, 0.8]} />
        <meshStandardMaterial color="#ede4ce" roughness={0.8} />
      </mesh>
      {/* Decorative Dentil Cornice */}
      <mesh position={[0, 5.05, -0.9]}>
        <boxGeometry args={[12.0, 0.16, 0.95]} />
        <meshStandardMaterial color="#dfd5bc" roughness={0.78} />
      </mesh>

      {/* Classical Triangular Pediment Gable over the Central 4 Columns */}
      <group position={[0, 5.12, -0.95]}>
        {/* Sloping Left Cornice */}
        <mesh position={[-1.9, 0.65, 0]} rotation={[0, 0, 0.32]} castShadow>
          <boxGeometry args={[4.2, 0.26, 0.7]} />
          <meshStandardMaterial color="#dfd5bc" roughness={0.8} />
        </mesh>
        {/* Sloping Right Cornice */}
        <mesh position={[1.9, 0.65, 0]} rotation={[0, 0, -0.32]} castShadow>
          <boxGeometry args={[4.2, 0.26, 0.7]} />
          <meshStandardMaterial color="#dfd5bc" roughness={0.8} />
        </mesh>
        {/* Tympanum Center Wall & Relief */}
        <mesh position={[0, 0.52, -0.05]} castShadow>
          <boxGeometry args={[7.0, 1.15, 0.5]} />
          <meshStandardMaterial color="#ede4ce" roughness={0.82} />
        </mesh>
        {/* Heraldic Gold/Brass University Medallion */}
        <mesh position={[0, 0.58, 0.24]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.38, 0.38, 0.06, 24]} />
          <meshStandardMaterial color="#cba757" roughness={0.35} metalness={0.65} />
        </mesh>
      </group>

      {/* Carved Frieze Label: "LUGAISH UNIVERSITY" */}
      <Html position={[0, 4.75, -0.52]} center distanceFactor={11} zIndexRange={[15, 0]}>
        <div className="uni-building-label">LUGAISH UNIVERSITY</div>
      </Html>
    </group>
  );
}

/**
 * Grand 4-Tier Entrance Staircase with Flanking Balustrade Pedestals and Topiary.
 */
function GrandStairs() {
  const steps = [
    { z: 0.35, y: 0.035, w: 13.0, h: 0.07, d: 0.5, c: '#ded7c2' },
    { z: 0.05, y: 0.105, w: 12.6, h: 0.07, d: 0.5, c: '#e4ddc8' },
    { z: -0.25, y: 0.175, w: 12.2, h: 0.07, d: 0.5, c: '#ede5d0' },
    { z: -0.55, y: 0.245, w: 11.8, h: 0.07, d: 0.5, c: '#f5edd8' },
  ];

  return (
    <group position={[0, 0, 0]}>
      {/* 4 Wide Ascending Steps */}
      {steps.map((st, i) => (
        <mesh key={i} position={[0, st.y, st.z]} receiveShadow castShadow>
          <boxGeometry args={[st.w, st.h, st.d]} />
          <meshStandardMaterial color={st.c} roughness={0.85} />
        </mesh>
      ))}

      {/* Flanking Balustrade Pedestals at Base of Stairs */}
      {[-6.6, 6.6].map(x => (
        <group key={`ped-${x}`} position={[x, 0, 0.4]}>
          {/* Stepped Stone Balustrade Wall */}
          <mesh position={[0, 0.38, -0.45]} castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.76, 1.4]} />
            <meshStandardMaterial color="#dcd4bf" roughness={0.85} />
          </mesh>
          {/* Corner Pedestal Pillar */}
          <mesh position={[0, 0.45, 0.22]} castShadow receiveShadow>
            <boxGeometry args={[0.62, 0.9, 0.62]} />
            <meshStandardMaterial color="#cfc6af" roughness={0.85} />
          </mesh>
          {/* Sculpted Stone Planter / Urn */}
          <mesh position={[0, 0.98, 0.22]} castShadow>
            <cylinderGeometry args={[0.34, 0.22, 0.22, 12]} />
            <meshStandardMaterial color="#ded6be" roughness={0.8} />
          </mesh>
          {/* Manicured Spherical Green Topiary */}
          <mesh position={[0, 1.25, 0.22]} castShadow>
            <sphereGeometry args={[0.36, 14, 12]} />
            <meshStandardMaterial color="#3f613c" roughness={0.88} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Central Limestone Promenade with Pavers, Border Curbs, and Scattered Autumn Leaves.
 */
function CentralPromenade() {
  // Memoized subtle scattered autumn fallen leaves across the stone promenade
  const leaves = useMemo(() => {
    const items = [];
    const colors = ['#c87532', '#d99c37', '#a64828', '#b86d2a', '#e0aa42'];
    for (let i = 0; i < 32; i++) {
      const x = ((i * 1.7) % 4.8) - 2.4;
      const z = 0.8 + ((i * 2.3) % 5.4);
      const rot = (i * 0.9) % (Math.PI * 2);
      const scale = 0.08 + (i % 4) * 0.02;
      const color = colors[i % colors.length];
      items.push({ x, z, rot, scale, color });
    }
    return items;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Broad Central Limestone Paving Slab */}
      <mesh position={[0, 0.005, 3.8]} receiveShadow>
        <boxGeometry args={[5.6, 0.015, 6.4]} />
        <meshStandardMaterial color="#ebe3d1" roughness={0.85} />
      </mesh>

      {/* Flanking Stone Border Curbs */}
      {[-2.85, 2.85].map(x => (
        <mesh key={`curb-${x}`} position={[x, 0.03, 3.8]} receiveShadow castShadow>
          <boxGeometry args={[0.16, 0.06, 6.4]} />
          <meshStandardMaterial color="#cfc5af" roughness={0.8} />
        </mesh>
      ))}

      {/* Paver Joint Seams */}
      {[-1.4, 0, 1.4].map(x => (
        <mesh key={`seam-x-${x}`} position={[x, 0.015, 3.8]}>
          <boxGeometry args={[0.025, 0.005, 6.38]} />
          <meshStandardMaterial color="#c5baa1" roughness={0.9} />
        </mesh>
      ))}
      {[1.5, 2.7, 3.9, 5.1, 6.3].map(z => (
        <mesh key={`seam-z-${z}`} position={[0, 0.015, z]}>
          <boxGeometry args={[5.55, 0.005, 0.025]} />
          <meshStandardMaterial color="#c5baa1" roughness={0.9} />
        </mesh>
      ))}

      {/* Scattered Autumn Fallen Leaves on Promenade */}
      {leaves.map((lf, i) => (
        <mesh
          key={`leaf-${i}`}
          position={[lf.x, 0.022, lf.z]}
          rotation={[-Math.PI / 2, 0, lf.rot]}
          scale={lf.scale}
        >
          <planeGeometry args={[1, 0.65]} />
          <meshStandardMaterial color={lf.color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Campus({ selection, ready = true, onArrive, onChoose, onError }) {
  const { gl, camera } = useThree();
  const journey = useRef(createJourney());
  const studentRef = useRef();
  const motion = useRef({ velocity: { x: 0, z: 0 }, facing: Math.PI, seated: false });
  const arrivedCalled = useRef(false);
  const camPos = useRef(new Vector3(0, 2.35, 9.2));
  const lookTarget = useRef(new Vector3(0, 2.35, 0.2));
  const doorAngles = useRef({ classroom: 0, study: 0, speaking: 0 });
  const reducedMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const lost = e => {
      e.preventDefault();
      onError();
    };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }, [gl, onError]);

  useEffect(() => {
    arrivedCalled.current = false;
    if (!selection) {
      journey.current.destination = null;
      journey.current.index = 0;
      doorAngles.current = { classroom: 0, study: 0, speaking: 0 };
    }
  }, [selection]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    if (reducedMotion.current && selection && !arrivedCalled.current) {
      arrivedCalled.current = true;
      onArrive();
      return;
    }

    // Step physics & navigation journey
    stepJourney(journey.current, selection, ready, dt);
    const s = journey.current;

    // Update student position (including stair elevation s.y) and motion
    if (studentRef.current) {
      studentRef.current.position.set(s.x, s.y || 0, s.z);
    }
    motion.current = {
      velocity: s.velocity,
      facing: s.yaw,
      seated: false,
      grounded: s.grounded,
      ground: (_, z) => getStairsElevation(z),
    };

    // Update door opening angles
    for (const key of ['classroom', 'study', 'speaking']) {
      const targetAngle = selection === key ? s.door : 0;
      doorAngles.current[key] += (targetAngle - doorAngles.current[key]) * (1 - Math.exp(-6 * dt));
    }

    // Human-scale cinematic camera tracking:
    // Wide prestigious establishing shot at rest; follows student forward during navigation
    const targetCamX = selection ? s.x * 0.35 : 0;
    const targetCamY = selection ? Math.max(2.1, 1.85 + (s.y || 0)) : 2.35;
    const targetCamZ = selection ? Math.max(-0.4, s.z + 4.0) : 9.2;
    const targetCamPos = new Vector3(targetCamX, targetCamY, targetCamZ);

    const targetLookX = selection ? s.x * 0.65 : 0;
    const targetLookY = selection ? 1.35 + (s.y || 0) : 2.35;
    const targetLookZ = selection ? s.z - 2.0 : 0.2;
    const targetLook = new Vector3(targetLookX, targetLookY, targetLookZ);

    const camBlend = 1 - Math.exp(-5 * dt);
    camPos.current.lerp(targetCamPos, camBlend);
    lookTarget.current.lerp(targetLook, camBlend);

    camera.position.copy(camPos.current);
    camera.lookAt(lookTarget.current);

    // Arrival event triggered when student clears the doorway
    if (s.phase === 'arrived' && !arrivedCalled.current) {
      arrivedCalled.current = true;
      onArrive();
    }
  });

  return (
    <>
      {/* Sky & Atmosphere */}
      <color attach="background" args={['#d8e8f2']} />
      <fog attach="fog" args={['#dce8e0', 22, 54]} />

      {/* Sunlit Sky Clouds */}
      <SkyClouds />

      {/* Natural Warm Afternoon Sunlight & Sky Bounce */}
      <ambientLight intensity={0.42} />
      <hemisphereLight args={['#fdfbf3', '#5a7354', 1.35]} />
      <directionalLight
        position={[-7, 14, 9]}
        intensity={2.1}
        color="#fff6e2"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00012}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.5}
        shadow-camera-far={36}
      />

      {/* Flanking Manicured Green Lawns */}
      <mesh position={[-8.5, -0.05, 3.5]} receiveShadow>
        <boxGeometry args={[11, 0.1, 14]} />
        <meshStandardMaterial color="#6a875d" roughness={0.9} />
      </mesh>
      <mesh position={[8.5, -0.05, 3.5]} receiveShadow>
        <boxGeometry args={[11, 0.1, 14]} />
        <meshStandardMaterial color="#6a875d" roughness={0.9} />
      </mesh>

      {/* Elevated Portico Terrace Slab (y = 0.28) */}
      <mesh position={[0, 0.14, -1.9]} receiveShadow castShadow>
        <boxGeometry args={[18, 0.28, 2.7]} />
        <meshStandardMaterial color="#f2ecd8" roughness={0.82} />
      </mesh>

      {/* Central Grand Limestone Promenade */}
      <CentralPromenade />

      {/* Grand 4-Tier Entrance Staircase */}
      <GrandStairs />

      {/* Symmetrical Classic Campus Park Benches */}
      <CampusBench position={[-2.45, 0, 4.4]} rotation={[0, 0.14, 0]} />
      <CampusBench position={[2.45, 0, 4.4]} rotation={[0, -0.14, 0]} />
      <CampusBench position={[-2.45, 0, 2.1]} rotation={[0, 0.12, 0]} />
      <CampusBench position={[2.45, 0, 2.1]} rotation={[0, -0.12, 0]} />

      {/* Majestic Framing Campus Shade Trees */}
      {/* Foreground Right Framing Tree with Inward Branch Canopy */}
      <CampusTree position={[5.2, 0, 4.6]} scale={1.25} foliageTint="#527d49" mirror={true} />
      {/* Foreground Left Framing Tree with Inward Branch Canopy */}
      <CampusTree position={[-5.4, 0, 4.2]} scale={1.2} foliageTint="#497341" mirror={false} />
      {/* Midground Trees Flanking Lawns */}
      <CampusTree position={[-7.2, 0, 1.4]} scale={1.05} foliageTint="#648e50" />
      <CampusTree position={[7.2, 0, 1.4]} scale={1.05} foliageTint="#598248" />
      {/* Distant Campus Trees behind Building Wings */}
      <CampusTree position={[-11.5, 0, -1.8]} scale={1.3} foliageTint="#41633a" />
      <CampusTree position={[11.5, 0, -1.8]} scale={1.3} foliageTint="#41633a" />

      {/* Neoclassical Facade: 6 Columns, Carved Pediment, Upper Arched Windows, Wings */}
      <NeoclassicalFacade />

      {/* Three Functional Portals (Classroom, Study Room, Speaking Practice) */}
      <DoorPortal
        x={-4}
        id="classroom"
        label="Classroom"
        doorAngle={doorAngles.current.classroom}
        selection={selection}
        onChoose={onChoose}
      />
      <DoorPortal
        x={0}
        id="study"
        label="Study Room"
        doorAngle={doorAngles.current.study}
        selection={selection}
        onChoose={onChoose}
      />


      {/* Rigged Student Avatar (Starts on Promenade at z = 4.4) */}
      <group ref={studentRef} position={[0, 0, 4.4]}>
        <RiggedStudent motion={motion} tint="#3b6b55" />
      </group>
    </>
  );
}

export default function UniversityScene(props) {
  return (
    <div className="uni-canvas">
      <Canvas
        frameloop="always"
        dpr={[1, 1.5]}
        shadows
        camera={{ position: [0, 2.35, 8.8], fov: 46, near: 0.1, far: 65 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Campus {...props} />
      </Canvas>
    </div>
  );
}
