import React, { useState, useCallback, useEffect, useRef } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Html, Line, Environment } from "@react-three/drei";
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

// Улучшенные цвета и материалы для более сочной картинки
const BODY_COLOR = "#2979ff"; // Сделали синий ярче, чтобы глянец лучше играл
const GLASS_COLOR = "#111111";
const GLASS_OPACITY = 0.75;
const HEADLIGHT_COLOR = "#ffffff";
const TAILLIGHT_COLOR = "#ff0d00";
const TIRE_COLOR = "#151515";
const CHROME_COLOR = "#eeeeee";
const GRILL_COLOR = "#050505";
const TRIM_COLOR = "#1a1a1a";

function Wheel({
  position,
  onClick,
}: {
  position: [number, number, number];
  onClick: (e: ThreeEvent<MouseEvent>) => void;
}) {
  return (
    <group position={position}>
      {/* Шина */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow onClick={onClick}>
        <cylinderGeometry args={[0.32, 0.32, 0.25, 32]} />
        <meshStandardMaterial color={TIRE_COLOR} roughness={0.9} />
      </mesh>
      {/* Диск (Chrome) */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[0, 0, 0.13]}
        onClick={onClick}
      >
        <cylinderGeometry args={[0.22, 0.22, 0.05, 16]} />
        <meshStandardMaterial
          color={CHROME_COLOR}
          roughness={0.15}
          metalness={0.95}
        />
      </mesh>
      {/* Спицы (упрощенно) */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.15]}>
        <boxGeometry args={[0.04, 0.42, 0.02]} />
        <meshStandardMaterial
          color={CHROME_COLOR}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, Math.PI / 2]} position={[0, 0, 0.15]}>
        <boxGeometry args={[0.04, 0.42, 0.02]} />
        <meshStandardMaterial
          color={CHROME_COLOR}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* Центральный колпачок */}
      <mesh
        rotation={[0, 0, Math.PI / 2]}
        position={[0, 0, 0.16]}
        onClick={onClick}
      >
        <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
        <meshStandardMaterial color="#000000" roughness={0.5} />
      </mesh>
    </group>
  );
}

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

  // Физический материал с мощным глянцем (теперь будет отражать свет от Environment)
  const bodyMaterial = (
    <meshPhysicalMaterial
      color={BODY_COLOR}
      metalness={0.4}
      roughness={0.15}
      clearcoat={1.0}
      clearcoatRoughness={0.05}
    />
  );

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ===== НИЖНЯЯ ЧАСТЬ КУЗОВА (CHASSIS) ===== */}
      <mesh position={[0, 0.35, 0]} onClick={handleClick} castShadow>
        <boxGeometry args={[1.86, 0.45, 4.3]} />
        {bodyMaterial}
      </mesh>

      {/* ===== БОКОВЫЕ ПОРОГИ (SIDE SKIRTS) ===== */}
      <mesh position={[-0.94, 0.18, 0]} onClick={handleClick} castShadow>
        <boxGeometry args={[0.04, 0.1, 2.5]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.8} />
      </mesh>
      <mesh position={[0.94, 0.18, 0]} onClick={handleClick} castShadow>
        <boxGeometry args={[0.04, 0.1, 2.5]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.8} />
      </mesh>

      {/* ===== КАБИНА (CABIN) ===== */}
      <mesh position={[0, 0.9, -0.3]} onClick={handleClick} castShadow>
        <boxGeometry args={[1.5, 0.45, 2.2]} />
        {bodyMaterial}
      </mesh>

      {/* ===== АНТЕННА "АКУЛИЙ ПЛАВНИК" ===== */}
      <mesh
        position={[0, 1.15, -1.2]}
        rotation={[-0.3, 0, 0]}
        onClick={handleClick}
      >
        <boxGeometry args={[0.05, 0.1, 0.15]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.6} />
      </mesh>

      {/* ===== КАПОТ (HOOD) ===== */}
      <mesh position={[0, 0.62, 1.55]} onClick={handleClick} castShadow>
        <boxGeometry args={[1.8, 0.12, 1.2]} />
        {bodyMaterial}
      </mesh>

      {/* ===== БАГАЖНИК (TRUNK) ===== */}
      <mesh position={[0, 0.62, -1.8]} onClick={handleClick} castShadow>
        <boxGeometry args={[1.8, 0.12, 0.7]} />
        {bodyMaterial}
      </mesh>

      {/* ===== ПЕРЕДНИЙ БАМПЕР И РЕШЕТКА РАДИАТОРА ===== */}
      <mesh position={[0, 0.25, 2.2]} onClick={handleClick} castShadow>
        <boxGeometry args={[1.86, 0.25, 0.15]} />
        {bodyMaterial}
      </mesh>

      {/* Хромированная окантовка решетки */}
      <mesh position={[0, 0.35, 2.27]} onClick={handleClick}>
        <boxGeometry args={[1.25, 0.22, 0.05]} />
        <meshStandardMaterial
          color={CHROME_COLOR}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Сама решетка */}
      <mesh position={[0, 0.35, 2.28]} onClick={handleClick}>
        <boxGeometry args={[1.2, 0.18, 0.05]} />
        <meshStandardMaterial color={GRILL_COLOR} roughness={0.9} />
      </mesh>

      {/* ===== ЗАДНИЙ БАМПЕР ===== */}
      <mesh position={[0, 0.25, -2.2]} onClick={handleClick} castShadow>
        <boxGeometry args={[1.86, 0.25, 0.15]} />
        {bodyMaterial}
      </mesh>

      {/* Номерные знаки с рамкой */}
      <mesh position={[0, 0.2, 2.29]} onClick={handleClick}>
        <boxGeometry args={[0.55, 0.15, 0.01]} />
        <meshStandardMaterial color={TRIM_COLOR} />
      </mesh>
      <mesh position={[0, 0.2, 2.295]} onClick={handleClick}>
        <boxGeometry args={[0.5, 0.12, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      <mesh position={[0, 0.3, -2.29]} onClick={handleClick}>
        <boxGeometry args={[0.55, 0.15, 0.01]} />
        <meshStandardMaterial color={TRIM_COLOR} />
      </mesh>
      <mesh position={[0, 0.3, -2.295]} onClick={handleClick}>
        <boxGeometry args={[0.5, 0.12, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>

      {/* ===== ВЫХЛОПНЫЕ ТРУБЫ ===== */}
      <mesh
        position={[-0.6, 0.15, -2.25]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={handleClick}
      >
        <cylinderGeometry args={[0.07, 0.07, 0.12, 16]} />
        <meshStandardMaterial
          color={CHROME_COLOR}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      <mesh
        position={[0.6, 0.15, -2.25]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={handleClick}
      >
        <cylinderGeometry args={[0.07, 0.07, 0.12, 16]} />
        <meshStandardMaterial
          color={CHROME_COLOR}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* ===== СПОЙЛЕР ===== */}
      <group position={[0, 0.75, -2.0]}>
        <mesh position={[-0.6, 0, 0]} onClick={handleClick} castShadow>
          <boxGeometry args={[0.05, 0.15, 0.1]} />
          {bodyMaterial}
        </mesh>
        <mesh position={[0.6, 0, 0]} onClick={handleClick} castShadow>
          <boxGeometry args={[0.05, 0.15, 0.1]} />
          {bodyMaterial}
        </mesh>
        <mesh position={[0, 0.1, 0.05]} onClick={handleClick} castShadow>
          <boxGeometry args={[1.7, 0.05, 0.25]} />
          {bodyMaterial}
        </mesh>
      </group>

      {/* ===== БОКОВЫЕ ЗЕРКАЛА ===== */}
      <group position={[-0.95, 0.8, 0.5]}>
        <mesh onClick={handleClick} castShadow>
          <boxGeometry args={[0.15, 0.1, 0.15]} />
          {bodyMaterial}
        </mesh>
        {/* Само стекло зеркала */}
        <mesh position={[0.01, 0, -0.08]} onClick={handleClick}>
          <boxGeometry args={[0.13, 0.08, 0.01]} />
          <meshStandardMaterial
            color={CHROME_COLOR}
            roughness={0}
            metalness={1}
          />
        </mesh>
      </group>

      <group position={[1.05, 0.8, 0.5]}>
        <mesh onClick={handleClick} castShadow>
          <boxGeometry args={[0.15, 0.1, 0.15]} />
          {bodyMaterial}
        </mesh>
        {/* Само стекло зеркала */}
        <mesh position={[-0.01, 0, -0.08]} onClick={handleClick}>
          <boxGeometry args={[0.13, 0.08, 0.01]} />
          <meshStandardMaterial
            color={CHROME_COLOR}
            roughness={0}
            metalness={1}
          />
        </mesh>
      </group>

      {/* ===== ДВЕРНЫЕ РУЧКИ ===== */}
      {/* Левые */}
      <mesh position={[-0.94, 0.7, 0.2]} onClick={handleClick}>
        <boxGeometry args={[0.04, 0.04, 0.15]} />
        {bodyMaterial}
      </mesh>
      <mesh position={[-0.94, 0.7, -0.7]} onClick={handleClick}>
        <boxGeometry args={[0.04, 0.04, 0.15]} />
        {bodyMaterial}
      </mesh>
      {/* Правые */}
      <mesh position={[0.94, 0.7, 0.2]} onClick={handleClick}>
        <boxGeometry args={[0.04, 0.04, 0.15]} />
        {bodyMaterial}
      </mesh>
      <mesh position={[0.94, 0.7, -0.7]} onClick={handleClick}>
        <boxGeometry args={[0.04, 0.04, 0.15]} />
        {bodyMaterial}
      </mesh>

      {/* ===== СТЕКЛА ===== */}
      {/* Лобовое */}
      <mesh
        position={[0, 0.95, 0.81]}
        rotation={[-0.1, 0, 0]}
        onClick={handleClick}
      >
        <boxGeometry args={[1.4, 0.4, 0.02]} />
        <meshPhysicalMaterial
          color={GLASS_COLOR}
          transparent
          opacity={GLASS_OPACITY}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
        />
      </mesh>
      {/* Заднее */}
      <mesh
        position={[0, 0.95, -1.41]}
        rotation={[0.1, 0, 0]}
        onClick={handleClick}
      >
        <boxGeometry args={[1.4, 0.4, 0.02]} />
        <meshPhysicalMaterial
          color={GLASS_COLOR}
          transparent
          opacity={GLASS_OPACITY}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
        />
      </mesh>
      {/* Боковое левое общее */}
      <mesh position={[-0.76, 0.92, -0.3]} onClick={handleClick}>
        <boxGeometry args={[0.02, 0.35, 2.0]} />
        <meshPhysicalMaterial
          color={GLASS_COLOR}
          transparent
          opacity={GLASS_OPACITY}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
        />
      </mesh>
      {/* Боковое правое общее */}
      <mesh position={[0.76, 0.92, -0.3]} onClick={handleClick}>
        <boxGeometry args={[0.02, 0.35, 2.0]} />
        <meshPhysicalMaterial
          color={GLASS_COLOR}
          transparent
          opacity={GLASS_OPACITY}
          roughness={0.1}
          metalness={0.9}
          clearcoat={1.0}
        />
      </mesh>

      {/* Центральные оконные стойки (B-pillars) */}
      <mesh position={[-0.77, 0.92, -0.25]} onClick={handleClick}>
        <boxGeometry args={[0.025, 0.36, 0.15]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.8} />
      </mesh>
      <mesh position={[0.77, 0.92, -0.25]} onClick={handleClick}>
        <boxGeometry args={[0.025, 0.36, 0.15]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.8} />
      </mesh>

      {/* ===== ФАРЫ (ПЕРЕДНИЕ) ===== */}
      <group position={[-0.7, 0.5, 2.16]}>
        {/* Внешнее стекло */}
        <mesh onClick={handleClick}>
          <boxGeometry args={[0.3, 0.12, 0.05]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            roughness={0.1}
            clearcoat={1}
          />
        </mesh>
        {/* Внутренняя лампочка */}
        <mesh position={[0, 0, -0.01]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color={HEADLIGHT_COLOR}
            emissive={HEADLIGHT_COLOR}
            emissiveIntensity={2.0}
          />
        </mesh>
      </group>

      <group position={[0.7, 0.5, 2.16]}>
        {/* Внешнее стекло */}
        <mesh onClick={handleClick}>
          <boxGeometry args={[0.3, 0.12, 0.05]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.4}
            roughness={0.1}
            clearcoat={1}
          />
        </mesh>
        {/* Внутренняя лампочка */}
        <mesh position={[0, 0, -0.01]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color={HEADLIGHT_COLOR}
            emissive={HEADLIGHT_COLOR}
            emissiveIntensity={2.0}
          />
        </mesh>
      </group>

      {/* ===== ФАРЫ (ЗАДНИЕ) ===== */}
      <group position={[-0.7, 0.5, -2.16]}>
        <mesh onClick={handleClick}>
          <boxGeometry args={[0.35, 0.12, 0.05]} />
          <meshPhysicalMaterial
            color={TAILLIGHT_COLOR}
            transparent
            opacity={0.8}
            roughness={0.2}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color={TAILLIGHT_COLOR}
            emissive={TAILLIGHT_COLOR}
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      <group position={[0.7, 0.5, -2.16]}>
        <mesh onClick={handleClick}>
          <boxGeometry args={[0.35, 0.12, 0.05]} />
          <meshPhysicalMaterial
            color={TAILLIGHT_COLOR}
            transparent
            opacity={0.8}
            roughness={0.2}
            clearcoat={1}
          />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial
            color={TAILLIGHT_COLOR}
            emissive={TAILLIGHT_COLOR}
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* ===== КОЛЕСА ===== */}
      <Wheel position={[-0.95, 0.15, 1.4]} onClick={handleClick} />
      <Wheel position={[0.95, 0.15, 1.4]} onClick={handleClick} />
      <Wheel position={[-0.95, 0.15, -1.4]} onClick={handleClick} />
      <Wheel position={[0.95, 0.15, -1.4]} onClick={handleClick} />

      {/* ===== НЕВИДИМАЯ ПЛОСКОСТЬ (Пол для перехвата кликов) ===== */}
      <mesh
        position={[0, -0.15, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
      >
        <planeGeometry args={[10, 12]} />
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
  const dragPosRef = useRef(
    new THREE.Vector3(damage.coord_x, damage.coord_y, damage.coord_z),
  );
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0)));

  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const color = damage.is_paid ? "#4caf50" : isSelected ? "#ffb300" : "#ff3d00";

  const stemPoints: [number, number, number][] = [
    [damage.coord_x, damage.coord_y + 0.02, damage.coord_z],
    [damage.coord_x, damage.coord_y + 0.25, damage.coord_z],
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
          point.x = Math.max(-2.0, Math.min(2.0, point.x));
          point.z = Math.max(-2.8, Math.min(2.8, point.z));
          point.y = damage.coord_y;
          dragPosRef.current.copy(point);

          meshRef.current.position.set(point.x, point.y + 0.25, point.z);

          if (lineRef.current) {
            const pos = lineRef.current.geometry.attributes.position.array;
            pos[0] = point.x;
            pos[1] = point.y + 0.02;
            pos[2] = point.z;
            pos[3] = point.x;
            pos[4] = point.y + 0.25;
            pos[5] = point.z;
            lineRef.current.geometry.attributes.position.needsUpdate = true;
          }
        }
      } else if (isSelected || hovered) {
        const scale = 1 + 0.25 * Math.sin(state.clock.elapsedTime * 4);
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
    [
      damage.id,
      damage.coord_x,
      damage.coord_y,
      damage.coord_z,
      onClick,
      onDragEnd,
    ],
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
    [
      dragging,
      damage.id,
      onDragEnd,
      onClick,
      damage.coord_x,
      damage.coord_y,
      damage.coord_z,
    ],
  );

  return (
    <group>
      {/* Стержень */}
      <Line ref={lineRef} points={stemPoints} color={color} lineWidth={2} />

      {/* Светящаяся сфера пина */}
      <mesh
        ref={meshRef}
        position={[damage.coord_x, damage.coord_y + 0.25, damage.coord_z]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
      >
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || isSelected ? 0.9 : 0.4}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Индикатор координат при перетаскивании */}
      {dragging && (
        <Html
          position={[
            dragPosRef.current.x,
            dragPosRef.current.y + 0.5,
            dragPosRef.current.z,
          ]}
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
              dragPosRef.current.x.toFixed(2) +
              " Y: " +
              dragPosRef.current.y.toFixed(2) +
              " Z: " +
              dragPosRef.current.z.toFixed(2)}
          </Box>
        </Html>
      )}

      {/* Всплывающая подсказка (Tooltip) */}
      {!dragging && (hovered || isSelected) && showTooltip && (
        <Html
          position={[damage.coord_x, damage.coord_y + 0.55, damage.coord_z]}
          center
          style={{ pointerEvents: "none", zIndex: 10 }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              color: "text.primary",
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              boxShadow: 6,
              whiteSpace: "nowrap",
              border: "2px solid",
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
            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
              <Typography variant="caption" color="text.secondary">
                ${Number(damage.repair_cost).toFixed(0)}
              </Typography>
              <Typography
                variant="caption"
                fontWeight="bold"
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

function GhostPin({
  position,
}: {
  position: { x: number; y: number; z: number };
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = 1 + 0.2 * Math.sin(state.clock.elapsedTime * 4);
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group>
      <Line
        points={[
          [position.x, position.y + 0.02, position.z],
          [position.x, position.y + 0.2, position.z],
        ]}
        color="#00e5ff"
        lineWidth={2}
      />
      <mesh
        ref={meshRef}
        position={[position.x, position.y + 0.22, position.z]}
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
      {/* СЕКРЕТ КРАСИВОГО ГЛЯНЦА: Environment map. 
        Без него глянцевый материал отражает черную пустоту.
      */}
      <Environment preset="city" />

      {/* Усиленное классическое освещение на случай, если Environment загружается с задержкой */}
      <ambientLight intensity={1.2} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-10, 10, -10]} intensity={1.5} />
      <directionalLight position={[0, -5, 0]} intensity={0.5} />
      <spotLight
        position={[0, 10, 0]}
        intensity={2}
        angle={Math.PI / 3}
        penumbra={1}
      />
      <hemisphereLight args={["#ffffff", "#444444", 1.0]} />

      {/* Интерактивная модель автомобиля */}
      <ProceduralCarModel onClick={onCarClick} />

      {/* Пины повреждений */}
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

      {/* Призрачный пин (превью при создании) */}
      {previewCoords && <GhostPin position={previewCoords} />}

      {/* Сетка на полу */}
      <gridHelper
        args={[12, 12, "#555555", "#333333"]}
        position={[0, -0.15, 0]}
      />

      {/* Камера и контроллеры */}
      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={3.5}
        maxDistance={12}
        maxPolarAngle={Math.PI / 2 + 0.1}
        target={[0, 0.5, 0]}
      />

      {/* Плашка режима перетаскивания (Reposition Mode) */}
      {repositionModeLabel && (
        <Html center position={[0, 2.8, 0]}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              px: 2,
              py: 0.75,
              borderRadius: 2,
              boxShadow: 6,
              whiteSpace: "nowrap",
              fontSize: "0.85rem",
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
                sx={{ color: "inherit", ml: 1, p: 0.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelReposition();
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
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
        <CircularProgress size={32} />
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
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
  const canvasBgColor = theme.palette.mode === "dark" ? "#121212" : "#f5f5f5";

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
        boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
      }}
    >
      <Canvas
        camera={{ position: [4.5, 3.5, 6], fov: 45 }}
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
