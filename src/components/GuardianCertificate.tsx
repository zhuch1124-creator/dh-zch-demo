import React, { useRef, useState, useEffect } from 'react';
import {
  Award,
  Sparkles,
  Download,
  Share2,
  RotateCcw,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Gift
} from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface GuardianCertificateProps {
  score: number;
  onRestartJourney: () => void;
}

export const GuardianCertificate: React.FC<GuardianCertificateProps> = ({
  score,
  onRestartJourney
}) => {
  const [guardianName, setGuardianName] = useState('莫高修行者');
  const [exchangeCode, setExchangeCode] = useState('DH-MOGAO-8891');
  const [issueDate, setIssueDate] = useState('');
  const certCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    soundManager.playAwakeningFanfare();
    const d = new Date();
    setIssueDate(`${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`);
    const randCode = `DH-${Math.floor(1000 + Math.random() * 9000)}-MGX`;
    setExchangeCode(randCode);
  }, []);

  // Download Certificate as PNG image using Canvas
  const handleDownloadCertificate = () => {
    soundManager.playCorrectChime();
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient parchment
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#2B1B17');
    bgGrad.addColorStop(0.5, '#3E2723');
    bgGrad.addColorStop(1, '#1A120B');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Double Border
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 12;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, 1104, 704);

    // Title
    ctx.fillStyle = '#FEF3C7';
    ctx.font = 'bold 44px serif';
    ctx.textAlign = 'center';
    ctx.fillText('敦 煌 文 化 守 护 者', 600, 150);

    ctx.font = '22px serif';
    ctx.fillStyle = '#FBBF24';
    ctx.fillText('DUNHUANG CULTURAL RESTORATION GUARDIAN', 600, 190);

    // Body text
    ctx.font = 'bold 36px serif';
    ctx.fillStyle = '#FDE68A';
    ctx.fillText(`兹证明：${guardianName}`, 600, 290);

    ctx.font = '20px serif';
    ctx.fillStyle = '#E5E7EB';
    const lines = [
      '在《敦煌重光：修缮守护者之旅》数字化沉浸式探索中，',
      '手持烛火巡礼八大洞窟，悉心寻齐澄泥地仗、胶矾水、矿物石青与狼毫古法材料，',
      '成功以盛唐技法修葺散花飞天壁画，并在敦煌学知识考核中取得优异成绩。',
      '特颁此证，以表彰其对敦煌石窟艺术数字化活态传承之卓绝贡献！'
    ];
    lines.forEach((line, i) => {
      ctx.fillText(line, 600, 370 + i * 40);
    });

    // Verification info
    ctx.font = '18px serif';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(`考核成绩: ${score} / 10 题`, 350, 580);
    ctx.fillText(`认证编号: ${exchangeCode}`, 350, 615);
    ctx.fillText(`颁发日期: ${issueDate}`, 350, 650);

    // Traditional Vermilion Seal (莫高窟修缮之印)
    ctx.save();
    ctx.translate(850, 610);
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 6;
    ctx.strokeRect(-50, -50, 100, 100);
    ctx.fillStyle = '#DC2626';
    ctx.font = 'bold 22px serif';
    ctx.fillText('莫高窟', 0, -10);
    ctx.fillText('重光印', 0, 25);
    ctx.restore();

    // Trigger download
    const link = document.createElement('a');
    link.download = `敦煌文化守护者_${guardianName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="relative w-full h-screen overflow-y-auto select-none bg-stone-950 font-serif flex flex-col justify-between p-6">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2B1B17] via-[#1A120B] to-[#0D0907] pointer-events-none opacity-95" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-900/60 border border-yellow-400 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            <ShieldCheck className="w-7 h-7 text-yellow-300" />
          </div>
          <div>
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700">
              结 算 荣 誉 殿 堂
            </span>
            <h2 className="text-2xl font-black text-amber-100 tracking-wider mt-0.5">
              敦煌重光 · 守护者认证与礼品兑换
            </h2>
          </div>
        </div>

        <button
          onClick={onRestartJourney}
          className="px-4 py-2 rounded-xl bg-stone-900 border border-amber-800 text-amber-200 text-xs flex items-center space-x-2 hover:bg-stone-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>重温莫高之旅</span>
        </button>
      </div>

      {/* Main Certificate Display Area */}
      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto py-6">
        <div className="relative rounded-3xl p-8 bg-gradient-to-b from-[#3E2723] via-[#2B1B17] to-[#1A120B] border-4 border-amber-600 shadow-2xl space-y-6">
          {/* Inner Golden Border */}
          <div className="absolute inset-3 border-2 border-dashed border-amber-400/50 rounded-2xl pointer-events-none" />

          {/* Certificate Header Banner */}
          <div className="relative text-center space-y-2">
            <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-amber-500/20 border border-yellow-400/60 text-yellow-300 text-xs font-bold tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>莫 高 窟 数 字 典 藏 荣 誉 认 证</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-4xl font-black text-amber-100 tracking-[0.2em] drop-shadow-lg">
              敦 煌 文 化 守 护 者
            </h1>
            <p className="text-xs text-amber-300/80 tracking-widest font-mono">
              DUNHUANG CULTURAL RESTORATION GUARDIAN MEDAL
            </p>
          </div>

          {/* Guardian Name Customizer */}
          <div className="relative max-w-sm mx-auto flex items-center bg-stone-950/80 border border-amber-700/80 rounded-xl px-3 py-1.5 shadow-inner">
            <span className="text-xs text-amber-400 font-bold mr-2 whitespace-nowrap">
              守护者尊名:
            </span>
            <input
              type="text"
              value={guardianName}
              onChange={(e) => setGuardianName(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-yellow-200 focus:outline-none"
              placeholder="请输入您的名字"
              maxLength={12}
            />
          </div>

          {/* Certificate Citation & Achievement Badges */}
          <div className="relative text-center space-y-4 max-w-2xl mx-auto text-xs text-amber-100/90 leading-relaxed">
            <p>
              善哉！修缮守护者 <strong className="text-yellow-300 text-sm">{guardianName}</strong>：
            </p>
            <p className="opacity-90">
              你已圆满遍历莫高窟第 257、285、420、220、45、103、320、156 窟，
              集齐【澄泥地仗坯】、【胶矾水】、【石青颜料】与【狼毫画笔】四大古法材料，
              成功亲手绘制盛唐散花飞天壁画，并在文化问答中荣获{' '}
              <strong className="text-yellow-300 font-mono text-base">{score} / 10</strong> 满堂嘉誉！
            </p>

            {/* 4 Accomplishment Medals */}
            <div className="grid grid-cols-4 gap-3 pt-2">
              {[
                { title: '烛火破晓', desc: '点亮幽暗长廊', icon: '🕯️' },
                { title: '八窟巡礼', desc: '360° 全景沉浸', icon: '🏛️' },
                { title: '古法重光', desc: '飞天壁画活态', icon: '🪶' },
                { title: '博古通今', desc: '十题通关问答', icon: '📜' }
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className="bg-stone-950/70 border border-amber-800/80 rounded-2xl p-2.5 text-center space-y-1 shadow"
                >
                  <div className="text-2xl">{badge.icon}</div>
                  <div className="font-bold text-amber-200 text-xs">{badge.title}</div>
                  <div className="text-[10px] text-stone-400">{badge.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Offline Museum Souvenir Redemption QR Code & Verification Block */}
          <div className="relative grid grid-cols-2 gap-4 pt-4 border-t border-amber-800/50">
            {/* Left: Offline Redemption Code */}
            <div className="bg-stone-950/80 border border-amber-700/60 rounded-2xl p-4 flex items-center space-x-4">
              <div className="w-14 h-14 rounded-xl bg-amber-950 flex items-center justify-center border border-amber-500/50 flex-shrink-0">
                <Gift className="w-7 h-7 text-yellow-300" />
              </div>
              <div className="text-left space-y-1">
                <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>线下纪念品兑换特权</span>
                </div>
                <div className="text-xs text-stone-300">凭核销码可至莫高窟文创馆兑换文创明信片</div>
                <div className="font-mono text-base font-black text-yellow-300 tracking-wider">
                  {exchangeCode}
                </div>
              </div>
            </div>

            {/* Right: Simulated QR Code & Seal */}
            <div className="bg-stone-950/80 border border-amber-700/60 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Visual SVG QR Code */}
                <div className="w-16 h-16 bg-white p-1.5 rounded-lg flex items-center justify-center shadow">
                  <svg className="w-full h-full text-stone-950" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2,2H10V10H2V2M4,4V8H8V4H4M2,14H10V22H2V14M4,16V20H8V16H4M14,2H22V10H14V2M16,4V8H20V4H16M14,14H16V16H14V14M18,14H20V16H18V14M20,16H22V18H20V16M14,18H16V20H14V18M16,16H18V18H16V16M18,18H20V20H18V18M20,20H22V22H20V20M14,20H16V22H14V20M16,20H18V22H16V20" />
                  </svg>
                </div>
                <div className="text-left text-xs text-stone-300 space-y-0.5">
                  <div className="font-bold text-amber-200">数字防伪印信</div>
                  <div className="text-[11px] text-stone-400">核验时间：{issueDate}</div>
                  <div className="text-[11px] text-emerald-400">状态：已生效 (有效期限永久)</div>
                </div>
              </div>

              {/* Red Vermilion Dunhuang Seal */}
              <div className="w-16 h-16 rounded border-2 border-red-600 bg-red-950/40 flex flex-col items-center justify-center text-red-500 font-bold text-[11px] tracking-widest shadow-inner transform rotate-3">
                <span>莫高窟</span>
                <span>重光印</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Download & Restart */}
          <div className="relative flex items-center justify-center space-x-4 pt-2">
            <button
              onClick={handleDownloadCertificate}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-black text-xs tracking-wider shadow-xl shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
            >
              <Download className="w-4 h-4 text-stone-950" />
              <span>保存守护者高清证书至本地</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center text-[11px] text-stone-500">
        敦煌研究院数字敦煌 · 弘扬莫高精神 · 守护千年瑰宝
      </div>
    </div>
  );
};
