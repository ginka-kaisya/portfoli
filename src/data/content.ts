/**
 * 整站文案、作品和数据都在这个文件里改。
 * 保存后刷新页面即可。部署见 README。
 *
 * 作品字段：
 * - id            英文短 id，用于分享链接 ?work=id，不要重复
 * - title         标题
 * - category      项目分类，会自动出现在筛选里
 * - type          "image" 或 "video"
 * - src           图片大图 / 本地影片 / YouTube 链接
 * - thumbnail     卡片封面。本地文件写 public/ 里的相对路径，例如 media/cover.jpg
 * - description   简介
 * - date          YYYY-MM-DD
 * - frame         portrait 竖图 / landscape 横图 / square 方图
 * - metrics       可选。不写就不显示
 * - featured      可选。true 的视频会在作品区顶部内嵌播放（只放一个）
 * - example       可选。false 表示真实成片，卡片不再标「示例」
 * - titleJa       可选。日文标题，灯箱里跟在中文标题后面
 * - duration      可选。片长，例如 "0:29"
 * - ratio         可选。CSS 宽高比，例如 "1080 / 1920"，避免裁掉画面里的字
 * - span          可选。作品墙跨列，不写就按默认节奏
 *
 * 首页「最近の作品」用下面的 reel。成片同时写进 works，作品墙里也能筛到。
 *
 * 本地影片：把 mp4 放进 public/media/，src 写成 "media/你的文件.mp4"
 * YouTube：src 贴观看链接即可，例如 https://www.youtube.com/watch?v=xxxxxxxx
 */

export type WorkMetrics = {
  /** 展示文案，例如 "186万" */
  views?: string;
  likes?: string;
  /** 例如 "6.8%" */
  engagementRate?: string;
  /** 例如 "Instagram"、"YouTube"、"小红书" */
  platform?: string;
};

export type WorkItem = {
  id: string;
  title: string;
  category: string;
  type: "image" | "video";
  src: string;
  thumbnail: string;
  description: string;
  date: string;
  frame: "portrait" | "landscape" | "square";
  metrics?: WorkMetrics;
  featured?: boolean;
  example?: boolean;
  titleJa?: string;
  duration?: string;
  ratio?: string;
  span?: number;
};

export type ReelFilm = {
  id: string;
  issue: string;
  titleJa: string;
  titleZh: string;
  category: string;
  duration: string;
  src: string;
  poster: string;
  ratio: string;
};

export type Highlight = {
  label: string;
  value: number;
  decimals: number;
  unit: string;
  hint: string;
};

