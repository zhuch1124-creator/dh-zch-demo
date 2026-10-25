/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameStage, CaveData, CAVES_DATA, TreasureItem } from './types/dunhuang';
import { PrologueTorch } from './components/PrologueTorch';
import { IlluminationCinema } from './components/IlluminationCinema';
import { CaveSelector } from './components/CaveSelector';
import { Cave360Viewer } from './components/Cave360Viewer';
import { RestorationWorkshop } from './components/RestorationWorkshop';
import { KnowledgeQuiz } from './components/KnowledgeQuiz';
import { GuardianCertificate } from './components/GuardianCertificate';
import { BackpackDrawer } from './components/BackpackDrawer';
import { NavigationBar } from './components/NavigationBar';
import { AudioController } from './components/AudioController';
import { soundManager } from './services/soundEffects';

export default function App() {
  const [currentStage, setCurrentStage] = useState<GameStage>('prologue_torch');
  const [selectedCave, setSelectedCave] = useState<CaveData | null>(null);
  const [collectedTreasures, setCollectedTreasures] = useState<Record<string, boolean>>({
    ground_plaster: false,
    glue_alum: false,
    azurite_mineral: false,
    wolf_hair_brush: false
  });
  const [quizScore, setQuizScore] = useState<number>(10);
  const [isBackpackOpen, setIsBackpackOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(soundManager.getIsBgmPlaying());

  // Listen for audio manager updates and sync mute & play state
  useEffect(() => {
    const unsub = soundManager.subscribe(() => {
      setIsMuted(soundManager.getMuted());
      setIsBgmPlaying(soundManager.getIsBgmPlaying());
    });
    return () => unsub();
  }, []);

  // Guarantee BGM starts on user's first gesture anywhere in the app
  useEffect(() => {
    const handleFirstGesture = () => {
      soundManager.startBgm();
    };
    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const collectedCount = Object.values(collectedTreasures).filter(Boolean).length;
  const allTreasuresCollected = collectedCount >= 4;

  // Handlers
  const handleLightUpCorridor = () => {
    setCurrentStage('illumination_cinema');
  };

  const handleSelectCave = (cave: CaveData) => {
    setSelectedCave(cave);
    setCurrentStage('cave_exploration');
  };

  const handleCollectTreasure = (item: TreasureItem) => {
    setCollectedTreasures((prev) => ({
      ...prev,
      [item.id]: true
    }));
  };

  const handleGoToWorkshop = () => {
    setCurrentStage('restoration_workshop');
  };

  const handleCompleteWorkshop = () => {
    setCurrentStage('knowledge_quiz');
  };

  const handlePassQuiz = (score: number) => {
    setQuizScore(score);
    setCurrentStage('guardian_badge');
  };

  const handleRestartJourney = () => {
    setCurrentStage('prologue_torch');
    setSelectedCave(null);
    setCollectedTreasures({
      ground_plaster: false,
      glue_alum: false,
      azurite_mineral: false,
      wolf_hair_brush: false
    });
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMuted(next);
  };

  return (
    <div className="relative w-full h-screen bg-stone-950 text-stone-100 font-serif select-none overflow-hidden">
      {/* Top Floating Navigation Bar (shown when not in pure prologue or fullscreen immersion) */}
      {currentStage !== 'prologue_torch' && (
        <NavigationBar
          currentStage={currentStage}
          onNavigateStage={(stage) => {
            if (stage === 'cave_exploration' && !selectedCave) {
              setCurrentStage('cave_selector');
            } else {
              setCurrentStage(stage);
            }
          }}
          collectedCount={collectedCount}
          onToggleBackpack={() => setIsBackpackOpen(true)}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isBgmPlaying={isBgmPlaying}
          onTogglePlayBgm={() => soundManager.toggleBgm()}
        />
      )}

      {/* Main Flow Stages */}
      <main className="w-full h-full">
        {currentStage === 'prologue_torch' && (
          <PrologueTorch onLightUpCorridor={handleLightUpCorridor} />
        )}

        {currentStage === 'illumination_cinema' && (
          <IlluminationCinema
            onCompleteToSelector={() => setCurrentStage('cave_selector')}
            onBackToPrologue={() => setCurrentStage('prologue_torch')}
          />
        )}

        {currentStage === 'cave_selector' && (
          <CaveSelector
            collectedTreasures={collectedTreasures}
            onSelectCave={handleSelectCave}
            onGoToWorkshop={handleGoToWorkshop}
            onGoToQuiz={() => setCurrentStage('knowledge_quiz')}
          />
        )}

        {currentStage === 'cave_exploration' && selectedCave && (
          <Cave360Viewer
            cave={selectedCave}
            isTreasureCollected={
              selectedCave.treasure ? !!collectedTreasures[selectedCave.treasure.id] : false
            }
            onCollectTreasure={handleCollectTreasure}
            onBackToSelector={() => setCurrentStage('cave_selector')}
            onGoToWorkshop={handleGoToWorkshop}
            allTreasuresCollected={allTreasuresCollected}
          />
        )}

        {currentStage === 'restoration_workshop' && (
          <RestorationWorkshop
            onCompleteWorkshop={handleCompleteWorkshop}
            onBackToSelector={() => setCurrentStage('cave_selector')}
          />
        )}

        {currentStage === 'knowledge_quiz' && (
          <KnowledgeQuiz
            onPassQuiz={handlePassQuiz}
            onBackToSelector={() => setCurrentStage('cave_selector')}
          />
        )}

        {currentStage === 'guardian_badge' && (
          <GuardianCertificate
            score={quizScore}
            onRestartJourney={handleRestartJourney}
          />
        )}
      </main>

      {/* Global Persistent Audio Controller with Dedicated Turn-off Channel */}
      <AudioController onMuteToggle={(m) => setIsMuted(m)} />

      {/* Global Backpack Drawer for Inspecting Collected Ancient Materials */}
      <BackpackDrawer
        isOpen={isBackpackOpen}
        onClose={() => setIsBackpackOpen(false)}
        collectedTreasures={collectedTreasures}
        onGoToWorkshop={() => {
          setIsBackpackOpen(false);
          handleGoToWorkshop();
        }}
      />
    </div>
  );
}
