# 🔧 故障排除指南

## ✅ 已修复的问题

### 1. 404 错误 - 路由冲突

**问题**: 访问 `/en/test-i18n` 返回 404

**原因**: 
- `src/app/layout.tsx` 和 `src/app/page.tsx` 与新的 `[locale]` 路由冲突
- `src/app/[lang]` 目录也造成了冲突

**解决方案**:
```bash
# 已备份的文件
src/app/layout.tsx.backup
src/app/page.tsx.backup
src/app/[lang].backup/
```

这些文件已被重命名为 `.backup`，现在 `[locale]` 路由可以正常工作了。

### 2. server-only 错误

**问题**: 
```
You're importing a component that needs server-only. 
That only works in a Server Component...
```

**原因**: 
客户端组件（'use client'）尝试导入包含 `server-only` 的模块

**解决方案**:
更新导入路径，只导入配置文件，不导入 server-only 模块：

```typescript
// ❌ 错误 - 在客户端组件中
import { locales, type Locale } from '@/i18n'

// ✅ 正确 - 只导入配置
import { locales, type Locale } from '@/i18n/config'
```

**已修复的文件**:
- `src/components/LanguageSwitcher.tsx`
- `src/components/layout/NavigationBarI18n.tsx`
- `src/app/[locale]/layout.tsx`

## 🚀 现在可以使用了

### 启动项目
```bash
pnpm dev
```

### 测试 URL
```
http://localhost:3000              → 重定向到 /en 或 /zh
http://localhost:3000/en           → 英文首页 ✅
http://localhost:3000/zh           → 中文首页 ✅
http://localhost:3000/en/test-i18n → 英文测试页面 ✅
http://localhost:3000/zh/test-i18n → 中文测试页面 ✅
```

## 📁 文件结构说明

### 当前活动的路由
```
src/app/[locale]/          ← 新的多语言路由（活动）
├── layout.tsx
├── page.tsx
├── about/
├── blog/
├── laboratory/
├── projects/
└── test-i18n/
```

### 备份的文件
```
src/app/
├── layout.tsx.backup      ← 旧的根布局（备份）
├── page.tsx.backup        ← 旧的首页（备份）
├── [lang].backup/         ← 旧的语言路由（备份）
├── about/                 ← 旧的页面（保留，但不会被访问）
├── blog/                  ← 旧的页面（保留，但不会被访问）
├── laboratory/            ← 旧的页面（保留，但不会被访问）
└── projects/              ← 旧的页面（保留，但不会被访问）
```

## 🔄 导入规则

### 服务端组件
```typescript
// ✅ 可以导入所有内容
import { getDictionary, type Locale } from '@/i18n'
import { locales, defaultLocale } from '@/i18n/config'
```

### 客户端组件
```typescript
// ✅ 只导入配置和类型
import { locales, localeNames, type Locale } from '@/i18n/config'

// ❌ 不要导入 getDictionary（它使用 server-only）
// import { getDictionary } from '@/i18n'
```

### 类型导入
```typescript
// ✅ 类型可以安全导入
import type { Locale } from '@/i18n/config'
import type { Dictionary } from '@/i18n/get-dictionary'
```

## 🐛 常见问题

### Q: 为什么访问 `/about` 不工作？
A: 现在所有路由都需要语言前缀。使用 `/en/about` 或 `/zh/about`。

### Q: 旧的页面还能恢复吗？
A: 可以！备份文件都在，只需要重命名回来：
```bash
mv src/app/layout.tsx.backup src/app/layout.tsx
mv src/app/page.tsx.backup src/app/page.tsx
```
但这会导致 `[locale]` 路由失效。

### Q: 如何完全切换到新路由？
A: 删除旧的页面目录：
```bash
rm -rf src/app/about
rm -rf src/app/blog
rm -rf src/app/laboratory
rm -rf src/app/projects
```
然后更新所有组件使用新的 `[locale]` 路由。

### Q: 开发服务器需要重启吗？
A: 是的，修改路由结构后需要重启：
```bash
# 停止当前服务器 (Ctrl+C)
pnpm dev
```

## 📊 迁移状态

### ✅ 已完成
- [x] 创建 `[locale]` 路由结构
- [x] 备份旧的根文件
- [x] 修复 server-only 导入问题
- [x] 创建测试页面
- [x] 语言切换功能

### 🔄 进行中
- [ ] 更新现有组件支持 i18n
- [ ] 迁移所有页面内容
- [ ] 添加更多翻译

### 📝 待办
- [ ] 删除旧的页面目录（可选）
- [ ] 更新所有内部链接
- [ ] SEO 优化（hreflang 标签）

## 🎯 下一步

1. **测试功能**
   ```bash
   pnpm dev
   # 访问 http://localhost:3000/en/test-i18n
   ```

2. **验证语言切换**
   - 点击语言切换按钮
   - 检查 URL 变化
   - 验证内容翻译

3. **开始迁移组件**
   - 从 `InteractiveHomepage` 开始
   - 提取硬编码文本到翻译文件
   - 更新组件接收 `locale` 和 `dict` props

## 💡 提示

- 保持开发服务器运行时的控制台输出，它会显示有用的错误信息
- 使用浏览器开发者工具的 Network 标签查看请求
- 检查 Application → Cookies 确认 `NEXT_LOCALE` 设置正确
- 使用测试页面 `/test-i18n` 验证翻译

## 🎉 成功！

如果你能访问 `http://localhost:3000/en/test-i18n` 并看到测试页面，说明 i18n 已经成功配置！

继续探索其他功能吧！🚀
