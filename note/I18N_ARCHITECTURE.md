# 🏗️ i18n 架构说明

## 📐 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                         用户请求                              │
│                    http://example.com/                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Middleware (语言检测)                      │
│  1. 检查 URL 路径 (/en, /zh)                                 │
│  2. 检查 Cookie (NEXT_LOCALE)                                │
│  3. 检查 Accept-Language 头                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  重定向到语言版本                              │
│              /en/* 或 /zh/*                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                [locale] 路由处理                              │
│         src/app/[locale]/layout.tsx                          │
│         src/app/[locale]/page.tsx                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              getDictionary(locale)                           │
│         加载对应语言的翻译文件                                 │
│    en.json 或 zh.json                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  渲染页面内容                                 │
│         使用翻译后的文本                                       │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 语言切换流程

```
┌─────────────────┐
│  用户点击语言按钮  │
│   (English/中文)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  LanguageSwitcher       │
│  1. 更新 URL 路径        │
│  2. 设置 Cookie         │
│  3. 触发页面导航         │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  router.push()          │
│  /en/page → /zh/page    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  页面重新加载            │
│  使用新语言的翻译         │
└─────────────────────────┘
```

## 📂 文件依赖关系

```
middleware.ts
    │
    ├─→ i18n/config.ts (locales, defaultLocale)
    │
    └─→ 重定向到 [locale] 路由

app/[locale]/layout.tsx
    │
    ├─→ i18n/config.ts (Locale type)
    ├─→ AuthProvider
    └─→ globals.css

app/[locale]/page.tsx
    │
    └─→ InteractiveHomepage

app/[locale]/test-i18n/page.tsx
    │
    ├─→ i18n/get-dictionary.ts
    ├─→ LanguageSwitcher
    └─→ 显示所有翻译

components/LanguageSwitcher.tsx
    │
    ├─→ i18n/config.ts (locales, localeNames)
    ├─→ usePathname (检测当前路径)
    └─→ useRouter (切换语言)

components/layout/NavigationBarI18n.tsx
    │
    ├─→ i18n types (Locale, Dictionary)
    ├─→ LanguageSwitcher
    └─→ 使用 dict 对象显示翻译

i18n/get-dictionary.ts
    │
    ├─→ i18n/config.ts (Locale type)
    ├─→ dictionaries/en.json
    └─→ dictionaries/zh.json
```

## 🎯 数据流

### 服务端渲染流程

```
1. 用户请求 /zh/about
         ↓
2. Next.js 匹配 [locale] 路由
         ↓
3. 提取 params.locale = 'zh'
         ↓
4. 调用 getDictionary('zh')
         ↓
5. 动态导入 zh.json
         ↓
6. 返回翻译对象 dict
         ↓
7. 传递给组件 props
         ↓
8. 渲染 HTML (服务端)
         ↓
9. 发送到浏览器
```

### 客户端交互流程

```
1. 用户点击语言切换
         ↓
2. LanguageSwitcher 更新 URL
         ↓
3. 设置 Cookie: NEXT_LOCALE=zh
         ↓
4. router.push('/zh/about')
         ↓
5. 触发页面导航
         ↓
6. 重新执行服务端渲染流程
         ↓
7. 使用新语言渲染页面
```

## 🔐 Cookie 机制

```
┌─────────────────────────────────────┐
│  NEXT_LOCALE Cookie                 │
│  ─────────────────────────────────  │
│  Name: NEXT_LOCALE                  │
│  Value: 'en' 或 'zh'                │
│  Path: /                            │
│  Max-Age: 31536000 (1年)            │
│  ─────────────────────────────────  │
│  作用:                               │
│  1. 记住用户语言偏好                  │
│  2. 下次访问自动使用该语言             │
│  3. 优先级高于 Accept-Language       │
└─────────────────────────────────────┘
```

## 🚦 路由优先级

```
Middleware 检测顺序:

1. URL 路径
   /en/about → locale = 'en' ✅ 最高优先级
   /zh/blog  → locale = 'zh' ✅

2. Cookie
   NEXT_LOCALE=zh → locale = 'zh' ✅ 中等优先级

3. Accept-Language 头
   zh-CN,zh;q=0.9,en;q=0.8 → locale = 'zh' ✅ 最低优先级

4. 默认语言
   如果以上都没有 → locale = 'en' ✅ 兜底
```

## 📊 性能优化

### 1. 动态导入翻译文件
```typescript
// 不是一次性加载所有语言
const dictionaries = {
  en: () => import('./dictionaries/en.json'),  // 按需加载
  zh: () => import('./dictionaries/zh.json'),  // 按需加载
}
```

### 2. 服务端渲染
```typescript
// 翻译在服务端完成，客户端直接接收翻译后的 HTML
export default async function Page({ params: { locale } }) {
  const dict = await getDictionary(locale)  // 服务端执行
  return <h1>{dict.nav.home}</h1>           // 已翻译的 HTML
}
```

### 3. 静态生成
```typescript
// 构建时预生成所有语言版本
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}
// 生成: /en/about.html, /zh/about.html
```

### 4. Cookie 缓存
```typescript
// 避免每次都检测语言
if (cookie.NEXT_LOCALE) {
  return cookie.NEXT_LOCALE  // 直接使用缓存
}
```

## 🔍 调试技巧

### 1. 查看 Middleware 日志
```typescript
// 在 middleware.ts 中添加
console.log('Detected locale:', locale)
console.log('Pathname:', pathname)
console.log('Cookie:', request.cookies.get('NEXT_LOCALE'))
```

### 2. 检查 Cookie
```javascript
// 浏览器控制台
document.cookie
// 输出: "NEXT_LOCALE=zh; ..."
```

### 3. 测试不同语言
```bash
# 清除 Cookie
# 浏览器 → 开发者工具 → Application → Cookies → 删除 NEXT_LOCALE

# 修改浏览器语言
# Chrome → 设置 → 语言 → 调整顺序
```

### 4. 使用测试页面
```
访问 /test-i18n 查看所有翻译
```

## 🎨 扩展性

### 添加新语言（如日语）

```typescript
// 1. 更新 config.ts
export const locales = ['en', 'zh', 'ja'] as const

// 2. 创建 dictionaries/ja.json
{
  "nav": {
    "home": "ホーム",
    ...
  }
}

// 3. 更新 get-dictionary.ts
const dictionaries = {
  en: () => import('./dictionaries/en.json'),
  zh: () => import('./dictionaries/zh.json'),
  ja: () => import('./dictionaries/ja.json'),
}

// 4. 更新 localeNames
export const localeNames = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
}
```

## 📈 最佳实践

1. **翻译文件组织**
   - 按功能模块分组（nav, auth, blog, etc.）
   - 使用嵌套结构保持清晰
   - 保持英文和中文文件结构一致

2. **组件设计**
   - 服务端组件负责加载翻译
   - 客户端组件接收翻译作为 props
   - 避免在客户端组件中直接调用 getDictionary

3. **链接处理**
   - 始终使用 `/${locale}/path` 格式
   - 使用 Link 组件而不是 <a> 标签
   - 保持语言前缀一致性

4. **测试**
   - 测试所有语言版本
   - 验证语言切换功能
   - 检查 Cookie 持久化
   - 确保 SEO 友好（lang 属性）

## 🎯 总结

这个 i18n 架构提供了：
- ✅ 自动语言检测
- ✅ 灵活的路由系统
- ✅ 高性能（按需加载、服务端渲染）
- ✅ 良好的用户体验（Cookie 持久化）
- ✅ 易于扩展（添加新语言）
- ✅ SEO 友好（URL 语言前缀）

完美支持你的多语言需求！🚀
