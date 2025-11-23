# 🌍 国际化 (i18n) - 快速开始

## 🎯 已完成

你的 Next.js 项目现在支持**中英双语**！

## 🚀 立即开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 启动项目
```bash
pnpm dev
```

### 3. 测试 i18n
打开浏览器访问：
```
http://localhost:3000/test-i18n
```

## ✨ 功能特性

- ✅ **自动语言检测** - 根据浏览器语言自动选择
- ✅ **URL 语言前缀** - `/en/about` 或 `/zh/about`
- ✅ **语言切换按钮** - 一键切换中英文
- ✅ **Cookie 持久化** - 记住用户语言偏好
- ✅ **完整翻译** - 导航栏、按钮、标签等

## 📖 文档

- **快速开始**: `QUICK_START_I18N.md`
- **详细设置**: `I18N_SETUP.md`
- **安装指南**: `INSTALL_I18N.md`
- **完整总结**: `I18N_SUMMARY.md`

## 🎨 URL 示例

```
/                → 自动重定向到 /en 或 /zh
/en              → 英文首页
/zh              → 中文首页
/en/about        → 英文关于页面
/zh/about        → 中文关于页面
/en/projects     → 英文项目页面
/zh/projects     → 中文项目页面
/en/blog         → 英文博客
/zh/blog         → 中文博客
```

## 🔧 核心文件

```
src/
├── middleware.ts                    # 语言路由
├── i18n/
│   ├── dictionaries/
│   │   ├── en.json                 # 英文翻译
│   │   └── zh.json                 # 中文翻译
│   └── get-dictionary.ts           # 加载翻译
├── app/[locale]/                    # 多语言路由
└── components/
    ├── LanguageSwitcher.tsx         # 语言切换
    └── layout/
        └── NavigationBarI18n.tsx    # 多语言导航栏
```

## 💡 使用示例

### 服务端组件
```tsx
import { getDictionary } from '@/i18n'

export default async function Page({ params: { locale } }) {
  const dict = await getDictionary(locale)
  return <h1>{dict.nav.home}</h1>
}
```

### 客户端组件
```tsx
'use client'

export default function Component({ dict, locale }) {
  return <h1>{dict.nav.home}</h1>
}
```

## 🎉 开始使用

运行 `pnpm install && pnpm dev`，然后访问 http://localhost:3000

祝你使用愉快！
