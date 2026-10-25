export type GameStage =
  | 'prologue_torch'       // 1. 序幕与烛火探照
  | 'illumination_cinema'  // 【新增】照见天心 · 九镜沉浸长卷与视觉风格锁
  | 'cave_selector'        // 2. 洞窟全景选单
  | 'cave_exploration'     // 3. 沉浸式洞窟空间与材料寻宝
  | 'restoration_workshop' // 4. 古法壁画手势绘制小游戏
  | 'knowledge_quiz'       // 5. 敦煌知识考验 (10题)
  | 'guardian_badge';      // 6. 结算与守护者勋章/凭证

export interface TreasureItem {
  id: 'ground_plaster' | 'glue_alum' | 'azurite_mineral' | 'wolf_hair_brush';
  name: string;
  pinyin: string;
  english: string;
  sourceCaveId: number;
  description: string;
  craftRole: string;
  icon: string;
  color: string;
}

export interface Hotspot {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  position: [number, number, number]; // 3D coordinates on sphere
  culturalInsight: string;
  isFlyingApsarasSpecial?: boolean;
  realPhotoUrl?: string;
}

export interface CaveData {
  id: number;
  dynasty: string;
  name: string;
  tagline: string;
  description: string;
  audioIntroText: string;
  dominantColor: string;
  buttonPosition: { x: number; y: number }; // percentage on selector map
  muralTheme: string;
  highlights: string[];
  hotspots: Hotspot[];
  treasure?: TreasureItem;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: '壁画故事' | '洞窟年代' | '矿物颜料' | '香音飞天' | '历史传承';
}

export const TREASURE_ITEMS: Record<string, TreasureItem> = {
  ground_plaster: {
    id: 'ground_plaster',
    name: '澄泥地仗坯',
    pinyin: 'Chéng Ní Dì Zhàng',
    english: 'Sediment Clay Ground Base',
    sourceCaveId: 257,
    description: '莫高窟泥塑与壁画的地基，由大泉河澄板土、细沙及麻刀、麦草纤维精细混拌熟化，抗裂防潮。',
    craftRole: '第一道工序：批刮地仗层，铺平岩壁基底',
    icon: '🧱',
    color: '#D4B996'
  },
  glue_alum: {
    id: 'glue_alum',
    name: '胶矾水',
    pinyin: 'Jiāo Fán Shuǐ',
    english: 'Animal Glue & Alum Sizing',
    sourceCaveId: 220,
    description: '以牛皮胶与明矾按严谨比例熬制调和，用于生宣或地仗打底固胶，使矿物色层三矾九染而不洇脱。',
    craftRole: '第二道工序：刷胶矾水定性，形成防水固色层',
    icon: '🧪',
    color: '#FDE68A'
  },
  azurite_mineral: {
    id: 'azurite_mineral',
    name: '石青颜料',
    pinyin: 'Shí Qīng Yán Liào',
    english: 'Natural Azurite Mineral Pigment',
    sourceCaveId: 320,
    description: '从天然蓝铜矿脉研磨水飞提取的顶级重彩矿物颜料，千年不褪，呈现盛唐飞天华丽澄澈的青金石光泽。',
    craftRole: '第三道工序：平涂晕染石青，赋色唐代云气与裙裾',
    icon: '💎',
    color: '#0284C7'
  },
  wolf_hair_brush: {
    id: 'wolf_hair_brush',
    name: '狼毫画笔',
    pinyin: 'Láng Háo Huà Bǐ',
    english: 'Fine Weasel Hair Outlining Brush',
    sourceCaveId: 103,
    description: '采用深冬黄鼠狼尾毛特制，刚柔相济，弹性极佳。唐代画僧以之运笔如“吴带当风”，起承转合一气呵成。',
    craftRole: '第四道工序：铁线描与兰叶描勾勒飞天轮廓与飘带',
    icon: '🖌️',
    color: '#F59E0B'
  }
};

