export interface ShotSpecification {
  id: string; // S01, S02, S03, S03B, S04, S05, S06, S07, S08
  numberLabel: string; // e.g. "01", "02", "03", "03B", "04", etc.
  title: string;
  subtitle: string;
  interactionHint: string;
  timeRange: [number, number]; // [startTimeInSec, endTimeInSec]
  realityRatio: string; // e.g. "洞窟现实感 70% · 壁画质感 30%"
  styleRule: string;
  motionConstraint: string;
  startFrameUrl: string;
  endFrameUrl: string;
  prompt: string;
  negativePrompt: string;
}

export interface TransitionCheck {
  fromId: string;
  toId: string;
  title: string;
  lightingTransition: string;
  motionTransition: string;
  colorLockCheck: string;
  seamlessCheck: string;
}

export interface SkinTonePreset {
  id: string;
  name: string;
  period: string;
  description: string;
  historicalContext: string;
  // Visual calibration values
  warmth: number; // -50 to +50
  leadOxidation: number; // 0 to 100 (antique lead white patina)
  ironWireContrast: number; // 0 to 100
  saturation: number; // 50 to 120
  cssFilter: string;
  colorSwatch: [string, string, string]; // 3 representative hex colors
}

export const GLOBAL_STYLE_PROMPT = 
  "Authentic Dunhuang Mogao Cave Buddhist fresco aesthetic, Tang and Northern Wei mineral pigment painting on weathered lime plaster, low-saturation earthy ochre, lapis lazuli azurite blue, malachite green, chalk ivory white, pine lamp soot black, natural antique wall crackles, restrained 2.5D planar floating movement, flat Chinese traditional gongbi line-art, iron-wire outlines, non-photorealistic skin, authentic lead-white oxidized fresco patina, 16:9, 24fps --ar 16:9 --style raw";

export const GLOBAL_NEGATIVE_PROMPT = 
  "neon colors, glowing sci-fi portals, magical laser bloom, modern anime face, high saturation, shiny 3D glossy CG, modern photorealistic Caucasian or Asian beauty skin, glossy lip gloss, synthetic makeup, photorealistic animal fur, cyberpunk, metallic glitter, electric lamps, western Disney cartoon style, sudden cuts, black frame cuts, jerky jittery camera";

