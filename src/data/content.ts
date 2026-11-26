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
    "田中的作品集。InnAIO Japan 海外达人合作，以杂志的方式陈列图片、影片与战役数据。当前内容为示例。",
  updated: "2026-11-26",
};

export const hero = {
  image: photo("1493976040374-85c8e12f0c0e", 1800),
  alt: "示例封面：京都清晨的街巷，并非项目成片",
};

/** 首页数据看板。数字都是示例，直接改 value。 */
export const highlights: Highlight[] = [
  { label: "合作达人", value: 128, decimals: 0, unit: "位", hint: "本年度合作" },
  { label: "累计曝光", value: 2460, decimals: 0, unit: "万", hint: "跨平台合计" },
  { label: "平均互动率", value: 4.8, decimals: 1, unit: "%", hint: "互动 ÷ 曝光" },
  { label: "覆盖市场", value: 12, decimals: 0, unit: "个", hint: "国家与地区" },
  { label: "品牌战役", value: 36, decimals: 0, unit: "场", hint: "已结案战役" },
];

/** 柱状图。value 的单位写在 unit 里，页面会按最大值自动缩放。 */
export const impressionSeries = {
  title: "近六月曝光",
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
  note: "按曝光占比 · 示例",
  suffix: "%",
  items: [
    { label: "日本", value: 36 },
    { label: "东南亚", value: 22 },
    { label: "台湾", value: 18 },
    { label: "韩国", value: 14 },
    { label: "其他", value: 10 },
  ],
};

export const works: WorkItem[] = [
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
    id: "three-minutes",
    title: "三分钟讲清楚",
    category: "产品开箱",
    type: "video",
    src: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
    thumbnail: photo("1556228720-195a672e8a03", 1200),
    description:
      "示例 YouTube。把观看链接贴进 src 就能嵌进页面。片中画面是公开样片，正式项目请换成达人成片。",
    date: "2026-04-09",
    frame: "portrait",
    metrics: {
      platform: "YouTube",
      views: "92万",
      likes: "1.8万",
      engagementRate: "4.1%",
    },
  },
  {
    id: "bottle-light",
    title: "瓶身与侧光",
    category: "春季新品",
    type: "image",
    src: photo("1541643600914-78b084683601", 1800),
    thumbnail: photo("1541643600914-78b084683601", 1000),
    description: "示例静物。留给评论区的那张图：只留瓶身、光和一只手，方便达人统一封面。",
    date: "2026-04-22",
    frame: "portrait",
    metrics: {
      platform: "小红书",
      views: "64万",
      likes: "3.1万",
      engagementRate: "7.4%",
    },
  },
  {
    id: "shimokita-afternoon",
    title: "下北泽的下午",
    category: "城市纪实",
    type: "image",
    src: photo("1495474472287-4d71bcdd2085", 2000),
    thumbnail: photo("1495474472287-4d71bcdd2085", 1200),
    description: "示例街拍。没有单条数据的作品也可以，不填 metrics 就不会出现数字。",
    date: "2026-05-16",
    frame: "landscape",
  },
  {
    id: "window-flower",
    title: "窗边的花",
    category: "城市纪实",
    type: "video",
    src: "media/sample-flower.mp4",
    thumbnail: photo("1490750967868-88aa4486c946", 1400),
    description:
      "示例本地 MP4，文件在 public/media/sample-flower.mp4。可以在卡片里直接播放，也可以打开弹层看。画面为 CC0 样片。",
    date: "2026-06-28",
    frame: "square",
    featured: true,
    metrics: {
      platform: "TikTok",
      views: "240万",
      likes: "9.6万",
      engagementRate: "5.5%",
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
    id: "first-layer",
    title: "礼盒的第一层",
    category: "春季新品",
    type: "image",
    src: photo("1512496015851-a90fb38ba796", 1600),
    thumbnail: photo("1512496015851-a90fb38ba796", 1000),
    description: "示例细节。开箱视频的封面帧，单独拿出来做图文笔记。",
    date: "2026-09-19",
    frame: "landscape",
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
  {
    id: "after-live",
    title: "直播结束后",
    category: "直播回顾",
    type: "image",
    src: photo("1441986300917-64674bd600d8", 2000),
    thumbnail: photo("1441986300917-64674bd600d8", 1200),
    description: "示例幕后。灯还亮着，货已经清点完。结案报告里用它当最后一页。",
    date: "2026-11-02",
    frame: "landscape",
    metrics: {
      platform: "Bilibili",
      views: "33万",
      likes: "8600",
      engagementRate: "3.2%",
    },
  },
];

export const about = {
  quote: "选对人，比把话说满更重要。",
  image: photo("1519710164239-da123dc03ef4", 1400),
  imageAlt: "示例配图：安静的室内，不是田中的肖像",
  paragraphs: [
    "田中在 InnAIO Japan 做海外达人合作。工作从日本出发，把产品交到不同市场的创作者手里：选人、对脚本、看播出、复盘下一次该换谁。",
    "这个页面用杂志的方式放作品和成绩。你现在看到的图片、影片和数字都是示例，方便先把版式定下来。换成真实案例时，只改 src/data/content.ts。",
  ],
  facts: [
    { label: "机构", value: "InnAIO Japan" },
    { label: "职责", value: "海外达人合作 / 内容战役" },
    { label: "语言", value: "中文 · 日本語 · English" },
    { label: "常驻", value: "日本（示例）" },
  ],
};

export const contact = {
  title: "想合作，或只是打个招呼。",
  note: "邮箱和社交账号都是占位示例，上线前请换成你自己的。",
  links: [
    { label: "Email", value: "hello@tanaka.example", href: "mailto:hello@tanaka.example" },
    { label: "Instagram", value: "@tanaka.example", href: "https://instagram.com/" },
    { label: "小红书", value: "田中（示例）", href: "https://www.xiaohongshu.com/" },
    { label: "LinkedIn", value: "Tanaka", href: "https://www.linkedin.com/" },
  ],
};
