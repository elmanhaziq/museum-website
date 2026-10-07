'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { MathUtils, Vector3 } from 'three';
import { GALLERY } from '@/lib/constants';

const pressed = new Set<string>();

export default function Player({ active }: { active: boolean }) {
  const { camera, gl } = useThree();
  const direction = useRef(new Vector3());
  const forward = useRef(new Vector3());
  const right = useRef(new Vector3());

  useEffect(() => {
    const onDown = (event: KeyboardEvent) => { pressed.add(event.code); };
    const onUp = (event: KeyboardEvent) => { pressed.delete(event.code); };
    const onBlur = () => pressed.clear();
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  useEffect(() => {
    let dragging = false;
    let previousX = 0;
    let previousY = 0;
    const canvas = gl.domElement;
    const onPointerDown = (event: PointerEvent) => {
      if (!active) return;
      dragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;
      previousX = event.clientX;
      previousY = event.clientY;
      camera.rotation.order = 'YXZ';
      camera.rotation.y -= dx * 0.0022;
      camera.rotation.x = MathUtils.clamp(camera.rotation.x - dy * 0.0022, -Math.PI / 2.35, Math.PI / 2.35);
    };
    const onPointerUp = () => { dragging = false; };
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
    };
  }, [active, camera, gl]);

  useFrame((_, delta) => {
    if (!active) return;
    const f = Number(pressed.has('KeyW') || pressed.has('ArrowUp')) - Number(pressed.has('KeyS') || pressed.has('ArrowDown'));
    const s = Number(pressed.has('KeyD') || pressed.has('ArrowRight')) - Number(pressed.has('KeyA') || pressed.has('ArrowLeft'));
    if (!f && !s) return;
    forward.current.set(0, 0, -1).applyQuaternion(camera.quaternion).setY(0).normalize();
    right.current.set(1, 0, 0).applyQuaternion(camera.quaternion).setY(0).normalize();
    direction.current.copy(forward.current).multiplyScalar(f).addScaledVector(right.current, s).normalize().multiplyScalar(GALLERY.movementSpeed * Math.min(delta, 0.05));
    const nextX = camera.position.x + direction.current.x;
    const nextZ = camera.position.z + direction.current.z;
    const halfW = GALLERY.width / 2 - GALLERY.playerRadius;
    const halfD = GALLERY.depth / 2 - GALLERY.playerRadius;
    camera.position.x = Math.max(-halfW, Math.min(halfW, nextX));
    camera.position.z = Math.max(-halfD, Math.min(halfD, nextZ));
  });

  return null;
}