export const ILLUMINATION_SHOTS: ShotSpecification[] = [
  {
    id: 'S01',
    numberLabel: '01',
    title: '幽窟启扉',
    subtitle: '推开尘封千年的榆木窟门，微弱暖光探向幽邃未知的古老石窟。',
    interactionHint: '沉浸凝视 步入佛窟',
    timeRange: [0.0, 4.5],
    realityRatio: '洞窟现实感 70% · 壁画质感 30%',
    styleRule: '暖光微弱，暗部保留石质细节与铜环质感，坚决不使用科幻高光。',
    motionConstraint: '镜头平稳匀速推入，首尾帧保持古木纹理与门环物理结构。',
    startFrameUrl: '/video_assets/shots/s01/01_start.png',
    endFrameUrl: '/video_assets/shots/s01/02_end.png',
    prompt: 'Cinematic camera tracking in, ancient Mogao Dunhuang weathered wooden double doors slowly creaking open into a dark mysterious cave interior, bronze lion knocker, subtle directional warm candlelight casting long shadows, 70% photorealistic cave stone realism, 30% ancient mural texture, low-saturation ochre, mineral pigments, 16:9, 24fps, film grain, photorealistic rendering --ar 16:9 --style raw',
    negativePrompt: 'neon colors, high saturation, gold bloom, fantasy magic particles, CGI glow, sci-fi lens flare, modern lighting, overexposed, deformed structure, sudden cuts'
  },
  {
    id: 'S02',
    numberLabel: '02',
    title: '微光照壁',
    subtitle: '摇曳的烛光扫过风蚀的石壁与立柱，千年矿物重彩在黑暗中悄然苏醒。',
    interactionHint: '移动光斑 探寻古壁',
    timeRange: [4.5, 9.0],
    realityRatio: '洞窟现实感 70% · 壁画质感 30%',
    styleRule: '暖光微弱，保留立柱古壁裂纹，纯手工矿物颜料原貌，暗部细节丰富。',
    motionConstraint: '沿回廊平缓前行，无黑屏切割，光斑平滑过渡。',
    startFrameUrl: '/video_assets/shots/s02/01_start.png',
    endFrameUrl: '/video_assets/shots/s02/02_end.png',
    prompt: 'Slow steady forward camera motion through a narrow dark Mogao cave corridor, ancient painted sandstone pillars and weathered wall murals faintly revealed by flickering warm candle light, deep shadows with rich texture details, 70% cave realism, low saturation red ochre, azurite blue, malachite green, ancient plaster crackles, no modern light fixtures, 16:9, 24fps --ar 16:9',
    negativePrompt: 'bright daylight, flashlights, high-tech illumination, electric lamps, oversaturated colors, smooth modern drywall, plastic gloss'
  },
  {
    id: 'S03',
    numberLabel: '03',
    title: '仰见天心',
    subtitle: '抬头，一枚古老的图案会转到中心。',
    interactionHint: '滚动探寻 靠近中心',
    timeRange: [9.0, 14.0],
    realityRatio: '洞窟现实感 70% · 壁画质感 30%',
    styleRule: '镜头平滑上仰至覆斗藻井，微光聚焦天顶，完成现实向二维的过渡准备。',
    motionConstraint: '镜头平稳上仰抬升，藻井中心平滑居中，速度恒定无突变。',
    startFrameUrl: '/video_assets/shots/s03/01_start.png',
    endFrameUrl: '/video_assets/shots/s03/02_end.png',
    prompt: 'Cinematic camera smoothly tilting upwards from dark cave floor toward the inverted pyramidal caisson ceiling (Zaojing) of Dunhuang Mogao Cave, warm spotlight focusing onto the central floral caisson motif, transition from 3D architectural interior to painted mural plane, authentic ancient pigment texture, subtle dust motes, 16:9, 24fps --ar 16:9',
    negativePrompt: 'rapid camera jerky movement, sci-fi portal effects, neon blue laser beams, modern ceiling fans, sterile lighting'
  },
  {
    id: 'S03B',
    numberLabel: '03B',
    title: '藻井初显',
    subtitle: '隋代第407窟三兔藻井铺展天幕，莲花重瓣如恒星般静穆运转。',
    interactionHint: '定睛凝望 乾坤初开',
    timeRange: [14.0, 19.0],
    realityRatio: '现实空间退场 · 壁画质感提升至 90%',
    styleRule: '现实空间退场，壁画质感提升到 90%；旋转来自纹样本身，不使用科幻光效。',
    motionConstraint: '纹样自身向心同心圆旋转，克制且平稳，不扭曲几何拓扑。',
    startFrameUrl: '/video_assets/shots/s04/01_start.png',
    endFrameUrl: '/video_assets/shots/s04/02_end.png',
    prompt: 'Frontal symmetrical view of Dunhuang Mogao Cave 407 caisson ceiling, Three Hares sharing three ears at the circular center surrounded by layered lotus petals, 90% ancient mural flatness, subtle 2.5D relief depth, natural crackles and mineral sediment textures, low saturation earthy vermilion, malachite green, aged white ground plaster, 16:9, 24fps --ar 16:9',
    negativePrompt: '3D cartoon CGI, western Disney rendering, photorealistic fur, synthetic gradients, shiny metallic gold, futuristic HUD'
  },
  {
    id: 'S04',
    numberLabel: '04',
    title: '三兔飞旋',
    subtitle: '三兔循环追逐，三耳相连而各具双耳；纹样随时间周而复始，生生不息。',
    interactionHint: '纹样流转 始于天道',
    timeRange: [19.0, 24.5],
    realityRatio: '壁画纯二维造型 · 保持古壁裂纹',
    styleRule: '旋转完全来自纹样几何本身，克制2.5D离墙，绝不变成写实3D动物或毛发。',
    motionConstraint: '三兔共耳几何中心绝对稳定，顺时针追逐旋转，莲瓣微幅呼吸律动。',
    startFrameUrl: '/video_assets/shots/s05/01_start.png',
    endFrameUrl: '/video_assets/shots/s05/02_end.png',
    prompt: 'Authentic Dunhuang mural animation of Three Hares caisson, three rabbits chasing each other in a perpetual circle sharing three ears, subtle restrained 2.5D planar movement, flat traditional Chinese painting style, mineral pigments on weathered plaster, layered lotus petals gently pulsing, natural antique color palette, no magic sparks, 16:9, 24fps --ar 16:9',
    negativePrompt: 'magical glowing lasers, sci-fi warp effects, modern cartoon animation, realistic 3D fur physics, neon glow'
  },
  {
    id: 'S05',
    numberLabel: '05',
    title: '纹样化转',
    subtitle: '天心流转，莲瓣化为波澜云浪；自天顶覆斗，平滑穿越进入壁画叙事长卷。',
    interactionHint: '穿梭时空 入画九色',
    timeRange: [24.5, 30.0],
    realityRatio: '完全进入壁画叙事 · 保持二维造型',
    styleRule: 'S05 以后不生成烛光、移动光斑或暗角；烛光照见效果留给后续程序交互叠加。',
    motionConstraint: '纹样自中心旋转扩散，自然融为横卷波纹水浪，无黑屏切割。',
    startFrameUrl: '/video_assets/shots/s06/01_start.png',
    endFrameUrl: '/video_assets/shots/s06/02_end.png',
    prompt: 'Vortex transition of ancient Dunhuang caisson decorative patterns gently swirling outward into stylized Chinese wave ripples and flowing cloud ribbons, preserving flat 2D mural line-art and mineral pigments, organic painterly transition into panoramic narrative wall mural space, no digital glitch, no candle vignette, 16:9, 24fps --ar 16:9',
    negativePrompt: 'digital matrix glitch, black hole CGI, hyperspace starfield, neon rave colors, sharp cuts, baked-in flashlight, high contrast vignette'
  },
  {
    id: 'S06',
    numberLabel: '06',
    title: '鹿王舍己',
    subtitle: '北魏第257窟，九色神鹿涉险救起溺水者，显化大乘舍己度人之至德。',
    interactionHint: '横卷铺展 见证慈悲',
    timeRange: [30.0, 35.5],
    realityRatio: '北魏横卷壁画 · 纯二维造型与秀骨清像',
    styleRule: '低饱和土红与石绿山峦，神鹿克制离墙横向行进，人物保持北魏矿彩肤色。',
    motionConstraint: '轻微分层与横卷位移，动作幅度宁小勿大，禁止真人或写实CG。',
    startFrameUrl: '/video_assets/shots/s07/01_start.png',
    endFrameUrl: '/video_assets/shots/s07/02_end.png',
    prompt: 'Dunhuang Cave 257 Nine-Colored Deer horizontal narrative scroll animation, elegant white sacred deer with branching coral-like antlers wading gracefully to rescue drowning merchant, Northern Wei fresco aesthetic, 2D flat traditional Chinese mural style, subtle parallax layer depth, crackled mineral earth ground, non-realistic stylized figures, iron-wire lines, 16:9, 24fps --ar 16:9',
    negativePrompt: 'photorealistic real deer, 3D Disney Bambi character, modern fantasy game creature, golden aura explosions, modern photorealistic human skin, anime face'
  },
  {
    id: 'S07',
    numberLabel: '07',
    title: '飞天御风',
    subtitle: '盛唐第320窟，双飞天凌空对舞，天衣飘带御风回旋，彩云如潮涌动。',
    interactionHint: '长巾飘举 凌虚御空',
    timeRange: [35.5, 41.0],
    realityRatio: '盛唐矿物重彩 · 2.5D飘带律动',
    styleRule: '长巾飘扬保持二维平面优雅，矿物青绿与朱砂，飞天尊相保持高古矿彩。',
    motionConstraint: '飘带克制波状起伏，首尾帧闭环，无剧烈翻滚或仙侠光效。',
    startFrameUrl: '/video_assets/shots/s08/01_start.png',
    endFrameUrl: '/video_assets/shots/s08/02_end.png',
    prompt: 'High Tang Dunhuang Mogao Cave 320 Flying Apsaras (Feitian) celestial ribbon floating gracefully down into stylized flowing cloud waves and sacred river, connecting heaven and earth, pure 2D planar elegance, mineral green, azure blue, and muted vermilion robes, ancient wall crackles, gentle rhythmic waving silk motion, 16:9, 24fps --ar 16:9',
    negativePrompt: 'winged western angel, 3D female avatar, anime waifu, blinding golden glare, synthetic neon smoke, modern beauty salon skin'
  },
  {
    id: 'S08',
    numberLabel: '08',
    title: '照见终局',
    subtitle: '全片连续照见圆满收官，古壁文明在流光中苏醒，八窟之门由此洞开。',
    interactionHint: '圆满定格 启幕八窟',
    timeRange: [41.0, 55.7],
    realityRatio: '全景长卷相逢 · 矿彩光华定格',
    styleRule: '彩带与莫高窟八大洞窟长卷相融，保持矿彩与古壁质感，无黑屏切割。',
    motionConstraint: '全景向后缓拉定格，光华温润内敛，平滑引出交互选单。',
    startFrameUrl: '/video_assets/shots/s09/01_start.png',
    endFrameUrl: '/video_assets/shots/s09/02_end.png',
    prompt: 'Panoramic culmination of Dunhuang Mogao murals, seamless integration of caisson lotus, sacred deer mountains and flying apsaras ribbon into the overarching historic cave architecture, quiet warm ambient glow, authentic cracked plaster and oxidized mineral pigments, gentle camera slow pull back, timeless sacred atmosphere, 16:9, 24fps --ar 16:9',
    negativePrompt: 'sudden black screen, flash of white light, modern end credits CG, sci-fi particle portal, neon sign'
  }
];

