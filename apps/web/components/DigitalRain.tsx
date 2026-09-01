'use client';

import { useEffect, useRef } from 'react';

interface Drop {
  y: number;
  speed: number;
  direction: 1 | -1; // 1 = falling, -1 = rising
  opacity: number;
  chars: string[];
  lastSwitch: number;
}

export default function DigitalRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const FONT_SIZE = 14;
    const CHARS = '01';

    // Theme colors — muted greens from the Terminal Noir palette
    const COLORS = [
      'rgba(78, 222, 163, ',   // #4edea3 primary
      'rgba(16, 185, 129, ',   // #10b981 primary-container
      'rgba(104, 219, 169, ',  // #68dba9 tertiary
      'rgba(111, 255, 190, ',  // #6ffbbe primary-fixed
      'rgba(183, 200, 225, ',  // #b7c8e1 secondary (for variety)
    ];

    let columns = 0;
    let drops: Drop[] = [];
    let animFrame: number;
    let lastTime = 0;
    const FPS_INTERVAL = 1000 / 30; // 30fps — smooth enough, saves battery

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;

      const newColumns = Math.ceil(canvas!.width / FONT_SIZE);

      // Preserve existing drops, add new ones if columns increased
      if (newColumns > columns) {
        for (let i = columns; i < newColumns; i++) {
          drops.push(createDrop());
        }
      } else if (newColumns < columns) {
        drops = drops.slice(0, newColumns);
      }

      columns = newColumns;
    }

    function createDrop(): Drop {
      // ~20% of columns rise up, ~80% fall down
      const direction: 1 | -1 = Math.random() < 0.2 ? -1 : 1;
      return {
        y: Math.random() * (canvas!.height / FONT_SIZE),
        speed: 0.3 + Math.random() * 0.7,
        direction,
        opacity: 0.15 + Math.random() * 0.45,
        chars: [],
        lastSwitch: 0,
      };
    }

    function draw(timestamp: number) {
      animFrame = requestAnimationFrame(draw);

      // Throttle to ~30fps
      if (timestamp - lastTime < FPS_INTERVAL) return;
      lastTime = timestamp;

      // Semi-transparent overlay for trail effect
      ctx!.fillStyle = 'rgba(11, 19, 38, 0.08)';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      ctx!.font = `${FONT_SIZE}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const x = i * FONT_SIZE;
        const yPixel = drop.y * FONT_SIZE;

        // Pick a random char every few frames
        if (timestamp - drop.lastSwitch > 80 + Math.random() * 200) {
          const char = CHARS[Math.floor(Math.random() * CHARS.length)];
          drop.chars.push(char);
          if (drop.chars.length > 12) drop.chars.shift();
          drop.lastSwitch = timestamp;
        }

        // Draw the trailing characters with fading opacity
        const colorBase = COLORS[i % COLORS.length];
        for (let c = 0; c < drop.chars.length; c++) {
          const charOpacity = drop.opacity * ((c + 1) / drop.chars.length) * 0.6;
          const charY = direction_y(drop, yPixel, c);

          // Don't draw off-screen
          if (charY < -FONT_SIZE || charY > canvas!.height + FONT_SIZE) continue;

          // Lead character is brighter
          if (c === drop.chars.length - 1) {
            ctx!.fillStyle = colorBase + (drop.opacity * 0.9).toFixed(2) + ')';
          } else {
            ctx!.fillStyle = colorBase + charOpacity.toFixed(2) + ')';
          }

          ctx!.fillText(drop.chars[c], x, charY);
        }

        // Move the drop
        if (drop.direction === 1) {
          // Falling: top to bottom
          drop.y += drop.speed;
          if (drop.y * FONT_SIZE > canvas!.height && Math.random() > 0.975) {
            drop.y = -2;
            drop.speed = 0.3 + Math.random() * 0.7;
          }
        } else {
          // Rising: bottom to top
          drop.y -= drop.speed;
          if (drop.y * FONT_SIZE < 0 && Math.random() > 0.975) {
            drop.y = canvas!.height / FONT_SIZE + 2;
            drop.speed = 0.3 + Math.random() * 0.7;
          }
        }
      }
    }

    function direction_y(drop: Drop, yPixel: number, charOffset: number): number {
      if (drop.direction === 1) {
        // Falling: trailing chars go up (above the head)
        return yPixel - charOffset * FONT_SIZE;
      } else {
        // Rising: trailing chars go down (below the head)
        return yPixel + charOffset * FONT_SIZE;
      }
    }

    resize();
    animFrame = requestAnimationFrame(draw);

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
}
