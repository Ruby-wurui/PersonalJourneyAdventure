# 游戏中心页面 (Games Center Page)

## 概述

这是一个游戏集成页面，展示所有可用的交互式游戏。用户可以浏览游戏列表，点击游戏卡片跳转到对应的游戏页面。

## 文件结构

```
src/app/[locale]/games/
├── page.tsx              # Next.js 服务端页面组件
├── GamesPageClient.tsx   # 客户端组件（包含交互逻辑）
└── README.md            # 本文档
```

## 功能特性

### 1. 游戏卡片展示
- 每个游戏以卡片形式展示
- 包含游戏标题、描述、预览图和标签
- 悬停时显示播放按钮和动画效果

### 2. 响应式设计
- 移动端：单列布局
- 平板：双列布局
- 桌面：三列布局

### 3. 国际化支持
- 支持中文和英文
- 所有文本从字典文件读取

### 4. 动画效果
- 使用 Framer Motion 实现流畅的进入动画
- 卡片悬停时的缩放和提升效果
- 渐变色叠加效果

## 如何添加新游戏

在 `GamesPageClient.tsx` 中的 `games` 数组添加新游戏对象：

```typescript
{
    id: 'game-id',                    // 唯一标识符
    title: dict.games?.game_title,    // 游戏标题（从字典读取）
    description: dict.games?.game_desc, // 游戏描述
    image: '/path/to/preview.jpg',    // 预览图路径
    tags: ['Tag1', 'Tag2'],           // 技术标签
    path: `/${locale}/game-path`,     // 游戏页面路径
    gradient: 'from-color to-color'   // 渐变色类名
}
```

然后在字典文件中添加对应的翻译：

**zh.json:**
```json
"games": {
    "game_title": "游戏标题",
    "game_desc": "游戏描述"
}
```

**en.json:**
```json
"games": {
    "game_title": "Game Title",
    "game_desc": "Game Description"
}
```

## 样式参考

页面样式参考了 About 页面的设计风格：
- 深色背景 (#050505)
- 交互式网格背景
- 玻璃态效果（backdrop-blur）
- 渐变色强调
- 流畅的动画过渡

## 导航集成

游戏中心已集成到主导航栏中：
- 图标：🎮
- 路径：`/{locale}/games`
- 在所有页面的导航栏中可见

## 技术栈

- **Next.js 14+**: 服务端渲染和路由
- **React 18+**: UI 组件
- **TypeScript**: 类型安全
- **Framer Motion**: 动画效果
- **Tailwind CSS**: 样式系统
- **i18n**: 国际化支持
