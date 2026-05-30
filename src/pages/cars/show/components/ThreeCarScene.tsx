import React, { useState, useCallback, useEffect, useRef } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import {
  Box,
  Stack,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useTranslate } from "@refinedev/core";

interface DamagePoint {
  id: number;
  coord_x: number;
  coord_y: number;
  coord_z: number;
  type: string;
  description: string;
  repair_cost: number;
  is_paid: boolean;
}

interface ThreeCarSceneProps {
  damages: DamagePoint[];
  selectedDamageId: number | null;
  onCarClick: (position: { x: number; y: number; z: number }) => void;
  onPinClick: (damageId: number) => void;
  onSceneReady: () => void;
  previewCoords?: { x: number; y: number; z: number } | null;
}

const BODY_COLOR = "#4a90d9";
const BODY_ROUGHNESS = 0.6;
const BODY_METALNESS = 0.4;
const GLASS_COLOR = "#88ccff";
const GLASS_OPACITY = 0.3;
const HEADLIGHT_COLOR = "#ffee88";
const TAILLIGHT_COLOR = "#ff3333";
const TIRE_COLOR = "#1a1a1a";
const CHROME_COLOR = "#cccccc";

function ProceduralCarModel({
  onClick,
}: {
  onClick: (pos: { x: number; y: number; z: number }) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onClick(e.point.clone());
    },
    [onClick],
  );

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ===== MAIN CHASSIS ===== */}
      <mesh position={[0, 0.35, 0]} onClick={handleClick} castShadow>
        <boxGeometry args={[1.8, 0.4, 4.2]} />
        <meshStandardMaterial
          color={BODY_COLOR}
          roughness={BODY_ROUGHNESS}
          metalness={BODY_METALNESS}
        />
      </mesh>

      {/* ===== CABIN / ROOF ===== */}
      <mesh position={[0, 0.9, -0.3]} onClick={handleClick} castShadow>
        <boxGeometry args={[1.55, 0.5, 2.0]} />
        <meshStandardMaterial color="#3a7bc8" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* ===== HOOD ===== */}
      <mesh position={[0, 0.6, 1.5]} onClick={handleClick} castShadow>
        <boxGeometry args={[1.7, 0.15, 0.9]} />
        <meshStandardMaterial color="#5a9de6" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* ===== TRUNK ===== */}
      <mesh position={[0, 0.6, -1.7]} onClick={handleClick} castShadow>
        <boxGeometry args={[1.7, 0.15, 0.7]} />
        <meshStandardMaterial color="#5a9de6" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* ===== FRONT BUMPER ===== */}
      <mesh position={[0, 0.2, 2.15]} castShadow>
        <boxGeometry args={[1.7, 0.2, 0.15]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>

      {/* ===== REAR BUMPER ===== */}
      <mesh position={[0, 0.2, -2.15]} castShadow>
        <boxGeometry args={[1.7, 0.2, 0.15]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>

      {/* ===== WINDSHIELD ===== */}
      <mesh position={[0, 0.95, 0.65]} onClick={handleClick}>
        <boxGeometry args={[1.5, 0.35, 0.05]} />
        <meshStandardMaterial
          color={GLASS_COLOR}
          transparent
          opacity={GLASS_OPACITY}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* ===== REAR WINDOW ===== */}
      <mesh position={[0, 0.95, -0.95]} onClick={handleClick}>
        <boxGeometry args={[1.5, 0.35, 0.05]} />
        <meshStandardMaterial
          color={GLASS_COLOR}
          transparent
          opacity={GLASS_OPACITY}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* ===== LEFT SIDE WINDOW ===== */}
      <mesh
        position={[-0.8, 0.9, -0.3]}
        rotation={[0, 0, 0]}
        onClick={handleClick}
      >
        <boxGeometry args={[0.05, 0.35, 1.5]} />
        <meshStandardMaterial
          color={GLASS_COLOR}
          transparent
          opacity={GLASS_OPACITY}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* ===== RIGHT SIDE WINDOW ===== */}
      <mesh
        position={[0.8, 0.9, -0.3]}
        rotation={[0, 0, 0]}
        onClick={handleClick}
      >
        <boxGeometry args={[0.05, 0.35, 1.5]} />
        <meshStandardMaterial
          color={GLASS_COLOR}
          transparent
          opacity={GLASS_OPACITY}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* ===== HEADLIGHTS ===== */}
      <mesh position={[-0.6, 0.45, 2.1]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color={HEADLIGHT_COLOR}
          emissive={HEADLIGHT_COLOR}
          emissiveIntensity={0.6}
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0.6, 0.45, 2.1]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color={HEADLIGHT_COLOR}
          emissive={HEADLIGHT_COLOR}
          emissiveIntensity={0.6}
          roughness={0.1}
        />
      </mesh>

      {/* ===== TAILLIGHTS ===== */}
      <mesh position={[-0.6, 0.45, -2.1]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color={TAILLIGHT_COLOR}
          emissive={TAILLIGHT_COLOR}
          emissiveIntensity={0.4}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.6, 0.45, -2.1]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial
          color={TAILLIGHT_COLOR}
          emissive={TAILLIGHT_COLOR}
          emissiveIntensity={0.4}
          roughness={0.3}
        />
      </mesh>

      {/* ===== FRONT LEFT WHEEL ===== */}
      <group position={[-1.05, 0.15, 1.3]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color={TIRE_COLOR} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.11]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
          <meshStandardMaterial
            color={CHROME_COLOR}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* ===== FRONT RIGHT WHEEL ===== */}
      <group position={[1.05, 0.15, 1.3]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color={TIRE_COLOR} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.11]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
          <meshStandardMaterial
            color={CHROME_COLOR}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* ===== REAR LEFT WHEEL ===== */}
      <group position={[-1.05, 0.15, -1.3]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color={TIRE_COLOR} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.11]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
          <meshStandardMaterial
            color={CHROME_COLOR}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* ===== REAR RIGHT WHEEL ===== */}
      <group position={[1.05, 0.15, -1.3]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color={TIRE_COLOR} roughness={0.9} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.11]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
          <meshStandardMaterial
            color={CHROME_COLOR}
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* ===== INVISIBLE GROUND PLANE (prevents click-through to background) ===== */}
      <mesh
        position={[0, -0.15, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[8, 10]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

function DamagePin({
  damage,
  isSelected,
  onClick,
}: {
  damage: DamagePoint;
  isSelected: boolean;
  onClick: (id: number) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected || hovered) {
        const scale = 1 + 0.3 * Math.sin(state.clock.elapsedTime * 3);
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const color = damage.is_paid ? "#4caf50" : isSelected ? "#ff6b35" : "#f44336";

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    setShowTooltip(true);
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(false), 200);
  }, []);

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onClick(damage.id);
    },
    [damage.id, onClick],
  );

  return (
    <group>
      {/* Vertical stem */}
      <Line
        points={[
          [damage.coord_x, damage.coord_y + 0.02, damage.coord_z],
          [damage.coord_x, damage.coord_y + 0.2, damage.coord_z],
        ]}
        color={color}
        lineWidth={1}
      />

      {/* Glowing pin sphere */}
      <mesh
        ref={meshRef}
        position={[damage.coord_x, damage.coord_y + 0.22, damage.coord_z]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || isSelected ? 0.8 : 0.3}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Hover tooltip */}
      {(hovered || isSelected) && showTooltip && (
        <Html
          position={[damage.coord_x, damage.coord_y + 0.5, damage.coord_z]}
          center
          style={{ pointerEvents: "none", zIndex: 10 }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              color: "text.primary",
              px: 1.5,
              py: 0.75,
              borderRadius: 1,
              boxShadow: 4,
              whiteSpace: "nowrap",
              border: "1px solid",
              borderColor: isSelected ? "primary.main" : "divider",
              maxWidth: 220,
            }}
          >
            <Typography
              variant="caption"
              fontWeight="bold"
              display="block"
              noWrap
            >
              {damage.description || "—"}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                ${Number(damage.repair_cost).toFixed(0)}
              </Typography>
              <Typography
                variant="caption"
                color={damage.is_paid ? "success.main" : "error.main"}
              >
                {damage.is_paid ? "Paid" : "Unpaid"}
              </Typography>
            </Stack>
          </Box>
        </Html>
      )}
    </group>
  );
}

