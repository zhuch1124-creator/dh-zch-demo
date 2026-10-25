import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Video,
  VideoOff,
  Palette,
  Flame,
  ArrowRight,
  Award
} from 'lucide-react';
import { RESTORATION_STEPS, RestorationStep } from '../types/dunhuang';
import { soundManager } from '../services/soundEffects';

interface RestorationWorkshopProps {
  onCompleteWorkshop: () => void;
  onBackToSelector: () => void;
}

export const RestorationWorkshop: React.FC<RestorationWorkshopProps> = ({
  onCompleteWorkshop,
  onBackToSelector
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState<number[]>([0, 0, 0, 0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [isAwakened, setIsAwakened] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const currentStep = RESTORATION_STEPS[currentStepIndex];

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Draw Weathered Sandstone Wall Base
    ctx.fillStyle = '#2B1D14';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Weathering cracks
    ctx.strokeStyle = '#1A100A';
    ctx.lineWidth = 2;
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 800, 0);
      ctx.lineTo(Math.random() * 800, 600);
      ctx.stroke();
    }
  }, []);

  // Stroke Sound Throttler
  const lastSoundTime = useRef(0);
  const triggerStrokeSound = () => {
    const now = Date.now();
    if (now - lastSoundTime.current > 120) {
      soundManager.playBrushStroke();
      lastSoundTime.current = now;
    }
  };

  // Perform drawing on canvas based on active tool step
  const drawStroke = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    triggerStrokeSound();

    ctx.save();
    switch (currentStep.toolKey) {
      case 'ground_plaster': {
        // Broad plaster stroke (澄泥质感)
        ctx.fillStyle = 'rgba(196, 164, 124, 0.45)';
        ctx.beginPath();
        ctx.arc(x, y, 42, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'glue_alum': {
        // Glossy glue alum sizing glaze (明矾胶液微光)
        ctx.fillStyle = 'rgba(253, 230, 138, 0.28)';
        ctx.beginPath();
        ctx.arc(x, y, 32, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
      case 'azurite_mineral': {
        // Deep Azurite Mineral Pigment (矿物石青重彩分层)
        ctx.fillStyle = 'rgba(2, 132, 199, 0.38)';
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();
        // Golden accent sparkles
        if (Math.random() > 0.6) {
          ctx.fillStyle = '#F59E0B';
          ctx.beginPath();
          ctx.arc(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 20, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      case 'wolf_hair_brush': {
        // Fine Wolf-Hair Iron-Wire Line (狼毫铁线与金线描)
        if (lastPos) {
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(lastPos.x, lastPos.y);
          ctx.lineTo(x, y);
          ctx.stroke();

          // Core black line
          ctx.strokeStyle = '#18181B';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(lastPos.x, lastPos.y);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
        break;
      }
    }
    ctx.restore();

    // Increment progress for this step
    setStepProgress((prev) => {
      const next = [...prev];
      if (next[currentStepIndex] < 100) {
        next[currentStepIndex] = Math.min(100, next[currentStepIndex] + 2);

        // Check if current step reached 100%
        if (next[currentStepIndex] >= 100) {
          soundManager.playCorrectChime();
          // If step 4 completed, trigger Flying Apsaras Awakening!
          if (currentStepIndex === 3) {
            triggerAwakening();
          } else {
            // Auto advance to next tool step after a brief moment
            setTimeout(() => {
              setCurrentStepIndex((idx) => Math.min(3, idx + 1));
            }, 600);
          }
        }
      }
      return next;
    });

    setLastPos({ x, y });
  };

  // Grand Awakening Celebration
  const triggerAwakening = () => {
    setIsAwakened(true);
    soundManager.playAwakeningFanfare();

    // Fire golden & azurite confetti
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#0284C7', '#10B981', '#EF4444', '#FDE68A']
    });

    // Render pristine finished Flying Apsaras on canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderAwakenedFlyingApsaras(ctx, canvas.width, canvas.height);
  };

  // Draw full glowing restored Flying Apsaras
  const renderAwakenedFlyingApsaras = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    const cx = w * 0.5;
    const cy = h * 0.5;

    // Glowing Heavenly Cloud Aura
    const auraGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 260);
    auraGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
    auraGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.35)');
    auraGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(0, 0, w, h);

    // Flying Apsaras Double Loop Ribbons
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(cx + 80, cy - 60, 90, Math.PI * 0.2, Math.PI * 1.8);
    ctx.bezierCurveTo(cx + 200, cy + 20, cx + 240, cy + 120, cx + 300, cy + 140);
    ctx.stroke();

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(cx + 100, cy - 20, 75, Math.PI * 0.1, Math.PI * 1.6);
    ctx.bezierCurveTo(cx + 220, cy + 60, cx + 260, cy + 140, cx + 320, cy + 180);
    ctx.stroke();

    // Bodice
    ctx.fillStyle = '#FEF3C7';
    ctx.beginPath();
    ctx.ellipse(cx - 30, cy - 10, 28, 42, -0.6, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(cx - 75, cy - 40, 22, 0, Math.PI * 2);
    ctx.fill();

    // Chignon & Crown
    ctx.fillStyle = '#18181B';
    ctx.beginPath();
    ctx.arc(cx - 85, cy - 60, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(cx - 80, cy - 62, 7, 0, Math.PI * 2);
    ctx.fill();

    // Skirt (Stone Blue Azurite)
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.moveTo(cx - 15, cy + 10);
    ctx.quadraticCurveTo(cx + 60, cy + 20, cx + 150, cy + 65);
    ctx.quadraticCurveTo(cx + 190, cy + 120, cx + 160, cy + 150);
    ctx.quadraticCurveTo(cx + 80, cy + 95, cx + 5, cy + 35);
    ctx.closePath();
    ctx.fill();

    // Golden Iron-Wire Outlining
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  };

  // Mouse / Touch Event Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 800;
    const y = ((e.clientY - rect.top) / rect.height) * 600;
    setLastPos({ x, y });
    drawStroke(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 800;
    const y = ((e.clientY - rect.top) / rect.height) * 600;
    drawStroke(x, y);
  };

  const handlePointerUp = () => {
    setIsDrawing(false);
    setLastPos(null);
  };

  // Optional Webcam Gesture Tracking for Brush Motion
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      setIsCameraActive(false);
    }
  };

  // Optical hand motion simulation to draw on canvas
  useEffect(() => {
    if (!isCameraActive || !videoRef.current) return;
    let trackAnimId: number;
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 64;
    sampleCanvas.height = 48;
    const sCtx = sampleCanvas.getContext('2d');

    const sampleLoop = () => {
      if (videoRef.current && videoRef.current.readyState >= 2 && sCtx) {
        sCtx.drawImage(videoRef.current, 0, 0, 64, 48);
        const imgData = sCtx.getImageData(0, 0, 64, 48).data;
        let sumX = 0;
        let sumY = 0;
        let count = 0;

        for (let y = 0; y < 48; y += 2) {
          for (let x = 0; x < 64; x += 2) {
            const idx = (y * 64 + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            const lum = r * 0.299 + g * 0.587 + b * 0.114;
            if (lum > 150) {
              sumX += (64 - x); // mirror
              sumY += y;
              count++;
            }
          }
        }

        if (count > 25) {
          const drawX = (sumX / count / 64) * 800;
          const drawY = (sumY / count / 48) * 600;
          drawStroke(drawX, drawY);
        }
      }
      trackAnimId = requestAnimationFrame(sampleLoop);
    };

    trackAnimId = requestAnimationFrame(sampleLoop);
    return () => cancelAnimationFrame(trackAnimId);
  }, [isCameraActive, currentStepIndex]);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-stone-950 font-serif flex flex-col justify-between p-6">
      {/* Top Header */}
      <div className="flex items-center justify-between z-20">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToSelector}
            className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-amber-800 text-amber-200 text-xs flex items-center space-x-1.5 hover:bg-stone-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>返回全景选单</span>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                古法修缮工作坊
              </span>
              <span className="text-xs text-amber-400/80">四道古法工序 · 重现飞天神韵</span>
            </div>
            <h2 className="text-2xl font-black text-amber-100 tracking-wider mt-0.5">
              古法壁画手势绘制体验
            </h2>
          </div>
        </div>

        {/* Gesture Camera Control Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleCamera}
            className={`px-3 py-1.5 rounded-full text-xs flex items-center space-x-2 border transition-all ${
              isCameraActive
                ? 'bg-amber-600 text-stone-950 border-amber-400 font-bold'
                : 'bg-stone-900 text-amber-300 border-amber-800 hover:bg-stone-800'
            }`}
          >
            {isCameraActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
            <span>{isCameraActive ? '手势运笔已开启' : '开启手势运笔'}</span>
          </button>

          {isAwakened && (
            <button
              onClick={onCompleteWorkshop}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-xs tracking-wider flex items-center space-x-2 shadow-lg shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all animate-bounce"
            >
              <Award className="w-4 h-4 text-stone-950" />
              <span>通关问答考验</span>
              <ArrowRight className="w-3.5 h-3.5 text-stone-950" />
            </button>
          )}
        </div>
      </div>

      {/* Main Workshop Interactive Area */}
      <div className="relative flex-1 flex items-center justify-center py-4 z-10">
        {/* Drawing Easel & Canvas */}
        <div className="relative rounded-3xl p-3 bg-gradient-to-b from-[#3E2723] to-[#1A120B] border-4 border-amber-700/70 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          {/* Subtle Golden Frame Trim */}
          <div className="absolute inset-2 border border-amber-500/40 rounded-2xl pointer-events-none" />

          {/* Underlay Guide Silhouette of Flying Apsaras */}
          <div className="relative w-[780px] h-[520px] rounded-xl overflow-hidden bg-stone-950">
            {/* Faint faint stencil line guide */}
            <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
              <svg className="w-full h-full text-amber-300" viewBox="0 0 800 600">
                <path
                  d="M480,240 C560,180 640,280 700,300 M320,290 C380,310 470,355 520,380"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="6 6"
                />
              </svg>
            </div>

            {/* Interactive Painting Canvas */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="relative w-full h-full cursor-crosshair touch-none"
            />
          </div>

          {/* Current Step Instruction Toast */}
          <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-stone-950/95 border border-amber-600 rounded-full px-6 py-2 shadow-2xl flex items-center space-x-3 text-xs text-amber-200">
            <span className="font-bold text-amber-400">{currentStep.title}:</span>
            <span>{currentStep.actionHint}</span>
            <span className="font-mono text-yellow-300 font-bold bg-amber-950/80 px-2 py-0.5 rounded">
              {stepProgress[currentStepIndex]}%
            </span>
          </div>
        </div>

        {/* Video feed for camera if active */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`fixed bottom-6 right-6 w-32 h-24 rounded border border-amber-500 object-cover z-30 ${
            isCameraActive ? 'opacity-75' : 'hidden'
          }`}
        />
      </div>

      {/* Bottom Tool Palettes: 4 Ancient Restoration Steps */}
      <div className="relative z-20 max-w-4xl mx-auto w-full grid grid-cols-4 gap-4">
        {RESTORATION_STEPS.map((step, idx) => {
          const isCurrent = currentStepIndex === idx;
          const isDone = stepProgress[idx] >= 100;

          return (
            <button
              key={step.id}
              onClick={() => {
                soundManager.playGuqinPluck(idx);
                setCurrentStepIndex(idx);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isCurrent
                  ? 'bg-amber-900/60 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)] scale-102'
                  : isDone
                  ? 'bg-stone-900/80 border-emerald-500/60 opacity-90'
                  : 'bg-stone-900/60 border-stone-800 opacity-60 hover:opacity-85'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-sans font-bold text-amber-400">
                  第 {idx + 1} 道工序
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] font-mono text-amber-200">
                    {stepProgress[idx]}%
                  </span>
                )}
              </div>

              <div className="text-sm font-black text-amber-100">{step.name}</div>
              <p className="text-[11px] text-stone-300 mt-1 line-clamp-1">
                {step.instruction}
              </p>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-stone-800 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                  style={{ width: `${stepProgress[idx]}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Flying Apsaras Awakening Success Modal */}
      {isAwakened && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-md p-4">
          <div className="max-w-md w-full bg-stone-900 border-2 border-yellow-400 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-scale-up font-serif">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border-2 border-yellow-300 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.9)] animate-bounce">
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </div>

            <div>
              <span className="text-xs px-2.5 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/60">
                飞天重光 · 活态传承
              </span>
              <h3 className="text-2xl font-black text-amber-100 mt-1 tracking-wider">
                飞天壁画修缮圆满！
              </h3>
              <p className="text-xs text-amber-200/80 mt-1">
                澄泥为骨，胶矾为魂，石青为色，铁线为韵
              </p>
            </div>

            <div className="bg-stone-950/80 border border-amber-800/60 rounded-xl p-3 text-xs text-stone-300 text-left leading-relaxed">
              历经四道古法工序，盛唐第320窟散花飞天终于在你手中破壁重光！飘带宛如灵蛇回旋，天花缤纷如雨，呼应着现代敦煌舞的生生不息。
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={onCompleteWorkshop}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-black text-sm tracking-widest shadow-xl shadow-amber-500/40 hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2"
              >
                <span>前往最终考验：敦煌学 10 题通关问答</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
