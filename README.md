# 飞书MCP服务器

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js->=23-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

飞书MCP服务器是一个基于[Model Context Protocol](https://modelcontextprotocol.ai/)的服务，提供飞书API集成，支持文档读取和机器人消息发送等功能，使AI模型能够轻松与飞书服务交互。

## 功能特点

- **文档服务**：读取飞书文档内容和元数据
- **机器人服务**：发送文本消息和交互卡片到飞书聊天
- **双模式支持**：
  - STDIO模式：适用于CLI环境，通过标准输入/输出通信
  - HTTP模式：提供HTTP接口，支持SSE连接
- **模块化架构**：易于扩展新功能和集成其他飞书API

## 项目结构

该项目采用模块化、分层架构设计，确保代码易于理解和扩展：

```
/src
  /client        # API客户端实现
  /server        # MCP服务器实现
    /tools       # MCP工具注册
  /services      # 服务层实现
    /documents   # 文档相关服务
    /bots        # 机器人相关服务
  /typings       # 类型定义
  /utils         # 工具函数
  config.ts      # 配置管理
  index.ts       # 入口点
```

## 安装

### 前提条件

- Node.js 23.0或更高版本
- npm或yarn包管理器
- 有效的飞书开发者账号和应用

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/yourusername/feishu-mcp-server.git
cd feishu-mcp-server
```

2. 安装依赖

```bash
pnpm install
```

3. 创建`.env`文件（或设置环境变量）

```
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
PORT=3344
```

## 开发规范

本项目使用husky和lint-staged来确保代码质量和一致性：

### Git提交规范

提交消息必须遵循以下格式：
```
<type>(<scope>): <subject>
```

例如：
- `feat(bot): 添加发送卡片功能`
- `fix(documents): 修复文档内容获取错误`

支持的类型：
- `feat`: 新功能
- `fix`: 修复Bug
- `docs`: 文档变更
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 自动代码检查

- 提交前会自动运行代码检查和格式化
- 推送前会运行类型检查和构建验证

### 手动运行检查

```bash
# 运行代码检查
pnpm lint

# 运行代码检查并修复
pnpm lint:fix

# 运行代码格式化
pnpm format
```

## 使用方法

### 开发模式

```bash
pnpm start
```

### 构建和运行

```bash
pnpm build
node dist/index.js
```

### 命令行参数

服务器支持以下命令行参数：

```bash
node dist/index.js --feishu-app-id=your_app_id --feishu-app-secret=your_app_secret --port=3344
```

### STDIO模式

对于集成到其他应用中，可以使用STDIO模式：

```bash
NODE_ENV=cli node dist/index.js
```

或

```bash
node dist/index.js --stdio
```

## 配置选项

| 选项 | 环境变量 | 命令行参数 | 默认值 | 描述 |
|------|----------|------------|--------|------|
| 飞书应用ID | `FEISHU_APP_ID` | `--feishu-app-id` | - | 飞书应用的App ID |
| 飞书应用密钥 | `FEISHU_APP_SECRET` | `--feishu-app-secret` | - | 飞书应用的App Secret |
| 服务器端口 | `PORT` | `--port` | 3344 | HTTP服务器端口号 |

## API文档

### 文档操作

#### `get_feishu_doc_raw`

获取飞书文档的原始内容。

参数：
- `docId` - 文档ID，通常在URL中找到 (例如：feishu.cn/wiki/<documentId>)

返回：
- 文档的文本内容

#### `get_feishu_doc_info`

获取飞书文档的元数据信息。

参数：
- `docId` - 文档ID

返回：
- 文档的元数据（JSON格式）

### 机器人操作

#### `send_feishu_text_message`

发送文本消息到飞书聊天。

参数：
- `chatId` - 聊天ID
- `text` - 要发送的文本内容

返回：
- 发送状态和消息ID

#### `send_feishu_card`

发送交互卡片到飞书聊天。

参数：
- `chatId` - 聊天ID
- `cardContent` - 卡片内容（JSON字符串）

返回：
- 发送状态和消息ID

## 扩展指南

该项目设计为易于扩展，如需添加新功能：

1. 在适当的目录下创建新的客户端类（如`services/[feature]/[feature]-client.ts`）
2. 创建相应的服务类（如`services/[feature]/[feature]-service.ts`）
3. 在`services/index.ts`中注册新服务
4. 添加相应的MCP工具（在`server/tools/[feature]-tools.ts`）
5. 在`server/tools/index.ts`中注册新工具

## 许可证

MIT

## 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m 'feat: add some amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 开启Pull Request
