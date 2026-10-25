// Procedural Canvas Texture Generator for Dunhuang 360° Cave Panoramas
// Guarantees zero 404 dependencies with authentic Dunhuang mineral pigments and traditional motifs

export function generateCavePanoramaCanvas(caveId: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const w = canvas.width;
  const h = canvas.height;

  // 1. Base Cave Rock Texture (Coarse sand, weathered mud, desert earthen tones)
  const baseGrad = ctx.createLinearGradient(0, 0, 0, h);
  baseGrad.addColorStop(0, '#2D231E'); // Cave dome
  baseGrad.addColorStop(0.3, '#3A2E26');
  baseGrad.addColorStop(0.5, '#42332A');
  baseGrad.addColorStop(0.7, '#3A2E26');
  baseGrad.addColorStop(1, '#1A1410'); // Cave floor
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, w, h);

  // Weathering noise & mineral speckles
  const noiseCount = 3500;
  for (let i = 0; i < noiseCount; i++) {
    const nx = Math.random() * w;
    const ny = Math.random() * h;
    const nr = Math.random() * 2.5 + 0.5;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(212, 185, 150, 0.08)' : 'rgba(0, 0, 0, 0.12)';
    ctx.beginPath();
    ctx.arc(nx, ny, nr, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Dome / Caisson (藻井) at top
  drawCaissonCeiling(ctx, w, h, caveId);

  // 3. Central Murals & Specific Themes across walls
  switch (caveId) {
    case 257:
      drawCave257NineColoredDeer(ctx, w, h);
      break;
    case 285:
      drawCave285WesternWeiGods(ctx, w, h);
      break;
    case 420:
      drawCave420SuiCaravan(ctx, w, h);
      break;
    case 220:
      drawCave220TangMusicDance(ctx, w, h);
      break;
    case 45:
      drawCave45TangSculptures(ctx, w, h);
      break;
    case 103:
      drawCave103WuLineDrawing(ctx, w, h);
      break;
    case 320:
      drawCave320FlyingApsaras(ctx, w, h);
      break;
    case 156:
      drawCave156ZhangYichaoExpedition(ctx, w, h);
      break;
    default:
      drawCave320FlyingApsaras(ctx, w, h);
  }

  // 4. Subtle Thousand Buddha Pattern (千佛图) on upper band
  drawThousandBuddhasBand(ctx, w, h, caveId);

  // 5. Border Trim & Lotus Petal Dado (金刚座/莲花纹边饰)
  drawDecorativeBorder(ctx, w, h);

  return canvas;
}

// Draw Caisson (藻井) at top pole (equirectangular projection)
function drawCaissonCeiling(ctx: CanvasRenderingContext2D, w: number, h: number, caveId: number) {
  const topH = h * 0.22;
  const grad = ctx.createLinearGradient(0, 0, 0, topH);
  grad.addColorStop(0, '#1B263B');
  grad.addColorStop(0.5, '#7C2D12');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, topH);

  // Lotus petals repeating along caisson edge
  const steps = 32;
  const stepW = w / steps;
  for (let i = 0; i < steps; i++) {
    const cx = i * stepW + stepW / 2;
    const cy = topH * 0.6;
    ctx.beginPath();
    ctx.fillStyle = (i % 2 === 0) ? '#D97706' : '#047857';
    ctx.arc(cx, cy, stepW * 0.45, 0, Math.PI);
    ctx.fill();

    // Golden dot in caisson
    ctx.fillStyle = '#FDE68A';
    ctx.beginPath();
    ctx.arc(cx, cy - 10, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Thousand Buddha repeated grid along upper mural band
function drawThousandBuddhasBand(ctx: CanvasRenderingContext2D, w: number, h: number, caveId: number) {
  const startY = h * 0.18;
  const bandH = h * 0.12;
  const cols = 28;
  const rows = 2;
  const cellW = w / cols;
  const cellH = bandH / rows;

  ctx.save();
  ctx.globalAlpha = 0.65;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const bx = c * cellW + cellW * 0.5;
      const by = startY + r * cellH + cellH * 0.5;

      // Halo / Mandorla
      ctx.fillStyle = (c + r) % 2 === 0 ? '#164E63' : '#991B1B';
      ctx.beginPath();
      ctx.arc(bx, by, cellH * 0.38, 0, Math.PI * 2);
      ctx.fill();

      // Dhyana Buddha silhouette
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(bx, by - cellH * 0.12, cellH * 0.14, 0, Math.PI * 2); // head
      ctx.fill();

      // Robe
      ctx.beginPath();
      ctx.moveTo(bx - cellH * 0.22, by + cellH * 0.28);
      ctx.quadraticCurveTo(bx, by - cellH * 0.05, bx + cellH * 0.22, by + cellH * 0.28);
      ctx.fill();
    }
  }
  ctx.restore();
}

// Decorative lower border (莲瓣纹与忍冬纹)
function drawDecorativeBorder(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const botY = h * 0.88;
  ctx.fillStyle = '#1A1410';
  ctx.fillRect(0, botY, w, h - botY);

  const steps = 40;
  const sw = w / steps;
  for (let i = 0; i < steps; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#B2533E' : '#0D9488';
    ctx.beginPath();
    ctx.moveTo(i * sw, botY);
    ctx.lineTo((i + 0.5) * sw, botY + 18);
    ctx.lineTo((i + 1) * sw, botY);
    ctx.fill();
  }
}

// --- Specific Cave Murals ---

// Cave 257: Nine-Colored Deer
function drawCave257NineColoredDeer(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const cx = w * 0.45;
  const cy = h * 0.55;

  // Northern Wei Desert Ochre Mountains
  ctx.fillStyle = '#B2533E';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.72);
  ctx.lineTo(w * 0.2, h * 0.48);
  ctx.lineTo(w * 0.4, h * 0.65);
  ctx.lineTo(w * 0.6, h * 0.45);
  ctx.lineTo(w * 0.8, h * 0.62);
  ctx.lineTo(w, h * 0.5);
  ctx.lineTo(w, h * 0.88);
  ctx.lineTo(0, h * 0.88);
  ctx.fill();

  // Swirling holy river
  const riverGrad = ctx.createLinearGradient(0, h * 0.68, w, h * 0.75);
  riverGrad.addColorStop(0, '#0E7490');
  riverGrad.addColorStop(0.5, '#065F46');
  riverGrad.addColorStop(1, '#0E7490');
  ctx.fillStyle = riverGrad;
  ctx.fillRect(0, h * 0.72, w, h * 0.12);

  // Nine-Colored Deer Hero (Pristine White with Nine Jewel Spots)
  ctx.save();
  ctx.translate(cx, cy);

  // Body
  ctx.fillStyle = '#FFFBEB';
  ctx.shadowColor = '#F59E0B';
  ctx.shadowBlur = 24;
  ctx.beginPath();
  ctx.ellipse(0, 0, 75, 45, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Neck and Head
  ctx.beginPath();
  ctx.moveTo(-45, -20);
  ctx.quadraticCurveTo(-75, -80, -95, -95);
  ctx.lineTo(-75, -100);
  ctx.quadraticCurveTo(-45, -70, -20, -35);
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.ellipse(-95, -95, 24, 15, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // Branching Coral Antlers (Coral Red & Gold)
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-95, -105);
  ctx.lineTo(-120, -150);
  ctx.lineTo(-100, -175);
  ctx.moveTo(-115, -135);
  ctx.lineTo(-145, -155);
  ctx.moveTo(-90, -105);
  ctx.lineTo(-80, -155);
  ctx.lineTo(-60, -180);
  ctx.moveTo(-82, -135);
  ctx.lineTo(-65, -150);
  ctx.stroke();

  // 9 Jewels Spots on Body (Azurite, Malachite, Vermilion, Gold)
  const spots = [
    { x: -20, y: -10, c: '#0284C7' },
    { x: 10, y: -15, c: '#10B981' },
    { x: 35, y: -5, c: '#EF4444' },
    { x: -5, y: 10, c: '#F59E0B' },
    { x: 25, y: 15, c: '#8B5CF6' },
    { x: -35, y: 5, c: '#EC4899' },
    { x: 15, y: -2, c: '#06B6D4' }
  ];
  spots.forEach(s => {
    ctx.fillStyle = s.c;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 6.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Deer Legs (graceful slender posture)
  ctx.strokeStyle = '#FFFBEB';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-40, 30);
  ctx.lineTo(-45, 95);
  ctx.moveTo(-20, 35);
  ctx.lineTo(-15, 90);
  ctx.moveTo(35, 30);
  ctx.lineTo(40, 95);
  ctx.moveTo(55, 25);
  ctx.lineTo(65, 90);
  ctx.stroke();

  ctx.restore();

  // Royal King's Carriage on right wall
  ctx.save();
  ctx.fillStyle = '#D97706';
  ctx.fillRect(w * 0.72, h * 0.52, 90, 60);
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(w * 0.76, h * 0.62, 30, 0, Math.PI * 2);
  ctx.arc(w * 0.84, h * 0.62, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

// Cave 285: Western Wei Pantheon (Fuxi & Nuwa)
function drawCave285WesternWeiGods(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Cosmic starry swirling background
  const skyGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, 50, w * 0.5, h * 0.45, w * 0.45);
  skyGrad.addColorStop(0, '#1E293B');
  skyGrad.addColorStop(0.6, '#0F172A');
  skyGrad.addColorStop(1, '#332014');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, h * 0.22, w, h * 0.66);

  // Chinese constellation / celestial dots
  ctx.fillStyle = '#FDE68A';
  for (let i = 0; i < 180; i++) {
    const sx = Math.random() * w;
    const sy = h * 0.25 + Math.random() * (h * 0.5);
    ctx.beginPath();
    ctx.arc(sx, sy, Math.random() * 2 + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // Fuxi (Holding Ruler / 矩) & Nuwa (Holding Compass / 规)
  const cx = w * 0.5;
  const cy = h * 0.5;

  ctx.save();
  ctx.translate(cx, cy);

  // Entwined serpent tails (人首蛇身交尾)
  ctx.lineWidth = 22;
  ctx.lineCap = 'round';

  // Fuxi Tail (Azurite blue)
  ctx.strokeStyle = '#0284C7';
  ctx.beginPath();
  ctx.moveTo(-50, -30);
  ctx.bezierCurveTo(-10, 30, 40, 80, 0, 130);
  ctx.bezierCurveTo(-40, 180, 20, 210, 0, 240);
  ctx.stroke();

  // Nuwa Tail (Vermilion Red)
  ctx.strokeStyle = '#EF4444';
  ctx.beginPath();
  ctx.moveTo(50, -30);
  ctx.bezierCurveTo(10, 30, -40, 80, 0, 130);
  ctx.bezierCurveTo(40, 180, -20, 210, 0, 240);
  ctx.stroke();

  // Fuxi Torso & Sun Disc
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  ctx.arc(-70, -110, 32, 0, Math.PI * 2); // Sun disk with golden crow
  ctx.fill();
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.arc(-70, -50, 20, 0, Math.PI * 2); // Fuxi Head
  ctx.fill();

  // Nuwa Torso & Moon Disc
  ctx.fillStyle = '#E2E8F0';
  ctx.beginPath();
  ctx.arc(70, -110, 32, 0, Math.PI * 2); // Moon disk with toad/rabbit
  ctx.fill();
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.arc(70, -50, 20, 0, Math.PI * 2); // Nuwa Head
  ctx.fill();

  // Cloud swirls surrounding gods
  ctx.strokeStyle = 'rgba(253, 230, 138, 0.45)';
  ctx.lineWidth = 4;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.arc(i * 120, -20, 45, 0, Math.PI);
    ctx.stroke();
  }

  ctx.restore();
}

// Cave 420: Sui Silk Road Caravan
function drawCave420SuiCaravan(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Layered green mountain ridges (青绿山水雏形)
  ctx.fillStyle = '#065F46';
  ctx.beginPath();
  ctx.moveTo(0, h * 0.7);
  for (let x = 0; x <= w; x += 150) {
    ctx.lineTo(x, h * 0.5 + Math.sin(x * 0.02) * 50);
  }
  ctx.lineTo(w, h * 0.88);
  ctx.lineTo(0, h * 0.88);
  ctx.fill();

  // Sandy trail
  ctx.fillStyle = '#D97706';
  ctx.fillRect(0, h * 0.72, w, h * 0.16);

  // Camel Caravan String (Bactrian Camels)
  const caravanX = w * 0.4;
  const caravanY = h * 0.72;

  for (let i = 0; i < 4; i++) {
    const x = caravanX + i * 160;
    const y = caravanY;

    ctx.save();
    ctx.fillStyle = '#92400E';
    // Body & Humps
    ctx.beginPath();
    ctx.ellipse(x, y - 20, 45, 28, 0, 0, Math.PI * 2);
    ctx.fill();
    // Two humps
    ctx.beginPath();
    ctx.arc(x - 16, y - 48, 16, Math.PI, 0);
    ctx.arc(x + 16, y - 48, 16, Math.PI, 0);
    ctx.fill();
    // Neck & Head
    ctx.beginPath();
    ctx.moveTo(x - 35, y - 25);
    ctx.quadraticCurveTo(x - 70, y - 60, x - 65, y - 80);
    ctx.lineTo(x - 50, y - 80);
    ctx.quadraticCurveTo(x - 55, y - 50, x - 25, y - 30);
    ctx.fill();
    // Legs
    ctx.strokeStyle = '#92400E';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(x - 25, y);
    ctx.lineTo(x - 25, y + 45);
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x - 10, y + 45);
    ctx.moveTo(x + 15, y);
    ctx.lineTo(x + 15, y + 45);
    ctx.moveTo(x + 30, y);
    ctx.lineTo(x + 30, y + 45);
    ctx.stroke();

    // Connecting lead rope
    if (i < 3) {
      ctx.strokeStyle = '#FDE68A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 65, y - 75);
      ctx.quadraticCurveTo(x - 100, y - 40, x - 130, y - 20);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// Cave 220: Early Tang Hu Xuan Dance & Orchestra
function drawCave220TangMusicDance(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Pure Land Gold Stage & Crystal Lanterns
  ctx.fillStyle = '#854D0E';
  ctx.fillRect(0, h * 0.65, w, h * 0.23);

  // Seven Medicine Buddhas seated along upper wall
  const buddhaCount = 7;
  const bSpacing = w * 0.7 / buddhaCount;
  const startBX = w * 0.15;

  for (let i = 0; i < buddhaCount; i++) {
    const bx = startBX + i * bSpacing;
    const by = h * 0.42;

    // Golden Halo
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(bx, by, 45, 0, Math.PI * 2);
    ctx.fill();
    // Robe
    ctx.fillStyle = i % 2 === 0 ? '#DC2626' : '#2563EB';
    ctx.beginPath();
    ctx.arc(bx, by + 10, 32, 0, Math.PI);
    ctx.fill();
  }

  // Circular Persian Floral Carpet for Hu Xuan Dancer
  const cx = w * 0.5;
  const cy = h * 0.74;

  ctx.save();
  ctx.fillStyle = '#991B1B';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 140, 45, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Rapidly Spinning Hu Xuan Dancer (胡旋舞伎)
  // Dynamic whirling silk skirt
  const skirtGrad = ctx.createLinearGradient(cx - 60, cy, cx + 60, cy);
  skirtGrad.addColorStop(0, '#38BDF8');
  skirtGrad.addColorStop(0.5, '#F43F5E');
  skirtGrad.addColorStop(1, '#FBBF24');
  ctx.fillStyle = skirtGrad;

  ctx.beginPath();
  ctx.moveTo(cx - 70, cy + 10);
  ctx.quadraticCurveTo(cx - 85, cy - 35, cx - 25, cy - 70);
  ctx.quadraticCurveTo(cx, cy - 60, cx + 25, cy - 70);
  ctx.quadraticCurveTo(cx + 85, cy - 35, cx + 70, cy + 10);
  ctx.closePath();
  ctx.fill();

  // Slender upper body & arms flung high
  ctx.fillStyle = '#FEF3C7';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 80, 16, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, cy - 105, 12, 0, Math.PI * 2); // Head & tall chignon
  ctx.fill();

  // Swirling long scarf flying in double loops
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx - 40, cy - 85, 35, 0, Math.PI * 2);
  ctx.arc(cx + 40, cy - 85, 35, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  // Orchestra Musicians flanking on left and right (Pipa, Sheng, Flute, Waist Drum)
  [-1, 1].forEach(side => {
    for (let j = 0; j < 5; j++) {
      const mx = cx + side * (200 + j * 45);
      const my = cy - 20 + (j % 2) * 15;
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(mx, my - 25, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1E3A8A';
      ctx.beginPath();
      ctx.arc(mx, my, 22, 0, Math.PI);
      ctx.fill();
    }
  });
}

// Cave 45: High Tang Seven Sculptures
function drawCave45TangSculptures(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Horseshoe niche (马蹄形大佛龛)
  const cx = w * 0.5;
  const cy = h * 0.52;

  ctx.save();
  // Niche Arch
  ctx.fillStyle = '#451A03';
  ctx.beginPath();
  ctx.arc(cx, cy - 30, 280, Math.PI, 0);
  ctx.lineTo(cx + 280, cy + 220);
  ctx.lineTo(cx - 280, cy + 220);
  ctx.fill();

  // Niche halo flame border
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 14;
  ctx.stroke();

  // Central Sakyamuni Buddha
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(cx, cy - 60, 55, 0, Math.PI * 2); // Head
  ctx.fill();
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 50, 95, 110, 0, 0, Math.PI * 2); // Robe
  ctx.fill();

  // Left Bodhisattva (Iconic S-Curve Tribhanga Pose)
  const bx = cx - 140;
  const by = cy + 40;
  ctx.fillStyle = '#FEF3C7';
  ctx.beginPath();
  ctx.arc(bx, by - 85, 20, 0, Math.PI * 2); // Head tilted left
  ctx.fill();
  // Body S-curve
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 26;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(bx, by - 65);
  ctx.quadraticCurveTo(bx + 20, by - 20, bx - 10, by + 20); // Chest right, hips left
  ctx.quadraticCurveTo(bx - 25, by + 60, bx, by + 110);
  ctx.stroke();

  // Right Bodhisattva (Symmetrical S-Curve)
  const rx = cx + 140;
  ctx.fillStyle = '#FEF3C7';
  ctx.beginPath();
  ctx.arc(rx, by - 85, 20, 0, Math.PI * 2); // Head tilted right
  ctx.fill();
  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 26;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(rx, by - 65);
  ctx.quadraticCurveTo(rx - 20, by - 20, rx + 10, by + 20);
  ctx.quadraticCurveTo(rx + 25, by + 60, rx, by + 110);
  ctx.stroke();

  ctx.restore();
}

// Cave 103: Wu Daozi Line Drawing (吴带当风)
function drawCave103WuLineDrawing(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Pure Ochre Sandstone Wall
  ctx.fillStyle = '#E5D5B8';
  ctx.fillRect(0, h * 0.22, w, h * 0.66);

  // Ancient hairline crackles
  ctx.strokeStyle = 'rgba(120, 90, 70, 0.25)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * w, h * 0.25);
    ctx.lineTo(Math.random() * w, h * 0.85);
    ctx.stroke();
  }

  // Grand Linear Figure Composition with Iron-Wire lines (铁线描与折钗股)
  const cx = w * 0.5;
  const cy = h * 0.52;

  ctx.save();
  ctx.strokeStyle = '#1C1917'; // Chinese black ink line
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Floating scholar / merchant figures with billowing robes
  for (let f = -1; f <= 1; f++) {
    const fx = cx + f * 220;
    const fy = cy + (Math.abs(f) * 30);

    // Head and Cap
    ctx.beginPath();
    ctx.arc(fx, fy - 100, 24, 0, Math.PI * 2);
    ctx.stroke();
    // High Han Tang Cap
    ctx.strokeRect(fx - 14, fy - 140, 28, 25);

    // Sweeping billowing sleeves (吴带当风)
    ctx.beginPath();
    ctx.moveTo(fx, fy - 75);
    ctx.bezierCurveTo(fx - 90, fy - 40, fx - 110, fy + 40, fx - 40, fy + 80);
    ctx.bezierCurveTo(fx - 70, fy + 120, fx - 120, fy + 150, fx - 30, fy + 170);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(fx, fy - 75);
    ctx.bezierCurveTo(fx + 90, fy - 40, fx + 110, fy + 40, fx + 40, fy + 80);
    ctx.bezierCurveTo(fx + 70, fy + 120, fx + 120, fy + 150, fx + 30, fy + 170);
    ctx.stroke();

    // Central Robe pleats
    for (let l = -3; l <= 3; l++) {
      ctx.beginPath();
      ctx.moveTo(fx + l * 8, fy - 50);
      ctx.lineTo(fx + l * 12, fy + 160);
      ctx.stroke();
    }
  }

  ctx.restore();
}

// Cave 320: High Tang Twin Flying Apsaras (双飞天散花图)
function drawCave320FlyingApsaras(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Deep Azurite / Lapis Lazuli Celestial Sky
  const skyGrad = ctx.createLinearGradient(0, h * 0.22, 0, h * 0.88);
  skyGrad.addColorStop(0, '#0F172A');
  skyGrad.addColorStop(0.3, '#0369A1'); // Azurite Blue
  skyGrad.addColorStop(0.7, '#075985');
  skyGrad.addColorStop(1, '#0C4A6E');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, h * 0.22, w, h * 0.66);

  // Shower of Celestial Flowers (天女散花)
  const flowers = 90;
  for (let i = 0; i < flowers; i++) {
    const fx = Math.random() * w;
    const fy = h * 0.25 + Math.random() * (h * 0.6);
    const size = Math.random() * 8 + 4;
    ctx.fillStyle = i % 3 === 0 ? '#F43F5E' : (i % 3 === 1 ? '#FDE047' : '#FFFFFF');
    ctx.beginPath();
    ctx.arc(fx, fy, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Twin Flying Apsaras (双飞天)
  drawSingleApsara(ctx, w * 0.38, h * 0.5, -1);
  drawSingleApsara(ctx, w * 0.62, h * 0.48, 1);
}

function drawSingleApsara(ctx: CanvasRenderingContext2D, cx: number, cy: number, dir: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(dir, 1);

  // Glowing Aura
  ctx.shadowColor = '#38BDF8';
  ctx.shadowBlur = 28;

  // Swirling Long Ribbons (天衣披帛)
  ctx.strokeStyle = '#EF4444'; // Vermilion Ribbon
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(70, -40, 60, Math.PI * 0.3, Math.PI * 1.8);
  ctx.bezierCurveTo(150, 20, 180, 80, 220, 100);
  ctx.stroke();

  ctx.strokeStyle = '#10B981'; // Malachite Ribbon
  ctx.lineWidth = 11;
  ctx.beginPath();
  ctx.arc(90, -10, 50, Math.PI * 0.1, Math.PI * 1.6);
  ctx.bezierCurveTo(160, 50, 190, 110, 240, 130);
  ctx.stroke();

  // Torso Diving Downwards with arched back
  ctx.fillStyle = '#FEF3C7';
  ctx.beginPath();
  ctx.ellipse(-20, -10, 22, 35, -0.6, 0, Math.PI * 2);
  ctx.fill();

  // Head with chignon looking forward
  ctx.beginPath();
  ctx.arc(-55, -35, 18, 0, Math.PI * 2);
  ctx.fill();

  // High chignon with gold ornament
  ctx.fillStyle = '#18181B';
  ctx.beginPath();
  ctx.arc(-62, -50, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.arc(-58, -52, 5, 0, Math.PI * 2);
  ctx.fill();

  // Outstretched delicate hands scattering flower basket
  ctx.strokeStyle = '#FEF3C7';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-35, -20);
  ctx.lineTo(-75, -5);
  ctx.moveTo(-35, -15);
  ctx.lineTo(-70, 15);
  ctx.stroke();

  // Flower tray (花盘)
  ctx.fillStyle = '#F59E0B';
  ctx.beginPath();
  ctx.ellipse(-85, 5, 18, 6, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Fluttering Long Pleated Skirt (石青色曳地长裙)
  ctx.fillStyle = '#0284C7';
  ctx.beginPath();
  ctx.moveTo(-10, 5);
  ctx.quadraticCurveTo(45, 10, 110, 45);
  ctx.quadraticCurveTo(140, 85, 120, 110);
  ctx.quadraticCurveTo(60, 70, 5, 25);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// Cave 156: Late Tang General Zhang Yichao Army
function drawCave156ZhangYichaoExpedition(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Late Tang Military Sandstone & Standard Flags
  ctx.fillStyle = '#78350F';
  ctx.fillRect(0, h * 0.6, w, h * 0.28);

  const cx = w * 0.5;
  const cy = h * 0.68;

  // Ranks of Grand Banners & Standards (大纛与节度使旌旗)
  for (let i = 0; i < 12; i++) {
    const fx = w * 0.15 + i * 85;
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(fx, h * 0.35);
    ctx.lineTo(fx, h * 0.72);
    ctx.stroke();

    // Red military triangular pennant
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.moveTo(fx, h * 0.35);
    ctx.lineTo(fx + 45, h * 0.4);
    ctx.lineTo(fx, h * 0.46);
    ctx.closePath();
    ctx.fill();
  }

  // General Zhang Yichao on White Steed (白马红袍大将军)
  ctx.save();
  ctx.translate(cx, cy);

  // Galloping white horse
  ctx.fillStyle = '#F8FAFC';
  ctx.beginPath();
  ctx.ellipse(0, 0, 75, 40, -0.1, 0, Math.PI * 2); // Horse torso
  ctx.fill();
  // Horse neck & head
  ctx.beginPath();
  ctx.moveTo(40, -15);
  ctx.quadraticCurveTo(75, -50, 95, -60);
  ctx.lineTo(75, -80);
  ctx.quadraticCurveTo(45, -50, 20, -25);
  ctx.fill();

  // General in Scarlet Tang Robe
  ctx.fillStyle = '#DC2626';
  ctx.beginPath();
  ctx.ellipse(0, -45, 24, 32, 0, 0, Math.PI * 2);
  ctx.fill();
  // Tang Futou headwear
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(0, -78, 14, 0, Math.PI * 2);
  ctx.fill();
  // Bow and quiver
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(-22, -45, 20, 0, Math.PI);
  ctx.stroke();

  ctx.restore();
}
