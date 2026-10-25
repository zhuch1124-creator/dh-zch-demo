import React from 'react';
import { X, Package, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { TREASURE_ITEMS, TreasureItem } from '../types/dunhuang';

interface BackpackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  collectedTreasures: Record<string, boolean>;
  onGoToWorkshop: () => void;
}

export const BackpackDrawer: React.FC<BackpackDrawerProps> = ({
  isOpen,
  onClose,
  collectedTreasures,
  onGoToWorkshop
}) => {
  if (!isOpen) return null;

  const treasures = Object.values(TREASURE_ITEMS);
  const collectedCount = Object.values(collectedTreasures).filter(Boolean).length;
  const isAllCollected = collectedCount >= 4;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-stone-950/70 backdrop-blur-sm animate-fade-in font-serif">
      <div className="w-full max-w-md h-full bg-stone-900 border-l border-amber-700/60 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center space-x-2.5">
              <Package className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="text-lg font-black text-amber-100 tracking-wider">
                  壁画修缮材料行囊
                </h3>
                <p className="text-xs text-amber-400/80">
                  已寻得 {collectedCount} / 4 种古法矿物与工具
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-amber-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 4 Items List */}
          <div className="space-y-4">
            {treasures.map((item) => {
              const hasIt = collectedTreasures[item.id];
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    hasIt
                      ? 'bg-amber-950/40 border-amber-500/70 shadow'
                      : 'bg-stone-950/60 border-stone-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center text-2xl flex-shrink-0 shadow">
                      {item.icon}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-amber-100">
                          {item.name}
                        </h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            hasIt
                              ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-600'
                              : 'bg-stone-800 text-stone-500'
                          }`}
                        >
                          {hasIt ? '已寻获' : `藏于第 ${item.sourceCaveId} 窟`}
                        </span>
                      </div>

                      <div className="text-[11px] text-amber-300/80 font-mono">
                        {item.pinyin} · {item.english}
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed pt-1">
                        {item.description}
                      </p>

                      <div className="text-[11px] text-yellow-300/90 font-medium pt-1">
                        工序：{item.craftRole}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="pt-4 border-t border-stone-800">
          {isAllCollected ? (
            <button
              onClick={() => {
                onClose();
                onGoToWorkshop();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-black text-xs tracking-wider shadow-xl shadow-amber-500/40 hover:scale-102 active:scale-98 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>四宝齐聚 · 前往古法壁画绘制</span>
              <ArrowRight className="w-4 h-4 text-stone-950" />
            </button>
          ) : (
            <div className="text-center text-xs text-stone-400 py-2">
              探索对应洞窟暗部岩隙，即可发现微光宝箱并集齐材料
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