const photo = (id: string, width: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

export const site = {
  name: "田中",
  nameEn: "Tanaka",
  nameJa: "田中",
  role: "InnAIO Japan · 海外达人合作",
  tagline: "把品牌故事，交给对的人讲。",
  taglineJa: "ふさわしい声に、物語を。",
  issue: "2026 秋冬",
  locationNote: "京都 · 示例封面",
  description:
    "田中的作品集。InnAIO Japan 海外达人合作。两支声音克隆翻译器短片，图片与数字仍为示例。",
  updated: "2026-11-26",
};

export const hero = {
  image: photo("1493976040374-85c8e12f0c0e", 1800),
  alt: "示例封面：京都清晨的街巷，并非项目成片",
};

/** 首页数据看板。数字都是示例，直接改 value。 */
export const highlights: Highlight[] = [
  { label: "合作达人", value: 128, decimals: 0, unit: "位", hint: "本年度合作" },
  { label: "累计播放", value: 2460, decimals: 0, unit: "万", hint: "跨平台合计" },
  { label: "平均互动率", value: 4.8, decimals: 1, unit: "%", hint: "互动 ÷ 播放" },
  { label: "覆盖市场", value: 12, decimals: 0, unit: "个", hint: "国家与地区" },
  { label: "品牌战役", value: 36, decimals: 0, unit: "场", hint: "已结案战役" },
];

/** 柱状图。value 的单位写在 unit 里，页面会按最大值自动缩放。 */
export const impressionSeries = {
  title: "近六月播放",
  note: "单位：万次 · 示例数据",
  unit: "万",
  points: [
    { label: "6月", value: 280 },
    { label: "7月", value: 340 },
    { label: "8月", value: 310 },
    { label: "9月", value: 460 },
    { label: "10月", value: 520 },
    { label: "11月", value: 610 },
  ],
};

/** 横向条。value 按相对大小画长度，不必加总为 100。suffix 会跟在数字后面。 */
export const markets = {
  title: "市场分布",
  note: "按播放占比 · 示例",
  suffix: "%",
  items: [
    { label: "日本", value: 36 },
    { label: "东南亚", value: 22 },
    { label: "台湾", value: 18 },
    { label: "韩国", value: 14 },
    { label: "其他", value: 10 },
  ],
};

export const reel = {
  title: "最近の作品",
  lede: "生活与会议。两支 InnAIO 声音克隆翻译器短片。",
  films: [
    {
      id: "pizza-chicken",
      issue: "01",
      titleJa: "ピザ？チキン？",
      titleZh: "披萨还是炸鸡？跨语言日常",
      category: "社媒短视频 / Lifestyle",
      duration: "0:29",
      src: "media/pizza-chicken.mp4",
      poster: "media/pizza-chicken.jpg",
      ratio: "1080 / 1920",
    },
    {
      id: "global-meeting",
      issue: "02",
      titleJa: "スムーズなグローバル会議",
      titleZh: "无界商务会议",
      category: "B2B",
      duration: "0:15",
      src: "media/global-meeting.mp4",
      poster: "media/global-meeting.jpg",
      ratio: "832 / 1056",
    },
  ] satisfies ReelFilm[],
};

export const works: WorkItem[] = [
  {
    id: "pizza-chicken",
    title: "披萨还是炸鸡？跨语言日常",
    titleJa: "ピザ？チキン？",
    category: "社媒短视频 / Lifestyle",
    type: "video",
    src: "media/pizza-chicken.mp4",
    thumbnail: "media/pizza-chicken.jpg",
    description:
      "日语和韩语的一对拌嘴：今晚披萨，还是炸鸡。翻译器把话接上。片尾是「言葉の壁を、なくそう。」",
    date: "2026-11-26",
    frame: "portrait",
    ratio: "1080 / 1920",
    duration: "0:29",
    span: 4,
    example: false,
  },
  {
    id: "global-meeting",
    title: "无界商务会议",
    titleJa: "スムーズなグローバル会議",
    category: "B2B",
    type: "video",
    src: "media/global-meeting.mp4",
    thumbnail: "media/global-meeting.jpg",
    description:
      "俯拍一场跨国会议，设备放在桌面中央，日英字幕一起走。片尾是「言葉の壁を越えて、ビジネスをもっとスムーズに。」",
    date: "2026-11-26",
    frame: "portrait",
    ratio: "832 / 1056",
    duration: "0:15",
    span: 4,
    example: false,
  },
  {
    id: "morning-path",
    title: "清晨的参道",
    category: "春季新品",
    type: "image",
    src: photo("1493976040374-85c8e12f0c0e", 2000),
    thumbnail: photo("1493976040374-85c8e12f0c0e", 1200),
    description:
      "示例静帧。春季 campaign 的封面先把场景定住：达人出镜之前，让清晨的路自己把气质说完。",
    date: "2026-03-18",
    frame: "landscape",
    metrics: {
      platform: "Instagram",
      views: "186万",
      likes: "4.2万",
      engagementRate: "6.8%",
    },
  },
  {
    id: "before-swatch",
    title: "试色之前",
    category: "直播回顾",
    type: "image",
    src: photo("1596462502278-27bfdc403348", 1800),
    thumbnail: photo("1596462502278-27bfdc403348", 1100),
    description: "示例平面。直播前发给达人的参考静帧，用来对齐色调和道具。",
    date: "2026-07-12",
    frame: "portrait",
    metrics: {
      platform: "Instagram",
      views: "51万",
      likes: "2.4万",
      engagementRate: "5.9%",
    },
  },
  {
    id: "night-window",
    title: "橱窗亮起来",
    category: "城市纪实",
    type: "image",
    src: photo("1503899036084-c55cdd92da26", 2000),
    thumbnail: photo("1503899036084-c55cdd92da26", 1200),
    description: "示例夜景。同一座城市的第二张脸，放进战役结案，用来对比白天的街拍。",
    date: "2026-08-30",
    frame: "landscape",
    metrics: {
      platform: "Instagram",
      views: "77万",
      likes: "1.9万",
      engagementRate: "3.6%",
    },
  },
  {
    id: "sea-cloth",
    title: "布料与海风",
    category: "品牌形象",
    type: "image",
    src: photo("1469334031218-e382a71b716b", 1800),
    thumbnail: photo("1469334031218-e382a71b716b", 1100),
    description: "示例形象片静帧。给还在选达人的品牌看「我们要的空气感」是哪一种。",
    date: "2026-10-07",
    frame: "portrait",
    metrics: {
      platform: "小红书",
      views: "120万",
      likes: "6.8万",
      engagementRate: "8.2%",
    },
  },
];

export const about = {
  quote: "选对人，比把话说满更重要。",
  image: photo("1519710164239-da123dc03ef4", 1400),
  imageAlt: "示例配图：安静的室内，不是田中的肖像",
  paragraphs: [
    "田中在 InnAIO Japan 做海外达人合作。工作从日本出发，把产品交到不同市场的创作者手里：选人、对脚本、看播出、复盘下一次该换谁。",
    "这个页面用杂志的方式放作品和成绩。上面两支短片是 InnAIO 声音克隆翻译器的战役成片。其余图片和数字仍是示例。换成更多真实案例时，改 src/data/content.ts。",
  ],
  facts: [
    { label: "机构", value: "InnAIO Japan" },
    { label: "职责", value: "海外达人合作 / 内容战役" },
    { label: "语言", value: "中文 · 日本語 · English" },
    { label: "常驻", value: "日本（示例）" },
  ],
};

/**
 * 合作短视频。每条换成真实合作即可。
 * - url           公开的 Instagram 帖子或 Reel 链接
 * - collaborator  对方账号名称
 * - role          本人在这条合作里的角色
 * - plays         可选。只写播放次数，例如 "186万"。不写就不显示。不要填曝光或播放率。
 * - sample        可选。不写或 true 会标「示例 / サンプル」。真实条目写 false。
 * noteZh / noteJa 是整区的一行说明。换成真实合作后留空，页面就不再显示。
 */
export type CollabReel = {
  url: string;
  collaborator: string;
  role: string;
  plays?: string;
  sample?: boolean;
};

export const collabs = {
  title: "合作短视频",
  titleJa: "コラボ動画",
  noteZh: "以下为占位示例，并非田中的作品。",
  noteJa: "以下はサンプルであり、田中の作品ではありません。",
  items: [
    {
      url: "https://www.instagram.com/reel/DdcI4o0Prsz/",
      collaborator: "Instagram",
      role: "示例 / サンプル",
      sample: true,
    },
    {
      url: "https://www.instagram.com/reel/DeTUk4sDSp-/",
      collaborator: "NASA",
      role: "示例 / サンプル",
      sample: true,
    },
    {
      url: "https://www.instagram.com/reel/DHO_wDACVyE/",
      collaborator: "National Geographic",
      role: "示例 / サンプル",
      sample: true,
    },
    {
      url: "https://www.instagram.com/reel/DbRF0YXgtbw/",
      collaborator: "National Geographic",
      role: "示例 / サンプル",
      sample: true,
    },
  ] satisfies CollabReel[],
};

export const contact = {
  title: "想合作，或只是打个招呼。",
  links: [
    { label: "Email", value: "2597743668@qq.com", href: "mailto:2597743668@qq.com" },
    { label: "Instagram", value: "@tanaka.example", href: "https://instagram.com/" },
    { label: "小红书", value: "田中（示例）", href: "https://www.xiaohongshu.com/" },
    { label: "LinkedIn", value: "Tanaka", href: "https://www.linkedin.com/" },
  ],
};