function GhostPin({ position }: { position: { x: number; y: number; z: number } }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + 0.25 * Math.sin(state.clock.elapsedTime * 4);
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <Line
        points={[
          [position.x, position.y + 0.02, position.z],
          [position.x, position.y + 0.15, position.z],
        ]}
        color="#00e5ff"
        lineWidth={1}
      />
      <mesh
        ref={meshRef}
        position={[position.x, position.y + 0.17, position.z]}
      >
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial
          color="#00e5ff"
          transparent
          opacity={0.7}
          emissive="#00e5ff"
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function SceneContent({
  damages,
  selectedDamageId,
  onCarClick,
  onPinClick,
  onSceneReady,
  previewCoords,
}: {
  damages: DamagePoint[];
  selectedDamageId: number | null;
  onCarClick: (pos: { x: number; y: number; z: number }) => void;
  onPinClick: (id: number) => void;
  onSceneReady: () => void;
  previewCoords?: { x: number; y: number; z: number } | null;
}) {
  useEffect(() => {
    onSceneReady();
  }, [onSceneReady]);

  return (
    <>
      {/* Ambient base light */}
      <ambientLight intensity={0.5} />

      {/* Key light — warm, directional */}
      <directionalLight
        position={[5, 10, 7]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill light — cool, from opposite side */}
      <directionalLight position={[-5, 4, -4]} intensity={0.5} />

      {/* Rim light — from below to highlight edges */}
      <directionalLight position={[0, -3, 0]} intensity={0.15} />

      {/* Hemisphere light for ambient color variation */}
      <hemisphereLight args={["#87ceeb", "#444444", 0.4]} />

      {/* The interactive car */}
      <ProceduralCarModel onClick={onCarClick} />

      {/* Existing damage pins */}
      {(Array.isArray(damages) ? damages : []).map(
        (d) =>
          d.coord_x != null &&
          d.coord_y != null &&
          d.coord_z != null && (
            <DamagePin
              key={d.id}
              damage={d}
              isSelected={selectedDamageId === d.id}
              onClick={onPinClick}
            />
          ),
      )}

      {/* Ghost preview pin — visible while dialog is open with captured coords */}
      {previewCoords && <GhostPin position={previewCoords} />}

      {/* Ground grid */}
      <gridHelper
        args={[10, 10, "#666666", "#444444"]}
        position={[0, -0.15, 0]}
      />

      {/* Orbit controls — full interaction */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={2.5}
        maxDistance={10}
        target={[0, 0.5, 0]}
      />
    </>
  );
}

function LoadingFallback() {
  const t = useTranslate();
  return (
    <Html center>
      <Stack spacing={2} alignItems="center">
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          {t("cars.damages.messages.loading3D", "Loading 3D scene...")}
        </Typography>
      </Stack>
    </Html>
  );
}

export default function ThreeCarScene({
  damages,
  selectedDamageId,
  onCarClick,
  onPinClick,
  onSceneReady,
  previewCoords,
}: ThreeCarSceneProps) {
  const theme = useTheme();
  const canvasBgColor = theme.palette.background.default;

  return (
    <Box
      sx={{
        width: "100%",
        height: 520,
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: canvasBgColor,
        position: "relative",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Canvas
        camera={{ position: [3.5, 2.5, 5], fov: 40 }}
        shadows
        gl={{ antialias: true, alpha: false }}
        onCreated={(state) => {
          state.gl.setClearColor(canvasBgColor);
        }}
      >
        <React.Suspense fallback={<LoadingFallback />}>
          <SceneContent
            damages={damages}
            selectedDamageId={selectedDamageId}
            onCarClick={onCarClick}
            onPinClick={onPinClick}
            onSceneReady={onSceneReady}
            previewCoords={previewCoords}
          />
        </React.Suspense>
      </Canvas>
    </Box>
  );
}
