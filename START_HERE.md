# 🎯 从这里开始 - i18n 国际化

## 🚀 三步启动

### 1️⃣ 安装
```bash
pnpm install
```

### 2️⃣ 启动
```bash
pnpm dev
```

### 3️⃣ 测试
打开浏览器访问：
```
http://localhost:3000/test-i18n
```

## ✨ 你会看到什么

- 🌍 自动语言检测和重定向
- 🔄 语言切换按钮（English / 中文）
- 📝 所有翻译内容展示
- 🔗 多语言链接测试

## 📚 文档导航

### 快速了解（5分钟）
1. **START_HERE.md** ← 你在这里
2. **README_I18N.md** - 快速概览
3. **QUICK_START_I18N.md** - 快速开始

### 深入学习（15分钟）
4. **I18N_SETUP.md** - 详细设置说明
5. **I18N_ARCHITECTURE.md** - 架构设计
6. **INSTALL_I18N.md** - 安装和迁移

### 完整参考（30分钟）
7. **I18N_SUMMARY.md** - 完整总结
8. **I18N_CHECKLIST.md** - 测试检查清单

## 🎨 已创建的文件

### 核心代码
```
src/
├── middleware.ts                    ✅ 语言路由
├── i18n/
│   ├── config.ts                   ✅ 配置
│   ├── get-dictionary.ts           ✅ 加载翻译
│   ├── index.ts                    ✅ 导出
│   └── dictionaries/
│       ├── en.json                 ✅ 英文
│       └── zh.json                 ✅ 中文
├── app/[locale]/                    ✅ 多语言路由
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/
│   ├── blog/
│   ├── laboratory/
│   ├── projects/
│   └── test-i18n/                  ✅ 测试页面
└── components/
    ├── LanguageSwitcher.tsx         ✅ 语言切换
    └── layout/
        └── NavigationBarI18n.tsx    ✅ 多语言导航栏
```

### 文档
```
├── START_HERE.md                    ✅ 你在这里
├── README_I18N.md                   ✅ 快速概览
├── QUICK_START_I18N.md              ✅ 快速开始
├── I18N_SETUP.md                    ✅ 详细设置
├── I18N_ARCHITECTURE.md             ✅ 架构设计
├── INSTALL_I18N.md                  ✅ 安装指南
├── I18N_SUMMARY.md                  ✅ 完整总结
└── I18N_CHECKLIST.md                ✅ 检查清单
```

## 🎯 URL 示例

```
访问这些 URL 测试功能：

http://localhost:3000
  → 自动重定向到 /en 或 /zh

http://localhost:3000/en
  → 英文首页

http://localhost:3000/zh
  → 中文首页

http://localhost:3000/en/test-i18n
  → 英文测试页面 ⭐ 推荐先访问这个

http://localhost:3000/zh/test-i18n
  → 中文测试页面 ⭐ 推荐先访问这个

http://localhost:3000/en/about
  → 英文关于页面

http://localhost:3000/zh/about
  → 中文关于页面
```

## ✅ 功能清单

- ✅ 自动语言检测（基于浏览器设置）
- ✅ URL 语言前缀（/en, /zh）
- ✅ Cookie 持久化（记住用户选择）
- ✅ 语言切换组件
- ✅ 多语言导航栏
- ✅ 完整的翻译系统
- ✅ 测试页面
- ✅ 详细文档

## 🎓 学习路径

### 初学者
1. 运行项目
2. 访问测试页面
3. 尝试切换语言
4. 阅读 README_I18N.md

### 开发者
1. 查看 I18N_ARCHITECTURE.md 了解架构
2. 阅读 I18N_SETUP.md 学习使用
3. 参考代码示例
4. 开始迁移现有组件

### 高级用户
1. 研究 middleware.ts 实现
2. 自定义翻译结构
3. 添加新语言
4. 优化性能

## 💡 快速示例

### 在组件中使用翻译

```tsx
// 服务端组件
import { getDictionary } from '@/i18n'

export default async function Page({ params: { locale } }) {
  const dict = await getDictionary(locale)
  
  return (
    <div>
      <h1>{dict.nav.home}</h1>
      <p>{dict.nav.home_desc}</p>
    </div>
  )
}
```

### 添加新翻译

```json
// src/i18n/dictionaries/en.json
{
  "mySection": {
    "title": "My Title"
  }
}

// src/i18n/dictionaries/zh.json
{
  "mySection": {
    "title": "我的标题"
  }
}
```

### 使用语言切换

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher'

<LanguageSwitcher currentLocale={locale} />
```

## 🐛 遇到问题？

### ⚠️ 常见问题已修复

如果遇到以下问题，请查看 **TROUBLESHOOTING.md**：
- ✅ 404 错误（路由冲突）- 已修复
- ✅ server-only 错误 - 已修复

### 快速修复

1. **安装失败**
   ```bash
   rm -rf node_modules pnpm-lock.yaml
   pnpm install
   ```

2. **启动失败**
   ```bash
   # 检查端口是否被占用
   lsof -ti:3000 | xargs kill -9
   pnpm dev
   ```

3. **翻译不显示**
   - 检查 JSON 文件格式
   - 查看浏览器控制台
   - 重启开发服务器

4. **语言切换不工作**
   - 清除浏览器 Cookie
   - 检查 middleware.ts
   - 查看 Network 标签

### 获取帮助

- 📖 **TROUBLESHOOTING.md** - 故障排除指南
- 📖 查看其他文档
- 🔍 搜索错误信息
- 🧪 访问测试页面
- 💬 检查控制台日志

## 🎉 开始使用

现在运行：

```bash
pnpm install && pnpm dev
```

然后访问：

```
http://localhost:3000/test-i18n
```

享受你的多语言网站吧！🌍✨

---

**提示**: 如果这是你第一次使用，建议先访问测试页面 `/test-i18n` 来了解所有功能！
