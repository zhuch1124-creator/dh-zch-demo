import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen
} from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion } from '../types/dunhuang';
import { soundManager } from '../services/soundEffects';

interface KnowledgeQuizProps {
  onPassQuiz: (score: number) => void;
  onBackToSelector: () => void;
}

export const KnowledgeQuiz: React.FC<KnowledgeQuizProps> = ({
  onPassQuiz,
  onBackToSelector
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIndex];
  const total = QUIZ_QUESTIONS.length;

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    soundManager.playGuqinPluck(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctIndex;

    if (isCorrect) {
      soundManager.playCorrectChime();
    } else {
      soundManager.playWrongChime();
    }

    const updated = [...userAnswers, selectedOption];
    setUserAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Calculate score
      const finalScore = userAnswers.reduce((acc, ans, i) => {
        return ans === QUIZ_QUESTIONS[i].correctIndex ? acc + 1 : acc;
      }, 0);

      setIsFinished(true);
      if (finalScore >= 8) {
        soundManager.playAwakeningFanfare();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      } else {
        soundManager.playTempleBell();
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers([]);
    setIsFinished(false);
  };

  // Score calculation
  const score = userAnswers.reduce((acc, ans, i) => {
    return ans === QUIZ_QUESTIONS[i].correctIndex ? acc + 1 : acc;
  }, 0);
  const isPassed = score >= 8;

  return (
    <div className="relative w-full h-screen overflow-y-auto select-none bg-stone-950 font-serif flex flex-col justify-between p-6">
      {/* Background Mogao Mural Pattern */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#2B1B17] via-[#1E140E] to-[#120B08] pointer-events-none opacity-90" />
      <div className="fixed inset-0 bg-[radial-gradient(#D97706_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBackToSelector}
            className="px-3.5 py-1.5 rounded-xl bg-stone-900 border border-amber-800 text-amber-200 text-xs flex items-center space-x-1.5 hover:bg-stone-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>返回洞窟选单</span>
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                敦煌学进阶考验
              </span>
              <span className="text-xs text-amber-400/80">满分 10 题 · 答对 8 题通关认证</span>
            </div>
            <h2 className="text-2xl font-black text-amber-100 tracking-wide mt-0.5">
              敦煌重光 · 守护者知识问答
            </h2>
          </div>
        </div>

        {/* Progress Pill */}
        <div className="bg-stone-900/80 border border-amber-800/80 rounded-xl px-4 py-2 flex items-center space-x-3">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-200">
            进度: <span className="font-mono font-bold text-amber-400">{currentIndex + 1}</span> / {total}
          </span>
          <span className="text-xs text-stone-400">|</span>
          <span className="text-xs text-amber-200">
            当前得分: <span className="font-mono font-bold text-yellow-300">{score}</span>
          </span>
        </div>
      </div>

      {/* Question Main Card */}
      <div className="relative z-10 max-w-3xl mx-auto w-full my-auto py-6">
        {!isFinished ? (
          <div className="bg-stone-900/90 border border-amber-700/70 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
            {/* Category tag & Question number */}
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <span className="text-xs px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-700 font-sans">
                {currentQ.category}
              </span>
              <span className="text-xs text-stone-400 font-mono">
                QUESTION {currentQ.id} OF 10
              </span>
            </div>

            {/* Question Text */}
            <h3 className="text-xl font-black text-amber-100 leading-relaxed tracking-wide">
              {currentQ.question}
            </h3>

            {/* 4 Multiple Choice Options */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQ.correctIndex;

                let btnStyle = 'bg-stone-950/70 border-stone-800 text-stone-200 hover:border-amber-600';
                if (isSelected && !isAnswerSubmitted) {
                  btnStyle = 'bg-amber-900/50 border-amber-400 text-amber-100 shadow-md';
                }
                if (isAnswerSubmitted) {
                  if (isCorrectOption) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrectOption) {
                    btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-stone-950/40 border-stone-800 text-stone-500';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${btnStyle}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-700 flex items-center justify-center font-mono text-xs text-amber-400 font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm font-medium">{opt}</span>
                    </div>

                    {isAnswerSubmitted && isCorrectOption && (
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation Box upon submission */}
            {isAnswerSubmitted && (
              <div className="bg-amber-950/50 border border-amber-700/60 rounded-2xl p-4 text-xs space-y-1.5 animate-fade-in">
                <div className="flex items-center space-x-2 text-amber-300 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>
                    {selectedOption === currentQ.correctIndex ? '回答正确！' : '解析释义：'}
                  </span>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex justify-end pt-2">
              {!isAnswerSubmitted ? (
                <button
                  disabled={selectedOption === null}
                  onClick={handleSubmitAnswer}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all ${
                    selectedOption !== null
                      ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg shadow-amber-500/30'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  确认提交
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-xs tracking-wider shadow-lg hover:scale-105 transition-transform flex items-center space-x-1.5"
                >
                  <span>{currentIndex < total - 1 ? '下一题' : '查看通关结果'}</span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Results Card */
          <div className="bg-stone-900/90 border border-amber-600 rounded-3xl p-8 shadow-2xl backdrop-blur-md text-center space-y-5 animate-scale-up">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-yellow-300 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.8)]">
              <Award className="w-10 h-10 text-yellow-300" />
            </div>

            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700">
                考核结果公布
              </span>
              <h3 className="text-3xl font-black text-amber-100 mt-2 tracking-wide">
                {isPassed ? '恭喜通关！荣获敦煌文化守护者认证' : '仍需精进 · 未能达成通关标准'}
              </h3>
              <p className="text-sm text-stone-300 mt-1">
                最终成绩：<span className="text-2xl font-black font-mono text-yellow-300">{score}</span> / 10 题
                （通关基准线：8 题）
              </p>
            </div>

            <p className="text-xs text-stone-400 max-w-lg mx-auto leading-relaxed">
              {isPassed
                ? '你已全面掌握莫高窟经典壁画本生故事、开窟历史年代、古法矿物颜料提取、香音神飞天与现代敦煌舞的活态传承！'
                : '莫高窟千年文脉博大精深，重温洞窟全景漫游后再次挑战，必定能够顺利通关。'}
            </p>

            <div className="flex items-center justify-center space-x-4 pt-3">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-bold transition-colors"
              >
                重新测试
              </button>

              {isPassed ? (
                <button
                  onClick={() => onPassQuiz(score)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 font-black text-xs tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>颁发“敦煌文化守护者”勋章与证书</span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </button>
              ) : (
                <button
                  onClick={onBackToSelector}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold"
                >
                  返回洞窟继续温习
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="relative z-10 text-center text-[11px] text-stone-500">
        莫高窟保护研究与数字化展示 · 传承千年丝路文明
      </div>
    </div>
  );
};
