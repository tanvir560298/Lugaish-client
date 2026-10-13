import {reportOperationalEvent} from '../utils/operations.js';
import { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { RiggedStudent } from '../characters/RiggedStudent.jsx';
import { followTarget, rotateToward, angleDelta } from '../characters/characterController.js';
import { planPath } from '../characters/navigation.js';
import { STUDY_ENVIRONMENT } from './studyWorld.js';

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() {reportOperationalEvent('library_render_failure'); this.props.onError?.(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const DESK_CONFIG = {
  window: {
    x: -3.2,
    chairZ: -0.35,
    standZ: 0.35,
    camPos: new Vector3(-1.8, 1.55, 0.95),
    camLook: new Vector3(-3.2, 0.95, -1.0),
  },
  quiet: {
    x: -0.4,
    chairZ: -0.6,
    standZ: -0.07,
    camPos: new Vector3(1.1, 1.6, 0.8),
    camLook: new Vector3(-0.4, 1.0, -1.3),
  },
  lounge: {
    x: 1.1,
    chairZ: 1.6,
    standZ: 2.3,
    camPos: new Vector3(-0.1, 1.5, 2.8),
    camLook: new Vector3(1.3, 0.85, 1.5),
  },
};

/**
 * Monumental floor-to-ceiling Scandinavian oak bookshelf wall with architectural walk-through portal.
 * Located along the right wall (x = 4.8), extending across the entire room depth.
 */
function MonumentalBookshelfWall() {
  const shelfY = [0.45, 1.05, 1.65, 2.25, 2.85, 3.45, 4.05];
  const dividersZ = [-4.5, -3.6, -2.7, -1.8, -0.9, 0.9, 1.8, 2.7, 3.6];

  // Collegiate library book collection with varied spines and colors
  const books = useMemo(() => {
    const palette = ['#22384d', '#2c4b3c', '#944030', '#c4933d', '#ede4d4', '#453a32', '#33485c', '#546b5a'];
    const items = [];
    shelfY.forEach((sy, sIdx) => {
      dividersZ.forEach((dz, dIdx) => {
        // Leave portal opening clear (Z in [-0.9, 0.9] and Y < 2.8)
        if (dz > -1.0 && dz < 1.0 && sy < 2.8) return;
        const count = 3 + ((sIdx * 4 + dIdx) % 3);
        for (let b = 0; b < count; b++) {
          const color = palette[(sIdx * 5 + dIdx * 3 + b) % palette.length];
          const height = 0.28 + ((sIdx + b) % 4) * 0.05;
          const width = 0.05 + (b % 2) * 0.02;
          const zOffset = dz + 0.12 + b * 0.14;
          items.push({ sy, zOffset, height, width, color });
        }
      });
    });
    return items;
  }, []);

  return (
    <group position={[4.8, 0, 0]}>
      {/* Heavy Natural Oak Backing Panel */}
      <mesh position={[0.2, 2.1, -0.4]} receiveShadow>
        <boxGeometry args={[0.08, 4.2, 8.8]} />
        <meshStandardMaterial color="#ba8c54" roughness={0.8} />
      </mesh>

      {/* Horizontal Shelves */}
      {shelfY.map(y => (
        <mesh key={y} position={[0, y, -0.4]} castShadow receiveShadow>
          <boxGeometry args={[0.48, 0.045, 8.8]} />
          <meshStandardMaterial color="#c8965a" roughness={0.75} />
        </mesh>
      ))}

      {/* Vertical Oak Dividers */}
      {dividersZ.map(z => (
        <mesh key={z} position={[0, 2.1, z]} castShadow receiveShadow>
          <boxGeometry args={[0.46, 4.2, 0.045]} />
          <meshStandardMaterial color="#ba8c54" roughness={0.75} />
        </mesh>
      ))}

      {/* Architectural Walk-Through Portal Opening Architrave Frame */}
      <mesh position={[0, 2.7, 0]} castShadow>
        <boxGeometry args={[0.52, 0.14, 1.84]} />
        <meshStandardMaterial color="#ba8c54" roughness={0.7} />
      </mesh>
      {[-0.92, 0.92].map(z => (
        <mesh key={`post-${z}`} position={[0, 1.35, z]} castShadow>
          <boxGeometry args={[0.52, 2.7, 0.08]} />
          <meshStandardMaterial color="#ba8c54" roughness={0.7} />
        </mesh>
      ))}

      {/* Warm Ambient Corridor Glow visible through Portal Opening */}
      <mesh position={[0.3, 1.35, 0]}>
        <planeGeometry args={[1.7, 2.6]} />
        <meshBasicMaterial color="#f0e2c8" />
      </mesh>

      {/* Rhythmic Book Spines */}
      {books.map((bk, i) => (
        <mesh
          key={i}
          position={[-0.04, bk.sy + bk.height / 2 + 0.022, bk.zOffset]}
          castShadow
        >
          <boxGeometry args={[0.34, bk.height, bk.width]} />
          <meshStandardMaterial color={bk.color} roughness={0.7} />
        </mesh>
      ))}

      {/* Cascading Green Ivy Plants on Top Shelf */}
      {[-2.7, 2.7].map(pz => (
        <group key={`plant-${pz}`} position={[-0.05, 3.47, pz]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.07, 0.16, 14]} />
            <meshStandardMaterial color="#c48a60" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.22, 0]}>
            <sphereGeometry args={[0.16, 12, 10]} />
            <meshStandardMaterial color="#446840" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/**
 * Panoramic floor-to-ceiling window bays with stepped reading bleachers and outdoor cityscape view.
 * Located along the left wall (x = -5.4).
 */
function PanoramaWindowsAndBleachers() {
  return (
    <group position={[-5.4, 0, 0]}>
      {/* Tall Architectural Window Bay Mullions */}
      {[-3.8, -1.3, 1.3, 3.8].map(z => (
        <mesh key={`mullion-${z}`} position={[0, 2.1, z]} castShadow>
          <boxGeometry args={[0.12, 4.2, 0.08]} />
          <meshStandardMaterial color="#2d3339" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 4.15, 0]}>
        <boxGeometry args={[0.14, 0.12, 9.2]} />
        <meshStandardMaterial color="#2d3339" roughness={0.6} />
      </mesh>

      {/* Glass Pane with Radiant Daytime Reflection */}
      <mesh position={[0.04, 2.1, 0]}>
        <boxGeometry args={[0.02, 4.0, 9.0]} />
        <meshStandardMaterial color="#b9d7e8" roughness={0.15} metalness={0.25} transparent opacity={0.35} />
      </mesh>

      {/* Outdoor Panoramic Sky & Campus Backdrop */}
      <mesh position={[-1.2, 2.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[11.5, 4.6]} />
        <meshBasicMaterial color="#cde3f0" />
      </mesh>
      {/* Distant Collegiate Skyline & Modern Towers */}
      {[-3.6, -1.8, 0.2, 2.0, 3.6].map((tz, i) => (
        <mesh key={`tower-${i}`} position={[-1.1, 1.8 + (i % 3) * 0.4, tz]}>
          <boxGeometry args={[0.05, 2.8 + (i % 3) * 0.8, 0.8 + (i % 2) * 0.4]} />
          <meshBasicMaterial color="#b4cee0" />
        </mesh>
      ))}

      {/* Stepped Wooden Bleacher Reading Benches */}
      {/* Lower Tier with Integrated Bookshelves */}
      <mesh position={[0.55, 0.12, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.55, 0.24, 8.6]} />
        <meshStandardMaterial color="#c8965a" roughness={0.7} />
      </mesh>
      {/* Upper Tier */}
      <mesh position={[0.18, 0.28, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.38, 0.56, 8.6]} />
        <meshStandardMaterial color="#b8864a" roughness={0.7} />
      </mesh>

      {/* Soft Bleacher Throw Cushions */}
      {[-3.2, -1.8, -0.4, 1.0, 2.4, 3.6].map((cz, i) => (
        <mesh
          key={`cushion-${i}`}
          position={[0.55, 0.26, cz]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.42, 0.05, 0.45]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#f2ede4' : '#547562'} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * North Wall (Far End, z = -4.9):
 * Panoramic clerestory windows looking at the sky & continuous low oak bookcases along the base.
 */
function NorthWall() {
  return (
    <group position={[0, 0, -4.9]}>
      {/* Solid Back Wall Structure */}
      <mesh position={[0, 2.1, 0]} receiveShadow>
        <boxGeometry args={[11.2, 4.2, 0.18]} />
        <meshStandardMaterial color="#f7f5ee" roughness={0.85} />
      </mesh>

      {/* Low Oak Bookcases running along the North Wall */}
      <mesh position={[0, 0.46, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[9.6, 0.92, 0.38]} />
        <meshStandardMaterial color="#c8965a" roughness={0.7} />
      </mesh>
      {/* Bookcase Top Trim */}
      <mesh position={[0, 0.94, 0.16]} castShadow>
        <boxGeometry args={[9.8, 0.04, 0.42]} />
        <meshStandardMaterial color="#b8864a" roughness={0.7} />
      </mesh>
      {/* Rhythmic Book Insets on North Wall */}
      {[-3.8, -2.2, -0.6, 1.0, 2.6, 4.0].map((bx, idx) => (
        <mesh key={bx} position={[bx, 0.46, 0.32]} castShadow>
          <boxGeometry args={[1.2, 0.65, 0.08]} />
          <meshStandardMaterial
            color={idx % 3 === 0 ? '#264259' : idx % 3 === 1 ? '#8a3c2c' : '#456050'}
            roughness={0.75}
          />
        </mesh>
      ))}

      {/* Panoramic Back Windows over Bookcase */}
      <mesh position={[0, 2.5, 0.12]}>
        <boxGeometry args={[9.6, 2.2, 0.04]} />
        <meshStandardMaterial color="#c6dded" roughness={0.2} transparent opacity={0.4} />
      </mesh>
      {/* North Window Mullions */}
      {[-3.2, 0, 3.2].map(wx => (
        <mesh key={`mullion-${wx}`} position={[wx, 2.5, 0.14]} castShadow>
          <boxGeometry args={[0.08, 2.2, 0.06]} />
          <meshStandardMaterial color="#2d3339" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 3.62, 0.14]}>
        <boxGeometry args={[9.8, 0.08, 0.06]} />
        <meshStandardMaterial color="#2d3339" roughness={0.6} />
      </mesh>
    </group>
  );
}

/**
 * 6 Suspended Scandinavian circular drum pendant lamps with warm downward illumination.
 * Arranged in two parallel rows down the grand hall.
 */
function PendantLighting() {
  const lights = [
    [-1.8, 3.3, -3.2],
    [1.8, 3.3, -3.2],
    [-1.8, 3.3, -1.2],
    [1.8, 3.3, -1.2],
    [-1.8, 3.3, 0.8],
    [1.8, 3.3, 0.8],
  ];

  return (
    <group>
      {lights.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Thin Suspension Cable */}
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.9, 6]} />
            <meshBasicMaterial color="#2d3339" />
          </mesh>
          {/* Crisp White Minimalist Drum Pendant Fixture */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.22, 24, 1, false]} />
            <meshStandardMaterial color="#fdfdfd" roughness={0.5} />
          </mesh>
          {/* Glowing Emissive Bottom Diffuser */}
          <mesh position={[0, -0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.4, 24]} />
            <meshBasicMaterial color="#fff5d6" />
          </mesh>
          {/* Downward Warm Pool Light */}
          <pointLight position={[0, -0.25, 0]} color="#ffeed0" intensity={0.7} distance={3.8} />
        </group>
      ))}
    </group>
  );
}

/**
 * Low double-sided oak library book display islands / dividers.
 * Separates foreground reading lounge from central library study tables.
 */
function LowBookDividers() {
  return (
    <group position={[-0.4, 0, 0.6]}>
      {/* Oak Base Cabinet & Shelf Frame */}
      <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.92, 0.65]} />
        <meshStandardMaterial color="#c8965a" roughness={0.7} />
      </mesh>
      {/* Top Cap */}
      <mesh position={[0, 0.94, 0]} castShadow>
        <boxGeometry args={[2.56, 0.04, 0.71]} />
        <meshStandardMaterial color="#b8864a" roughness={0.7} />
      </mesh>
      {/* Display Shelf Ledges with Forward-Facing Magazine/Book Covers */}
      {[-0.34, 0.34].map(z => (
        <group key={`shelf-${z}`} position={[0, 0.45, z]}>
          {[-0.8, 0, 0.8].map((x, idx) => (
            <mesh key={x} position={[x, 0.1, 0]} rotation={[z > 0 ? 0.18 : -0.18, 0, 0]} castShadow>
              <boxGeometry args={[0.46, 0.52, 0.02]} />
              <meshStandardMaterial
                color={idx === 0 ? '#264057' : idx === 1 ? '#9e462c' : '#3d5c48'}
                roughness={0.6}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/**
 * Scandinavian Reading Lounge Zone (`lounge` seat):
 * Woven wool rug, low oak coffee table, and two mid-century wooden armchairs.
 */
function ReadingLoungeArea({ selected, onSelect }) {
  return (
    <group position={[2.0, 0, 1.6]}>
      {/* Textured Woven Wool Area Rug */}
      <mesh position={[0, 0.006, 0]} receiveShadow>
        <boxGeometry args={[2.8, 0.012, 2.1]} />
        <meshStandardMaterial color="#c6c2b6" roughness={0.9} />
      </mesh>

      {/* Low Solid Oak Coffee Table */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.15, 0.05, 0.68]} />
          <meshStandardMaterial color="#c8965a" roughness={0.65} />
        </mesh>
        {[-0.48, 0.48].flatMap(lx =>
          [-0.26, 0.26].map(lz => (
            <mesh key={`${lx}-${lz}`} position={[lx, 0.14, lz]} castShadow>
              <boxGeometry args={[0.06, 0.28, 0.06]} />
              <meshStandardMaterial color="#b8864a" roughness={0.7} />
            </mesh>
          ))
        )}
        {/* Tabletop Art Books & Ceramic Ceramic Decor */}
        <mesh position={[-0.22, 0.36, -0.05]} castShadow>
          <boxGeometry args={[0.28, 0.03, 0.34]} />
          <meshStandardMaterial color="#2d4239" roughness={0.6} />
        </mesh>
        <mesh position={[0.26, 0.44, 0.08]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.18, 14]} />
          <meshStandardMaterial color="#eae5d8" roughness={0.5} />
        </mesh>
      </group>

      {/* Primary Armchair (Seat ID: 'lounge') on Left of Coffee Table */}
      <group
        position={[-0.9, 0, 0]}
        onClick={e => { e.stopPropagation(); onSelect(); }}
        onPointerOver={e => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = ''; }}
      >
        {/* Sculpted Natural Oak Frame */}
        {[-0.32, 0.32].map(x => (
          <group key={x} position={[x, 0, 0]}>
            <mesh position={[0, 0.22, 0.25]} rotation={[-0.15, 0, 0]} castShadow>
              <boxGeometry args={[0.045, 0.44, 0.05]} />
              <meshStandardMaterial color="#b8864a" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.24, -0.25]} rotation={[0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.045, 0.48, 0.05]} />
              <meshStandardMaterial color="#b8864a" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.48, 0]} castShadow>
              <boxGeometry args={[0.05, 0.03, 0.58]} />
              <meshStandardMaterial color="#b8864a" roughness={0.7} />
            </mesh>
          </group>
        ))}

        {/* Thick Off-White Linen Seat Cushion */}
        <mesh position={[0, 0.42, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.56, 0.12, 0.52]} />
          <meshStandardMaterial color={selected ? '#dfd8c2' : '#ede8db'} roughness={0.85} />
        </mesh>
        {/* Angled Backrest */}
        <mesh position={[0, 0.72, -0.2]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.54, 0.48, 0.1]} />
          <meshStandardMaterial color={selected ? '#dfd8c2' : '#ede8db'} roughness={0.85} />
        </mesh>
      </group>

      {/* Second Matching Armchair on Opposite Side */}
      <group position={[0.9, 0, 0]} rotation={[0, Math.PI, 0]}>
        {[-0.32, 0.32].map(x => (
          <group key={x} position={[x, 0, 0]}>
            <mesh position={[0, 0.22, 0.25]} rotation={[-0.15, 0, 0]} castShadow>
              <boxGeometry args={[0.045, 0.44, 0.05]} />
              <meshStandardMaterial color="#b8864a" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.24, -0.25]} rotation={[0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.045, 0.48, 0.05]} />
              <meshStandardMaterial color="#b8864a" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.48, 0]} castShadow>
              <boxGeometry args={[0.05, 0.03, 0.58]} />
              <meshStandardMaterial color="#b8864a" roughness={0.7} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.42, 0.02]} castShadow receiveShadow>
          <boxGeometry args={[0.56, 0.12, 0.52]} />
          <meshStandardMaterial color="#ede8db" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.72, -0.2]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[0.54, 0.48, 0.1]} />
          <meshStandardMaterial color="#ede8db" roughness={0.85} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Communal Grand Library Tables (Multiple Tables in Parallel Rows):
 * Table 1 (Front Table, z = -1.2): Hosts the `quiet` interactive study seat.
 * Table 2 (Back Table, z = -3.2): Deep library row with books, chairs, and brass lamp.
 */
function CommunalLibraryTables({ selected, onSelect }) {
  return (
    <group>
      {/* ====== ROW 1: FRONT COMMUNAL TABLE (Interactive `quiet` seat) ====== */}
      <group position={[-0.4, 0, -1.2]}>
        {/* Solid Honey Oak Tabletop */}
        <mesh
          position={[0, 0.74, 0]}
          castShadow
          receiveShadow
          onClick={e => { e.stopPropagation(); onSelect(); }}
          onPointerOver={e => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = ''; }}
        >
          <boxGeometry args={[3.2, 0.065, 1.15]} />
          <meshStandardMaterial color={selected ? '#d4aa72' : '#c8965a'} roughness={0.7} />
        </mesh>

        {/* Solid Oak Trestle Legs & Stretcher */}
        {[-1.25, 1.25].map(x => (
          <group key={`leg-${x}`} position={[x, 0, 0]}>
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.1, 0.7, 0.95]} />
              <meshStandardMaterial color="#b8864a" roughness={0.75} />
            </mesh>
            <mesh position={[0, 0.05, 0]} castShadow>
              <boxGeometry args={[0.14, 0.1, 1.05]} />
              <meshStandardMaterial color="#b8864a" roughness={0.75} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[2.4, 0.06, 0.08]} />
          <meshStandardMaterial color="#b8864a" roughness={0.75} />
        </mesh>

        {/* Linear Brass Reading Lamp */}
        <group position={[0, 0.78, 0]}>
          {[-0.9, 0.9].map(lx => (
            <mesh key={`post-${lx}`} position={[lx, 0.16, 0]} castShadow>
              <cylinderGeometry args={[0.016, 0.016, 0.32, 10]} />
              <meshStandardMaterial color="#cba757" roughness={0.35} metalness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.024, 0.024, 2.2, 16]} />
            <meshStandardMaterial color="#cba757" roughness={0.35} metalness={0.7} />
          </mesh>
          <pointLight position={[0, 0.28, 0]} color="#fff0c4" intensity={1.1} distance={2.8} />
        </group>

        {/* Center Study Place (`quiet` station) */}
        <group position={[0, 0.78, 0.28]}>
          <mesh position={[0, 0.01, 0]} rotation={[0, -0.05, 0]}>
            <boxGeometry args={[0.34, 0.016, 0.26]} />
            <meshStandardMaterial color="#f7f3e4" roughness={0.7} />
          </mesh>
          <mesh position={[0.24, 0.01, 0.04]} rotation={[0, -0.3, 0]}>
            <boxGeometry args={[0.012, 0.012, 0.2]} />
            <meshStandardMaterial color="#2d4239" roughness={0.5} />
          </mesh>
        </group>

        {/* Flanking Station Props */}
        <group position={[-0.85, 0.78, 0.25]}>
          <mesh position={[0, 0.015, 0]} rotation={[0, 0.08, 0]} castShadow>
            <boxGeometry args={[0.42, 0.024, 0.32]} />
            <meshStandardMaterial color="#253a52" roughness={0.7} />
          </mesh>
        </group>
        <group position={[0.85, 0.78, 0.26]}>
          <mesh position={[0, 0.01, 0]} rotation={[0, -0.04, 0]}>
            <boxGeometry args={[0.3, 0.014, 0.24]} />
            <meshStandardMaterial color="#f3eee0" roughness={0.7} />
          </mesh>
          <mesh position={[0.26, 0.07, -0.06]} castShadow>
            <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
            <meshStandardMaterial color="#dfdbce" roughness={0.6} />
          </mesh>
        </group>

        {/* Primary Interactive Chair (Quiet Desk) */}
        <group
          position={[0, 0, 0.6]}
          onClick={e => { e.stopPropagation(); onSelect(); }}
          onPointerOver={e => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = ''; }}
        >
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.06, 0.46]} />
            <meshStandardMaterial color={selected ? '#577c68' : '#3e5d4d'} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.72, 0.2]} castShadow>
            <boxGeometry args={[0.46, 0.46, 0.05]} />
            <meshStandardMaterial color={selected ? '#577c68' : '#3e5d4d'} roughness={0.8} />
          </mesh>
          {[-0.18, 0.18].flatMap(lx =>
            [-0.18, 0.18].map(lz => (
              <mesh key={`${lx}-${lz}`} position={[lx, 0.22, lz]} castShadow>
                <boxGeometry args={[0.035, 0.44, 0.035]} />
                <meshStandardMaterial color="#35483e" roughness={0.7} />
              </mesh>
            ))
          )}
        </group>

        {/* Flanking Chairs on Front Side */}
        {[-0.85, 0.85].map(cx => (
          <group key={`chair-${cx}`} position={[cx, 0, 0.6]}>
            <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.48, 0.06, 0.46]} />
              <meshStandardMaterial color="#3e5d4d" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.72, 0.2]} castShadow>
              <boxGeometry args={[0.46, 0.46, 0.05]} />
              <meshStandardMaterial color="#3e5d4d" roughness={0.8} />
            </mesh>
            {[-0.18, 0.18].flatMap(lx =>
              [-0.18, 0.18].map(lz => (
                <mesh key={`${lx}-${lz}`} position={[lx, 0.22, lz]} castShadow>
                  <boxGeometry args={[0.035, 0.44, 0.035]} />
                  <meshStandardMaterial color="#35483e" roughness={0.7} />
                </mesh>
              ))
            )}
          </group>
        ))}

        {/* Back Side Chairs (Facing Front) */}
        {[-0.85, 0, 0.85].map(cx => (
          <group key={`bchair-${cx}`} position={[cx, 0, -0.6]} rotation={[0, Math.PI, 0]}>
            <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.48, 0.06, 0.46]} />
              <meshStandardMaterial color="#3e5d4d" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.72, 0.2]} castShadow>
              <boxGeometry args={[0.46, 0.46, 0.05]} />
              <meshStandardMaterial color="#3e5d4d" roughness={0.8} />
            </mesh>
            {[-0.18, 0.18].flatMap(lx =>
              [-0.18, 0.18].map(lz => (
                <mesh key={`${lx}-${lz}`} position={[lx, 0.22, lz]} castShadow>
                  <boxGeometry args={[0.035, 0.44, 0.035]} />
                  <meshStandardMaterial color="#35483e" roughness={0.7} />
                </mesh>
              ))
            )}
          </group>
        ))}
      </group>

      {/* ====== ROW 2: BACK COMMUNAL TABLE (Parallel Library Table) ====== */}
      <group position={[-0.4, 0, -3.2]}>
        <mesh position={[0, 0.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.065, 1.15]} />
          <meshStandardMaterial color="#c8965a" roughness={0.7} />
        </mesh>
        {[-1.25, 1.25].map(x => (
          <group key={`b-leg-${x}`} position={[x, 0, 0]}>
            <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.1, 0.7, 0.95]} />
              <meshStandardMaterial color="#b8864a" roughness={0.75} />
            </mesh>
            <mesh position={[0, 0.05, 0]} castShadow>
              <boxGeometry args={[0.14, 0.1, 1.05]} />
              <meshStandardMaterial color="#b8864a" roughness={0.75} />
            </mesh>
          </group>
        ))}
        {/* Brass Center Reading Lamp */}
        <group position={[0, 0.78, 0]}>
          {[-0.9, 0.9].map(lx => (
            <mesh key={`b-post-${lx}`} position={[lx, 0.16, 0]} castShadow>
              <cylinderGeometry args={[0.016, 0.016, 0.32, 10]} />
              <meshStandardMaterial color="#cba757" roughness={0.35} metalness={0.7} />
            </mesh>
          ))}
          <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.024, 0.024, 2.2, 16]} />
            <meshStandardMaterial color="#cba757" roughness={0.35} metalness={0.7} />
          </mesh>
          <pointLight position={[0, 0.28, 0]} color="#fff0c4" intensity={0.9} distance={2.8} />
        </group>

        {/* Row 2 Study Chairs */}
        {[-0.85, 0, 0.85].map(cx => (
          <group key={`r2-chair-${cx}`} position={[cx, 0, 0.6]}>
            <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.48, 0.06, 0.46]} />
              <meshStandardMaterial color="#3e5d4d" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.72, 0.2]} castShadow>
              <boxGeometry args={[0.46, 0.46, 0.05]} />
              <meshStandardMaterial color="#3e5d4d" roughness={0.8} />
            </mesh>
            {[-0.18, 0.18].flatMap(lx =>
              [-0.18, 0.18].map(lz => (
                <mesh key={`${lx}-${lz}`} position={[lx, 0.22, lz]} castShadow>
                  <boxGeometry args={[0.035, 0.44, 0.035]} />
                  <meshStandardMaterial color="#35483e" roughness={0.7} />
                </mesh>
              ))
            )}
          </group>
        ))}
        {[-0.85, 0, 0.85].map(cx => (
          <group key={`r2-bchair-${cx}`} position={[cx, 0, -0.6]} rotation={[0, Math.PI, 0]}>
            <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.48, 0.06, 0.46]} />
              <meshStandardMaterial color="#3e5d4d" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.72, 0.2]} castShadow>
              <boxGeometry args={[0.46, 0.46, 0.05]} />
              <meshStandardMaterial color="#3e5d4d" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/**
 * Window Study Desk (`window` seat):
 * Dedicated focus study desk positioned alongside the floor-to-ceiling panoramic window bay.
 */
