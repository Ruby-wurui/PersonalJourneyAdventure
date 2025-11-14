# 国际化 (i18n) 设置说明

## 📁 项目结构

```
src/
├── middleware.ts                    # 语言路由中间件
├── i18n/
│   ├── config.ts                   # i18n 配置
│   ├── get-dictionary.ts           # 字典加载函数
│   ├── index.ts                    # 导出文件
│   └── dictionaries/
│       ├── en.json                 # 英文翻译
│       └── zh.json                 # 中文翻译
├── app/
│   └── [locale]/                   # 语言路由
│       ├── layout.tsx              # 根布局
│       ├── page.tsx                # 首页
│       ├── about/
│       ├── blog/
│       ├── laboratory/
│       └── projects/
└── components/
    ├── LanguageSwitcher.tsx        # 语言切换组件
    └── layout/
        └── NavigationBarI18n.tsx   # 支持 i18n 的导航栏
```

## 🚀 工作原理

### 1. 自动语言检测
- 访问根路径 `/` 时，middleware 会自动检测用户语言偏好
- 检测顺序：URL 路径 → Cookie → Accept-Language 头
- 自动重定向到对应语言版本（如 `/en` 或 `/zh`）

### 2. URL 结构
```
/en          → 英文首页
/zh          → 中文首页
/en/about    → 英文关于页面
/zh/about    → 中文关于页面
/en/blog     → 英文博客
/zh/blog     → 中文博客
```

### 3. 语言切换
- 点击语言切换按钮会：
  1. 更新 URL 中的语言前缀
  2. 设置 `NEXT_LOCALE` Cookie（保存用户偏好）
  3. 刷新页面内容

## 📝 如何使用

### 在服务端组件中使用翻译

```tsx
import { getDictionary, type Locale } from '@/i18n'

export default async function Page({ 
  params: { locale } 
}: { 
  params: { locale: Locale } 
}) {
  const dict = await getDictionary(locale)
  
  return (
    <div>
      <h1>{dict.nav.home}</h1>
      <p>{dict.nav.home_desc}</p>
    </div>
  )
}
```

### 在客户端组件中使用翻译

由于客户端组件不能直接使用 `getDictionary`，需要从父组件传递：

```tsx
// 父组件（服务端）
import ClientComponent from './ClientComponent'
import { getDictionary } from '@/i18n'

export default async function Page({ params: { locale } }) {
  const dict = await getDictionary(locale)
  
  return <ClientComponent dict={dict} locale={locale} />
}

// 子组件（客户端）
'use client'

export default function ClientComponent({ dict, locale }) {
  return <div>{dict.nav.home}</div>
}
```

### 添加新的翻译

1. 在 `src/i18n/dictionaries/en.json` 添加英文：
```json
{
  "mySection": {
    "title": "My Title",
    "description": "My Description"
  }
}
```

2. 在 `src/i18n/dictionaries/zh.json` 添加中文：
```json
{
  "mySection": {
    "title": "我的标题",
    "description": "我的描述"
  }
}
```

3. 在组件中使用：
```tsx
<h1>{dict.mySection.title}</h1>
<p>{dict.mySection.description}</p>
```

## 🔧 配置

### 修改支持的语言

编辑 `src/i18n/config.ts`：

```typescript
export const locales = ['en', 'zh', 'ja'] as const  // 添加日语
export const defaultLocale = 'en' as const

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ja: '日本語',  // 添加日语名称
}
```

然后创建 `src/i18n/dictionaries/ja.json` 并在 `get-dictionary.ts` 中添加：

```typescript
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  zh: () => import('./dictionaries/zh.json').then((module) => module.default),
  ja: () => import('./dictionaries/ja.json').then((module) => module.default),
}
```

### 禁用自动语言检测

如果你想禁用自动检测，只使用手动切换，可以修改 `src/middleware.ts` 中的 `getLocale` 函数，移除 Accept-Language 检测部分。

## 🎯 下一步

### 需要更新的组件

以下组件需要更新以支持 i18n：

1. **InteractiveHomepage** - 主页组件
2. **AboutPage** - 关于页面（已有内容很多）
3. **ProjectsPage** - 项目页面
4. **BlogPage** - 博客页面

### 更新步骤

1. 将组件中的硬编码文本提取到翻译文件
2. 通过 props 传递 `dict` 和 `locale`
3. 使用 `dict.xxx.xxx` 替换硬编码文本
4. 更新所有内部链接使用 `/${locale}/path` 格式

### 示例：更新现有组件

```tsx
// 之前
<Link href="/about">About</Link>

// 之后
<Link href={`/${locale}/about`}>{dict.nav.about}</Link>
```

## 🐛 常见问题

### Q: 为什么访问 `/` 会重定向？
A: middleware 会自动检测语言并重定向到 `/en` 或 `/zh`。这是正常行为。

### Q: 如何测试不同语言？
A: 
1. 直接访问 `/en` 或 `/zh`
2. 使用语言切换按钮
3. 清除 Cookie 并修改浏览器语言设置

### Q: API 路由会受影响吗？
A: 不会。middleware 会跳过所有 `/api/*` 路径。

### Q: 静态文件会受影响吗？
A: 不会。middleware 会跳过所有包含文件扩展名的路径。

## 📚 参考资料

- [Next.js i18n 文档](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
