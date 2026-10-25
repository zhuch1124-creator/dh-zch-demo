import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Info,
  Package,
  RotateCcw,
  Eye,
  Maximize2,
  Play,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { CaveData, Hotspot, TreasureItem } from '../types/dunhuang';
import { generateCavePanoramaCanvas } from '../services/proceduralMurals';
import { soundManager } from '../services/soundEffects';

interface Cave360ViewerProps {
  cave: CaveData;
  isTreasureCollected: boolean;
  onCollectTreasure: (item: TreasureItem) => void;
  onBackToSelector: () => void;
  onGoToWorkshop: () => void;
  allTreasuresCollected: boolean;
}

export const Cave360Viewer: React.FC<Cave360ViewerProps> = ({
  cave,
  isTreasureCollected,
  onCollectTreasure,
  onBackToSelector,
  onGoToWorkshop,
  allTreasuresCollected
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // UI state
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isFlyingDanceOpen, setIsFlyingDanceOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(true);
  const [treasureDiscovered, setTreasureDiscovered] = useState(isTreasureCollected);
  const [showTreasureModal, setShowTreasureModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // References to Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const hotspotMeshesRef = useRef<THREE.Mesh[]>([]);
  const chestMeshRef = useRef<THREE.Group | null>(null);

  // Camera angles
  const isUserInteracting = useRef(false);
  const lon = useRef(0);
  const lat = useRef(0);
  const targetLon = useRef(0);
  const targetLat = useRef(0);
  const onPointerDownPointerX = useRef(0);
  const onPointerDownPointerY = useRef(0);
  const onPointerDownLon = useRef(0);
  const onPointerDownLat = useRef(0);

  // Voice narration trigger
  const handleToggleVoice = useCallback(() => {
    if (isSpeaking) {
      soundManager.stopSpeaking();
      setIsSpeaking(false);
    } else {
      soundManager.speakText(cave.audioIntroText);
      setIsSpeaking(true);
    }
  }, [cave.audioIntroText, isSpeaking]);

  // Read voice once upon entry if user opens intro
  useEffect(() => {
    soundManager.playTempleBell();
    const timer = setTimeout(() => {
      soundManager.speakText(cave.audioIntroText);
      setIsSpeaking(true);
    }, 600);

    return () => {
      clearTimeout(timer);
      soundManager.stopSpeaking();
    };
  }, [cave]);

  // Three.js 360° Panoramic Sphere Setup
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Software WebGL detection
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(72, width / height, 0.1, 1100);
    const cameraTarget = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 2. Generate Procedural 360° Cave Canvas Texture
    const panoCanvas = generateCavePanoramaCanvas(cave.id);
    const panoTexture = new THREE.CanvasTexture(panoCanvas);
    panoTexture.colorSpace = THREE.SRGBColorSpace;
    panoTexture.mapping = THREE.EquirectangularReflectionMapping;
    panoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Inverted 360 Sphere
    const sphereGeo = new THREE.SphereGeometry(500, 60, 40);
    sphereGeo.scale(-1, 1, 1); // Turn face inward
    const sphereMat = new THREE.MeshBasicMaterial({
      map: panoTexture
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
    sphereMeshRef.current = sphereMesh;

    // 3. Ambient and Point Lights for warm candle cave mood
    const ambientLight = new THREE.AmbientLight(0xffecd2, 0.85);
    scene.add(ambientLight);

    const warmPoint = new THREE.PointLight(0xf59e0b, 1.2, 800);
    warmPoint.position.set(0, -50, 0);
    scene.add(warmPoint);

    // 4. Hotspots (Raycasting Interactive Markers)
    const hotspotsGroup = new THREE.Group();
    scene.add(hotspotsGroup);
    hotspotMeshesRef.current = [];

    cave.hotspots.forEach((spot) => {
      // Hotspot pin group
      const pinGroup = new THREE.Group();
      const [px, py, pz] = spot.position;
      const v = new THREE.Vector3(px, py, pz).normalize().multiplyScalar(440);
      pinGroup.position.copy(v);
      pinGroup.lookAt(0, 0, 0);

      // Glowing ring
      const ringGeo = new THREE.RingGeometry(10, 15, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: spot.isFlyingApsarasSpecial ? 0x38bdf8 : 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      pinGroup.add(ringMesh);

      // Inner pulsating bead
      const beadGeo = new THREE.SphereGeometry(6, 16, 16);
      const beadMat = new THREE.MeshBasicMaterial({
        color: spot.isFlyingApsarasSpecial ? 0xf0fdf4 : 0xfffbeb
      });
      const beadMesh = new THREE.Mesh(beadGeo, beadMat);
      beadMesh.userData = { hotspotData: spot };
      pinGroup.add(beadMesh);

      hotspotsGroup.add(pinGroup);
      hotspotMeshesRef.current.push(beadMesh);
    });

    // 5. Hidden Treasure Chest if this cave has a treasure and not yet collected
    let chestGroup: THREE.Group | null = null;
    if (cave.treasure && !isTreasureCollected) {
      chestGroup = new THREE.Group();
      // Position hidden near a lower corner of the cave
      const chestPos = new THREE.Vector3(0.68, -0.45, 0.45).normalize().multiplyScalar(420);
      chestGroup.position.copy(chestPos);
      chestGroup.lookAt(0, 0, 0);

      // Procedural 3D Treasure Chest (Base, Lid, Brass bands, Lock)
      const baseGeo = new THREE.BoxGeometry(26, 16, 18);
      const woodMat = new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.7,
        metalness: 0.1
      });
      const chestBase = new THREE.Mesh(baseGeo, woodMat);
      chestGroup.add(chestBase);

      // Curved Lid
      const lidGeo = new THREE.CylinderGeometry(9, 9, 26, 16, 1, false, 0, Math.PI);
      lidGeo.rotateZ(Math.PI / 2);
      const lidMat = new THREE.MeshStandardMaterial({
        color: 0x92400e,
        roughness: 0.6,
        metalness: 0.2
      });
      const chestLid = new THREE.Mesh(lidGeo, lidMat);
      chestLid.position.y = 8;
      chestGroup.add(chestLid);

      // Glowing Gold Lock
      const lockGeo = new THREE.SphereGeometry(4, 16, 16);
      const lockMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24
      });
      const lockMesh = new THREE.Mesh(lockGeo, lockMat);
      lockMesh.position.set(0, 4, 10);
      chestGroup.add(lockMesh);

      // Golden Aura Halo
      const auraGeo = new THREE.RingGeometry(18, 26, 32);
      const auraMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const auraMesh = new THREE.Mesh(auraGeo, auraMat);
      auraMesh.position.z = -1;
      chestGroup.add(auraMesh);

      chestGroup.userData = { isChest: true, treasureData: cave.treasure };
      scene.add(chestGroup);
      chestMeshRef.current = chestGroup;
    }

    // 6. Raycasting for Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check Hotspots
      const hotspotHits = raycaster.intersectObjects(hotspotMeshesRef.current);
      if (hotspotHits.length > 0) {
        const hitData = hotspotHits[0].object.userData.hotspotData as Hotspot;
        soundManager.playGuqinPluck(3);
        if (hitData.isFlyingApsarasSpecial) {
          setIsFlyingDanceOpen(true);
        } else {
          setActiveHotspot(hitData);
        }
        return;
      }

      // Check Treasure Chest
      if (chestGroup) {
        const chestHits = raycaster.intersectObjects(chestGroup.children);
        if (chestHits.length > 0) {
          soundManager.playTreasureUnlock();
          setTreasureDiscovered(true);
          setShowTreasureModal(true);
          if (cave.treasure) {
            onCollectTreasure(cave.treasure);
          }
          // Remove chest from scene
          scene.remove(chestGroup);
        }
      }
    };

    renderer.domElement.addEventListener('click', onPointerClick);

    // 7. Mouse/Touch Pan and Orbit Controls
    const onPointerDown = (e: PointerEvent) => {
      isUserInteracting.current = true;
      onPointerDownPointerX.current = e.clientX;
      onPointerDownPointerY.current = e.clientY;
      onPointerDownLon.current = lon.current;
      onPointerDownLat.current = lat.current;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (isUserInteracting.current) {
        targetLon.current = (onPointerDownPointerX.current - e.clientX) * 0.15 + onPointerDownLon.current;
        targetLat.current = (e.clientY - onPointerDownPointerY.current) * 0.15 + onPointerDownLat.current;
      }
    };

    const onPointerUp = () => {
      isUserInteracting.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Resize handler
    const onResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 8. Animation & Render Loop
    let animId: number;
    let clockTime = 0;

    const animate = () => {
      clockTime += 0.02;

      // Smooth damping interpolation for camera angles
      lat.current += (targetLat.current - lat.current) * 0.1;
      lon.current += (targetLon.current - lon.current) * 0.1;

      // Constrain latitude so camera doesn't flip at poles
      lat.current = Math.max(-85, Math.min(85, lat.current));

      const phi = THREE.MathUtils.degToRad(90 - lat.current);
      const theta = THREE.MathUtils.degToRad(lon.current);

      cameraTarget.x = 500 * Math.sin(phi) * Math.cos(theta);
      cameraTarget.y = 500 * Math.cos(phi);
      cameraTarget.z = 500 * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(cameraTarget);

      // Gentle floating animation for chest if present
      if (chestGroup) {
        chestGroup.rotation.y += 0.015;
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('click', onPointerClick);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      sphereGeo.dispose();
      sphereMat.dispose();
      panoTexture.dispose();
      renderer.dispose();
    };
  }, [cave, isTreasureCollected, onCollectTreasure]);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-stone-950 font-serif">
      {/* 360 Three.js WebGL Container */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top Header Overlay HUD */}
      <div className="absolute top-6 left-8 z-20 flex items-center space-x-4 pointer-events-auto">
        <button
          onClick={onBackToSelector}
          className="px-4 py-2 rounded-xl bg-stone-900/85 hover:bg-stone-800 text-amber-200 border border-amber-800/80 shadow-lg text-xs flex items-center space-x-2 transition-all hover:border-amber-400"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>返回全景选单</span>
        </button>

        <div className="bg-stone-900/85 border border-amber-700/60 rounded-xl px-4 py-2 shadow-lg backdrop-blur-md">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-600/30 text-amber-300 font-sans">
              {cave.dynasty}
            </span>
            <h2 className="text-sm font-black text-amber-100 tracking-wider">
              {cave.name}
            </h2>
          </div>
        </div>

        <button
          onClick={handleToggleVoice}
          className={`px-3 py-2 rounded-xl border text-xs flex items-center space-x-1.5 shadow-lg transition-all ${
            isSpeaking
              ? 'bg-amber-600/80 text-stone-950 border-amber-300 font-bold'
              : 'bg-stone-900/85 text-amber-300 border-amber-800/80 hover:bg-stone-800'
          }`}
          title="播放/暂停洞窟语音导览"
        >
          {isSpeaking ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{isSpeaking ? '语音导览中' : '播放讲解'}</span>
        </button>
      </div>

      {/* Top Right: Treasure Status & Direct Link to Workshop */}
      <div className="absolute top-6 right-8 z-20 flex items-center space-x-3 pointer-events-auto">
        {cave.treasure && (
          <div
            className={`px-4 py-2 rounded-xl border shadow-lg backdrop-blur-md text-xs flex items-center space-x-2 ${
              treasureDiscovered
                ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-200'
                : 'bg-amber-950/80 border-amber-500/70 text-amber-200 animate-pulse'
            }`}
          >
            <Package className="w-4 h-4 text-amber-400" />
            <span>
              {treasureDiscovered
                ? `本窟密藏已寻得：${cave.treasure.name}`
                : `此窟藏有【${cave.treasure.name}】，环顾岩隙寻找微光宝箱！`}
            </span>
          </div>
        )}

        {allTreasuresCollected && (
          <button
            onClick={onGoToWorkshop}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black text-xs tracking-wider flex items-center space-x-1.5 shadow-lg shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>前往古法绘制</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Floating Exploration Hint Banner */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
        <div className="bg-stone-950/80 border border-amber-700/50 rounded-full px-5 py-2 shadow-2xl backdrop-blur-sm flex items-center space-x-3 text-xs text-amber-200">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>拖拽鼠标/滑动屏幕可 360° 旋转全景 · 点击金色光环放大鉴赏壁画细节</span>
        </div>
      </div>

      {/* Cave Audio Overview Sheet (Opens on first entry, dismissible) */}
      {isIntroOpen && (
        <div className="absolute inset-x-0 bottom-16 max-w-xl mx-auto z-30 pointer-events-auto animate-fade-in">
          <div className="bg-stone-950/95 border border-amber-600/70 rounded-2xl p-5 shadow-2xl backdrop-blur-lg">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center space-x-2">
                <span className="text-amber-400 font-bold text-sm">🏛️ 洞窟总览导览</span>
                <span className="text-xs text-stone-400">{cave.dynasty}</span>
              </div>
              <button
                onClick={() => setIsIntroOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-3 text-xs text-amber-100/90 leading-relaxed">
              {cave.audioIntroText}
            </p>
            <div className="mt-4 flex items-center justify-between pt-2">
              <span className="text-[11px] text-amber-400/80">
                主壁画题材：{cave.muralTheme}
              </span>
              <button
                onClick={() => setIsIntroOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs tracking-wider"
              >
                开始 360° 漫游
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hotspot Cultural Detail Modal */}
      {activeHotspot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 backdrop-blur-sm p-4">
          <div className="max-w-lg w-full bg-stone-900 border border-amber-600 rounded-2xl p-6 shadow-2xl space-y-4 animate-scale-up font-serif">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                  {activeHotspot.subtitle}
                </span>
                <h3 className="text-xl font-black text-amber-100 mt-1 tracking-wide">
                  {activeHotspot.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-amber-200 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Authentic Photograph Artifact if available */}
            {activeHotspot.realPhotoUrl && (
              <div className="relative rounded-xl overflow-hidden border border-amber-600/70 shadow-lg max-h-56">
                <img
                  src={activeHotspot.realPhotoUrl}
                  alt={activeHotspot.title}
                  className="w-full h-full object-cover object-center filter saturate-105"
                />
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-stone-950/80 text-[10px] text-amber-300 font-sans border border-amber-800/80">
                  莫高窟真迹影像实拍
                </div>
              </div>
            )}

            <p className="text-sm text-stone-300 leading-relaxed">
              {activeHotspot.description}
            </p>

            <div className="bg-amber-950/40 border border-amber-700/40 rounded-xl p-3 text-xs text-amber-200 space-y-1">
              <div className="font-bold flex items-center space-x-1.5 text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>敦煌学深度释义</span>
              </div>
              <p className="leading-relaxed opacity-90">
                {activeHotspot.culturalInsight}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveHotspot(null)}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs"
              >
                关闭鉴赏
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Special Cave 320 "香音神飞天" Living Dance & Modern Heritage Modal */}
      {isFlyingDanceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-md p-4">
          <div className="max-w-2xl w-full bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950 border border-sky-400/80 rounded-3xl p-7 shadow-2xl space-y-5 animate-scale-up font-serif">
            <div className="flex items-start justify-between border-b border-sky-500/30 pb-3">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-900/60 text-sky-300 border border-sky-500/50">
                  第320窟专属 · 活态传承
                </span>
                <h3 className="text-2xl font-black text-sky-100 mt-1 tracking-wider flex items-center space-x-2">
                  <span>盛唐双飞天 · 香音神流光舞动</span>
                  <Sparkles className="w-5 h-5 text-sky-400 animate-spin-slow" />
                </h3>
              </div>
              <button
                onClick={() => setIsFlyingDanceOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-sky-200 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Animated Dunhuang Dance Video Screen */}
            <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-sky-600/50 bg-stone-950 flex flex-col items-center justify-center shadow-inner">
              {/* Dynamic Celestial Ribbon Fluid Motion Canvas */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-slate-900 to-amber-950 opacity-90" />

              {/* Swirling celestial silk ribbon loops */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 240">
                <path
                  d="M50,120 C150,40 250,200 350,100 C450,20 520,180 580,120"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="6"
                  strokeDasharray="12 6"
                  className="animate-pulse"
                />
                <path
                  d="M30,150 C120,220 220,60 320,140 C420,210 500,70 570,140"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="5"
                  className="animate-pulse"
                />
              </svg>

              {/* Dancing Silhouette & Shower of Flowers */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-sky-500/20 border-2 border-sky-300 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.7)] animate-bounce">
                  <Sparkles className="w-8 h-8 text-sky-200" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-amber-200 tracking-widest">
                    《丝路花雨》与香音神舞蹈密码
                  </h4>
                  <p className="text-xs text-sky-200/80 mt-1">
                    “反弹琵琶迎佛诞，天女散花满袖香”
                  </p>
                </div>
              </div>
            </div>

            {/* Cultural Analysis & Lineage Breakdown */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-stone-950/70 border border-sky-900/60 rounded-xl p-3 space-y-1">
                <span className="font-bold text-sky-300">1. 香音神源起</span>
                <p className="text-stone-300 leading-relaxed">
                  飞天梵文名健达缚（Gandharva）与紧那罗（Kinnara），在天宫不食五谷，唯嗅香气与奏乐，是敦煌石窟中永不落幕的乐舞之魂。
                </p>
              </div>
              <div className="bg-stone-950/70 border border-amber-900/60 rounded-xl p-3 space-y-1">
                <span className="font-bold text-amber-300">2. 现代敦煌舞体系</span>
                <p className="text-stone-300 leading-relaxed">
                  20世纪70年代，高金荣教授等学者深入第320窟与第112窟，从壁画中提炼“反弹、推指、回巾、S身韵”等动作，开创了闻名海内外的中国敦煌舞流派。
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setIsFlyingDanceOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-stone-950 font-black text-xs tracking-wider shadow-lg"
              >
                领悟香音神奥秘 · 继续探秘
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Treasure Chest Discovered Modal */}
      {showTreasureModal && cave.treasure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-md p-4">
          <div className="max-w-md w-full bg-gradient-to-b from-stone-900 via-stone-900 to-amber-950 border-2 border-yellow-400 rounded-3xl p-6 shadow-2xl text-center space-y-4 animate-scale-up font-serif">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-900/70 border-2 border-yellow-300 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.8)] animate-bounce text-4xl">
              {cave.treasure.icon}
            </div>

            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-600/30 text-amber-300 border border-amber-500 font-sans">
                寻宝成功 · 壁画修缮材料
              </span>
              <h3 className="text-2xl font-black text-yellow-200 mt-1 tracking-widest">
                寻得【{cave.treasure.name}】
              </h3>
              <p className="text-xs text-amber-200/70 font-mono mt-0.5">
                {cave.treasure.pinyin} · {cave.treasure.english}
              </p>
            </div>

            <div className="bg-stone-950/70 border border-amber-800/60 rounded-xl p-3 text-xs text-stone-300 text-left leading-relaxed">
              <p className="mb-2 text-amber-200 font-semibold">{cave.treasure.description}</p>
              <div className="p-2 rounded bg-amber-950/60 border border-amber-700/50 text-amber-300 text-[11px] font-bold">
                🎯 {cave.treasure.craftRole}
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowTreasureModal(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-700/60 hover:bg-amber-700 text-amber-100 text-xs font-bold"
              >
                收纳至修缮行囊
              </button>
              {allTreasuresCollected && (
                <button
                  onClick={onGoToWorkshop}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-black text-xs shadow-lg hover:scale-105 transition-transform flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>材料齐全 · 立即绘制</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
