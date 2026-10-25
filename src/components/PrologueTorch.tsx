import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Flame, Video, VideoOff, ArrowRight, Layers, Maximize2, Compass } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface PrologueTorchProps {
  onLightUpCorridor: () => void;
}

interface UploadedMuralPhoto {
  id: string;
  src: string;
  caveTitle: string;
  dynasty: string;
  description: string;
}

const UPLOADED_MURALS: UploadedMuralPhoto[] = [
  {
    id: 'nine_deer',
    src: '/mural_assets/cave_257_nine_deer.jpg',
    caveTitle: '第257窟 · 九色鹿本生经图',
    dynasty: '北魏 (386–534)',
    description: '横卷式同图异构连环画鼻祖，舍己救人、王后告密与因果报应之庄严史诗。'
  },
  {
    id: 'bodhisattva_torch',
    src: '/mural_assets/cave_045_bodhisattva_torch.jpg',
    caveTitle: '第45窟 · 烛光侧颜胁侍菩萨',
    dynasty: '盛唐 (712–766)',
    description: '古代烛火幽照下的塑画合一神品，眉目低垂，慈悲庄严，衣纹柔和如出水芙蓉。'
  },
  {
    id: 'cave_45_seven',
    src: '/mural_assets/cave_045_seven_statues.jpg',
    caveTitle: '第45窟 · 盛唐七身彩塑巅峰一铺',
    dynasty: '盛唐 (712–766)',
    description: '莫高窟保存最完好的盛唐彩塑组像：一佛、二弟子、二菩萨、二天王刚柔并济。'
  },
  {
    id: 'bodhisattva_face',
    src: '/mural_assets/cave_bodhisattva_face.jpg',
    caveTitle: '第45窟 · 菩萨微颔慈颜特写',
    dynasty: '盛唐 (712–766)',
    description: '盛唐“菩萨如宫娃”之传神写照，面容圆润细腻，发髻高耸，透露出无尽宁静。'
  },
  {
    id: 'expedition_156',
    src: '/mural_assets/cave_156_expedition.jpg',
    caveTitle: '第156窟 · 张议潮与宋国夫人出行长卷',
    dynasty: '晚唐 (848–907)',
    description: '十米纪实长卷：百戏杂耍、戴竿倒立、载歌载舞、仪仗骑兵威震西陲。'
  },
  {
    id: 'caisson_285',
    src: '/mural_assets/cave_285_caisson_celestial.jpg',
    caveTitle: '第285窟 · 飞天与覆斗藻井',
    dynasty: '西魏 (535–556)',
    description: '万神殿天幕：飞天身披飘带倒悬散花，莲花宝珠火焰纹与千佛光晕交织。'
  },
  {
    id: 'corridor_niche',
    src: '/mural_assets/cave_corridor_niche_buddha.jpg',
    caveTitle: '莫高窟深处 · 禅定佛窟主室',
    dynasty: '千年长河',
    description: '风蚀崖壁深处的主佛龛，在数百年沉寂中等待修缮守护者拂去尘封。'
  }
];