export const TRANSITION_CHECKLIST: TransitionCheck[] = [
  {
    fromId: 'S01',
    toId: 'S02',
    title: '幽窟启扉 ➔ 微光照壁',
    lightingTransition: '暗门缝透入暖光 ➔ 微弱手持烛光扫过风蚀立柱，光照强度平缓递进，暗部保持石质细节。',
    motionTransition: '推门动作终点接回廊平滑向前移动，无顿挫，无黑屏切割。',
    colorLockCheck: '低饱和土红、松烟黑与古木色，严格禁止突然跳变金光。',
    seamlessCheck: 'S01 02_end.png 门洞内部阴影与 S02 01_start.png 廊道起点完全吻合。'
  },
  {
    fromId: 'S02',
    toId: 'S03',
    title: '微光照壁 ➔ 仰见天心',
    lightingTransition: '侧向扫壁光 ➔ 平滑转向天顶中央弱聚光，形成圆形暖斑聚焦藻井。',
    motionTransition: '水平前行平缓上仰为垂直视角，视角旋转曲线平滑（Ease-in-out）。',
    colorLockCheck: '石壁矿物色（赭石与石绿）与天顶藻井边框色彩无缝呼应。',
    seamlessCheck: 'S02 终帧立柱顶部与 S03 始帧下边缘空间拓扑连贯。'
  },
  {
    fromId: 'S03',
    toId: 'S03B',
    title: '仰见天心 ➔ 藻井初显',
    lightingTransition: '现实洞窟微光 ➔ 现实空间退场，壁画质感升至 90%，无科幻虫洞光斑。',
    motionTransition: '上仰静止位接入同心圆旋转动势，旋转角速度宁缓勿急。',
    colorLockCheck: '低饱和赭红、石绿与白垩地仗，保持矿物颜料原貌。',
    seamlessCheck: 'S03 藻井中心三兔圆核与 S03B 藻井正视中轴严密对齐。'
  },
  {
    fromId: 'S03B',
    toId: 'S04',
    title: '藻井初显 ➔ 三兔飞旋',
    lightingTransition: '壁画均质自然漫射光，无高亮反光，质感稳定在 90% 以上。',
    motionTransition: '静止同心圆纹样顺势转化为三兔逆/顺时针追逐旋转，三耳共用拓扑坚固。',
    colorLockCheck: '赭红兔身与石绿地仗，纯工笔勾勒，禁止生成 3D 动物毛发。',
    seamlessCheck: '首尾三耳圆心重合，旋转相位连续无跳帧。'
  },
  {
    fromId: 'S04',
    toId: 'S05',
    title: '三兔飞旋 ➔ 纹样化转',
    lightingTransition: 'S05 起画面不再烘焙手电筒光斑或暗角，照见效果全部交由交互程序叠加。',
    motionTransition: '三兔旋转外延莲瓣向四周扩散，水波与云气波澜平滑卷舒。',
    colorLockCheck: '石青、石绿水浪线条，白垩浪花，禁止任何霓虹电光色彩。',
    seamlessCheck: 'S04 莲花外圈与 S05 旋转水涡曲率一致。'
  },
  {
    fromId: 'S05',
    toId: 'S06',
    title: '纹样化转 ➔ 鹿王舍己',
    lightingTransition: '完全进入纯二维叙事长卷空间，均质矿物重彩漫射，无现实阴影。',
    motionTransition: '旋转涡流平滑展平为北魏横卷山峦河流，神鹿涉水横向行进。',
    colorLockCheck: '北魏凹凸晕染赭红、石绿山石，九色鹿纯白矿彩，秀骨清像。',
    seamlessCheck: '水纹与鹿足踏浪交界自然衔接，无黑屏，无裂痕跳跃。'
  },
  {
    fromId: 'S06',
    toId: 'S07',
    title: '鹿王舍己 ➔ 飞天御风',
    lightingTransition: '北魏古朴高古自然过渡至盛唐石青与石绿的华美庄严，光度内敛沉静。',
    motionTransition: '河水波纹与祥云水汽向上升腾，化为双飞天长巾飘带，2.5D 离墙律动。',
    colorLockCheck: '飞天矿彩尊相：高古铅白氧化与赭红唇晕，坚决无现代粉色或 CG 仙侠质感。',
    seamlessCheck: '云气升腾线与飞天迎风飘带矢量切线完全对齐。'
  },
  {
    fromId: 'S07',
    toId: 'S08',
    title: '飞天御风 ➔ 照见终局',
    lightingTransition: '微弱暖光再次隐现，照见长卷全局，壁画与莫高窟整体空间融为一体。',
    motionTransition: '特写飘带缓缓拉远为宏伟长卷全景，定格于莫高窟千年文明重光之境。',
    colorLockCheck: '九镜色系低饱和统合：赭红、石青、石绿、米白、深黑，浑然一体。',
    seamlessCheck: '全景长卷无缝定格，平滑衔接至八窟探索与修复工坊。'
  }
];

