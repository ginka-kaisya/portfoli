# 田中作品集

InnAIO Japan 海外达人合作的个人作品集。日系清新杂志风，静态页面，适合免费放在 GitHub Pages 上，任何人随时都能打开。

现在的图片、影片和数字都是**示例**。换成真实内容时，主要只改一个文件：`src/data/content.ts`。

## 本地预览

需要 Node.js 20 或更新版本。

```bash
npm install
npm run dev
```

浏览器打开终端里显示的本地地址，路径是 `/portfoli/`，例如 `http://localhost:47281/portfoli/`。生产构建：

```bash
npm run build
npm run preview
```

构建结果在 `dist/`。生产环境的资源前缀是 `/portfoli/`，对应 GitHub Pages 地址 `https://ginka-kaisya.github.io/portfoli/`。本地 `npm run dev` 和 `npm run preview` 也挂在这个子路径下。

## 目录

| 路径 | 作用 |
| --- | --- |
| `src/data/content.ts` | 姓名、作品、数据、关于、联络。改这里。 |
| `src/main.ts` | 页面交互：筛选、灯箱、播放 |
| `src/style.css` | 版式 |
| `public/media/` | 本地 mp4 和你自己的封面图 |
| `public/media/sample-flower.mp4` | CC0 示例短片，可删 |
| `.github/workflows/pages.yml` | 推送到 `main` 后自动发布到 GitHub Pages |

若改了姓名，请同时改 `index.html` 里的 `<title>` 和 description，这样分享链接的标题也会变。

## 如何添加作品

打开 `src/data/content.ts`，在 `works` 数组里加一项。`id` 用英文，不要重复，分享链接会变成 `?work=你的id`。

```ts
{
  id: "summer-drop",
  title: "夏日上新",
  category: "夏季战役", // 新分类会自动出现在筛选里
  type: "image",       // image 或 video
  src: "media/summer.jpg",
  thumbnail: "media/summer-thumb.jpg",
  description: "这一条的简介。",
  date: "2026-08-01",  // YYYY-MM-DD
  frame: "portrait",   // portrait 竖图 / landscape 横图 / square 方图
  metrics: {           // 整段可删。不写，卡片和灯箱就不显示数据
    platform: "Instagram",
    views: "12万",
    likes: "6400",
    engagementRate: "5.2%",
  },
}
```

图片可以继续用完整的 https 地址，也可以把文件放进 `public/media/`，然后写 `media/文件名.jpg`（不要加开头的斜杠）。

筛选有「全部 / 图片 / 视频」，再加上作品里出现过的 `category`。

某条视频如果加上 `featured: true`，会在作品区顶部提供页内播放。只保留一个。

## 如何改数据看板

仍在 `src/data/content.ts`：

- `highlights`：五个大数字。改 `value`，小数位数用 `decimals`（互动率是 `1`）。
- `impressionSeries.points`：柱状图，按最大值自动缩放。
- `markets.items`：横向条。数字按相对大小画长度，不必加总成 100。`suffix` 是跟在数字后的符号，示例里是 `%`。

这些都是示例数据。

## 影片

支持两种：

1. **本地或直链 mp4 / webm / ogg**  
   把文件放进 `public/media/`，`src` 写成 `media/你的成片.mp4`。也可以填一个 https 直链。封面用 `thumbnail`。

2. **YouTube**  
   `src` 贴观看链接即可，例如：
   - `https://www.youtube.com/watch?v=视频ID`
   - `https://youtu.be/视频ID`
   - `https://www.youtube.com/shorts/视频ID`

卡片上的「播放」在页面里直接播；「在弹层中观看」或点标题会打开灯箱。图片点开是大图灯箱，可用键盘左右键切换、Esc 关闭。

## 部署到 GitHub Pages（免费、公开、随时可开）

仓库里已经有 `.github/workflows/pages.yml`。推送到 `main` 后，Actions 会构建 `dist/` 并发布。

仓库地址是 [github.com/ginka-kaisya/portfoli](https://github.com/ginka-kaisya/portfoli)（仓库名是 `portfoli`，不是 portfolio）。站点地址是 [ginka-kaisya.github.io/portfoli](https://ginka-kaisya.github.io/portfoli/)。

1. 把本项目推到 `ginka-kaisya/portfoli` 的 `main` 分支。
2. 打开仓库 Settings → Pages → Build and deployment，Source 选 **GitHub Actions**。
3. 等 Actions 里的 “Deploy GitHub Pages” 变绿。

`vite.config.ts` 里的 `base` 固定为 `/portfoli/`。构建出的样式、脚本、图标和 `public/media` 影片都会写成 `/portfoli/...`，和 Pages 子路径一致。不要改回 `/`，否则页面会去域名根目录找文件，样式和影片都会丢失。

第一次如果 Pages 没有自动出现，在仓库里用一次 workflow，或在 Settings → Pages 确认来源是 GitHub Actions。公开仓库的 Pages 站点对所有人开放，不需要登录。

## 其他静态托管

把 `dist/` 上传即可，例如 Cloudflare Pages、Netlify、Vercel：

- 构建命令：`npm run build`
- 输出目录：`dist`

## 素材与许可

- 字体：Google Fonts 上的 Noto Serif SC / Noto Serif JP / Noto Sans SC / Noto Sans JP / Cormorant Garamond，采用 SIL Open Font License。
- 示例图片：Unsplash，按 [Unsplash License](https://unsplash.com/license) 使用，只作占位。
- `public/media/sample-flower.mp4`：MDN 提供的 CC0 示例短片。
- 页面代码为这个项目本身，没有再打包第三方灯箱或图表库；播放、筛选和柱状图是页面自己的。

换成你自己的照片和成片之后，就可以删掉示例说明，或改掉页脚那一行「示例站点」。
