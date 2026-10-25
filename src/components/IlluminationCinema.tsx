import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ArrowRight,
  Sliders,
  Copy,
  Check,
  X,
  Layers,
  Eye,
  Film,
  Flame,
  Palette,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import {
  ILLUMINATION_SHOTS,
  TRANSITION_CHECKLIST,
  SKIN_TONE_PRESETS,
  GLOBAL_STYLE_PROMPT,
  GLOBAL_NEGATIVE_PROMPT,
  ShotSpecification,
  SkinTonePreset
} from '../types/illumination';
import { soundManager } from '../services/soundEffects';

interface IlluminationCinemaProps {
  onCompleteToSelector: () => void;
  onBackToPrologue: () => void;
}

export const IlluminationCinema: React.FC<IlluminationCinemaProps> = ({
  onCompleteToSelector,
  onBackToPrologue
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(41.0); // 41 seconds total
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [currentShotIndex, setCurrentShotIndex] = useState(0);
  const [hasUserStarted, setHasUserStarted] = useState(false);
  const [isVideoFailed, setIsVideoFailed] = useState(false);

  // Drawer modal state & active tab
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'prompts' | 'transitions' | 'styleLock' | 'skinTone'>('styleLock');
  const [selectedShotForDrawer, setSelectedShotForDrawer] = useState<ShotSpecification>(ILLUMINATION_SHOTS[0]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Interactive Torchlight Probe (Per prompt: S05+ torchlight is procedurally interactive)
  const [isTorchEnabled, setIsTorchEnabled] = useState(true);
  const [torchRadius, setTorchRadius] = useState(260); // px
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Skin Tone Calibration State ("调好肤色")
  const [activeSkinPreset, setActiveSkinPreset] = useState<SkinTonePreset>(SKIN_TONE_PRESETS[0]);
  const [skinWarmth, setSkinWarmth] = useState(SKIN_TONE_PRESETS[0].warmth);
  const [leadOxidation, setLeadOxidation] = useState(SKIN_TONE_PRESETS[0].leadOxidation);
  const [ironWireContrast, setIronWireContrast] = useState(SKIN_TONE_PRESETS[0].ironWireContrast);
  const [saturationLock, setSaturationLock] = useState(SKIN_TONE_PRESETS[0].saturation);
  const [showGrainOverlay, setShowGrainOverlay] = useState(true);

  // BGM audio state
  const [isBgmOn, setIsBgmOn] = useState(soundManager.getIsBgmPlaying());
  const [bgmVolume, setBgmVolume] = useState(soundManager.getBgmVolume());
  const [showBgmVolumeSlider, setShowBgmVolumeSlider] = useState(false);

  const currentShot = ILLUMINATION_SHOTS[currentShotIndex] || ILLUMINATION_SHOTS[0];

  // Subscribe to soundManager updates
  useEffect(() => {
    const unsub = soundManager.subscribe(() => {
      setIsBgmOn(soundManager.getIsBgmPlaying());
      setBgmVolume(soundManager.getBgmVolume());
    });
    return () => unsub();
  }, []);

  // Compute active dynamic CSS filter from skin tone parameters
  const getDynamicCssFilter = useCallback(() => {
    const baseFilter = activeSkinPreset.cssFilter;
    const warmthHue = skinWarmth * 0.4;
    const contrastVal = (100 + (ironWireContrast - 70) * 0.4) / 100;
    const satVal = saturationLock / 100;
    const sepiaVal = (leadOxidation * 0.4) / 100;

    return `sepia(${sepiaVal.toFixed(2)}) contrast(${contrastVal.toFixed(2)}) saturate(${satVal.toFixed(2)}) hue-rotate(${warmthHue.toFixed(1)}deg)`;
  }, [activeSkinPreset, skinWarmth, ironWireContrast, saturationLock, leadOxidation]);

  // Video Time Update & Shot Index Detection
  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);

    const shotIdx = ILLUMINATION_SHOTS.findIndex(
      (s) => t >= s.timeRange[0] && t < s.timeRange[1]
    );
    if (shotIdx !== -1 && shotIdx !== currentShotIndex) {
      setCurrentShotIndex(shotIdx);
    }
  }, [currentShotIndex]);

  // Fallback Timer Loop when video decoder is unavailable in the environment
  useEffect(() => {
    if (!isVideoFailed || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.15;
        if (next >= duration) {
          soundManager.playAwakeningFanfare();
          return 0;
        }
        const shotIdx = ILLUMINATION_SHOTS.findIndex(
          (s) => next >= s.timeRange[0] && next < s.timeRange[1]
        );
        if (shotIdx !== -1 && shotIdx !== currentShotIndex) {
          setCurrentShotIndex(shotIdx);
        }
        return next;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [isVideoFailed, isPlaying, duration, currentShotIndex]);

  // Jump to specific shot
  const handleJumpToShot = (index: number) => {
    const targetShot = ILLUMINATION_SHOTS[index];
    if (targetShot) {
      const nextTime = targetShot.timeRange[0] + 0.05;
      setCurrentShotIndex(index);
      setCurrentTime(nextTime);
      setSelectedShotForDrawer(targetShot);
      soundManager.playGuqinPluck(index % 6);
      if (videoRef.current && !isVideoFailed) {
        videoRef.current.currentTime = nextTime;
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          setHasUserStarted(true);
        }).catch(() => {});
      } else {
        setIsPlaying(true);
        setHasUserStarted(true);
      }
    }
  };

  // Advance to next shot on click (User requirement: 不要点击就暂停，单击是为了进到下一幕，不要有暂停的图标，和单机就暂停视频这一项)
  const handleAdvanceToNextShot = (e?: React.MouseEvent) => {
    if (e) {
      const target = e.target as HTMLElement;
      if (target.closest('button, input, select, textarea, [role="button"], .pointer-events-auto')) {
        return;
      }
    }
    const nextIdx = currentShotIndex + 1;
    if (nextIdx < ILLUMINATION_SHOTS.length) {
      handleJumpToShot(nextIdx);
    } else {
      // Reached the end of 9 shots, proceed to cave selector
      soundManager.playAwakeningFanfare();
      onCompleteToSelector();
    }
  };

  // Copy to clipboard helper
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    soundManager.playCorrectChime();
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Track pointer for torchlight
  const handlePointerMove = (e: React.PointerEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Apply Skin Preset
  const handleSelectPreset = (preset: SkinTonePreset) => {
    setActiveSkinPreset(preset);
    setSkinWarmth(preset.warmth);
    setLeadOxidation(preset.leadOxidation);
    setIronWireContrast(preset.ironWireContrast);
    setSaturationLock(preset.saturation);
    soundManager.playGuqinPluck(3);
  };

  // Reset to default style lock
  const handleResetStyleLock = () => {
    handleSelectPreset(SKIN_TONE_PRESETS[0]);
    setIsTorchEnabled(true);
  };

  // Auto-attempt play on mount and ensure BGM starts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    soundManager.startBgm();
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative w-full h-screen overflow-hidden select-none bg-stone-950 font-serif"
    >
      {/* SVG Texture filter for Dunhuang plaster grain & crackles */}
      <svg className="hidden">
        <defs>
          <filter id="mineral-grain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0.14 0" />
            <feComposite in2="SourceGraphic" in="glimmer" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Main Full-Bleed 16:9 24FPS Cinematic Video Player with Fallback Frame Stream */}
      {/* Click advances to next shot directly without pausing */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-stone-950 cursor-pointer"
        onClick={handleAdvanceToNextShot}
      >
        {isVideoFailed ? (
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden bg-stone-950"
            style={{ filter: getDynamicCssFilter() }}
          >
            {/* Smooth visual slideshow of 9 shots */}
            <img
              src={currentShot.startFrameUrl}
              alt={currentShot.title}
              className="w-full h-full object-cover object-center filter saturate-105 transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-stone-950/20" />
          </div>
        ) : (
          <video
            ref={videoRef}
            playsInline
            autoPlay
            loop
            muted={isVideoMuted}
            preload="auto"
            style={{ filter: getDynamicCssFilter() }}
            onTimeUpdate={handleTimeUpdate}
            onError={() => {
              setIsVideoFailed(true);
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration || 41.0);
              }
            }}
            onEnded={() => {
              soundManager.playAwakeningFanfare();
            }}
            className="w-full h-full object-cover object-center transition-all duration-300"
          >
            <source src="/video_assets/full_revelation.webm" type="video/webm" />
            <source src="/video_assets/full_revelation.mp4" type="video/mp4" />
          </video>
        )}

        {/* Ancient Plaster Crackle & Mineral Grains Grain Texture Overlay */}
        {showGrainOverlay && (
          <div
            className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(245,222,179,0.06) 0%, rgba(30,20,10,0.18) 100%)',
              backgroundSize: '100% 100%'
            }}
          />
        )}

        {/* Interactive Torchlight / Candlelight Overlay */}
        {/* Rule 4: S05+ does not bake in flashlight; procedural interaction dynamically illuminates the mural */}
        {isTorchEnabled && (
          <div
            className="pointer-events-none fixed z-15 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              width: `${torchRadius * 2}px`,
              height: `${torchRadius * 2}px`
            }}
          >
            <div
              className="w-full h-full rounded-full blur-md opacity-80"
              style={{
                background: currentShotIndex >= 4
                  ? 'radial-gradient(circle, rgba(254, 215, 170, 0.28) 0%, rgba(217, 119, 6, 0.12) 45%, transparent 70%)'
                  : 'radial-gradient(circle, rgba(251, 191, 36, 0.22) 0%, rgba(180, 83, 9, 0.10) 50%, transparent 75%)'
              }}
            />
          </div>
        )}
      </div>

      {/* Top Left Floating Header HUD */}
      <div className="absolute top-6 left-8 z-30 flex items-center space-x-3 pointer-events-auto">
        <button
          onClick={onBackToPrologue}
          className="px-3.5 py-1.5 rounded-xl bg-stone-900/85 border border-amber-800 text-amber-200 text-xs flex items-center space-x-1.5 hover:bg-stone-800 transition-colors shadow backdrop-blur-md"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>返回序幕</span>
        </button>

        <div className="bg-stone-900/85 border border-amber-700/60 rounded-xl px-4 py-1.5 shadow-lg backdrop-blur-md">
          <div className="flex items-center space-x-2.5">
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-900/70 text-amber-300 font-sans border border-amber-700/50 font-bold">
              一、统一视觉风格锁
            </span>
            <span className="text-xs text-amber-100 font-bold tracking-wider">
              连续照见长卷 · 9 镜 41 秒
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              16:9 · 24fps
            </span>
          </div>
        </div>
      </div>

      {/* Top Right Controls HUD */}
      <div className="absolute top-6 right-8 z-30 flex items-center space-x-2.5 pointer-events-auto">
        {/* Interactive Torchlight Toggle */}
        <button
          onClick={() => {
            setIsTorchEnabled(!isTorchEnabled);
            soundManager.playTorchIgnite();
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md ${
            isTorchEnabled
              ? 'bg-amber-600/90 text-stone-950 border border-amber-300'
              : 'bg-stone-900/85 text-stone-400 border border-stone-800 hover:text-amber-200'
          }`}
          title="移动鼠标即可在壁画上投射微弱暖光探寻"
        >
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>{isTorchEnabled ? '烛光照见中' : '开启烛光照见'}</span>
        </button>

        {/* Skin Tone & Mineral Preset Quick Switch ("调好肤色") */}
        <button
          onClick={() => {
            setDrawerTab('skinTone');
            setIsDrawerOpen(true);
            soundManager.playGuqinPluck(1);
          }}
          className="px-3 py-1.5 rounded-full bg-stone-900/85 hover:bg-stone-800 border border-amber-700/80 text-amber-200 font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all"
        >
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>矿彩肤色校准</span>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeSkinPreset.colorSwatch[1] }} />
        </button>

        {/* Style Lock, Prompts & Transitions Drawer Trigger */}
        <button
          onClick={() => {
            setSelectedShotForDrawer(currentShot);
            setDrawerTab('styleLock');
            setIsDrawerOpen(true);
            soundManager.playGuqinPluck(2);
          }}
          className="px-3.5 py-1.5 rounded-full bg-amber-600/90 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center space-x-1.5 shadow-lg transition-transform hover:scale-105"
        >
          <Sliders className="w-3.5 h-3.5 text-stone-950" />
          <span>视觉风格锁面板</span>
        </button>

        {/* Full BGM Channel Control with dedicated Pause key (贯穿全程，设置供选择的暂停键与关闭通道) */}
        <div className="flex items-center space-x-2 bg-stone-900/85 border border-amber-800/80 rounded-full px-3 py-1 shadow-md backdrop-blur-md">
          <button
            onClick={() => {
              const playing = soundManager.toggleBgm();
              setIsBgmOn(playing);
            }}
            className="flex items-center space-x-1.5 text-xs text-amber-300 hover:text-amber-100 transition-colors"
            title={isBgmOn ? '暂停背景禅乐' : '播放背景禅乐'}
          >
            {isBgmOn ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold">暂停音乐</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold">播放音乐</span>
              </>
            )}
          </button>

          <span className="w-px h-3 bg-amber-800/50" />

          <button
            onClick={() => {
              const currentMuted = soundManager.getMuted();
              soundManager.setMuted(!currentMuted);
            }}
            className="text-stone-400 hover:text-amber-300 transition-colors"
            title={soundManager.getMuted() ? '开启声音通道' : '静音通道'}
          >
            {soundManager.getMuted() ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Enter Cave Selector Stage Button */}
        <button
          onClick={onCompleteToSelector}
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-xs flex items-center space-x-1.5 shadow-lg hover:scale-105 active:scale-95 transition-all"
        >
          <span>进入八窟选单</span>
          <ArrowRight className="w-3.5 h-3.5 text-stone-950" />
        </button>
      </div>

      {/* Subtitles & Chapter Annotation - EXACT MATCH to User Reference Image (fc55d76dc30ae9796cdcc63c3c5ff4d2_4b929a3c.jpg) */}
      <div className="absolute bottom-24 left-10 z-30 pointer-events-none max-w-xl animate-fade-in font-serif">
        <div className="bg-stone-950/75 border border-amber-900/50 backdrop-blur-md px-5 py-4 rounded-2xl shadow-2xl">
          {/* Chapter Number & Reality Ratio Tag */}
          <div className="flex items-center space-x-2 text-stone-400 text-xs mb-1.5">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-mono text-amber-400 font-bold tracking-widest text-sm">
              {currentShot.numberLabel}
            </span>
            <span className="opacity-40">·</span>
            <span className="text-amber-200/90 font-medium">{currentShot.realityRatio}</span>
            <span className="opacity-40">·</span>
            <span className="text-stone-400 font-mono">
              {currentTime.toFixed(1)}s / {duration.toFixed(0)}s
            </span>
          </div>

          {/* Chapter Title (e.g. 仰见天心) */}
          <h2 className="text-2xl font-black text-amber-100 tracking-[0.25em] drop-shadow-md">
            {currentShot.title}
          </h2>

          {/* Subtitle Annotation (e.g. 抬头，一枚古老的图案会转到中心。) */}
          <p className="text-sm text-stone-200 mt-1.5 leading-relaxed tracking-wide drop-shadow font-sans font-light">
            {currentShot.subtitle}
          </p>

          {/* Interaction Hint: Click anywhere to advance to next shot */}
          <div className="mt-2.5 pt-2 border-t border-amber-900/30 flex items-center justify-between text-xs text-amber-400/90 font-mono">
            <span className="flex items-center space-x-1.5">
              <span className="text-amber-500">❖</span>
              <span>{currentShot.interactionHint} · 单击画面进入下一幕</span>
            </span>
            <span className="text-stone-400 tracking-normal text-[11px]">
              第 {currentShotIndex + 1}/9 镜
            </span>
          </div>
        </div>
      </div>

      {/* Floating Indicator when Programmatically Overlaid Torchlight is Active (S05 - S08) */}
      {currentShotIndex >= 4 && isTorchEnabled && (
        <div className="absolute bottom-24 right-10 z-30 pointer-events-none">
          <div className="bg-stone-900/80 border border-amber-600/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] text-amber-300 flex items-center space-x-1.5 shadow-lg">
            <Flame className="w-3 h-3 text-amber-400 animate-bounce" />
            <span>程序交互烛光照见中 · 保留二维矿彩原壁</span>
          </div>
        </div>
      )}

      {/* Bottom Timeline with 9 Shot Scrubbers (right-80 reserves clean space for global AudioController) */}
      <div className="absolute bottom-6 left-8 right-80 z-30 pointer-events-auto flex flex-col space-y-2">
        {/* Progress Bar with 9 Shot Chapters */}
        <div className="relative w-full h-2.5 bg-stone-900/90 rounded-full overflow-hidden border border-amber-900/40 shadow-inner flex">
          {/* Active elapsed fill */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 transition-all duration-100"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />

          {/* 9 Shot Divider Tick Marks */}
          {ILLUMINATION_SHOTS.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => handleJumpToShot(idx)}
              className="absolute top-0 bottom-0 w-0.5 bg-stone-950/80 cursor-pointer hover:bg-yellow-300 hover:w-1 transition-all"
              style={{ left: `${(s.timeRange[0] / duration) * 100}%` }}
              title={`${s.numberLabel} ${s.title} (${s.timeRange[0]}s - ${s.timeRange[1]}s)`}
            />
          ))}
        </div>

        {/* 9 Interactive Chapter Buttons */}
        <div className="grid grid-cols-9 gap-1.5 pt-0.5">
          {ILLUMINATION_SHOTS.map((s, idx) => {
            const isCurrent = currentShotIndex === idx;
            return (
              <button
                key={s.id}
                onClick={() => handleJumpToShot(idx)}
                className={`py-1.5 px-1 rounded-xl text-center transition-all ${
                  isCurrent
                    ? 'bg-amber-600/90 text-stone-950 font-black border border-amber-300 shadow-md scale-102'
                    : 'bg-stone-900/75 text-stone-400 hover:text-amber-200 hover:bg-stone-800 border border-stone-800'
                }`}
              >
                <div className="text-[10px] font-mono leading-none tracking-wider opacity-80">
                  {s.numberLabel}
                </div>
                <div className="text-xs truncate leading-tight mt-0.5 font-bold">
                  {s.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Modal Drawer: Style Lock, Prompts, Transitions, & Skin Calibration */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-stone-950/80 backdrop-blur-sm animate-fade-in font-serif">
          <div className="w-full max-w-3xl h-full bg-stone-900 border-l border-amber-700/80 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div className="space-y-5">
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-600 flex items-center justify-center">
                    <Film className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-amber-100 tracking-wide">
                      一、统一视觉风格锁控制中心
                    </h3>
                    <p className="text-xs text-amber-400/80">
                      9 镜 41 秒 · 16:9 24fps · 严格 2.5D 平面离墙与矿彩肤色控制
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-amber-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Tabs */}
              <div className="flex items-center space-x-2 border-b border-stone-800 pb-2">
                <button
                  onClick={() => setDrawerTab('styleLock')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    drawerTab === 'styleLock'
                      ? 'bg-amber-600 text-stone-950 shadow'
                      : 'bg-stone-950 text-stone-400 hover:text-amber-200'
                  }`}
                >
                  核心视觉逻辑与规则
                </button>
                <button
                  onClick={() => setDrawerTab('skinTone')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    drawerTab === 'skinTone'
                      ? 'bg-amber-600 text-stone-950 shadow'
                      : 'bg-stone-950 text-stone-400 hover:text-amber-200'
                  }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>调好肤色 (矿彩尊相)</span>
                </button>
                <button
                  onClick={() => setDrawerTab('prompts')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    drawerTab === 'prompts'
                      ? 'bg-amber-600 text-stone-950 shadow'
                      : 'bg-stone-950 text-stone-400 hover:text-amber-200'
                  }`}
                >
                  9 镜分镜 Prompt
                </button>
                <button
                  onClick={() => setDrawerTab('transitions')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    drawerTab === 'transitions'
                      ? 'bg-amber-600 text-stone-950 shadow'
                      : 'bg-stone-950 text-stone-400 hover:text-amber-200'
                  }`}
                >
                  镜头衔接检查表 (8 处)
                </button>
              </div>

              {/* TAB 1: CORE VISUAL STYLE LOCK & RULES */}
              {drawerTab === 'styleLock' && (
                <div className="space-y-4 text-xs">
                  {/* Core Logic Box */}
                  <div className="p-4 rounded-xl bg-stone-950 border border-amber-800/80 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>核心视觉逻辑</span>
                    </div>
                    <p className="text-stone-300 leading-relaxed font-sans">
                      全片不是九组独立画面，而是一条连续的“照见”过程：观众从幽暗洞窟进入，微弱暖光逐步显露古壁；镜头抬头进入藻井后，真实空间逐渐转化为壁画内部世界。进入三兔、九色鹿、飞天段落后，所有人物、动物、水纹、云气和飘带始终保留敦煌壁画的平面造型、矿物颜料和古壁裂纹，只做克制的 2.5D 离墙运动，不能变成真人、写实动物或仙侠 CG。
                    </p>
                  </div>

                  {/* 6 Continuity Rules */}
                  <div className="space-y-2">
                    <h4 className="text-amber-200 font-bold">风格连续性规则（6 大铁律）：</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-sans">
                      <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
                        <span className="font-bold text-amber-400">1. S01–S03：</span>
                        <p className="text-stone-300 mt-1">洞窟现实感占 70%，壁画质感占 30%；暖光微弱，暗部保留细节。</p>
                      </div>
                      <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
                        <span className="font-bold text-amber-400">2. S03B–S04：</span>
                        <p className="text-stone-300 mt-1">现实空间退场，壁画质感提升到 90%；旋转来自纹样本身，不使用科幻光效。</p>
                      </div>
                      <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
                        <span className="font-bold text-amber-400">3. S05–S08：</span>
                        <p className="text-stone-300 mt-1">完全进入壁画叙事；始终保留二维造型，只允许轻微分层、离墙、横卷和飘带运动。</p>
                      </div>
                      <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
                        <span className="font-bold text-amber-400">4. 烛光照见交互锁：</span>
                        <p className="text-stone-300 mt-1">S05 以后不生成烛光、移动光斑或暗角。烛光照见效果留给后续程序交互叠加。</p>
                      </div>
                      <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
                        <span className="font-bold text-amber-400">5. 色彩锁定：</span>
                        <p className="text-stone-300 mt-1">所有镜头保持低饱和赭红、石青、石绿、米白、深黑，禁止突然变成金色、霓虹色或高饱和仙侠色。</p>
                      </div>
                      <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
                        <span className="font-bold text-amber-400">6. 动势克制：</span>
                        <p className="text-stone-300 mt-1">动作幅度宁小勿大；优先保证结构、首尾帧和纹理稳定。</p>
                      </div>
                    </div>
                  </div>

                  {/* Global Negative Prompt Box */}
                  <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-300 flex items-center space-x-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>全局风格负向词（禁止仙侠 CG / 写实动物 / 现代人像）：</span>
                      </span>
                      <button
                        onClick={() => handleCopyText(GLOBAL_NEGATIVE_PROMPT, 'global_neg')}
                        className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-rose-300 flex items-center space-x-1 text-[11px]"
                      >
                        {copiedKey === 'global_neg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'global_neg' ? '已复制' : '一键复制'}</span>
                      </button>
                    </div>
                    <p className="font-mono text-[11px] text-rose-200/80 leading-relaxed">
                      {GLOBAL_NEGATIVE_PROMPT}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: SKIN TONE TUNING & MINERAL CALIBRATION ("调好肤色") */}
              {drawerTab === 'skinTone' && (
                <div className="space-y-4 text-xs font-sans">
                  {/* Historical Context Explainer */}
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/80 space-y-2">
                    <div className="flex items-center space-x-2 text-amber-300 font-bold text-sm">
                      <Palette className="w-4 h-4 text-amber-400" />
                      <span>敦煌矿彩与尊相肤色校准原理</span>
                    </div>
                    <p className="text-stone-300 leading-relaxed font-light">
                      敦煌壁画造像严禁渲染成现代粉嫩白皙肌肤或 3D 塑料感。北魏盛唐采用天然矿物颜料：额梁铅白提亮（经千年微量硫化转化为温润熟褐或黑褐“小字脸”）、西域凹凸赭红晕染、以及铁线描勾勒面容。此处校准仪实时调校矿物颜料温阶与氧化度。
                    </p>
                  </div>

                  {/* 4 Authentic Presets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-amber-200 font-bold">
                      <span>典藏矿彩预设：</span>
                      <span className="text-[11px] text-stone-400 font-normal">点击即时应用全片实时调色</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {SKIN_TONE_PRESETS.map((preset) => {
                        const isSelected = activeSkinPreset.id === preset.id;
                        return (
                          <div
                            key={preset.id}
                            onClick={() => handleSelectPreset(preset)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-amber-950/60 border-amber-400 shadow-lg scale-101'
                                : 'bg-stone-950 border-stone-800 hover:border-amber-800/60 hover:bg-stone-900'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-amber-200 text-xs">{preset.name}</span>
                              <span className="text-[10px] text-amber-400 font-mono">{preset.period}</span>
                            </div>
                            <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed mb-2">
                              {preset.description}
                            </p>
                            {/* Color swatches */}
                            <div className="flex items-center space-x-1.5">
                              {preset.colorSwatch.map((hex, i) => (
                                <div
                                  key={i}
                                  className="w-5 h-5 rounded-md border border-stone-700 shadow-sm"
                                  style={{ backgroundColor: hex }}
                                  title={hex}
                                />
                              ))}
                              <span className="text-[10px] text-stone-500 font-mono ml-auto">
                                {preset.colorSwatch[1]}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Calibration Sliders */}
                  <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between text-amber-200 font-bold">
                      <span>微调滑块参数：</span>
                      <button
                        onClick={handleResetStyleLock}
                        className="text-[11px] text-amber-400 hover:underline"
                      >
                        重置为官方视觉锁
                      </button>
                    </div>

                    {/* Warmth / Ochre temperature */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-stone-400 text-[11px]">
                        <span>肤色暖赭色温（土红与朱砂比）：</span>
                        <span className="font-mono text-amber-300">{skinWarmth > 0 ? `+${skinWarmth}` : skinWarmth}°</span>
                      </div>
                      <input
                        type="range"
                        min="-20"
                        max="40"
                        value={skinWarmth}
                        onChange={(e) => setSkinWarmth(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
                      />
                    </div>

                    {/* Lead White Oxidation */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-stone-400 text-[11px]">
                        <span>铅白千年熟褐氧化度（硫化铅沉淀）：</span>
                        <span className="font-mono text-amber-300">{leadOxidation}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={leadOxidation}
                        onChange={(e) => setLeadOxidation(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
                      />
                    </div>

                    {/* Iron Wire Contrast */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-stone-400 text-[11px]">
                        <span>铁线描边缘对比度（工笔轮廓明晰度）：</span>
                        <span className="font-mono text-amber-300">{ironWireContrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="120"
                        value={ironWireContrast}
                        onChange={(e) => setIronWireContrast(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
                      />
                    </div>

                    {/* Mineral Saturation Lock */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-stone-400 text-[11px]">
                        <span>矿物低饱和度锁定（坚决压制荧光仙侠色）：</span>
                        <span className="font-mono text-amber-300">{saturationLock}% (低饱和锁定)</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="100"
                        value={saturationLock}
                        onChange={(e) => setSaturationLock(parseInt(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
                      />
                    </div>

                    {/* Grain Texture Toggle */}
                    <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-300">
                      <span>古壁石灰地仗裂纹与矿物砂砾感：</span>
                      <button
                        onClick={() => setShowGrainOverlay(!showGrainOverlay)}
                        className={`px-2.5 py-1 rounded text-xs font-bold ${
                          showGrainOverlay
                            ? 'bg-amber-600 text-stone-950'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {showGrainOverlay ? '已启用砂砾裂纹' : '已关闭'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: 9 SHOTS PROMPTS & START/END CONTROL FRAMES */}
              {drawerTab === 'prompts' && (
                <div className="space-y-4">
                  {/* Shot Tabs */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                    {ILLUMINATION_SHOTS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedShotForDrawer(s);
                          soundManager.playGuqinPluck(1);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all ${
                          selectedShotForDrawer.id === s.id
                            ? 'bg-amber-600 text-stone-950 border border-amber-400'
                            : 'bg-stone-950 text-stone-400 hover:text-amber-200 border border-stone-800'
                        }`}
                      >
                        {s.numberLabel} {s.title}
                      </button>
                    ))}
                  </div>

                  {/* Start & End Frames Previews */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300">
                        该镜首尾控制帧（01_start.png & 02_end.png）：
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {selectedShotForDrawer.timeRange[0]}s - {selectedShotForDrawer.timeRange[1]}s
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Start Frame */}
                      <div className="relative rounded-xl overflow-hidden border border-amber-800/80 bg-stone-950 group">
                        <img
                          src={selectedShotForDrawer.startFrameUrl}
                          alt="01_start.png"
                          className="w-full h-32 object-cover object-center filter saturate-105"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-stone-950/80 text-[10px] text-amber-300 font-mono">
                          01_start.png
                        </div>
                      </div>

                      {/* End Frame */}
                      <div className="relative rounded-xl overflow-hidden border border-amber-800/80 bg-stone-950 group">
                        <img
                          src={selectedShotForDrawer.endFrameUrl}
                          alt="02_end.png"
                          className="w-full h-32 object-cover object-center filter saturate-105"
                        />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-stone-950/80 text-[10px] text-amber-300 font-mono">
                          02_end.png
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shot Style Rule & Motion Constraint */}
                  <div className="p-3.5 rounded-xl bg-stone-950 border border-amber-800/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-amber-200">
                      <span className="font-bold">视觉连续性规范：</span>
                      <span className="font-mono text-amber-400 font-bold">{selectedShotForDrawer.realityRatio}</span>
                    </div>
                    <p className="text-stone-300 font-sans leading-relaxed">
                      {selectedShotForDrawer.styleRule}
                    </p>
                    <div className="text-[11px] text-stone-400 font-mono pt-1.5 border-t border-stone-800">
                      动势约束：{selectedShotForDrawer.motionConstraint}
                    </div>
                  </div>

                  {/* Prompt Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-300">完整生成 Prompt：</span>
                      <button
                        onClick={() => handleCopyText(selectedShotForDrawer.prompt, `prompt_${selectedShotForDrawer.id}`)}
                        className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-amber-300 flex items-center space-x-1 text-[11px]"
                      >
                        {copiedKey === `prompt_${selectedShotForDrawer.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>复制 Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] font-mono text-stone-300 leading-relaxed max-h-24 overflow-y-auto">
                      {selectedShotForDrawer.prompt}
                    </div>
                  </div>

                  {/* Negative Prompt Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-rose-300">Negative Prompt：</span>
                      <button
                        onClick={() => handleCopyText(selectedShotForDrawer.negativePrompt, `neg_${selectedShotForDrawer.id}`)}
                        className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-rose-300 flex items-center space-x-1 text-[11px]"
                      >
                        {copiedKey === `neg_${selectedShotForDrawer.id}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>复制 Negative</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-[11px] font-mono text-stone-400 leading-relaxed max-h-20 overflow-y-auto">
                      {selectedShotForDrawer.negativePrompt}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TRANSITION CHECKLIST (8 JUNCTIONS) */}
              {drawerTab === 'transitions' && (
                <div className="space-y-3 text-xs font-sans">
                  <div className="flex items-center justify-between text-stone-400 pb-1">
                    <span className="text-amber-200 font-bold text-sm">镜头衔接检查表（全片无黑屏切割）：</span>
                    <span className="text-[11px] font-mono">共 8 组相邻衔接检查点</span>
                  </div>

                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                    {TRANSITION_CHECKLIST.map((tc, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2 hover:border-amber-700/60 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-mono text-[11px] font-bold">
                              {tc.fromId} ➔ {tc.toId}
                            </span>
                            <span className="text-amber-100 font-bold text-xs">{tc.title}</span>
                          </div>
                          <span className="text-emerald-400 text-[10px] flex items-center space-x-1 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>风格锁吻合</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="bg-stone-900/60 p-2 rounded-lg">
                            <span className="text-amber-400/90 font-bold">光比与光斑连续：</span>
                            <p className="text-stone-300 mt-0.5">{tc.lightingTransition}</p>
                          </div>
                          <div className="bg-stone-900/60 p-2 rounded-lg">
                            <span className="text-amber-400/90 font-bold">动势与角速度：</span>
                            <p className="text-stone-300 mt-0.5">{tc.motionTransition}</p>
                          </div>
                        </div>

                        <div className="text-[11px] text-stone-400 border-t border-stone-850 pt-1.5 flex items-center justify-between">
                          <span>首尾控制帧：{tc.seamlessCheck}</span>
                          <button
                            onClick={() => {
                              const targetIndex = ILLUMINATION_SHOTS.findIndex(s => s.id === tc.fromId);
                              if (targetIndex !== -1) {
                                handleJumpToShot(targetIndex);
                                setIsDrawerOpen(false);
                              }
                            }}
                            className="text-amber-400 hover:underline font-mono text-[10px]"
                          >
                            跳转至此分界点 ▶
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Action in Drawer */}
            <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
              <span className="text-[11px] text-stone-500 font-mono">
                首尾帧保证结构纹理稳定 · 动作幅度宁小勿大
              </span>
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  const idx = ILLUMINATION_SHOTS.findIndex((s) => s.id === selectedShotForDrawer.id);
                  if (idx !== -1) handleJumpToShot(idx);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md"
              >
                跳转至此镜播放
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
