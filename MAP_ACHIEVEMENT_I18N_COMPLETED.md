# MapNavigation & AchievementSystem 国际化完成

## 完成内容

已成功为 `MapNavigation` 和 `AchievementSystem` 组件添加国际化支持。

## 更新的文件

### 1. 字典文件
- `src/i18n/dictionaries/en.json` - 添加英文翻译
- `src/i18n/dictionaries/zh.json` - 添加中文翻译

### 2. 组件文件
- `src/components/adventure-map/MapNavigation.tsx` - 添加 dict prop 并使用翻译
- `src/components/adventure-map/AchievementSystem.tsx` - 添加 dict prop 并使用翻译
- `src/components/adventure-map/AdventureMap.tsx` - 传递 dict prop 给子组件

### 3. 类型定义
- `src/types/adventure-map.ts` - 更新 AdventureMapProps 接口

### 4. 页面组件
- `src/app/[locale]/projects/ProjectsPageClient.tsx` - 传递 dict prop
- `src/components/ProjectsPage.tsx` - 添加默认英文字典支持

## 新增的翻译键

### map_navigation
- `quick_navigation` - 快速导航
- `legend` - 图例
- `completed` - 已完成
- `in_development` - 开发中
- `maintained` - 维护中
- `featured_project` - 精选项目
- `controls` - 控制
- `drag_to_pan` - 拖动平移
- `scroll_to_zoom` - 滚动缩放
- `click_island` - 点击岛屿选择
- `hover_details` - 悬停查看详情

### achievements
- `title` - 成就
- `unlocked` - 成就解锁！
- `progress` - 进度
- `total_points` - 总积分
- `points` - 积分
- `unlocked_status` - 已解锁
- `explorer` - 探索者成就
- `demo_master` - 演示大师成就
- `tech_enthusiast` - 技术爱好者成就
- `interaction_champion` - 互动冠军成就
- `completionist` - 完美主义者成就
- `speed_runner` - 速通者成就
- `social_butterfly` - 社交达人成就
- `code_collaborator` - 代码协作者成就
- `rarity` - 稀有度（普通、稀有、史诗、传奇）

## 功能特性

1. **MapNavigation 组件**
   - 快速导航面板支持中英文
   - 图例标签支持中英文
   - 控制说明支持中英文
   - 项目状态显示支持中英文

2. **AchievementSystem 组件**
   - 成就面板标题和进度显示支持中英文
   - 8个成就的名称和描述支持中英文
   - 成就通知弹窗支持中英文
   - 稀有度标签支持中英文

## 测试建议

1. 切换语言查看快速导航面板
2. 切换语言查看图例和控制说明
3. 切换语言查看成就面板
4. 解锁成就时查看通知弹窗的语言
5. 验证项目状态标签的翻译

## 注意事项

- 所有文本内容已完全国际化
- 保持了原有的交互功能
- 支持中英文无缝切换
- 兼容旧版非国际化页面（使用默认英文字典）
