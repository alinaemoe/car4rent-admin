import React, { useState, useCallback, useEffect, useRef } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import {
  Box,
  Stack,
  CircularProgress,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
  onPinDragEnd?: (
    damageId: number,
    position: { x: number; y: number; z: number },
  ) => void;
  repositionModeLabel?: string | null;
  onCancelReposition?: () => void;
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
  onDragEnd,
}: {
  damage: DamagePoint;
  isSelected: boolean;
  onClick: (id: number) => void;
  onDragEnd?: (id: number, pos: { x: number; y: number; z: number }) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragPosRef = useRef(new THREE.Vector3(damage.coord_x, damage.coord_y, damage.coord_z));
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0)));

  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const color = damage.is_paid ? "#4caf50" : isSelected ? "#ff6b35" : "#f44336";

  const stemPoints: [number, number, number][] = [
    [damage.coord_x, damage.coord_y + 0.02, damage.coord_z],
    [damage.coord_x, damage.coord_y + 0.22, damage.coord_z],
  ];

  useFrame((state) => {
    if (meshRef.current) {
      if (dragging) {
        const { pointer, camera, raycaster } = state;
        raycaster.setFromCamera(pointer, camera);
        const plane = dragPlaneRef.current;
        plane.set(new THREE.Vector3(0, 1, 0), -damage.coord_y);
        const point = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(plane, point)) {
          point.x = Math.max(-1.5, Math.min(1.5, point.x));
          point.z = Math.max(-2.5, Math.min(2.5, point.z));
          point.y = damage.coord_y;
          dragPosRef.current.copy(point);

          meshRef.current.position.set(point.x, point.y + 0.22, point.z);

          if (lineRef.current) {
            const pos = lineRef.current.geometry.attributes.position.array;
            pos[0] = point.x; pos[1] = point.y + 0.02; pos[2] = point.z;
            pos[3] = point.x; pos[4] = point.y + 0.22; pos[5] = point.z;
            lineRef.current.geometry.attributes.position.needsUpdate = true;
          }
        }
      } else if (isSelected || hovered) {
        const scale = 1 + 0.3 * Math.sin(state.clock.elapsedTime * 3);
        meshRef.current.scale.setScalar(scale);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    setShowTooltip(true);
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    if (!dragging) {
      tooltipTimeoutRef.current = setTimeout(() => setShowTooltip(false), 200);
    }
  }, [dragging]);

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (onDragEnd) {
        setDragging(true);
        setShowTooltip(false);
        dragPosRef.current.set(damage.coord_x, damage.coord_y, damage.coord_z);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      } else {
        onClick(damage.id);
      }
    },
    [damage.id, damage.coord_x, damage.coord_y, damage.coord_z, onClick, onDragEnd],
  );

  const handlePointerUp = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (dragging) {
        setDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        const pos = dragPosRef.current;
        const dx = pos.x - damage.coord_x;
        const dz = pos.z - damage.coord_z;
        const moved = Math.sqrt(dx * dx + dz * dz);
        if (moved > 0.03) {
          onDragEnd?.(damage.id, { x: pos.x, y: pos.y, z: pos.z });
        } else {
          onClick(damage.id);
        }
      }
    },
    [dragging, damage.id, onDragEnd, onClick, damage.coord_x, damage.coord_y, damage.coord_z],
  );

  return (
    <group>
      {/* Vertical stem */}
      <Line ref={lineRef} points={stemPoints} color={color} lineWidth={1} />

      {/* Glowing pin sphere */}
      <mesh
        ref={meshRef}
        position={[damage.coord_x, damage.coord_y + 0.22, damage.coord_z]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
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

      {/* Drag coordinate indicator */}
      {dragging && (
        <Html
          position={[dragPosRef.current.x, dragPosRef.current.y + 0.45, dragPosRef.current.z]}
          center
          style={{ pointerEvents: "none", zIndex: 10 }}
        >
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              px: 1,
              py: 0.25,
              borderRadius: 1,
              boxShadow: 2,
              whiteSpace: "nowrap",
              fontSize: "0.65rem",
              fontFamily: "monospace",
            }}
          >
            {"X: " +
              dragPosRef.current.x.toFixed(3) +
              " Y: " +
              dragPosRef.current.y.toFixed(3) +
              " Z: " +
              dragPosRef.current.z.toFixed(3)}
          </Box>
        </Html>
      )}

      {/* Hover tooltip */}
      {!dragging && (hovered || isSelected) && showTooltip && (
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
  onPinDragEnd,
  onSceneReady,
  previewCoords,
  repositionModeLabel,
  onCancelReposition,
}: {
  damages: DamagePoint[];
  selectedDamageId: number | null;
  onCarClick: (pos: { x: number; y: number; z: number }) => void;
  onPinClick: (id: number) => void;
  onPinDragEnd?: (id: number, pos: { x: number; y: number; z: number }) => void;
  onSceneReady: () => void;
  previewCoords?: { x: number; y: number; z: number } | null;
  repositionModeLabel?: string | null;
  onCancelReposition?: () => void;
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
      {(Array.isArray(damages) ? damages : [])
        .map((d) => ({
          ...d,
          coord_x: Number(d.coord_x),
          coord_y: Number(d.coord_y),
          coord_z: Number(d.coord_z),
        }))
        .filter(
          (d) =>
            d.coord_x != null &&
            d.coord_y != null &&
            d.coord_z != null &&
            !isNaN(d.coord_x) &&
            !isNaN(d.coord_y) &&
            !isNaN(d.coord_z),
        )
        .map((d) => (
          <DamagePin
            key={d.id}
            damage={d}
            isSelected={selectedDamageId === d.id}
            onClick={onPinClick}
            onDragEnd={onPinDragEnd}
          />
        ))}

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

      {/* Reposition mode banner — floats above the scene */}
      {repositionModeLabel && (
        <Html center position={[0, 2.2, 0]}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              px: 2,
              py: 0.5,
              borderRadius: 2,
              boxShadow: 6,
              whiteSpace: "nowrap",
              fontSize: "0.85rem",
              fontWeight: "bold",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "inherit", fontWeight: "bold" }}
            >
              {repositionModeLabel}
            </Typography>
            {onCancelReposition && (
              <IconButton
                size="small"
                sx={{ color: "inherit", ml: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelReposition();
                }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Stack>
        </Html>
      )}
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
  onPinDragEnd,
  onSceneReady,
  previewCoords,
  repositionModeLabel,
  onCancelReposition,
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
            onPinDragEnd={onPinDragEnd}
            onSceneReady={onSceneReady}
            previewCoords={previewCoords}
            repositionModeLabel={repositionModeLabel}
            onCancelReposition={onCancelReposition}
          />
        </React.Suspense>
      </Canvas>
    </Box>
  );
}