function WindowDesk({ selected, onSelect }) {
  return (
    <group position={[-3.2, 0, -1.0]}>
      {/* Solid Honey Oak Desktop */}
      <mesh
        position={[0, 0.74, 0]}
        castShadow
        receiveShadow
        onClick={e => { e.stopPropagation(); onSelect(); }}
        onPointerOver={e => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = ''; }}
      >
        <boxGeometry args={[1.7, 0.065, 0.85]} />
        <meshStandardMaterial color={selected ? '#d4aa72' : '#c8965a'} roughness={0.7} />
      </mesh>

      {/* Collegiate Sage Metal Desk Legs */}
      {[-0.72, 0.72].flatMap(lx =>
        [-0.32, 0.32].map(lz => (
          <mesh key={`${lx}-${lz}`} position={[lx, 0.35, lz]} castShadow receiveShadow>
            <boxGeometry args={[0.055, 0.7, 0.055]} />
            <meshStandardMaterial color="#354a3d" roughness={0.7} />
          </mesh>
        ))
      )}

      {/* Ergonomic Study Chair */}
      <group
        position={[0, 0, 0.65]}
        onClick={e => { e.stopPropagation(); onSelect(); }}
        onPointerOver={e => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = ''; }}
      >
        <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.07, 0.48]} />
          <meshStandardMaterial color={selected ? '#577c68' : '#3e5d4d'} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.72, 0.22]} castShadow>
          <boxGeometry args={[0.48, 0.46, 0.06]} />
          <meshStandardMaterial color={selected ? '#577c68' : '#3e5d4d'} roughness={0.8} />
        </mesh>
        {[-0.19, 0.19].flatMap(lx =>
          [-0.19, 0.19].map(lz => (
            <mesh key={`${lx}-${lz}`} position={[lx, 0.22, lz]} castShadow>
              <boxGeometry args={[0.038, 0.44, 0.038]} />
              <meshStandardMaterial color="#354a3d" roughness={0.7} />
            </mesh>
          ))
        )}
      </group>

      {/* Open Study Notebook & Pen */}
      <group position={[0, 0.78, 0]} rotation={[0, -0.08, 0]}>
        <mesh position={[-0.15, 0.008, 0]} receiveShadow>
          <boxGeometry args={[0.28, 0.016, 0.34]} />
          <meshStandardMaterial color="#f7f2e0" roughness={0.75} />
        </mesh>
        <mesh position={[0.15, 0.008, 0]} receiveShadow>
          <boxGeometry args={[0.28, 0.016, 0.34]} />
          <meshStandardMaterial color="#f0ead4" roughness={0.75} />
        </mesh>
        <mesh position={[0.36, 0.018, 0.04]} rotation={[0, -0.35, 0]}>
          <boxGeometry args={[0.012, 0.012, 0.22]} />
          <meshStandardMaterial color="#2d4a3c" />
        </mesh>
      </group>

      {/* Classic Green Banker's Desk Lamp with Warm Glow */}
      <group position={[-0.58, 0.78, -0.2]}>
        <mesh position={[0, 0.015, 0]}>
          <boxGeometry args={[0.22, 0.03, 0.2]} />
          <meshStandardMaterial color="#4a654d" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.024, 0.48, 0.024]} />
          <meshStandardMaterial color="#4a654d" roughness={0.6} />
        </mesh>
        <mesh position={[0.09, 0.47, 0.06]} rotation={[0, 0, -0.3]} castShadow>
          <coneGeometry args={[0.15, 0.17, 24, 1, true]} />
          <meshStandardMaterial color="#4a654d" side={2} />
        </mesh>
        <mesh position={[0.09, 0.38, 0.06]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.13, 24]} />
          <meshBasicMaterial color="#fff4c8" side={2} />
        </mesh>
        <pointLight position={[0.09, 0.36, 0.06]} color="#fff0c4" intensity={0.9} distance={2.4} />
      </group>

      {/* Ceramic Coffee Mug */}
      <group position={[0.6, 0.78, -0.2]}>
        <mesh position={[0, 0.07, 0]} castShadow>
          <cylinderGeometry args={[0.065, 0.055, 0.14, 20]} />
          <meshStandardMaterial color="#d4b88f" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function Room({ seat, onSeat, onSeated, instantSeat = false }) {
  const { camera } = useThree();
  const studentGroup = useRef();
  const studentMotion = useRef({ velocity: { x: 0, z: 0 }, facing: Math.PI, seated: false, instant: false });
  const reducedMotion = useRef(window.matchMedia('(prefers-reduced-motion: reduce)').matches || instantSeat);

  const studentPos = useRef(new Vector3(0, 0, 2.6));
  const currentSeatRef = useRef(null);
  const motor = useRef({ x: 0, y: 0, z: 2.6, yaw: Math.PI, vx: 0, vz: 0 });
  const docking = useRef(null);
  const standingUp = useRef(false);
  const pathWaypoints = useRef([]);
  const pathIndex = useRef(0);
  const charFacing = useRef(Math.PI);
  const isSeatedState = useRef(false);
  const notifySeated = useRef(onSeated);
  notifySeated.current = onSeated;

  // Camera targets: wide architectural perspective framing the entire Scandinavian library hall
  // Left: panoramic windows & bleachers | Right: monumental bookshelf wall | Center: lounge & library tables
  const camPos = useRef(new Vector3(-0.6, 2.2, 4.4));
  const lookTarget = useRef(new Vector3(0.5, 1.25, -1.2));

  useEffect(() => {
    const instant = reducedMotion.current || instantSeat;

    if (!seat) {
      if (isSeatedState.current) {
        const old = DESK_CONFIG[currentSeatRef.current];
        standingUp.current = true;
        if (old) docking.current = { from: studentPos.current.clone(), to: new Vector3(old.x, 0, old.standZ), elapsed: 0, duration: 1 };
        isSeatedState.current = false;
        studentMotion.current = { velocity: { x: 0, z: 0 }, facing: Math.PI, seated: false, instant };
      }
      currentSeatRef.current = null;
      return;
    }

    const cfg = DESK_CONFIG[seat];
    if (!cfg) return;

    if (instant) {
      docking.current = null; standingUp.current = false;
      motor.current.vx = motor.current.vz = 0;
      studentPos.current.set(cfg.x, 0, cfg.chairZ - .33);
      charFacing.current = Math.PI;
      isSeatedState.current = true;
      currentSeatRef.current = seat;
      studentMotion.current = { velocity: { x: 0, z: 0 }, facing: Math.PI, seated: true, instant: true };
      notifySeated.current?.(seat);
      return;
    }

    // Finish the previous chair's stand-up before navigating to a new seat.
    const oldSeat = DESK_CONFIG[currentSeatRef.current];
    if (isSeatedState.current && oldSeat) {
      standingUp.current = true;
      docking.current = { from: studentPos.current.clone(), to: new Vector3(oldSeat.x, 0, oldSeat.standZ), elapsed: 0, duration: 1 };
    }
    currentSeatRef.current = seat;
    const start = docking.current?.to || studentPos.current;
    const points = planPath(start, { x: cfg.x, z: cfg.standZ }, STUDY_ENVIRONMENT);
    if (!points) { currentSeatRef.current = null; return; }
    pathWaypoints.current = points;
    pathIndex.current = 0;
    isSeatedState.current = false;
    studentMotion.current = { velocity: { x: 0, z: 0 }, facing: charFacing.current, seated: false, instant: false };
  }, [seat, instantSeat]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // Dock/undock only during the authored chair transition, never by teleporting.
    if (docking.current) {
      const d = docking.current;
      d.elapsed = Math.min(d.duration, d.elapsed + dt);
      const t = d.elapsed / d.duration, eased = t * t * (3 - 2 * t);
      studentPos.current.lerpVectors(d.from, d.to, eased);
      if (t === 1) docking.current = null;
    }
    if (currentSeatRef.current && !isSeatedState.current && !standingUp.current && !docking.current) {
      const cfg = DESK_CONFIG[currentSeatRef.current];
      const targetPoint = pathWaypoints.current[pathIndex.current];
      Object.assign(motor.current, { x: studentPos.current.x, y: studentPos.current.y, z: studentPos.current.z, yaw: charFacing.current });
      if (targetPoint) {
        const reached = followTarget(motor.current, targetPoint, dt, STUDY_ENVIRONMENT, pathWaypoints.current[pathIndex.current + 1]);
        studentPos.current.set(motor.current.x, motor.current.y, motor.current.z);
        charFacing.current = motor.current.yaw;
        studentMotion.current = { velocity: motor.current.velocity, facing: charFacing.current, seated: false, grounded: motor.current.grounded };
        if (reached) pathIndex.current++;
      } else if (cfg) {
        charFacing.current = rotateToward(charFacing.current, Math.PI, dt);
        studentMotion.current = { velocity: { x: 0, z: 0 }, facing: charFacing.current, seated: false };
        if (Math.abs(angleDelta(charFacing.current, Math.PI)) < .03) {
          isSeatedState.current = true;
          docking.current = { from: studentPos.current.clone(), to: new Vector3(cfg.x, 0, cfg.chairZ - .33), elapsed: 0, duration: 1.2916666 };
          studentMotion.current = { velocity: { x: 0, z: 0 }, facing: Math.PI, seated: true, instant: false };
          motor.current.vx = motor.current.vz = 0;
        }
      }
    }

    if (studentGroup.current) {
      studentGroup.current.position.copy(studentPos.current);
    }

    // Camera perspective: Smoothly blend between majestic hall overview and comfortable seated view
    let targetCamPos;
    let targetLook;

    if (isSeatedState.current && currentSeatRef.current) {
      const cfg = DESK_CONFIG[currentSeatRef.current];
      targetCamPos = cfg.camPos;
      targetLook = cfg.camLook;
    } else {
      // Grand Scandinavian University Library Hall Overview
      targetCamPos = new Vector3(-0.6, 2.2, 4.4);
      targetLook = new Vector3(0.5, 1.25, -1.2);
    }

    const camBlend = reducedMotion.current ? 1 : 1 - Math.exp(-5 * dt);
    camPos.current.lerp(targetCamPos, camBlend);
    lookTarget.current.lerp(targetLook, camBlend);

    camera.position.copy(camPos.current);
    camera.lookAt(lookTarget.current);
  });

  return (
    <>
      <color attach="background" args={['#dce5de']} />

      {/* Atmospheric Natural & Interior Lighting */}
      <ambientLight intensity={0.52} />
      <hemisphereLight args={['#faf6eb', '#6b7e67', 1.35]} />
      {/* Daylight streaming through panoramic windows */}
      <directionalLight
        position={[-7.5, 6.0, 1.5]}
        intensity={2.1}
        color="#fffce8"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.00015}
      />

      {/* Polished Scandinavian Terrazzo Flooring */}
      <mesh position={[0, -0.08, 0]} receiveShadow>
        <boxGeometry args={[12.6, 0.16, 10.4]} />
        <meshStandardMaterial color="#eae5dc" roughness={0.65} />
      </mesh>
      {/* Floor Paver Expansion Joints */}
      {[-3.6, -1.2, 1.2, 3.6].map(x => (
        <mesh key={`grid-x-${x}`} position={[x, 0.002, 0]}>
          <boxGeometry args={[0.015, 0.003, 10.2]} />
          <meshStandardMaterial color="#d8d2c4" roughness={0.8} />
        </mesh>
      ))}
      {[-3.0, -1.0, 1.0, 3.0].map(z => (
        <mesh key={`grid-z-${z}`} position={[0, 0.002, z]}>
          <boxGeometry args={[12.4, 0.003, 0.015]} />
          <meshStandardMaterial color="#d8d2c4" roughness={0.8} />
        </mesh>
      ))}

      {/* South Wall with University Entrance Archway */}
      <mesh position={[0, 2.1, 4.4]} receiveShadow>
        <boxGeometry args={[12.6, 4.2, 0.18]} />
        <meshStandardMaterial color="#f7f5ee" roughness={0.85} />
      </mesh>
      <mesh position={[0, 1.45, 4.3]}>
        <boxGeometry args={[1.8, 2.9, 0.12]} />
        <meshStandardMaterial color="#3a5647" roughness={0.7} />
      </mesh>

      {/* High Ceiling with Architectural Recessed Tray & Warm Cove Lighting Glow */}
      <mesh position={[0, 4.25, 0]}>
        <boxGeometry args={[12.6, 0.1, 10.4]} />
        <meshStandardMaterial color="#fcfbfa" roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.15, -4.75]}>
        <boxGeometry args={[12.2, 0.08, 0.12]} />
        <meshBasicMaterial color="#ffe8b8" />
      </mesh>
      <mesh position={[4.65, 4.15, 0]}>
        <boxGeometry args={[0.12, 0.08, 9.8]} />
        <meshBasicMaterial color="#ffe8b8" />
      </mesh>

      {/* North Wall: Low Oak Bookcase & Panoramic Clerestory Windows */}
      <NorthWall />

      {/* Suspended Modern Drum Pendant Lamps (6 units in 2 rows) */}
      <PendantLighting />

      {/* Monumental Double-Height Oak Bookshelf Wall (Right Wall) */}
      <MonumentalBookshelfWall />

      {/* Panoramic Windows & Stepped Bleacher Benches (Left Wall) */}
      <PanoramaWindowsAndBleachers />

      {/* Low Oak Book Display Divider */}
      <LowBookDividers />

      {/* Zone 1: Window Study Desk (`window`) */}
      <WindowDesk
        selected={seat === 'window'}
        onSelect={() => onSeat('window')}
      />

      {/* Zone 2: Communal Grand Library Tables (`quiet`) */}
      <CommunalLibraryTables
        selected={seat === 'quiet'}
        onSelect={() => onSeat('quiet')}
      />

      {/* Zone 3: Scandinavian Reading Lounge (`lounge`) */}
      <ReadingLoungeArea
        selected={seat === 'lounge'}
        onSelect={() => onSeat('lounge')}
      />

      {/* Rigged Student Character */}
      <group ref={studentGroup} position={[0, 0, 2.6]}>
        <RiggedStudent
          motion={studentMotion}
          tint="#3b6b55"
          onStanding={() => { standingUp.current = false; }}
          onSeated={() => {
            if (currentSeatRef.current) {
              notifySeated.current?.(currentSeatRef.current);
            }
          }}
        />
      </group>
    </>
  );
}

export default function StudyScene({ seat, onSeat, onSeated, instantSeat = false, onError }) {
  const wrapper = useRef();

  useEffect(() => {
    const node = wrapper.current;
    if (!node) return;
    const handleLost = () => onError?.();
    node.addEventListener('study-context-lost', handleLost);
    return () => {
      node.removeEventListener('study-context-lost', handleLost);
      document.body.style.cursor = '';
    };
  }, [onError]);

  return (
    <div ref={wrapper} className="ls-study-canvas">
      <SceneBoundary onError={onError}>
        <Canvas
          frameloop="always"
          dpr={[1, 1.4]}
          shadows
          camera={{ position: [-0.6, 2.2, 4.4], fov: 52, near: 0.1, far: 45 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          fallback={<p>Use the simple desk view below.</p>}
        >
          <Room seat={seat} onSeat={onSeat} onSeated={onSeated} instantSeat={instantSeat} />
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
