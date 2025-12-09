# 🚀 i18n 快速参考

## 📍 当前状态

✅ **已完成**
- Middleware 语言路由
- 翻译文件（英文/中文）
- 语言切换组件
- 导航栏国际化
- 主页国际化

## 🌐 URL 结构

```
/                    → 自动重定向
/en                  → 英文主页 ✅
/zh                  → 中文主页 ✅
/en/about            → 英文关于
/zh/about            → 中文关于
/en/projects         → 英文项目
/zh/projects         → 中文项目
/en/blog             → 英文博客
/zh/blog             → 中文博客
/en/test-i18n        → 英文测试 ✅
/zh/test-i18n        → 中文测试 ✅
```

## 💻 代码示例

### 服务端组件
```tsx
import { getDictionary, type Locale } from '@/i18n'

export default async function Page({ 
  params: { locale } 
}: { 
  params: { locale: Locale } 
}) {
  const dict = await getDictionary(locale)
  return <h1>{dict.nav.home}</h1>
}
```

### 客户端组件
```tsx
'use client'
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/get-dictionary'

interface Props {
  locale: Locale
  dict: Dictionary
}

export default function Component({ locale, dict }: Props) {
  return <h1>{dict.nav.home}</h1>
}
```

### 添加翻译
```json
// en.json
{
  "mySection": {
    "title": "My Title"
  }
}

// zh.json
{
  "mySection": {
    "title": "我的标题"
  }
}
```

### 使用翻译
```tsx
<h1>{dict.mySection.title}</h1>
```

## 📦 文件位置

```
src/
├── middleware.ts                    # 语言路由
├── i18n/
│   ├── config.ts                   # 配置
│   ├── get-dictionary.ts           # 加载器
│   └── dictionaries/
│       ├── en.json                 # 英文
│       └── zh.json                 # 中文
├── app/[locale]/                    # 路由
└── components/
    ├── LanguageSwitcher.tsx         # 切换器
    └── layout/
        └── NavigationBarI18n.tsx    # 导航栏
```

## 🔧 常用命令

```bash
# 安装依赖
pnpm install

# 启动开发
pnpm dev

# 访问测试
open http://localhost:3000/en/test-i18n
```

## 🐛 故障排除

### 404 错误
- 确保旧的 layout.tsx 和 page.tsx 已备份
- 重启开发服务器

### server-only 错误
- 客户端组件只导入 `@/i18n/config`
- 不要导入 `getDictionary`

### 翻译不显示
- 检查 JSON 格式
- 确认键名正确
- 查看浏览器控制台

## 📚 文档

- **START_HERE.md** - 开始使用
- **TROUBLESHOOTING.md** - 故障排除
- **I18N_IMPLEMENTATION.md** - 实现详情
- **I18N_ARCHITECTURE.md** - 架构说明

## ✨ 快速测试

1. 运行 `pnpm dev`
2. 访问 `http://localhost:3000`
3. 点击语言切换按钮
4. 观察 URL 和内容变化

## 🎯 下一步

- [ ] 完成 About 页面翻译
- [ ] 完成 Projects 页面翻译
- [ ] 完成 Blog 页面翻译
- [ ] 添加更多语言（可选）

---

**提示**: 保存此文件作为快速参考！
