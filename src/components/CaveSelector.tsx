import React, { useState } from 'react';
import { Sparkles, MapPin, Compass, Package, Award, ArrowRight, Play, Info } from 'lucide-react';
import { CaveData, CAVES_DATA, TreasureItem } from '../types/dunhuang';
import { soundManager } from '../services/soundEffects';

interface CaveSelectorProps {
  collectedTreasures: Record<string, boolean>;
  onSelectCave: (cave: CaveData) => void;
  onGoToWorkshop: () => void;
  onGoToQuiz: () => void;
}

export const CaveSelector: React.FC<CaveSelectorProps> = ({
  collectedTreasures,
  onSelectCave,
  onGoToWorkshop,
  onGoToQuiz
}) => {
  const [hoveredCave, setHoveredCave] = useState<CaveData | null>(null);
  const collectedCount = Object.values(collectedTreasures).filter(Boolean).length;
  const isAllCollected = collectedCount >= 4;

  const handleCaveClick = (cave: CaveData) => {
    soundManager.playGuqinPluck(cave.id % 7);
    onSelectCave(cave);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-stone-950 font-serif flex flex-col justify-between">
      {/* Background High-Definition Dunhuang Mogao Panorama Cliff Map */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-b from-[#2B1B17] via-[#3E2723] to-[#1A120B] opacity-95 relative overflow-hidden">
          {/* Desert cliff silhouettes and ancient cave entrances */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/30 via-stone-950/70 to-stone-950" />

          {/* Procedural desert mountain layers */}
          <svg className="absolute bottom-0 w-full h-[60vh] opacity-40" preserveAspectRatio="none" viewBox="0 0 1200 600">
            <path
              d="M0,450 C200,320 400,500 600,380 C800,260 1000,420 1200,320 L1200,600 L0,600 Z"
              fill="#5D4037"
            />
            <path
              d="M0,500 C150,420 350,560 550,470 C750,380 950,520 1200,440 L1200,600 L0,600 Z"
              fill="#3E2723"
            />
          </svg>

          {/* Mogao Cave Cliff Horizontal Gallery Grid Lines */}
          <div className="absolute top-[28%] inset-x-0 h-0.5 bg-amber-500/20 border-t border-dashed border-amber-400/40" />
          <div className="absolute top-[52%] inset-x-0 h-0.5 bg-amber-500/20 border-t border-dashed border-amber-400/40" />
          <div className="absolute top-[72%] inset-x-0 h-0.5 bg-amber-500/20 border-t border-dashed border-amber-400/40" />

          {/* Starlight & Sand Dust Particles */}
          <div className="absolute inset-0 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:32px_32px] opacity-15" />
        </div>
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 px-8 pt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-900/60 border border-amber-500/50 flex items-center justify-center shadow-lg backdrop-blur-md">
            <Compass className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded bg-amber-900/80 text-amber-300 border border-amber-700/60 font-sans">
                莫高长卷 · 洞窟全景
              </span>
              <span className="text-xs text-amber-200/60">北魏至晚唐千年营造</span>
            </div>
            <h2 className="text-2xl font-black text-amber-100 tracking-widest drop-shadow mt-0.5">
              莫高窟八大洞窟巡礼
            </h2>
          </div>
        </div>

        {/* Ancient Restoration Material Collection Status (4 Ancient Treasures) */}
        <div className="flex items-center space-x-3 bg-stone-900/85 border border-amber-700/60 rounded-2xl px-5 py-2.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center space-x-2 border-r border-stone-700 pr-4">
            <Package className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="text-[11px] text-stone-400">壁画修缮材料寻宝</div>
              <div className="text-sm font-bold text-amber-200">
                已集齐 <span className="text-amber-400 font-mono text-base">{collectedCount}</span> / 4 种
              </div>
            </div>
          </div>

          {/* 4 Item Badges */}
          <div className="flex items-center space-x-2">
            {[
              { id: 'ground_plaster', name: '澄泥坯', icon: '🧱' },
              { id: 'glue_alum', name: '胶矾水', icon: '🧪' },
              { id: 'azurite_mineral', name: '石青', icon: '💎' },
              { id: 'wolf_hair_brush', name: '狼毫笔', icon: '🖌️' }
            ].map((mat) => {
              const hasIt = collectedTreasures[mat.id];
              return (
                <div
                  key={mat.id}
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center text-sm transition-all ${
                    hasIt
                      ? 'bg-amber-600/30 border-amber-400 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                      : 'bg-stone-950/60 border-stone-800 text-stone-600 opacity-50'
                  }`}
                  title={`${mat.name}: ${hasIt ? '已寻得' : '未寻得（请探索相关洞窟）'}`}
                >
                  <span>{mat.icon}</span>
                </div>
              );
            })}
          </div>

          {/* Direct jump to Restoration Workshop if materials are ready */}
          {isAllCollected && (
            <button
              onClick={onGoToWorkshop}
              className="ml-3 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black text-xs tracking-wider flex items-center space-x-1.5 shadow-lg shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all animate-pulse"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>开启古法绘制</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 8 Dotted Ring Interactive Cave Buttons Placed Along Cliff Gallery */}
      <div className="relative flex-1 w-full mx-auto max-w-7xl">
        {CAVES_DATA.map((cave) => {
          const hasTreasureInThisCave = !!cave.treasure;
          const treasureFound = cave.treasure ? collectedTreasures[cave.treasure.id] : false;
          const isSelected = hoveredCave?.id === cave.id;

          return (
            <div
              key={cave.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${cave.buttonPosition.x}%`,
                top: `${cave.buttonPosition.y}%`
              }}
            >
              {/* Interactive Dotted Ring Cave Button */}
              <button
                onClick={() => handleCaveClick(cave)}
                onMouseEnter={() => {
                  setHoveredCave(cave);
                  soundManager.playGuqinPluck(cave.id % 5);
                }}
                onMouseLeave={() => setHoveredCave(null)}
                className="group relative flex flex-col items-center focus:outline-none"
              >
                {/* Outer Dashed Glowing Ring */}
                <div
                  className={`w-16 h-16 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'border-yellow-300 scale-125 bg-amber-500/30 shadow-[0_0_24px_rgba(245,158,11,0.8)] animate-spin-slow'
                      : 'border-amber-400/60 bg-stone-900/80 group-hover:border-amber-300 group-hover:scale-110'
                  }`}
                  style={{ animationDuration: isSelected ? '18s' : undefined }}
                >
                  {/* Inner Solid Cave Portal */}
                  <div
                    className="w-11 h-11 rounded-full flex flex-col items-center justify-center text-amber-100 font-bold border border-amber-300/40 shadow-inner"
                    style={{ backgroundColor: cave.dominantColor }}
                  >
                    <span className="text-[10px] leading-tight font-sans opacity-70">窟</span>
                    <span className="text-xs font-mono font-black">{cave.id}</span>
                  </div>
                </div>

                {/* Subtle Indicator if Cave has a hidden treasure */}
                {hasTreasureInThisCave && (
                  <div
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] border shadow ${
                      treasureFound
                        ? 'bg-emerald-600 border-emerald-300 text-emerald-100'
                        : 'bg-amber-500 border-yellow-200 text-stone-950 animate-bounce'
                    }`}
                    title={treasureFound ? '材料已寻得' : '藏有古法造壁修缮材料！'}
                  >
                    {treasureFound ? '✓' : '★'}
                  </div>
                )}

                {/* Cave Dynasty & Name Tag */}
                <div className="mt-2 text-center pointer-events-none">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold text-amber-200 bg-stone-950/80 border border-amber-800/60 shadow tracking-wide group-hover:text-amber-100 group-hover:border-amber-400 transition-colors whitespace-nowrap">
                    {cave.name}
                  </span>
                  <div className="text-[10px] text-amber-400/80 mt-0.5 tracking-tighter">
                    {cave.dynasty.split(' ')[0]}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Info Sheet / Hover Details Preview */}
      <div className="relative z-10 px-8 pb-6 flex items-end justify-between">
        {/* Active Hover / Focus Cave Description */}
        <div className="max-w-2xl bg-stone-950/90 border border-amber-700/60 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
          {hoveredCave ? (
            <div className="space-y-1.5 animate-fade-in">
              <div className="flex items-center space-x-3">
                <span className="text-xs px-2.5 py-0.5 rounded bg-amber-600/30 text-amber-300 border border-amber-500/50">
                  {hoveredCave.dynasty}
                </span>
                <h3 className="text-lg font-black text-amber-100 tracking-wide">
                  {hoveredCave.name}
                </h3>
                <span className="text-xs text-amber-400 font-sans tracking-wide">
                  {hoveredCave.tagline}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {hoveredCave.description}
              </p>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2 text-xs text-amber-300/80">
                  <span>重点看点：</span>
                  {hoveredCave.highlights.map((h, i) => (
                    <span key={i} className="bg-stone-900 px-2 py-0.5 rounded border border-stone-800 text-[11px]">
                      {h}
                    </span>
                  ))}
                </div>
                {hoveredCave.treasure && (
                  <span className="text-xs text-amber-400 font-semibold flex items-center space-x-1">
                    <span>宝箱密藏:</span>
                    <span className="text-yellow-200 underline">
                      {hoveredCave.treasure.name}
                    </span>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 py-1 text-stone-400 text-xs">
              <Info className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <span>
                悬停或点击崖壁上的 8 个虚线环形洞窟按钮，探寻 360° 仿 VR 空间；四处隐蔽岩隙藏有古法造壁修缮材料。
              </span>
            </div>
          )}
        </div>

        {/* Quick Nav shortcuts */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onGoToQuiz}
            className="px-4 py-2.5 rounded-xl bg-stone-900/90 border border-amber-800/80 text-amber-200 hover:bg-stone-800 hover:border-amber-500 text-xs tracking-wider flex items-center space-x-2 shadow-lg transition-all"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>敦煌学 10 题通关问答</span>
          </button>
        </div>
      </div>
    </div>
  );
};
