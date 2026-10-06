import { useEffect, useRef } from "react";

export function QuantumBrainCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId;

    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Anatomically Precise 3D Human Brain Mesh (1,400 Nodes for silky 60+ FPS)
    const particleCount = 1400;
    const particles = [];

    const generateBrainNode = () => {
      const type = Math.random();

      // 1. Brain Stem (Bottom Central Column)
      if (type < 0.06) {
        const t = Math.random();
        const angle = Math.random() * Math.PI * 2;
        const radius = (1 - t * 0.4) * 26 * Math.random();
        return {
          x: Math.cos(angle) * radius,
          y: 125 + t * 105,
          z: Math.sin(angle) * radius - 20,
        };
      }

      // 2. Cerebellum (Lower Rear Dual Bulges with Folia Ridges)
      if (type < 0.20) {
        const side = Math.random() < 0.5 ? -1 : 1;
        const u = Math.random() * Math.PI;
        const v = (Math.random() - 0.5) * Math.PI;
        const rx = 78;
        const ry = 58;
        const rz = 74;

        // Folia horizontal ridge pattern
        const ridge = Math.sin(u * 14) * 5;

        let x = (rx + ridge) * Math.sin(u) * Math.cos(v) * 0.8 + side * 44;
        let y = 85 + (ry + ridge) * Math.cos(u) * 0.85;
        let z = -90 + (rz + ridge) * Math.sin(u) * Math.sin(v) * 0.85;
        return { x, y, z };
      }

      // 3. Main Cerebrum (Left & Right Hemispheres with Gyri/Sulci Folds)
      const hemisphere = Math.random() < 0.5 ? -1 : 1;
      const u = Math.random() * Math.PI; // 0 (top) to PI (bottom)
      const v = (Math.random() - 0.5) * Math.PI; // -PI/2 (back) to PI/2 (front)

      const rx = 185; // Lateral width
      const ry = 195; // Vertical height
      const rz = 240; // Frontal-Occipital depth

      // Cortical Gyri (bumps) & Sulci (grooves) Folds
      const foldPrimary = Math.sin(u * 11 + hemisphere * 1.8) * Math.cos(v * 9) * 16;
      const foldSecondary = Math.sin(u * 22) * Math.cos(v * 18) * 7;
      const totalFold = foldPrimary + foldSecondary;

      const isSurface = Math.random() < 0.75;
      const depthFactor = isSurface ? 1.0 : 0.25 + Math.random() * 0.7;

      let x = (rx + totalFold) * Math.sin(u) * Math.cos(v) * hemisphere * depthFactor;
      let y = -(ry + totalFold) * Math.cos(u) * 0.82 - 20;
      let z = (rz + totalFold) * Math.sin(u) * Math.sin(v) * depthFactor;

      // Longitudinal Fissure
      const fissureGap = 20 * (1 - Math.abs(y) / (ry * 1.2));
      if (hemisphere > 0) {
        x = Math.max(fissureGap, x);
      } else {
        x = Math.min(-fissureGap, x);
      }

      // Temporal Lobe protrusion
      if (y > 8 && y < 100 && z > -60 && z < 70) {
        x *= 1.22;
      }

      // Frontal Lobe curvature
      if (z > 60 && y < 30) {
        z *= 1.08;
      }

      return { x, y, z };
    };

    for (let i = 0; i < particleCount; i++) {
      const pt = generateBrainNode();
      particles.push({
        ...pt,
        baseSize: Math.random() * 1.9 + 1.2,
        pulseSpeed: Math.random() * 0.035 + 0.015,
        pulseOffset: Math.random() * Math.PI * 2,
        brightness: Math.random() * 0.5 + 0.5,
      });
    }

    // Connect Nearby Nodes for Crisp Neural Circuit Connections
    const connections = [];
    const maxDistance = 42;
    for (let i = 0; i < particles.length; i++) {
      let neighbors = 0;
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dz = particles[i].z - particles[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < maxDistance && neighbors < 3) {
          connections.push({ from: i, to: j });
          neighbors++;
        }
      }
    }

    // Neural Spark Pulses
    const sparks = [];
    const maxSparks = 40;

    const createSpark = () => {
      if (connections.length === 0) return;
      const conn = connections[Math.floor(Math.random() * connections.length)];
      sparks.push({
        from: conn.from,
        to: conn.to,
        progress: 0,
        speed: Math.random() * 0.045 + 0.02,
        size: Math.random() * 2.6 + 1.5,
      });
    };

    for (let i = 0; i < 24; i++) createSpark();

    // Reusable Projection Arrays (Zero Garbage Collection overhead per frame)
    const projX = new Float32Array(particleCount);
    const projY = new Float32Array(particleCount);
    const projScale = new Float32Array(particleCount);
    const projAlpha = new Float32Array(particleCount);
    const projSize = new Float32Array(particleCount);
    const projZ = new Float32Array(particleCount);
    const sortedIndices = new Int32Array(particleCount);
    for (let i = 0; i < particleCount; i++) sortedIndices[i] = i;

    let rotationY = 0;
    let time = 0;

    // Render Loop
    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const focalLength = 760;

      rotationY += 0.007;
      time += 0.03;

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(0.06);
      const sinX = Math.sin(0.06);

      // 1. Project 3D points in-place without object creation
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        let rx = p.x * cosY + p.z * sinY;
        let rz = -p.x * sinY + p.z * cosY;

        let ry = p.y * cosX - rz * sinX;
        rz = p.y * sinX + rz * cosX;

        const scale = focalLength / (focalLength + rz + 360);
        projX[i] = centerX + rx * scale;
        projY[i] = centerY + ry * scale;
        projScale[i] = scale;
        projZ[i] = rz;

        const pulse = Math.sin(time * 2.5 + p.pulseOffset) * 0.4 + 0.6;
        projSize[i] = p.baseSize * scale * (0.85 + pulse * 0.35);
        projAlpha[i] = Math.min(1, Math.max(0.18, (rz + 300) / 600)) * pulse * p.brightness;
      }

      // 2. Sort indices in-place without allocating objects
      for (let i = 0; i < particleCount; i++) sortedIndices[i] = i;
      sortedIndices.sort((a, b) => projZ[a] - projZ[b]);

      // 3. Batched Neural Connection Lines
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      for (let i = 0; i < connections.length; i++) {
        const c = connections[i];
        const a1 = projAlpha[c.from];
        const a2 = projAlpha[c.to];
        const avgAlpha = (a1 + a2) * 0.35;
        if (avgAlpha > 0.07) {
          ctx.moveTo(projX[c.from], projY[c.from]);
          ctx.lineTo(projX[c.to], projY[c.to]);
        }
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.stroke();

      // 4. Render Sparks
      if (sparks.length < maxSparks && Math.random() < 0.35) {
        createSpark();
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.progress += s.speed;

        if (s.progress >= 1) {
          sparks.splice(i, 1);
          continue;
        }

        const f = s.from;
        const t = s.to;
        const sx = projX[f] + (projX[t] - projX[f]) * s.progress;
        const sy = projY[f] + (projY[t] - projY[f]) * s.progress;
        const sparkAlpha = Math.sin(s.progress * Math.PI) * Math.min(projAlpha[f], projAlpha[t]) * 1.9;
        const alpha = Math.min(1, sparkAlpha);

        ctx.beginPath();
        ctx.arc(sx, sy, s.size * projScale[f] * 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.2})`;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sx, sy, s.size * projScale[f], 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      // 5. Draw Nodes (Batched passes for inner core + subtle halo glow)
      // Glow pass for larger/brighter front nodes
      for (let k = 0; k < particleCount; k++) {
        const idx = sortedIndices[k];
        const alpha = projAlpha[idx];
        if (alpha <= 0.07) continue;
        const size = projSize[idx];
        if (size > 1.35) {
          ctx.beginPath();
          ctx.arc(projX[idx], projY[idx], size * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.12})`;
          ctx.fill();
        }
      }

      // Core node pass
      for (let k = 0; k < particleCount; k++) {
        const idx = sortedIndices[k];
        const alpha = projAlpha[idx];
        if (alpha <= 0.07) continue;

        ctx.beginPath();
        ctx.arc(projX[idx], projY[idx], projSize[idx], 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

