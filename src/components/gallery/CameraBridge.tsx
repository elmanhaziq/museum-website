'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import type { Camera } from 'three';

export default function CameraBridge({ onCamera }: { onCamera: (camera: Camera | null) => void }) {
  const { camera } = useThree();
  useEffect(() => { onCamera(camera); return () => onCamera(null); }, [camera, onCamera]);
  return null;
}
