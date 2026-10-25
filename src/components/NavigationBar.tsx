import React from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Package,
  Sparkles,
  Compass,
  Award,
  Layers,
  Flame,
  Film
} from 'lucide-react';
import { GameStage } from '../types/dunhuang';
import { soundManager } from '../services/soundEffects';

interface NavigationBarProps {
  currentStage: GameStage;
  onNavigateStage: (stage: GameStage) => void;
  collectedCount: number;
  onToggleBackpack: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isBgmPlaying?: boolean;
  onTogglePlayBgm?: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  currentStage,
  onNavigateStage,
  collectedCount,
  onToggleBackpack,
  isMuted,
  onToggleMute,
  isBgmPlaying = true,
  onTogglePlayBgm
}) => {
  const stages: { stage: GameStage; label: string; icon: React.ReactNode }[] = [
    { stage: 'prologue_torch', label: '序幕烛火', icon: <Flame className="w-3.5 h-3.5" /> },
    { stage: 'illumination_cinema', label: '照见九镜', icon: <Film className="w-3.5 h-3.5" /> },
    { stage: 'cave_selector', label: '八窟全景', icon: <Compass className="w-3.5 h-3.5" /> },
    { stage: 'restoration_workshop', label: '古法绘制', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { stage: 'knowledge_quiz', label: '通关问答', icon: <Layers className="w-3.5 h-3.5" /> },
    { stage: 'guardian_badge', label: '守护勋章', icon: <Award className="w-3.5 h-3.5" /> }
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-stone-950/80 border-b border-amber-900/40 backdrop-blur-md px-6 py-2.5 flex items-center justify-between font-serif">
      {/* Brand & App Title */}
      <div
        onClick={() => onNavigateStage('cave_selector')}
        className="flex items-center space-x-2.5 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div className="w-7 h-7 rounded-lg bg-amber-600/30 border border-amber-400 flex items-center justify-center text-amber-300 shadow">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-amber-100 tracking-wider">
            敦煌重光
          </span>
          <span className="text-[10px] text-amber-400/70 font-mono tracking-tighter">
            RESTORATION JOURNEY
          </span>
        </div>
      </div>

      {/* Breadcrumb Stage Navigator */}
      <nav className="hidden md:flex items-center space-x-1 bg-stone-900/60 border border-amber-900/50 rounded-full px-2 py-1">
        {stages.map((item, idx) => {
          const isActive = currentStage === item.stage;
          return (
            <button
              key={item.stage}
              onClick={() => onNavigateStage(item.stage)}
              className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1.5 transition-all ${
                isActive
                  ? 'bg-amber-600/80 text-stone-950 font-bold border border-amber-400 shadow-sm'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-stone-800/60'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Backpack & Sound */}
      <div className="flex items-center space-x-3">
        {/* Backpack Trigger */}
        <button
          onClick={onToggleBackpack}
          className="relative px-3 py-1.5 rounded-full bg-stone-900 border border-amber-800 hover:border-amber-500 text-amber-200 text-xs flex items-center space-x-1.5 transition-all shadow"
          title="查看已寻得的古法壁画修缮材料"
        >
          <Package className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono">{collectedCount}/4</span>
          {collectedCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
          )}
        </button>

        {/* Audio Pause / Resume Button */}
        <button
          onClick={() => {
            if (onTogglePlayBgm) {
              onTogglePlayBgm();
            } else {
              soundManager.toggleBgm();
            }
          }}
          className="px-2.5 py-1 rounded-full bg-stone-900 border border-amber-800 hover:border-amber-500 text-amber-200 text-xs flex items-center space-x-1.5 transition-all shadow"
          title={isBgmPlaying ? '暂停背景音乐' : '播放背景音乐'}
        >
          {isBgmPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold">暂停</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold">播放</span>
            </>
          )}
        </button>

        {/* Audio Channel Mute/Unmute */}
        <button
          onClick={onToggleMute}
          className="w-8 h-8 rounded-full bg-stone-900 border border-amber-800 hover:border-amber-500 text-amber-300 flex items-center justify-center transition-all shadow"
          title={isMuted ? '开启原声' : '静音'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-stone-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>
      </div>
    </header>
  );
};
