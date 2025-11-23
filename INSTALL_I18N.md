# 安装和启动 i18n

## 📦 安装依赖

运行以下命令安装必要的依赖：

```bash
pnpm add server-only
```

## 🚀 启动项目

```bash
pnpm dev
```

## 🧪 测试 i18n

### 1. 访问测试页面

打开浏览器访问：
- http://localhost:3000/test-i18n （会自动重定向到 /en/test-i18n 或 /zh/test-i18n）
- http://localhost:3000/en/test-i18n （英文版本）
- http://localhost:3000/zh/test-i18n （中文版本）

### 2. 测试自动语言检测

1. 清除浏览器 Cookie
2. 访问 http://localhost:3000
3. 系统会根据浏览器语言自动重定向

### 3. 测试语言切换

1. 访问任意页面
2. 点击右上角的语言切换按钮（English / 中文）
3. 页面会切换到对应语言版本

### 4. 测试 Cookie 持久化

1. 切换到中文
2. 关闭浏览器
3. 重新打开并访问网站
4. 应该自动显示中文版本

## 📋 已完成的工作

✅ 创建了 middleware 处理语言路由
✅ 创建了 i18n 配置和翻译文件（英文/中文）
✅ 创建了语言切换组件
✅ 创建了支持 i18n 的导航栏组件
✅ 创建了 [locale] 路由结构
✅ 创建了测试页面

## 🔄 需要迁移的内容

### 当前状态
- 旧的页面仍在 `src/app/` 目录下（about, blog, laboratory, projects）
- 新的 i18n 页面在 `src/app/[locale]/` 目录下

### 迁移步骤

#### 方案 1：逐步迁移（推荐）
1. 保留旧页面作为后备
2. 逐个更新组件支持 i18n
3. 测试完成后删除旧页面

#### 方案 2：快速迁移
1. 删除 `src/app/layout.tsx` 和 `src/app/page.tsx`
2. 所有流量都会通过 `[locale]` 路由
3. 更新所有组件使用翻译

## 🎯 下一步建议

### 1. 更新 InteractiveHomepage 组件

```tsx
// src/components/InteractiveHomepage.tsx
'use client'

import { type Locale, type Dictionary } from '@/i18n'

interface InteractiveHomepageProps {
  locale?: Locale
  dict?: Dictionary
}

export default function InteractiveHomepage({ locale, dict }: InteractiveHomepageProps) {
  // 使用 dict 替换硬编码文本
  // 使用 locale 构建链接
}
```

### 2. 更新页面传递 props

```tsx
// src/app/[locale]/page.tsx
import { getDictionary, type Locale } from '@/i18n'
import InteractiveHomepage from '@/components/InteractiveHomepage'

export default async function Home({ params: { locale } }: { params: { locale: Locale } }) {
  const dict = await getDictionary(locale)
  
  return <InteractiveHomepage locale={locale} dict={dict} />
}
```

### 3. 添加更多翻译

根据需要在 `src/i18n/dictionaries/` 中添加更多翻译内容。

### 4. 更新导航栏

将现有的 `NavigationBar` 替换为 `NavigationBarI18n`：

```tsx
import NavigationBarI18n from '@/components/layout/NavigationBarI18n'
import { getDictionary } from '@/i18n'

// 在服务端组件中
const dict = await getDictionary(locale)

<NavigationBarI18n 
  locale={locale}
  dict={dict}
  isAuthenticated={isAuthenticated}
  user={user}
  onLogin={handleLogin}
  onRegister={handleRegister}
  onLogout={handleLogout}
/>
```

## 🐛 故障排除

### 问题：访问 `/` 出现 404
**解决**：确保 middleware.ts 在 src 目录下，并且配置正确。

### 问题：翻译不显示
**解决**：检查 JSON 文件格式是否正确，确保没有语法错误。

### 问题：语言切换不工作
**解决**：检查浏览器控制台是否有错误，确保 Cookie 设置成功。

### 问题：构建失败
**解决**：确保安装了 `server-only` 包：
```bash
pnpm add server-only
```

## 📞 需要帮助？

如果遇到问题，请检查：
1. 浏览器控制台的错误信息
2. 终端的构建/运行日志
3. middleware 是否正确拦截请求
4. Cookie 是否正确设置

## 🎉 完成！

现在你的项目已经支持中英双语了！访问 http://localhost:3000 开始体验吧！