export const SKIN_TONE_PRESETS: SkinTonePreset[] = [
  {
    id: 'tang_oxidized',
    name: '高古铅白氧化 (官方推荐)',
    period: '唐代·莫高窟原貌',
    description: '铅粉（碱式碳酸铅）经千百年微量硫化氧化，尊相高光沉淀为古朴熟褐与暗银灰色，尽显莫高窟高古历史厚重感。',
    historicalContext: '敦煌壁画绘制时以铅粉涂抹额头、鼻梁与下颌，年代久远后铅氧化成硫化铅（黑褐色），形成了举世闻名的“小字脸”与“黑面飞天”历史印记。',
    warmth: 8,
    leadOxidation: 65,
    ironWireContrast: 75,
    saturation: 82,
    cssFilter: 'sepia(0.28) contrast(1.12) brightness(0.96) saturate(0.85) hue-rotate(-6deg)',
    colorSwatch: ['#5C3D2E', '#9E6D53', '#D4B89B']
  },
  {
    id: 'beiwei_ochre',
    name: '北魏丹赭西域晕染',
    period: '北魏·第257窟',
    description: '西域传入的“凹凸晕染法”，以土红赭石打底，朱砂勾勒眼眶与耳廓，人物呈现秀骨清像与古拙岩彩质感。',
    historicalContext: '北魏第257窟九色鹿本生图人物（调达与国王）均采用西域矿物晕染，皮肤以暖赭褐为主调，质朴庄严，与山林石绿相映成趣。',
    warmth: 24,
    leadOxidation: 40,
    ironWireContrast: 85,
    saturation: 88,
    cssFilter: 'sepia(0.35) contrast(1.15) brightness(0.94) saturate(0.92) hue-rotate(-12deg)',
    colorSwatch: ['#8A4B38', '#B36B54', '#E6C2A2']
  },
  {
    id: 'tang_ivory',
    name: '盛唐白垩温润矿彩',
    period: '盛唐·第320窟',
    description: '白垩粉与珊瑚矿彩轻微晕染，面相丰腴安详，石青石绿长巾衬托下温润如玉，铁线描精准生动。',
    historicalContext: '盛唐第320窟散花飞天脸部以纯净白垩打底，胭脂薄施两颊，笔致圆润流畅，展现开元盛世“天衣飞扬、满壁风动”的自信气度。',
    warmth: 12,
    leadOxidation: 20,
    ironWireContrast: 60,
    saturation: 90,
    cssFilter: 'sepia(0.18) contrast(1.08) brightness(0.98) saturate(0.88) hue-rotate(-4deg)',
    colorSwatch: ['#995D4A', '#CBA382', '#EFE1CE']
  },
  {
    id: 'museum_restored',
    name: '古壁矿石沉静原本',
    period: '文保修护·低饱和矿彩',
    description: '石青、石绿、赭红、白垩与松烟墨达到天然矿物平衡，彻底滤除刺眼荧光与油腻CG高光，忠实于古建壁画。',
    historicalContext: '严格遵循敦煌研究院文保标准，严格压制仙侠CG饱和度，保留粗粝石灰地仗裂纹与天然孔雀石、蓝铜矿砂砾感。',
    warmth: 0,
    leadOxidation: 50,
    ironWireContrast: 70,
    saturation: 80,
    cssFilter: 'sepia(0.20) contrast(1.10) brightness(0.95) saturate(0.80) hue-rotate(0deg)',
    colorSwatch: ['#3A5043', '#7A4338', '#CBB89D']
  }
];
