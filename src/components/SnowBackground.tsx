import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SnowBackgroundProps {
  snowIntensity?: 'gentle' | 'normal' | 'blizzard';
}

export const SnowBackground: React.FC<SnowBackgroundProps> = ({
  snowIntensity = 'normal',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, speed: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050b14, 0.0012);

    const camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.z = 600;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Snow Particles Geometry & Texture
    const particleCount = snowIntensity === 'gentle' ? 900 : snowIntensity === 'blizzard' ? 2400 : 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const alphas = new Float32Array(particleCount);

    // Generate soft circular snowflake texture via canvas
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(224, 242, 254, 0.85)');
      gradient.addColorStop(0.7, 'rgba(186, 230, 253, 0.35)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(32, 32, 32, 0, Math.PI * 2);
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1400; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1200; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1000; // z

      // Velocity: falling speed + natural sway
      velocities[i * 3] = (Math.random() - 0.5) * 0.8; // horizontal drift
      velocities[i * 3 + 1] = -(Math.random() * 1.8 + 0.8); // falling downward
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      sizes[i] = Math.random() * 8 + 4;
      alphas[i] = Math.random() * 0.6 + 0.4;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 9,
      map: texture,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 3. Ambient Glowing Stars & Distant Ice Dust
    const starsCount = 400;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 2000;
      starPositions[i * 3 + 1] = Math.random() * 800 + 100;
      starPositions[i * 3 + 2] = -(Math.random() * 800 + 200);
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      size: 3,
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    setIsLoaded(true);

    // 4. Mouse Move Event Listener with smooth damping & wind reaction
    let lastMouseX = 0;
    let lastMouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      
      const deltaX = e.clientX - lastMouseX;
      const deltaY = e.clientY - lastMouseY;
      mouseRef.current.speed = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.05, 3.5);
      
      mouseRef.current.targetX = normX;
      mouseRef.current.targetY = normY;
      
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 5. Resize Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation (lerp)
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
      mouseRef.current.speed *= 0.95; // decay speed boost

      // Subtle camera tilt
      camera.position.x = mouseRef.current.x * 40;
      camera.position.y = mouseRef.current.y * 25;
      camera.lookAt(0, 0, 0);

      // Update falling snowflakes with wind force reacting to mouse
      const pos = geometry.attributes.position.array as Float32Array;
      const windForceX = mouseRef.current.x * 1.5 + Math.sin(elapsedTime * 0.6) * 0.4;
      const mouseSpeedBoost = mouseRef.current.speed * 0.6;

      for (let i = 0; i < particleCount; i++) {
        // Apply vertical falling
        pos[i * 3 + 1] += velocities[i * 3 + 1] - mouseSpeedBoost * 0.3;
        // Apply horizontal sway & mouse reactive wind
        pos[i * 3] += velocities[i * 3] + windForceX * 0.3 + Math.sin(elapsedTime * 1.2 + i) * 0.2;
        // Apply depth sway
        pos[i * 3 + 2] += velocities[i * 3 + 2];

        // Reset snowflake if it goes below view or too far horizontally
        if (pos[i * 3 + 1] < -600) {
          pos[i * 3 + 1] = 600;
          pos[i * 3] = (Math.random() - 0.5) * 1400;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 1000;
        }
        if (pos[i * 3] > 800) pos[i * 3] = -800;
        if (pos[i * 3] < -800) pos[i * 3] = 800;
      }
      geometry.attributes.position.needsUpdate = true;

      // Twinkle stars
      stars.rotation.y = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [snowIntensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Full-screen High Definition Snowy Mountain & Lake Night Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out scale-[1.01]"
        style={{
          backgroundImage: `url('/assets/snowy_mountain_bg.jpg')`,
          filter: 'contrast(1.05) brightness(0.98) saturate(1.1)',
        }}
      />

      {/* 2. Dark Overlay (20-25%) for enhanced contrast and crystal readability while keeping the full image vibrant */}
      <div className="absolute inset-0 bg-[#050B14]/25 pointer-events-none" />

      {/* 3. Subtle Atmospheric Aurora & Lake Specular Glow Overlay */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] opacity-25 mix-blend-screen pointer-events-none overflow-hidden animate-aurora">
        <div className="absolute -top-32 -left-20 w-[120vw] h-[450px] bg-gradient-to-r from-cyan-400/20 via-sky-300/15 to-purple-400/20 blur-[80px]" />
      </div>

      {/* 4. Three.js Realtime Snowfall & Ice Dust WebGL Canvas */}
      <div ref={containerRef} className="absolute inset-0 z-10" />

      {/* 5. Minimal Bottom Gradient for smooth content reading */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050B14]/70 via-transparent to-transparent pointer-events-none z-10" />
    </div>
  );
};
