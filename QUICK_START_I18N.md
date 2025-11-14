# 🚀 i18n 快速启动指南

## 1️⃣ 安装依赖

```bash
pnpm install
```

## 2️⃣ 启动开发服务器

```bash
pnpm dev
```

## 3️⃣ 测试 i18n

打开浏览器访问：

### 测试页面（推荐先访问这个）
- http://localhost:3000/test-i18n

### 主要页面
- http://localhost:3000 （自动重定向到 /en 或 /zh）
- http://localhost:3000/en （英文版）
- http://localhost:3000/zh （中文版）

## 4️⃣ 验证功能

✅ 访问根路径会自动重定向到语言版本
✅ 点击语言切换按钮可以切换语言
✅ 刷新页面语言保持不变（Cookie）
✅ 所有链接都包含语言前缀

## 📁 关键文件

```
src/
├── middleware.ts                    # 🔑 语言路由核心
├── i18n/
│   ├── dictionaries/
│   │   ├── en.json                 # 🇺🇸 英文翻译
│   │   └── zh.json                 # 🇨🇳 中文翻译
│   └── get-dictionary.ts           # 📚 加载翻译
├── app/[locale]/                    # 🌍 多语言路由
│   ├── layout.tsx
│   ├── page.tsx
│   └── test-i18n/page.tsx          # 🧪 测试页面
└── components/
    ├── LanguageSwitcher.tsx         # 🔄 语言切换器
    └── layout/
        └── NavigationBarI18n.tsx    # 🧭 多语言导航栏
```

## 🎯 URL 结构

```
/                    → 自动重定向到 /en 或 /zh
/en                  → 英文首页
/zh                  → 中文首页
/en/about            → 英文关于页面
/zh/about            → 中文关于页面
/en/projects         → 英文项目页面
/zh/projects         → 中文项目页面
/en/blog             → 英文博客
/zh/blog             → 中文博客
/en/test-i18n        → 英文测试页面 ⭐
/zh/test-i18n        → 中文测试页面 ⭐
```

## 💡 使用示例

### 在服务端组件中

```tsx
import { getDictionary, type Locale } from '@/i18n'

export default async function Page({ params: { locale } }) {
  const dict = await getDictionary(locale)
  
  return <h1>{dict.nav.home}</h1>
}
```

### 在客户端组件中

```tsx
'use client'

export default function ClientComponent({ dict, locale }) {
  return (
    <div>
      <h1>{dict.nav.home}</h1>
      <Link href={`/${locale}/about`}>{dict.nav.about}</Link>
    </div>
  )
}
```

## 🔧 添加新翻译

1. 编辑 `src/i18n/dictionaries/en.json`：
```json
{
  "newSection": {
    "title": "New Title"
  }
}
```

2. 编辑 `src/i18n/dictionaries/zh.json`：
```json
{
  "newSection": {
    "title": "新标题"
  }
}
```

3. 在组件中使用：
```tsx
<h1>{dict.newSection.title}</h1>
```

## ✨ 已实现的功能

✅ 自动语言检测（基于浏览器设置）
✅ URL 语言前缀（/en, /zh）
✅ Cookie 持久化（记住用户选择）
✅ 语言切换组件
✅ 多语言导航栏
✅ 翻译文件（英文/中文）
✅ 测试页面

## 📝 下一步

查看详细文档：
- `I18N_SETUP.md` - 完整设置说明
- `INSTALL_I18N.md` - 安装和迁移指南

开始使用吧！🎉
