# Snowflake 项目

一个基于 React + TypeScript + Ant Design 的雪花图可视化工具，用于展示多维度的评分数据。

## 项目概述

Snowflake 是一个交互式的数据可视化项目，通过雪花形状的雷达图展示五个维度的评分数据。该项目特别适用于公司分析、投资评估等场景。

## 技术栈

- **前端框架**: React 19.2.0 + TypeScript
- **UI组件库**: Ant Design 5.28.1
- **构建工具**: Vite 7.2.2
- **样式**: TailwindCSS 4.1.17 + PostCSS
- **代码规范**: ESLint

## 项目结构

```
snowflake/
├── src/
│   ├── components/
│   │   ├── ControlPanel.tsx      # 控制面板组件
│   │   ├── SnowflakeCanvas.tsx   # 雪花图Canvas绘制组件
│   │   ├── SnowflakeChart.tsx    # 雪花图主组件
│   │   └── SnowflakeTooltip.tsx  # 工具提示组件
│   ├── utils/
│   │   ├── bezier.ts             # 贝塞尔曲线计算工具
│   │   └── color.ts              # 颜色转换工具
│   ├── types.ts                  # 类型定义
│   ├── App.tsx                   # 主应用组件
│   └── main.tsx                  # 应用入口
├── package.json
└── README.md
```

## 核心功能

### 1. 多维数据展示
- **五个评估维度**: VALUE（价值）、FUTURE（未来）、PAST（历史）、HEALTH（健康）、DIVIDEND（股息）
- **评分范围**: 0-7 分
- **扇形分段**: 每个维度分为6个扇形区域

### 2. 交互功能
- **模式切换**: COMPANY（公司模式）和 TOC（目录模式）
- **维度高亮**: 可选择特定维度进行高亮显示
- **实时调整**: 通过控制面板实时调整各维度分数
- **悬停提示**: 鼠标悬停显示维度详细信息
- **点击交互**: 点击扇形区域触发事件

### 3. 可视化特性
- **贝塞尔曲线**: 平滑的雪花形状边界
- **动态颜色**: 根据总分自动计算填充颜色
- **响应式设计**: 自适应不同屏幕尺寸
- **暗色主题**: 专业的深色界面设计

## 安装和运行

### 环境要求
- Node.js (推荐最新LTS版本)
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:5173 查看应用

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 使用说明

### 基本操作
1. **调整分数**: 在左侧控制面板中通过数字输入框调整各维度分数（0-7）
2. **模式切换**: 使用单选按钮在不同维度间切换高亮
3. **重置数据**: 点击 Reset 按钮恢复默认数据
4. **查看详情**: 鼠标悬停在雪花图上查看维度详细信息

### 数据格式
每个维度包含以下属性：
- `value`: 分数值 (0-7)
- `sections`: 6个布尔值组成的数组，表示扇形区域状态
- `description`: 维度描述文本

## 核心组件

### SnowflakeChart
主雪花图组件，负责协调 Canvas 绘制和交互逻辑。

### SnowflakeCanvas
Canvas 绘制组件，处理图形渲染、鼠标事件和动画效果。

### ControlPanel
控制面板组件，提供分数调整和模式切换功能。

## 工具函数

### bezier.ts
提供贝塞尔曲线控制点计算，用于生成平滑的雪花形状。

### color.ts
分数到颜色的转换工具，根据总分计算对应的渐变色。

## 开发说明

### 添加新维度
1. 在 `types.ts` 中更新 `DimKey` 类型定义
2. 在 `DIMENSIONS` 数组中添加新维度
3. 更新默认数据配置

### 自定义样式
- 主要样式通过内联样式和 Ant Design 组件控制
- 颜色主题可在 `color.ts` 中调整
- Canvas 绘制参数在 `SnowflakeCanvas.tsx` 中配置