export const PrologueTorch: React.FC<PrologueTorchProps> = ({ onLightUpCorridor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [torchRadius, setTorchRadius] = useState(175);
  const [exploreSeconds, setExploreSeconds] = useState(0);
  const [isReadyToLight, setIsReadyToLight] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // View Mode: 'gallery' (multi-panel flowing mural mosaic) vs 'deep_niche' (large full-screen deep cave)
  const [viewMode, setViewMode] = useState<'gallery' | 'deep_niche'>('gallery');

  // Active discovered photo inspection
  const [inspectPhoto, setInspectPhoto] = useState<UploadedMuralPhoto | null>(null);

  // Interaction timer for unveiling the button
  useEffect(() => {
    soundManager.playTorchIgnite();
    const interval = setInterval(() => {
      setExploreSeconds((prev) => {
        const next = prev + 1;
        if (next >= 4 && !isReadyToLight) {
          setIsReadyToLight(true);
          soundManager.playGuqinPluck(2);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isReadyToLight]);

  // Torchlight Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let flameTime = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      flameTime += 0.05;
      const w = canvas.width;
      const h = canvas.height;

      // Organic candle flame jitter
      const flicker = Math.sin(flameTime * 4) * 8 + Math.cos(flameTime * 7) * 4;
      const currentRadius = torchRadius + flicker;

      ctx.clearRect(0, 0, w, h);

      // 1. Fill entire screen with near-pitch dark ancient corridor shadow
      ctx.fillStyle = 'rgba(8, 6, 5, 0.95)';
      ctx.fillRect(0, 0, w, h);

      // 2. Punch through torchlight beam using radial gradient & composite operation
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';

      const gradient = ctx.createRadialGradient(
        mousePos.x,
        mousePos.y,
        currentRadius * 0.15,
        mousePos.x,
        mousePos.y,
        currentRadius
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.88)');
      gradient.addColorStop(0.88, 'rgba(0, 0, 0, 0.28)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Add warm golden amber candle rim & floating embers
      ctx.save();
      const warmAura = ctx.createRadialGradient(
        mousePos.x,
        mousePos.y,
        currentRadius * 0.1,
        mousePos.x,
        mousePos.y,
        currentRadius * 1.18
      );
      warmAura.addColorStop(0, 'rgba(251, 191, 36, 0.32)');
      warmAura.addColorStop(0.5, 'rgba(217, 119, 6, 0.2)');
      warmAura.addColorStop(0.88, 'rgba(180, 83, 9, 0.06)');
      warmAura.addColorStop(1, 'transparent');

      ctx.fillStyle = warmAura;
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, currentRadius * 1.18, 0, Math.PI * 2);
      ctx.fill();

      // Draw floating golden candle embers
      for (let i = 0; i < 7; i++) {
        const angle = flameTime * 2.2 + i * (Math.PI / 3.5);
        const dist = 32 + Math.sin(flameTime * 3 + i) * 22;
        const ex = mousePos.x + Math.cos(angle) * dist;
        const ey = mousePos.y + Math.sin(angle) * dist - (flameTime * 18 + i * 12) % 65;
        ctx.fillStyle = 'rgba(253, 224, 71, 0.85)';
        ctx.beginPath();
        ctx.arc(ex, ey, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mousePos, torchRadius]);

  // Pointer movement listener
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Optional Webcam Hand Tracking Toggle
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
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err: unknown) {
      setCameraError('未能获取摄像头权限，已自动保留流畅的鼠标与触控探照模式。');
      setIsCameraActive(false);
    }
  };

  // Optical center tracking on video stream if camera active
  useEffect(() => {
    if (!isCameraActive || !videoRef.current) return;
    let trackAnimId: number;
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 80;
    sampleCanvas.height = 60;
    const sCtx = sampleCanvas.getContext('2d');

    const sampleLoop = () => {
      if (videoRef.current && videoRef.current.readyState >= 2 && sCtx) {
        sCtx.drawImage(videoRef.current, 0, 0, 80, 60);
        const imgData = sCtx.getImageData(0, 0, 80, 60).data;
        let sumX = 0;
        let sumY = 0;
        let brightCount = 0;

        for (let y = 0; y < 60; y += 2) {
          for (let x = 0; x < 80; x += 2) {
            const idx = (y * 80 + x) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            const lum = r * 0.299 + g * 0.587 + b * 0.114;
            if (lum > 140) {
              sumX += (80 - x); // mirror
              sumY += y;
              brightCount++;
            }
          }
        }

        if (brightCount > 30) {
          const targetX = (sumX / brightCount / 80) * window.innerWidth;
          const targetY = (sumY / brightCount / 60) * window.innerHeight;
          setMousePos((prev) => ({
            x: prev.x + (targetX - prev.x) * 0.25,
            y: prev.y + (targetY - prev.y) * 0.25
          }));
        }
      }
      trackAnimId = requestAnimationFrame(sampleLoop);
    };

    trackAnimId = requestAnimationFrame(sampleLoop);
    return () => cancelAnimationFrame(trackAnimId);
  }, [isCameraActive]);

  const handleLightUp = () => {
    soundManager.playTempleBell();
    soundManager.playAwakeningFanfare();
    onLightUpCorridor();
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative w-full h-screen overflow-hidden select-none bg-stone-950 font-serif"
    >
      {/* Underlying Real Uploaded Dunhuang Cave Mural & Sculpture Gallery */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {viewMode === 'gallery' ? (
          /* Multi-photo cinematic mural corridor layout */
          <div className="w-[110vw] h-[105vh] grid grid-cols-4 grid-rows-2 gap-2 p-2 filter brightness-105 contrast-110">
            {/* Tile 1: Cave 257 Nine-Colored Deer */}
            <div className="relative rounded-xl overflow-hidden border border-amber-900/60 bg-stone-950">
              <img
                src={UPLOADED_MURALS[0].src}
                alt={UPLOADED_MURALS[0].caveTitle}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 left-3 bg-stone-950/85 border border-amber-700/60 rounded-lg px-2.5 py-1">
                <div className="text-[11px] font-bold text-amber-200">{UPLOADED_MURALS[0].caveTitle}</div>
                <div className="text-[10px] text-amber-400/80">{UPLOADED_MURALS[0].dynasty}</div>
              </div>
            </div>

            {/* Tile 2: Cave 45 Bodhisattva in Torchlight */}
            <div className="relative rounded-xl overflow-hidden border border-amber-900/60 bg-stone-950">
              <img
                src={UPLOADED_MURALS[1].src}
                alt={UPLOADED_MURALS[1].caveTitle}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 left-3 bg-stone-950/85 border border-amber-700/60 rounded-lg px-2.5 py-1">
                <div className="text-[11px] font-bold text-amber-200">{UPLOADED_MURALS[1].caveTitle}</div>
                <div className="text-[10px] text-amber-400/80">{UPLOADED_MURALS[1].dynasty}</div>
              </div>
            </div>

            {/* Tile 3: Cave 45 Full Seven Statues Niche */}
            <div className="relative rounded-xl overflow-hidden border border-amber-900/60 bg-stone-950 col-span-2">
              <img
                src={UPLOADED_MURALS[2].src}
                alt={UPLOADED_MURALS[2].caveTitle}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 left-3 bg-stone-950/85 border border-amber-700/60 rounded-lg px-2.5 py-1">
                <div className="text-[11px] font-bold text-amber-200">{UPLOADED_MURALS[2].caveTitle}</div>
                <div className="text-[10px] text-amber-400/80">{UPLOADED_MURALS[2].dynasty}</div>
              </div>
            </div>

            {/* Tile 4: Bodhisattva Serene Face Closeup */}
            <div className="relative rounded-xl overflow-hidden border border-amber-900/60 bg-stone-950">
              <img
                src={UPLOADED_MURALS[3].src}
                alt={UPLOADED_MURALS[3].caveTitle}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-3 left-3 bg-stone-950/85 border border-amber-700/60 rounded-lg px-2.5 py-1">
                <div className="text-[11px] font-bold text-amber-200">{UPLOADED_MURALS[3].caveTitle}</div>
                <div className="text-[10px] text-amber-400/80">{UPLOADED_MURALS[3].dynasty}</div>
              </div>
            </div>

            {/* Tile 5: Cave 156 Expedition Scroll */}
            <div className="relative rounded-xl overflow-hidden border border-amber-900/60 bg-stone-950 col-span-2">
              <img
                src={UPLOADED_MURALS[4].src}
                alt={UPLOADED_MURALS[4].caveTitle}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 left-3 bg-stone-950/85 border border-amber-700/60 rounded-lg px-2.5 py-1">
                <div className="text-[11px] font-bold text-amber-200">{UPLOADED_MURALS[4].caveTitle}</div>
                <div className="text-[10px] text-amber-400/80">{UPLOADED_MURALS[4].dynasty}</div>
              </div>
            </div>

            {/* Tile 6: Cave 285 Caisson & Flying Apsaras */}
            <div className="relative rounded-xl overflow-hidden border border-amber-900/60 bg-stone-950">
              <img
                src={UPLOADED_MURALS[5].src}
                alt={UPLOADED_MURALS[5].caveTitle}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 left-3 bg-stone-950/85 border border-amber-700/60 rounded-lg px-2.5 py-1">
                <div className="text-[11px] font-bold text-amber-200">{UPLOADED_MURALS[5].caveTitle}</div>
                <div className="text-[10px] text-amber-400/80">{UPLOADED_MURALS[5].dynasty}</div>
              </div>
            </div>
          </div>
        ) : (
          /* Deep Cave Niche single full-screen immersive view */
          <div className="relative w-full h-full bg-stone-950">
            <img
              src="/mural_assets/cave_corridor_niche_buddha.jpg"
              alt="莫高窟深处禅定佛龛"
              className="w-full h-full object-cover object-center filter brightness-105 contrast-110"
            />
            <div className="absolute bottom-8 left-8 bg-stone-950/90 border border-amber-600 rounded-xl px-4 py-2">
              <div className="text-sm font-bold text-amber-200">莫高窟深处 · 禅定佛龛主殿</div>
              <div className="text-xs text-stone-300">移动烛光照射佛尊神采与两侧飞天经变壁画</div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Black Canvas Torchlight Mask Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full cursor-none"
      />

      {/* Custom Candle Flame Cursor Follower */}
      <div
        className="pointer-events-none fixed z-20 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-transform duration-75"
        style={{ left: mousePos.x, top: mousePos.y }}
      >
        <div className="relative flex items-center justify-center">
          <Flame className="w-10 h-10 text-amber-400 drop-shadow-[0_0_18px_rgba(251,191,36,0.95)] animate-pulse" />
          <div className="absolute w-2.5 h-2.5 rounded-full bg-yellow-100 blur-[1px]" />
        </div>
      </div>

      {/* Top Floating Header HUD */}
      <div className="absolute top-6 left-8 z-30 pointer-events-none">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-950/85 border border-amber-500/60 flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/80 text-amber-300 border border-amber-700/60 font-sans">
                莫高窟真实影像特藏
              </span>
              <span className="text-xs text-amber-200/70">烛火探照 · 真实壁画重现</span>
            </div>
            <h1 className="text-2xl font-black text-amber-100 tracking-widest drop-shadow mt-0.5">
              敦煌重光 · 序幕探照
            </h1>
          </div>
        </div>
      </div>

      {/* Top Right Controls: View Mode, Gesture/Mouse Toggle & Torch Size */}
      <div className="absolute top-6 right-8 z-30 flex items-center space-x-3 pointer-events-auto">
        {/* Switcher: Gallery Mosaic vs Deep Cave Niche */}
        <div className="bg-stone-900/85 border border-amber-800/80 rounded-full p-1 flex items-center space-x-1 text-xs">
          <button
            onClick={() => {
              setViewMode('gallery');
              soundManager.playGuqinPluck(1);
            }}
            className={`px-3 py-1 rounded-full flex items-center space-x-1.5 transition-all ${
              viewMode === 'gallery'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-amber-200/80 hover:text-amber-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>实景长廊拼贴</span>
          </button>
          <button
            onClick={() => {
              setViewMode('deep_niche');
              soundManager.playGuqinPluck(3);
            }}
            className={`px-3 py-1 rounded-full flex items-center space-x-1.5 transition-all ${
              viewMode === 'deep_niche'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-amber-200/80 hover:text-amber-100'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>幽深佛窟主室</span>
          </button>
        </div>

        {/* Camera Gesture Toggle */}
        <button
          onClick={toggleCamera}
          className={`px-3 py-1.5 rounded-full text-xs flex items-center space-x-2 border transition-all ${
            isCameraActive
              ? 'bg-amber-600 text-stone-950 border-amber-400 font-bold shadow-lg shadow-amber-500/30'
              : 'bg-stone-900/85 text-amber-200 border-amber-800/80 hover:bg-stone-800'
          }`}
          title="启用摄像头隔空手势挥舞烛火"
        >
          {isCameraActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
          <span>{isCameraActive ? '手势探照已开启' : '开启手势探照'}</span>
        </button>

        {/* Torch Beam Size */}
        <div className="bg-stone-900/85 border border-amber-900/80 rounded-full px-3 py-1.5 flex items-center space-x-2 text-xs text-amber-300">
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>光晕:</span>
          <button
            onClick={() => setTorchRadius((r) => Math.max(130, r - 30))}
            className="w-5 h-5 rounded hover:bg-amber-950 flex items-center justify-center text-amber-300"
          >
            -
          </button>
          <span className="w-7 text-center font-mono">{torchRadius}</span>
          <button
            onClick={() => setTorchRadius((r) => Math.min(280, r + 30))}
            className="w-5 h-5 rounded hover:bg-amber-950 flex items-center justify-center text-amber-300"
          >
            +
          </button>
        </div>
      </div>

      {/* Hidden Video element for webcam capture */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`fixed bottom-4 right-4 w-32 h-24 rounded border border-amber-600 object-cover z-40 ${
          isCameraActive ? 'opacity-70' : 'hidden'
        }`}
      />

      {/* Bottom Center Interaction Guide or "Light Up Corridor" Button */}
      <div className="absolute bottom-10 inset-x-0 z-30 flex flex-col items-center justify-center pointer-events-auto">
        {!isReadyToLight ? (
          <div className="bg-stone-950/90 border border-amber-600/70 rounded-2xl px-6 py-3 shadow-2xl flex items-center space-x-4 backdrop-blur-md">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div
                className="w-8 h-8 rounded-full border-2 border-amber-500/30 border-t-amber-400 animate-spin"
                style={{ animationDuration: '3s' }}
              />
              <span className="absolute text-[10px] text-amber-300 font-mono font-bold">
                {Math.min(4, exploreSeconds)}/4s
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-amber-200">挥动烛光探索莫高窟真实壁画与彩塑...</p>
              <p className="text-xs text-stone-400">已载入真实洞窟摄影：九色鹿、第45窟彩塑神像、张议潮出行长卷</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center animate-fade-in">
            <button
              onClick={handleLightUp}
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-stone-950 font-black text-lg tracking-widest shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:shadow-[0_0_60px_rgba(245,158,11,0.9)] hover:scale-105 active:scale-95 transition-all flex items-center space-x-3 border-2 border-yellow-200"
            >
              <Sparkles className="w-6 h-6 text-stone-950 animate-bounce" />
              <span>✨ 点亮长廊，探寻莫高窟</span>
              <ArrowRight className="w-5 h-5 text-stone-950 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <p className="mt-3 text-xs text-amber-300/80 tracking-widest drop-shadow">
              已感应烛光共鸣 · 点击进入八大经典洞窟全景选单
            </p>
          </div>
        )}

        {cameraError && (
          <div className="mt-3 text-xs text-amber-400/80 bg-stone-900/90 px-3 py-1 rounded">
            {cameraError}
          </div>
        )}
      </div>
    </div>
  );
};
