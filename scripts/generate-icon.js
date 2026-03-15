const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function generateIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  // 배경 그라디언트 (빨강 → 진한 빨강)
  const bgGrad = ctx.createRadialGradient(cx * 0.7, cy * 0.5, 0, cx, cy, size * 0.75);
  bgGrad.addColorStop(0, '#E74C3C');
  bgGrad.addColorStop(0.5, '#C0392B');
  bgGrad.addColorStop(1, '#922B21');
  ctx.fillStyle = bgGrad;

  // 둥근 사각형 배경
  const r = size * 0.18;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fill();

  // 장식 원형 패턴 (반투명)
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.arc(size * 0.15, size * 0.15, size * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(size * 0.85, size * 0.85, size * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // 음표 아이콘 (♪) - 크게 중앙에
  const noteSize = size * 0.38;
  const noteX = cx - noteSize * 0.15;
  const noteY = cy - noteSize * 0.1;

  // 음표 머리 (타원)
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = size * 0.03;
  ctx.shadowOffsetY = size * 0.015;

  ctx.beginPath();
  ctx.ellipse(noteX - noteSize * 0.15, noteY + noteSize * 0.35, noteSize * 0.18, noteSize * 0.13, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // 음표 줄기
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = size * 0.03;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(noteX - noteSize * 0.02, noteY + noteSize * 0.3);
  ctx.lineTo(noteX - noteSize * 0.02, noteY - noteSize * 0.25);
  ctx.stroke();

  // 음표 깃발
  ctx.lineWidth = size * 0.025;
  ctx.beginPath();
  ctx.moveTo(noteX - noteSize * 0.02, noteY - noteSize * 0.25);
  ctx.quadraticCurveTo(noteX + noteSize * 0.2, noteY - noteSize * 0.15, noteX + noteSize * 0.15, noteY + noteSize * 0.05);
  ctx.stroke();

  // 골드 링 장식
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = size * 0.015;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.32, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // "트롯통" 텍스트 (하단)
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = size * 0.02;
  ctx.shadowOffsetY = size * 0.01;
  ctx.font = `bold ${size * 0.12}px "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('트롯통', cx, size * 0.82);

  // 골드 별 장식 (작은)
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  drawStar(ctx, size * 0.2, size * 0.25, size * 0.03, '#FFD700');
  drawStar(ctx, size * 0.8, size * 0.2, size * 0.025, '#FFD700');
  drawStar(ctx, size * 0.75, size * 0.7, size * 0.02, '#FFD700');

  // 저장
  const buffer = canvas.toBuffer('image/png');
  const outPath = path.join(__dirname, '..', 'assets', filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated: ${outPath} (${size}x${size})`);
}

function drawStar(ctx, cx, cy, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function generateAdaptiveIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const cx = size / 2;
  const cy = size / 2;

  // 투명 배경 (adaptive icon은 foreground만)
  ctx.clearRect(0, 0, size, size);

  // 음표 아이콘 (큰 사이즈, 중앙)
  const noteSize = size * 0.3;
  const noteX = cx;
  const noteY = cy - size * 0.05;

  // 음표 머리
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(noteX - noteSize * 0.15, noteY + noteSize * 0.35, noteSize * 0.2, noteSize * 0.14, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // 음표 줄기
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = size * 0.03;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(noteX, noteY + noteSize * 0.3);
  ctx.lineTo(noteX, noteY - noteSize * 0.3);
  ctx.stroke();

  // 음표 깃발
  ctx.lineWidth = size * 0.025;
  ctx.beginPath();
  ctx.moveTo(noteX, noteY - noteSize * 0.3);
  ctx.quadraticCurveTo(noteX + noteSize * 0.25, noteY - noteSize * 0.15, noteX + noteSize * 0.18, noteY + noteSize * 0.05);
  ctx.stroke();

  // "트롯통" 텍스트
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${size * 0.1}px "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('트롯통', cx, size * 0.78);

  // 작은 별
  drawStar(ctx, size * 0.3, size * 0.25, size * 0.025, '#FFD700');
  drawStar(ctx, size * 0.72, size * 0.22, size * 0.02, '#FFD700');

  const buffer = canvas.toBuffer('image/png');
  const outPath = path.join(__dirname, '..', 'assets', filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated: ${outPath} (${size}x${size})`);
}

function generateFavicon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 빨간 배경
  const grad = ctx.createRadialGradient(size * 0.4, size * 0.3, 0, size / 2, size / 2, size * 0.7);
  grad.addColorStop(0, '#E74C3C');
  grad.addColorStop(1, '#922B21');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // 음표
  ctx.fillStyle = '#FFF';
  ctx.font = `${size * 0.6}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('♪', size / 2, size / 2);

  const buffer = canvas.toBuffer('image/png');
  const outPath = path.join(__dirname, '..', 'assets', filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`Generated: ${outPath} (${size}x${size})`);
}

// 아이콘 생성
generateIcon(1024, 'icon.png');
generateAdaptiveIcon(1024, 'adaptive-icon.png');
generateFavicon(48, 'favicon.png');
generateIcon(96, 'notification-icon.png');
generateIcon(2048, 'splash.png');

console.log('\nAll icons generated!');