export const CAVES_DATA: CaveData[] = [
  {
    id: 257,
    dynasty: '北魏 (386–534)',
    name: '第257窟 · 九色鹿本生',
    tagline: '舍己救人，大义凛然的连环画鼻祖',
    description: '北魏代表窟之一。西壁绘有举世闻名的《九色鹿本生故事图》，采用横卷式同图异构连环画手法，色彩以土红、白、黑为主，淳朴庄严。',
    audioIntroText: '善哉佛子，你正步入北魏第257窟。凝视西壁，九色鹿救起溺水者调达，后者却因贪恋王后悬赏而告密，终遭恶果。在此窟深处的壁龛石隙中，藏有古法造壁的基石。',
    dominantColor: '#B2533E',
    buttonPosition: { x: 16, y: 40 },
    muralTheme: '九色鹿舍身救人与国王忏悔',
    highlights: ['横卷式连环画《九色鹿经图》', '早期西域凹凸晕染法', '北魏秀骨清像人物造型'],
    hotspots: [
      {
        id: 'deer_king',
        title: '九色鹿王挺立',
        subtitle: '西壁中央 · 构图核心',
        description: '神鹿鹿角如珊瑚琼枝，身躯洁白修长，面对兵马毫无惧色，气定神闲，体现佛教大乘舍己度人的崇高意境。',
        position: [-0.3, 0.1, -0.95],
        culturalInsight: '构图突破时间顺序，将九色鹿向摩罗国王陈述经过作为核心画面，充满戏剧张力。',
        realPhotoUrl: '/mural_assets/cave_257_nine_deer.jpg'
      },
      {
        id: 'traitor_drowning',
        title: '调达落水与负心',
        subtitle: '左侧起点',
        description: '调达落入汹涌急流，双手狂呼，九色鹿涉水负之出水。后调达贪图赏赐带领国王大军搜山，顿生白癞。',
        position: [-0.85, -0.1, -0.5],
        culturalInsight: '因果报应观念在北魏乱世中给予百姓深刻的精神警醒与慰藉。'
      }
    ],
    treasure: TREASURE_ITEMS.ground_plaster
  },
  {
    id: 285,
    dynasty: '西魏 (535–556)',
    name: '第285窟 · 诸神融汇殿堂',
    tagline: '中西文化交流与多元神祇汇聚的万神殿',
    description: '莫高窟最早有确切纪年（大统四年/538年）的洞窟。覆斗顶上绘制了伏羲女娲、雷公电母、印度教湿婆神与佛教诸尊，展现敦煌极致的文化包容。',
    audioIntroText: '步入西魏第285窟，头顶覆斗藻井仿佛打开了通往宇宙神话的天幕：中国上古伏羲女娲手执规矩，与天竺诸神同游云霄。',
    dominantColor: '#4A5568',
    buttonPosition: { x: 28, y: 24 },
    muralTheme: '多元神祇融合与五百强盗成佛',
    highlights: ['大统四年珍贵墨书题记', '伏羲女娲与雷公电母共存', '五百强盗皈依得眼成佛因缘'],
    hotspots: [
      {
        id: 'fuxi_nuwa',
        title: '伏羲与女娲同辉',
        subtitle: '窟顶西坡',
        description: '伏羲手持矩尺，女娲手持规圆，人首蛇身交尾于祥云之间，与飞天仙人共舞。',
        position: [-0.1, 0.85, -0.5],
        culturalInsight: '汉文化传统神祇与丝路外来佛教艺术在西魏时期实现了空前未有的深层交融。',
        realPhotoUrl: '/mural_assets/cave_285_caisson_celestial.jpg'
      }
    ]
  },
  {
    id: 420,
    dynasty: '隋代 (581–618)',
    name: '第420窟 · 丝路商旅图',
    tagline: '法华经变与驼铃回荡的沙漠传奇',
    description: '隋代壁画巅峰之作。顶部满布繁复华丽的花卉华盖，南壁绘《法华经·普门品》，其中一队波斯商胡牵引双峰骆驼在崇山峻岭间跋涉，遇险祈观音庇护。',
    audioIntroText: '第420窟记录着大漠丝路的真实风烟。骆驼商队背负丝绸瓷器，跋涉于峰峦叠嶂之间，正是千年丝绸之路商旅互通的生动写照。',
    dominantColor: '#059669',
    buttonPosition: { x: 40, y: 55 },
    muralTheme: '法华经观音普门品与商胡商队',
    highlights: ['华美双重莲花藻井', '波斯胡商驼队真实纪实', '早期青绿山水萌芽'],
    hotspots: [
      {
        id: 'camel_caravan',
        title: '波斯商胡驼队',
        subtitle: '南壁中下部',
        description: '胡商深目高鼻，头戴毡帽，牵引满载货物的骆驼穿越险峡，形象极其逼真。',
        position: [0.75, -0.2, -0.65],
        culturalInsight: '敦煌不仅是宗教圣地，更是欧亚大陆古代贸易物流的中枢枢纽。'
      }
    ]
  },
  {
    id: 220,
    dynasty: '初唐 (618–712)',
    name: '第220窟 · 翟家窟乐舞',
    tagline: '盛世长歌，大唐乐舞与药师净土的极致华彩',
    description: '初唐贞观十六年营建。北壁《药师经变》中七佛并列，宝池莲花绽放，下方庞大宫廷乐队催奏，两侧舞伎脚踏西域花毡回旋起舞（胡旋舞）。',
    audioIntroText: '聆听大唐的声音！第220窟翟家窟是唐代壁画的艺术高峰。这里舞乐齐鸣，二十八人管弦乐团伴奏，灯轮炽盛。在乐伎脚踏的花毡侧畔，正孕育着固色神水。',
    dominantColor: '#D97706',
    buttonPosition: { x: 52, y: 30 },
    muralTheme: '药师经变七佛与东方极乐舞乐',
    highlights: ['胡旋舞舞伎疾转如风', '二十八人大唐交响乐队', '璀璨琉璃灯轮与重檐宝阁'],
    hotspots: [
      {
        id: 'huxuan_dance',
        title: '反弹琵琶胡旋女',
        subtitle: '北壁下层乐舞平台',
        description: '两组舞伎各踏一张小花毡，轻舒双臂，回身疾转，裙摆飞扬如雪浪，展现唐代自西域康国传入的胡旋舞绝技。',
        position: [-0.05, -0.25, -0.96],
        culturalInsight: '李白诗云“胡旋女，心应弦，手应鼓”，此壁画为研究唐代宫廷及丝路舞乐提供了最权威图像证据。'
      }
    ],
    treasure: TREASURE_ITEMS.glue_alum
  },
  {
    id: 45,
    dynasty: '盛唐 (712–766)',
    name: '第45窟 · 塑画合一神品',
    tagline: '莫高窟彩塑巅峰，七身一铺绝美塑像',
    description: '正壁敞口佛龛内保存完好的盛唐七身彩塑（一佛、二弟子、二菩萨、二天王）。阿难清秀温雅，迦叶沉毅沧桑，菩萨体态袅娜多姿。',
    audioIntroText: '踏入第45窟，你所面对的是中国古代雕塑史上无与伦比的瑰宝。菩萨身姿呈优美的S形三道弯，丰满圆润，肌肤吹弹可破。',
    dominantColor: '#854D0E',
    buttonPosition: { x: 65, y: 46 },
    muralTheme: '盛唐塑画结合一铺七尊彩塑',
    highlights: ['S形三道弯胁侍菩萨', '写实入微的迦叶阿难弟子', '神情威猛金刚天王与菩萨的刚柔对比'],
    hotspots: [
      {
        id: 'bodhisattva_grace',
        title: '胁侍菩萨的三道弯',
        subtitle: '正龛左侧菩萨塑像',
        description: '头部微侧、胸部微挺、臀部微扭，呈现如希腊古典雕塑般典雅优美的三道弯曲线，衣纹薄如蝉翼。',
        position: [0.35, 0.05, -0.92],
        culturalInsight: '唐代“菩萨如宫娃”的世俗化美学取向在第45窟达到了登峰造极的地步。',
        realPhotoUrl: '/mural_assets/cave_045_bodhisattva_torch.jpg'
      }
    ]
  },
  {
    id: 103,
    dynasty: '盛唐 (712–766)',
    name: '第103窟 · 吴带当风铁线描',
    tagline: '画圣吴道子画风遗韵，法华化城喻图',
    description: '南壁绘《法华经·化城喻品》，画师运用纯熟精炼的白描与铁线描技法，线条富有弹性质感，衣袂飘举，“天衣飞扬，满壁风动”。',
    audioIntroText: '欢迎来到盛唐第103窟。这里的线条仿佛拥有生命！古代画圣吴道子“吴带当风”的绝技，在此窟壁画中被民间神工化作笔底波澜。修葺此画，非顶级狼毫不可。',
    dominantColor: '#0369A1',
    buttonPosition: { x: 76, y: 26 },
    muralTheme: '法华经化城喻品与山水人物图',
    highlights: ['吴带当风纯正线条艺术', '早期独立青绿山水构图', '渴求宝藏的商人旅途奇景'],
    hotspots: [
      {
        id: 'wudaizi_line',
        title: '吴带当风神笔',
        subtitle: '南壁东侧人物衣褶',
        description: '以极细劲韧的铁线起笔，转折处顿挫如折钗股，人物乘风而动，充满生命律动。',
        position: [-0.6, 0.1, -0.78],
        culturalInsight: '不施重彩而神采飞扬，印证了中国古代画论“骨法用笔，气韵生动”的最高准则。'
      }
    ],
    treasure: TREASURE_ITEMS.wolf_hair_brush
  },
  {
    id: 320,
    dynasty: '盛唐 (712–766)',
    name: '第320窟 · 双飞天散花',
    tagline: '香音神之舞，盛唐天衣飞扬的不朽杰作',
    description: '南壁阿弥陀佛净土上方绘有著名的“散花双飞天”。两位飞天从天而降，长巾飘卷，一人持花盘撒落天花，一人俯身合十迎迓。此处承载着现代敦煌舞的灵魂。',
    audioIntroText: '这是一片花雨缤纷的曼妙世界。第320窟的散花飞天，正是天界香音神乾闼婆与紧那罗的化身。她们不用双翼，只凭一缕五彩天衣祥云便能御风凌空。',
    dominantColor: '#1E3A8A',
    buttonPosition: { x: 86, y: 45 },
    muralTheme: '西方极乐净土与散花双飞天',
    highlights: ['盛唐最美散花双飞天', '青金石与石青重彩天幕', '现代敦煌舞蹈活态动作源泉'],
    hotspots: [
      {
        id: 'flying_apsaras_320',
        title: '散花双飞天 · 香音神流光',
        subtitle: '南壁上方净土天宫',
        description: '飞天体态轻盈曼妙，彩色飘带在身后回绕成优雅的双重圆环，指如削葱，正在漫天花雨中翩跹起舞。',
        position: [0.0, 0.35, -0.93],
        culturalInsight: '敦煌舞创始人高金荣教授正是在此飞天壁画中提炼出了“推指、回巾、反弹、倾身”等核心舞姿程式。',
        isFlyingApsarasSpecial: true
      }
    ],
    treasure: TREASURE_ITEMS.azurite_mineral
  },
  {
    id: 156,
    dynasty: '晚唐 (848–907)',
    name: '第156窟 · 张议潮统军出行',
    tagline: '归义军收复河西，历史风云的壮丽史诗',
    description: '晚唐代表大窟。南壁下部通栏绘有长逾十米的《张议潮统军出行图》，真实记录了晚唐张议潮率归义军驱逐吐蕃、收复河西十一州的威武军威。',
    audioIntroText: '第156窟是镌刻在莫高窟石壁上的历史史诗。信旗翻飞，号角齐鸣，张议潮将军骑高头大马巡阅三军，大唐将士甲光向日，民族脊梁在此屹立。',
    dominantColor: '#7C2D12',
    buttonPosition: { x: 88, y: 72 },
    muralTheme: '张议潮统军出行与宋国夫人出行图',
    highlights: ['十米长卷纪实史诗壁画', '晚唐甲胄、马匹与仪仗考据', '归义军忠勇爱国历史证物'],
    hotspots: [
      {
        id: 'zhang_general',
        title: '统军将军仪仗',
        subtitle: '南壁东侧下通栏',
        description: '张议潮身着圆领红袍，腰悬箭袋，跨骑白马；前有军乐鼓吹与引道骑兵，旌旗蔽日，威震西陲。',
        position: [0.55, -0.3, -0.8],
        culturalInsight: '此壁画填补了晚唐军制礼仪的史料空白，是敦煌世俗历史画的无上至宝。',
        realPhotoUrl: '/mural_assets/cave_156_expedition.jpg'
      }
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '莫高窟第257窟著名的北魏《九色鹿经图》中，九色鹿救起的落水人是谁？',
    options: ['调达', '阿难', '张议潮', '乐僔'],
    correctIndex: 0,
    explanation: '九色鹿在汹涌大河中救起了溺水狂呼的调达，然而调达后来贪图国王王后的重赏而告密，终遭恶疾现世报。',
    category: '壁画故事'
  },
  {
    id: 2,
    question: '公元366年（前秦建元二年），在鸣沙山崖壁上凿下莫高窟第一座佛窟的高僧是？',
    options: ['玄奘法师', '乐僔和尚', '法显三藏', '鸠摩罗什'],
    correctIndex: 1,
    explanation: '前秦建元二年，乐僔和尚云游至鸣沙山，见三危山顶金光万道如千佛闪现，心生感悟，遂在崖壁开凿了莫高窟第一窟。',
    category: '洞窟年代'
  },
  {
    id: 3,
    question: '莫高窟壁画中历经千年依然绚丽深邃的珍贵蓝色“石青”，主要由哪种天然矿物研磨水飞提取？',
    options: ['辰砂矿', '孔雀石', '蓝铜矿 (Azurite)', '雄黄'],
    correctIndex: 2,
    explanation: '石青主要成分为天然蓝铜矿（化学式 Cu3(CO3)2(OH)2），研磨后经水飞分级漂洗，呈现青金石般的澄澈纯蓝，色泽历经千年不易褪变。',
    category: '矿物颜料'
  },
  {
    id: 4,
    question: '佛教壁画中被称为“香音神”的飞天仙人，源自印度神话中掌管乐曲香气的一对神祇：乾闼婆与？',
    options: ['紧那罗 (Kinnara)', '夜叉 (Yaksha)', '修罗 (Asura)', '迦楼罗 (Garuda)'],
    correctIndex: 0,
    explanation: '飞天在梵文中由“乾闼婆”（香神，喜好香气、散发香气）与“紧那罗”（歌神乐神）合化而来，在敦煌融为善歌善舞、天衣飞扬的仙人形象。',
    category: '香音飞天'
  },
  {
    id: 5,
    question: '初唐第220窟（翟家窟）北壁《药师经变》中，舞伎脚踏西域小花毡急速旋转的舞蹈被称为？',
    options: ['霓裳羽衣舞', '胡旋舞', '踏歌舞', '绿腰舞'],
    correctIndex: 1,
    explanation: '胡旋舞由西域康国（今撒马尔罕一带）传入唐朝，特点是在一张小圆毡上“回雪飘摇，急转如风”，唐玄宗、安禄山、杨贵妃皆精通此舞。',
    category: '历史传承'
  },
  {
    id: 6,
    question: '盛唐第45窟被誉为莫高窟彩塑巅峰，其中胁侍菩萨身姿呈优美的人体曲线，被称为？',
    options: ['S形三道弯 (Tribhanga)', '十字平衡步', '垂足并立式', '金刚倒立式'],
    correctIndex: 0,
    explanation: '“S形三道弯”即头部微侧、胸臀反向扭动的优美曲度，使原本庄严的佛像具有了唐代宫廷仕女般的柔美与生动韵味。',
    category: '历史传承'
  },
  {
    id: 7,
    question: '与西方天使长有羽翼不同，敦煌壁画中的飞天能够凌空飞舞的核心奥秘在于？',
    options: ['脚踏七彩筋斗云', '凭借随风飘卷的凌空飞带（天衣）与云气', '背后隐形风筝翼', '借由莲花宝座喷射腾空'],
    correctIndex: 1,
    explanation: '敦煌飞天不生双翅、不生羽毛，仅凭一条回旋曲折的飘带和几朵流动的祥云，便展现出御风腾空、天衣飞扬的空灵动态。',
    category: '香音飞天'
  },
  {
    id: 8,
    question: '在古法壁画制作中，调和“三矾九染”使矿物颜料牢牢附着在地仗上的透明保护胶剂是？',
    options: ['胶矾水（骨胶+明矾）', '松节油与熟桐油', '鸡蛋清加蜂蜜', '树脂硝基漆'],
    correctIndex: 0,
    explanation: '胶矾水由牛皮骨胶与明矾配制而成，既能稳固矿物粉末防止剥落脱粉，又能防水防潮，是古法重彩壁画的生命线。',
    category: '矿物颜料'
  },
  {
    id: 9,
    question: '现代“敦煌舞”体系的重要奠基人（如高金荣等）主要从莫高窟壁画的哪种经典形态中提炼手位和体态？',
    options: ['反弹琵琶、拈花指与倾身回望', '西方芭蕾足尖站立', '京剧跑圆场翻跟头', '印度卡塔克足铃舞'],
    correctIndex: 0,
    explanation: '敦煌舞从莫高窟第112窟反弹琵琶、第320窟散花飞天、第220窟胡旋舞中提炼出“反弹、推指、回巾、S身韵”等独特舞蹈美学程式。',
    category: '历史传承'
  },
  {
    id: 10,
    question: '晚唐第156窟中十米宏伟巨卷《张议潮统军出行图》，记录了哪一重要历史功勋？',
    options: ['玄奘法师西天取经归来', '张议潮率归义军收复河西十一州归唐', '唐太宗李世民东征辽东', '文成公主进藏结好吐蕃'],
    correctIndex: 1,
    explanation: '唐大中二年（848年），沙州（敦煌）汉人领袖张议潮起兵驱逐吐蕃，收复瓜、沙等河西十一州，重开丝绸之路，唐宣宗敕封其为归义军节度使。',
    category: '壁画故事'
  }
];

export interface RestorationStep {
  id: number;
  toolKey: 'ground_plaster' | 'glue_alum' | 'azurite_mineral' | 'wolf_hair_brush';
  title: string;
  name: string;
  instruction: string;
  actionHint: string;
  progressTarget: number;
  strokeColor: string;
  cursorType: string;
}

export const RESTORATION_STEPS: RestorationStep[] = [
  {
    id: 1,
    toolKey: 'ground_plaster',
    title: '第一道工序 · 抹泥铺地仗',
    name: '澄泥地仗坯',
    instruction: '在风化斑驳的荒漠粗粝岩壁上，均匀批刮澄泥、麻刀与麦草熟化的地仗泥坯。',
    actionHint: '拖动鼠标或挥动手指，平整涂抹岩壁基底',
    progressTarget: 100,
    strokeColor: '#C4A47C',
    cursorType: 'crosshair'
  },
  {
    id: 2,
    toolKey: 'glue_alum',
    title: '第二道工序 · 刷胶矾水固底',
    name: '胶矾水',
    instruction: '调配牛皮胶与明矾，在干透的地仗层上轻刷三遍胶矾水，封闭气孔，防止矿物色沉洇渗。',
    actionHint: '涂刷胶矾水，形成晶莹透明的防水保护层',
    progressTarget: 100,
    strokeColor: '#FDF0CD',
    cursorType: 'crosshair'
  },
  {
    id: 3,
    toolKey: 'azurite_mineral',
    title: '第三道工序 · 晕染矿物石青',
    name: '石青颜料',
    instruction: '以纯天然蓝铜矿石青重彩，分层填染飞天的翻卷长裙、披帛天衣与祥云天幕。',
    actionHint: '点染晕涂，赋予盛唐天界深邃华丽的纯净青金光泽',
    progressTarget: 100,
    strokeColor: '#0284C7',
    cursorType: 'crosshair'
  },
  {
    id: 4,
    toolKey: 'wolf_hair_brush',
    title: '第四道工序 · 狼毫金线勾勒',
    name: '狼毫画笔',
    instruction: '运笔如吴带当风，以极细劲韧的铁线描与泥金勾画飞天的纤纤玉手、轻扬飘带与天冠宝花。',
    actionHint: '勾勒飞天轮廓线条，赋予壁画灵动的神韵',
    progressTarget: 100,
    strokeColor: '#F59E0B',
    cursorType: 'crosshair'
  }
];
