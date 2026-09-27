'use client';

import { useEffect, useRef } from 'react';

const COLORS = ['#DFFAFF', '#33ff5c', '#005201'];
const PARTICLE_COUNT = 168;
const MAX_DPR = 2;
const MAX_FPS = 45;
const MAX_BACKING_PIXELS = 2_200_000;
const TAU = Math.PI * 2;
const DIRECTION = (8 * Math.PI) / 180;

type Particle = {
  x: number;
  y: number;
  oldX: number;
  oldY: number;
  phase: number;
  drift: number;
  size: number;
  pace: number;
  color: number;
};

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationFrame = 0;
    let lastTime = 0;
    let scrollResumeTimer = 0;
    let destroyed = false;
    let hidden = document.hidden;
    let inViewport = true;
    let scrolling = false;
    let reducedMotion = false;
    const pointer = { x: 0, y: 0, active: false };
    const particles: Particle[] = [];
    const random = seededRandom(42017);
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: fine)');

    const makeParticle = (): Particle => {
      const x = random() * Math.max(width, 1);
      const y = random() * Math.max(height, 1);
      return {
        x,
        y,
        oldX: x,
        oldY: y,
        phase: random() * TAU,
        drift: (random() - 0.5) * 0.75,
        size: 0.55 + random() * 0.9,
        pace: 0.62 + random() * 0.72,
        color: Math.floor(random() * COLORS.length),
      };
    };

    const reconcileCount = () => {
      const mobile = width < 768;
      const target = mobile
        ? Math.min(90, Math.max(60, Math.round((width * height) / 5200)))
        : Math.min(PARTICLE_COUNT, Math.max(120, Math.round((width * height) / 900)));
      while (particles.length > target) particles.pop();
      while (particles.length < target) particles.push(makeParticle());
    };

    const wrap = (particle: Particle, margin: number) => {
      let wrapped = false;
      if (particle.x < -margin) {
        particle.x = width + margin;
        wrapped = true;
      } else if (particle.x > width + margin) {
        particle.x = -margin;
        wrapped = true;
      }
      if (particle.y < -margin) {
        particle.y = height + margin;
        wrapped = true;
      } else if (particle.y > height + margin) {
        particle.y = -margin;
        wrapped = true;
      }
      if (wrapped) {
        particle.oldX = particle.x;
        particle.oldY = particle.y;
      }
      return wrapped;
    };

    const pointerForce = (particle: Particle, velocity: { x: number; y: number }) => {
      if (!pointer.active) return;
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      const radius = 130;
      if (distance <= 0.01 || distance >= radius) return;
      const falloff = (1 - distance / radius) ** 2;
      const force = -falloff * 95;
      velocity.x += (dx / distance) * force;
      velocity.y += (dy / distance) * force;
    };

    const render = (time: number, delta: number, still = false) => {
      if (!width || !height) return;
      reconcileCount();
      context.save();
      context.globalCompositeOperation = 'lighter';
      context.lineCap = 'round';

      particles.forEach((particle) => {
        const waveA = Math.sin(particle.y * 0.0064 + time * 0.00016 + particle.phase);
        const waveB = Math.cos(particle.x * 0.0052 - time * 0.00012);
        const angle = DIRECTION + (waveA + waveB) * 0.5 * 0.82 + particle.drift * 0.2;
        const velocity = {
          x: Math.cos(angle) * 39 * particle.pace,
          y: Math.sin(angle) * 39 * particle.pace,
        };
        pointerForce(particle, velocity);

        let startX = particle.x;
        let startY = particle.y;
        let endX: number;
        let endY: number;
        if (still) {
          const length = 3.5 + particle.size * 3.2;
          startX -= Math.cos(angle) * length * 0.5;
          startY -= Math.sin(angle) * length * 0.5;
          endX = particle.x + Math.cos(angle) * length * 0.5;
          endY = particle.y + Math.sin(angle) * length * 0.5;
        } else {
          particle.oldX = particle.x;
          particle.oldY = particle.y;
          particle.x += velocity.x * delta;
          particle.y += velocity.y * delta;
          if (wrap(particle, 12)) return;
          // Keep a short visible streak even when the frame delta is small.
          // Without this, clearing the transparent canvas each frame reduces
          // the motion to sub-pixel dots on a 45 FPS display.
          const length = 4.5 + particle.size * 4.5;
          startX = particle.x - Math.cos(angle) * length * 0.5;
          startY = particle.y - Math.sin(angle) * length * 0.5;
          endX = particle.x + Math.cos(angle) * length * 0.5;
          endY = particle.y + Math.sin(angle) * length * 0.5;
        }

        const color = COLORS[particle.color % COLORS.length];
        context.globalAlpha = clamp(0.82 * (0.42 + particle.size * 0.23), 0, 0.9);
        context.strokeStyle = color;
        context.lineWidth = clamp(1.45 * particle.size, 0.35, 3.4);
        context.shadowColor = color;
        context.shadowBlur = 2.5 + particle.size * 3;
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
      });
      context.restore();
    };

    const canAnimate = () =>
      !destroyed && !hidden && inViewport && !scrolling && !reducedMotion;

    const stop = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const schedule = () => {
      if (!canAnimate() || animationFrame) return;
      animationFrame = window.requestAnimationFrame((time) => {
        animationFrame = 0;
        if (lastTime && time - lastTime < 1000 / MAX_FPS - 1) {
          schedule();
          return;
        }
        const delta = lastTime ? clamp((time - lastTime) / 1000, 0, 0.05) : 0;
        lastTime = time;
        context.clearRect(0, 0, width, height);
        render(time, delta);
        schedule();
      });
    };

    const renderStill = () => {
      if (!width || !height || hidden || !inViewport) return;
      context.clearRect(0, 0, width, height);
      render(window.performance.now(), 0, true);
    };

    const resize = () => {
      if (destroyed) return;
      const bounds = canvas.getBoundingClientRect();
      const nextWidth = Math.round(bounds.width);
      const nextHeight = Math.round(bounds.height);
      if (nextWidth <= 0 || nextHeight <= 0) return;
      const oldWidth = width;
      const oldHeight = height;
      width = nextWidth;
      height = nextHeight;
      const areaDpr = Math.sqrt(MAX_BACKING_PIXELS / Math.max(1, width * height));
      dpr = clamp(Math.min(window.devicePixelRatio || 1, MAX_DPR, areaDpr), 0.5, MAX_DPR);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (oldWidth && oldHeight) {
        particles.forEach((particle) => {
          particle.x *= width / oldWidth;
          particle.y *= height / oldHeight;
          particle.oldX = particle.x;
          particle.oldY = particle.y;
        });
      }
      reconcileCount();
      renderStill();
      lastTime = 0;
      schedule();
    };

    const onPointer = (event: PointerEvent) => {
      if (!canAnimate() || !pointerQuery.matches) {
        pointer.active = false;
        return;
      }
      const bounds = canvas.getBoundingClientRect();
      pointer.active =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;
      if (pointer.active) {
        pointer.x = event.clientX - bounds.left;
        pointer.y = event.clientY - bounds.top;
      }
    };

    const onPointerEnd = () => {
      pointer.active = false;
    };

    const onIntersection = (entries: IntersectionObserverEntry[]) => {
      inViewport = entries[0]?.isIntersecting ?? true;
      if (!inViewport) stop();
      else {
        lastTime = 0;
        renderStill();
        schedule();
      }
    };

    const onScroll = () => {
      scrolling = true;
      stop();
      window.clearTimeout(scrollResumeTimer);
      scrollResumeTimer = window.setTimeout(() => {
        scrolling = false;
        lastTime = 0;
        schedule();
      }, 140);
    };

    const onVisibilityChange = () => {
      hidden = document.hidden;
      if (hidden) stop();
      else {
        lastTime = 0;
        renderStill();
        schedule();
      }
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      stop();
      if (reducedMotion) renderStill();
      else {
        lastTime = 0;
        schedule();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(onIntersection, { threshold: 0.01 });
    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerleave', onPointerEnd);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    motionQuery.addEventListener('change', onMotionChange);
    reducedMotion = motionQuery.matches;
    resize();

    return () => {
      destroyed = true;
      stop();
      window.clearTimeout(scrollResumeTimer);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerleave', onPointerEnd);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      motionQuery.removeEventListener('change', onMotionChange);
      context.clearRect(0, 0, width, height);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
