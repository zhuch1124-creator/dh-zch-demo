import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  Upload,
  ChevronDown,
  ChevronUp,
  Disc,
  Sliders,
  Sparkles,
  Power
} from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface AudioControllerProps {
  onMuteToggle?: (muted: boolean) => void;
}

export const AudioController: React.FC<AudioControllerProps> = ({ onMuteToggle }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(soundManager.getIsBgmPlaying());
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());
  const [volume, setVolume] = useState<number>(soundManager.getBgmVolume());
  const [trackTitle, setTrackTitle] = useState<string>(soundManager.getBgmTitle());
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [customFileName, setCustomFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Subscribe to soundManager updates
    const unsubscribe = soundManager.subscribe(() => {
      setIsPlaying(soundManager.getIsBgmPlaying());
      setIsMuted(soundManager.getMuted());
      setVolume(soundManager.getBgmVolume());
      setTrackTitle(soundManager.getBgmTitle());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTogglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.toggleBgm();
  };

  const handleToggleChannelMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    soundManager.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (onMuteToggle) onMuteToggle(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundManager.setBgmVolume(val);
    if (val > 0 && isMuted) {
      soundManager.setMuted(false);
      setIsMuted(false);
      if (onMuteToggle) onMuteToggle(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      const title = file.name.replace(/\.[^/.]+$/, '');
      setCustomFileName(file.name);
      soundManager.setCustomAudio(blobUrl, `自定义 · ${title}`);
      soundManager.playCorrectChime();
    }
  };

  const handleSwitchToDefaultTrack = () => {
    setCustomFileName(null);
    soundManager.startBgm('/audio_assets/dunhuang_bgm.mp3', '莫高窟 · 丝路冥想禅乐');
    soundManager.playGuqinPluck(0);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-serif select-none">
      {/* Expanded Audio Control Center */}
      {isExpanded && (
        <div className="mb-3 w-80 bg-stone-900/95 border border-amber-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-stone-100 animate-fade-in font-serif">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-600 flex items-center justify-center text-amber-400">
                <Disc className={`w-4 h-4 ${isPlaying && !isMuted ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-200 tracking-wider">
                  敦煌梵音 · 全程禅韵声轨
                </h4>
                <p className="text-[10px] text-amber-400/80 truncate max-w-[170px]">
                  {trackTitle}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="w-6 h-6 rounded-full bg-stone-800 text-stone-400 hover:text-amber-200 flex items-center justify-center transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Channel Off / On Toggle Button */}
          <div className="my-3">
            <button
              onClick={() => handleToggleChannelMute()}
              className={`w-full py-2 px-3 rounded-xl flex items-center justify-center space-x-2 text-xs font-bold transition-all shadow ${
                isMuted
                  ? 'bg-stone-800 border border-stone-700 text-stone-400 hover:text-amber-300'
                  : 'bg-amber-600/90 hover:bg-amber-500 text-stone-950 border border-amber-400'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isMuted ? '当前已关闭音乐通道 (点击开启)' : '关闭音乐通道 (一键静音)'}</span>
            </button>
          </div>

          {/* Playback Controls & Volume */}
          <div className="space-y-3 pt-1 text-xs">
            {/* Play / Pause Toggle */}
            <div className="flex items-center justify-between bg-stone-950/60 p-2 rounded-xl border border-stone-800">
              <span className="text-stone-400 text-[11px]">播放状态</span>
              <button
                onClick={handleTogglePlayPause}
                className="px-3 py-1 rounded-lg bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border border-amber-700/60 flex items-center space-x-1.5 transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3 text-amber-400" />
                    <span>暂停</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-amber-400" />
                    <span>播放</span>
                  </>
                )}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span className="flex items-center space-x-1">
                  <Sliders className="w-3 h-3 text-amber-400" />
                  <span>音量调节</span>
                </span>
                <span className="font-mono text-amber-300 font-bold">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full accent-amber-500 h-1 bg-stone-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Audio Track Selector & Custom File Uploader */}
            <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span>音频音轨切换</span>
                {customFileName && (
                  <button
                    onClick={handleSwitchToDefaultTrack}
                    className="text-[10px] text-amber-400 underline hover:text-amber-300"
                  >
                    恢复默认禅乐
                  </button>
                )}
              </div>

              {/* Upload custom decrypted audio */}
              <input
                type="file"
                ref={fileInputRef}
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-1.5 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-300 hover:text-amber-200 text-[11px] flex items-center justify-center space-x-1.5 transition-colors"
                title="可上传解密后的 MP3/WAV/M4A 格式音频文件"
              >
                <Upload className="w-3 h-3 text-amber-400" />
                <span className="truncate">
                  {customFileName ? `已加载: ${customFileName}` : '上传/切换本地音频文件 (MP3/WAV)'}
                </span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-stone-500 text-center">
            贯穿全程 · 八窟漫游与修缮不中断
          </div>
        </div>
      )}

      {/* Floating Compact Capsule Pill */}
      <div
        className="group flex items-center space-x-2.5 bg-stone-900/95 hover:bg-stone-850 border border-amber-700/80 hover:border-amber-500 rounded-full pl-3 pr-2.5 py-1.5 shadow-2xl backdrop-blur-md transition-all duration-200"
      >
        {/* Animated Equalizer Visualizer or Muted Indicator (Click expands panel) */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-6 h-6 rounded-full bg-amber-950/80 border border-amber-600/70 flex items-center justify-center text-amber-400 flex-shrink-0 cursor-pointer hover:scale-110 transition-transform"
          title="点击展开音频设置面板"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-stone-500" />
          ) : isPlaying ? (
            <div className="flex items-end space-x-0.5 h-3">
              <span className="w-0.5 bg-amber-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-2.5" />
              <span className="w-0.5 bg-amber-300 rounded-full animate-[pulse_1.1s_ease-in-out_infinite_0.2s] h-3.5" />
              <span className="w-0.5 bg-yellow-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.4s] h-2" />
            </div>
          ) : (
            <Music className="w-3 h-3 text-amber-400" />
          )}
        </div>

        {/* Text Snippet (Click expands panel) */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-col cursor-pointer"
          title="点击展开音频设置面板"
        >
          <div className="flex items-center space-x-1.5">
            <span className="text-[11px] font-bold text-amber-200 tracking-wide">
              {isMuted ? '通道已关' : isPlaying ? '梵音缭绕' : '音乐已暂停'}
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950/80 text-amber-400/90 border border-amber-800/40">
              贯穿全程
            </span>
          </div>
          <span className="text-[9px] text-stone-400 truncate max-w-[85px] leading-tight">
            {isMuted ? '已静音' : trackTitle}
          </span>
        </div>

        {/* Dedicated Selectable Pause / Play Key (可以选择的暂停键) */}
        <button
          onClick={handleTogglePlayPause}
          className={`px-2 py-1 rounded-full flex items-center space-x-1 text-[11px] font-bold transition-all shadow ${
            isPlaying && !isMuted
              ? 'bg-amber-950/90 hover:bg-amber-900 border border-amber-600 text-amber-200'
              : 'bg-amber-600/90 hover:bg-amber-500 text-stone-950 border border-amber-300'
          }`}
          title={isPlaying ? '暂停背景禅乐' : '恢复播放背景禅乐'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3 h-3 text-amber-400 fill-current" />
              <span>暂停</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 text-stone-950 fill-current" />
              <span>播放</span>
            </>
          )}
        </button>

        {/* Quick Channel Off / Mute Button (设置供选择的关闭通道) */}
        <button
          onClick={handleToggleChannelMute}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shadow ${
            isMuted
              ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
              : 'bg-stone-800 text-stone-400 hover:text-amber-300 border border-stone-700'
          }`}
          title={isMuted ? '开启声音通道' : '关闭音乐通道(静音)'}
        >
          {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
        </button>

        {/* Expand Drawer Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-stone-500 hover:text-amber-300 transition-colors p-0.5"
          title={isExpanded ? '收起面板' : '展开调音面板'}
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
