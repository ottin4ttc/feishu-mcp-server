# 飞书MCP服务器

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js->=23-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

飞书MCP服务器是一个基于[Model Context Protocol](https://modelcontextprotocol.ai/)的服务，提供飞书API集成，使AI模型能够轻松与飞书服务交互。

## 目录

- [功能特点](#功能特点)
- [项目架构](#项目架构)
  - [代码结构](#代码结构)
  - [设计原则](#设计原则)
  - [工作流程](#工作流程)
- [快速开始](#快速开始)
  - [前提条件](#前提条件)
  - [安装步骤](#安装步骤)
  - [运行服务](#运行服务)
- [配置说明](#配置说明)
- [API文档](#api文档)
  - [搜索操作](#搜索操作)
  - [文档操作](#文档操作)
  - [机器人操作](#机器人操作)
  - [聊天操作](#聊天操作)
  - [多维表格操作](#多维表格操作)
  - [用户操作](#用户操作)
  - [部门操作](#部门操作)
  - [日历操作](#日历操作)
  - [任务操作](#任务操作)
- [开发指南](#开发指南)
  - [代码规范](#代码规范)
  - [错误处理](#错误处理)
  - [提交规范](#提交规范)
  - [扩展指南](#扩展指南)
- [常见问题](#常见问题)
- [许可证](#许可证)
- [贡献指南](#贡献指南)

## 功能特点

- **文档服务**：读取飞书文档内容和元数据
- **机器人服务**：发送文本消息和交互卡片到飞书聊天
- **聊天服务**：管理群组和聊天会话
- **多模式支持**：
  - **STDIO模式**：通过标准输入/输出通信，适用于CLI环境和集成到其他应用
  - **HTTP模式**：提供REST API和SSE连接，适用于Web服务和分布式部署
- **完善的错误处理**：统一的错误处理机制，提供详细的错误信息
- **类型安全**：基于TypeScript，提供完整的类型定义
- **模块化架构**：易于扩展新功能和集成其他飞书API

## 项目架构

### 代码结构

```
/src
  /client        # API客户端实现（底层API请求封装）
    /documents   # 文档相关API客户端
    /bots        # 机器人API客户端
    /chats       # 聊天相关API客户端
  /services      # 服务层实现（业务逻辑和错误处理）
    /documents   # 文档相关服务
    /bots        # 机器人相关服务
    /chats       # 聊天相关服务
  /server        # MCP服务器实现
    /tools       # MCP工具注册和实现
  /typings       # 类型定义
  /utils         # 通用工具函数
  /http          # HTTP服务器实现
  /logger        # 日志服务
  /consts        # 常量定义
  config.ts      # 配置管理
  index.ts       # 入口点
```

### 设计原则

项目采用分层架构设计，确保关注点分离和职责明确：

#### 1. 分层职责

- **客户端层（Client）**
  - 封装HTTP请求的细节
  - 处理底层API参数和响应格式
  - 管理认证和令牌刷新
  - 不包含业务逻辑

- **服务层（Service）**
  - 使用客户端执行API操作
  - 实现业务逻辑
  - 处理和转换错误
  - 提供友好的接口给上层使用

- **工具层（Tools）**
  - 实现MCP协议定义的工具
  - 处理参数验证和格式转换
  - 调用服务层完成实际操作
  - 格式化返回结果

#### 2. 依赖方向

- 服务层依赖客户端层
- 工具层依赖服务层
- 严格避免循环依赖

#### 3. 错误处理策略

- 使用 `FeiShuApiError` 统一处理API错误
- 客户端层返回原始错误
- 服务层捕获并转换为业务相关错误
- 工具层处理所有异常并返回用户友好消息

### 工作流程

1. MCP服务器接收请求（STDIO或HTTP）
2. 工具层验证参数并调用相应服务
3. 服务层实现业务逻辑并调用客户端
4. 客户端执行实际API请求并返回结果
5. 结果经由服务层处理后返回给工具层
6. 工具层格式化结果并返回给MCP服务器

## 快速开始

### 前提条件

- Node.js 23.0或更高版本
- pnpm包管理器
- 有效的飞书开发者账号和已创建的自建应用

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

3. 创建`.env`文件

```
# 飞书应用凭证（必填）
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret

# 服务器配置（可选）
PORT=3344
LOG_LEVEL=info
```

### 运行服务

#### 开发模式

```bash
# 开发模式（自动重启）
pnpm dev

# 或使用普通启动
pnpm start
```

#### 生产模式

```bash
# 构建项目
pnpm build

# 运行编译后的代码
node dist/index.js
```

#### STDIO模式

```bash
# 方法1：使用环境变量
NODE_ENV=cli node dist/index.js

# 方法2：使用命令行参数
node dist/index.js --stdio
```

## 配置说明

| 选项 | 环境变量 | 命令行参数 | 默认值 | 描述 |
|------|----------|------------|--------|------|
| 飞书应用ID | `FEISHU_APP_ID` | `--feishu-app-id` | - | 飞书自建应用的App ID |
| 飞书应用密钥 | `FEISHU_APP_SECRET` | `--feishu-app-secret` | - | 飞书自建应用的App Secret |
| 服务器端口 | `PORT` | `--port` | 3344 | HTTP服务器端口号 |
| 日志级别 | `LOG_LEVEL` | `--log-level` | info | 日志级别(debug/info/warn/error) |
| 令牌缓存时间 | `TOKEN_CACHE_DURATION` | - | 7100 | 访问令牌缓存时间(秒) |

## API文档

### 搜索操作

#### `search_feishu_users`

搜索飞书用户。

参数：
- `query` - 搜索关键词
- `pageSize` - 每页返回的用户数量，可选，默认为20
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 搜索结果用户列表（JSON格式）

#### `search_feishu_messages`

搜索飞书消息。

参数：
- `query` - 搜索关键词
- `messageType` - 消息类型，可选，如'text'、'interactive'等
- `pageSize` - 每页返回的消息数量，可选，默认为20
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 搜索结果消息列表（JSON格式）

#### `search_feishu_docs`

搜索飞书文档。

参数：
- `query` - 搜索关键词
- `type` - 文档类型，可选，如'docx'、'sheet'等
- `pageSize` - 每页返回的文档数量，可选，默认为20
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 搜索结果文档列表（JSON格式）

### 文档操作

#### `get_feishu_doc_raw`

获取飞书文档的原始内容。

参数：
- `docId` - 文档ID，通常在URL中找到 (例如：feishu.cn/docx/<documentId>)

返回：
- 文档的文本内容

#### `get_feishu_doc_info`

获取飞书文档的元数据信息。

参数：
- `docId` - 文档ID

返回：
- 文档的元数据（JSON格式）

#### `update_feishu_doc`

更新飞书文档内容。

参数：
- `docId` - 文档ID
- `content` - 新的文档内容
- `revision` - 文档修订版本号，可选

返回：
- 更新状态和文档信息

#### `delete_feishu_doc`

删除飞书文档。

参数：
- `docId` - 文档ID

返回：
- 删除状态

#### `get_feishu_doc_blocks`

获取飞书文档的块内容。

参数：
- `docId` - 文档ID
- `blockId` - 块ID，可选，不提供时获取所有块
- `pageSize` - 每页返回的块数量，可选，默认为20
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 文档块列表（JSON格式）

#### `search_feishu_docs`

搜索飞书文档。

参数：
- `query` - 搜索关键词
- `type` - 文档类型，可选，如'docx'、'sheet'等
- `pageSize` - 每页返回的文档数量，可选，默认为20
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 搜索结果文档列表（JSON格式）

### 机器人操作

#### `send_feishu_text_message`

发送文本消息到飞书聊天。

参数：
- `receiveId` - 接收者ID
- `text` - 要发送的文本内容
- `receiveIdType` - 接收者ID类型，可选值：'chat_id'(默认)、'open_id'、'user_id'、'union_id'、'email'

返回：
- 发送状态和消息ID

#### `send_feishu_card`

发送交互卡片到飞书聊天。

参数：
- `receiveId` - 接收者ID
- `cardContent` - 卡片内容（JSON字符串）
- `receiveIdType` - 接收者ID类型，可选值：'chat_id'(默认)、'open_id'、'user_id'、'union_id'、'email'

返回：
- 发送状态和消息ID

#### `reply_feishu_message`

回复飞书消息。

参数：
- `messageId` - 要回复的消息ID
- `content` - 回复内容
- `msgType` - 消息类型，可选值：'text'、'interactive'等

返回：
- 发送状态和消息ID

#### `edit_feishu_message`

编辑飞书消息。

参数：
- `messageId` - 要编辑的消息ID
- `content` - 新的消息内容
- `msgType` - 消息类型，可选值：'text'、'interactive'等

返回：
- 更新状态和消息ID

#### `forward_feishu_message`

转发飞书消息。

参数：
- `messageId` - 要转发的消息ID
- `receiveId` - 接收者ID
- `receiveIdType` - 接收者ID类型，可选值：'chat_id'(默认)、'open_id'、'user_id'、'union_id'、'email'

返回：
- 转发状态和新消息ID

#### `get_feishu_message_read_users`

获取已读消息的用户列表。

参数：
- `messageId` - 消息ID
- `pageSize` - 每页返回的用户数量，可选，默认为20
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 已读用户列表（JSON格式）

### 聊天操作

#### `get_feishu_chat_info`

获取飞书聊天的基本信息。

参数：
- `chatId` - 聊天ID

返回：
- 聊天的基本信息（JSON格式）

#### `create_feishu_chat`

创建飞书群聊。

参数：
- `name` - 群名称
- `description` - 群描述，可选
- `userIds` - 用户ID列表，群成员

返回：
- 创建的群聊信息（JSON格式）

#### `update_feishu_chat`

更新飞书群聊信息。

参数：
- `chatId` - 聊天ID
- `name` - 新的群名称，可选
- `description` - 新的群描述，可选

返回：
- 更新状态

#### `add_feishu_chat_members`

添加成员到飞书群聊。

参数：
- `chatId` - 聊天ID
- `userIds` - 要添加的用户ID列表

返回：
- 添加状态和结果信息

#### `remove_feishu_chat_members`

从飞书群聊中移除成员。

参数：
- `chatId` - 聊天ID
- `userIds` - 要移除的用户ID列表

返回：
- 移除状态和结果信息

### 用户操作

#### `get_feishu_user_info`

获取飞书用户信息。

参数：
- `userId` - 用户ID
- `userIdType` - 用户ID类型，可选值：'open_id'(默认)、'union_id'、'user_id'、'email'

返回：
- 用户信息（JSON格式），包含用户ID、姓名、头像、部门等信息

#### `list_feishu_users`

获取飞书用户列表。

参数：
- `departmentId` - 部门ID，可选，指定获取某个部门的用户
- `pageSize` - 每页返回的用户数量，可选，默认为20
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 用户列表（JSON格式），包含用户ID、姓名、头像、部门等信息

#### `search_feishu_users`

搜索飞书用户。

参数：
- `query` - 搜索关键词
- `pageSize` - 每页返回的用户数量，可选，默认为20
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 搜索结果用户列表（JSON格式）

### 部门操作

#### `get_feishu_department_info`

获取飞书部门信息。

参数：
- `departmentId` - 部门ID
- `departmentIdType` - 部门ID类型，可选值：'open_department_id'(默认)、'department_id'

返回：
- 部门信息（JSON格式），包含部门ID、名称、父部门、成员数量等信息

#### `list_feishu_departments`

获取飞书部门列表。

参数：
- `parentDepartmentId` - 父部门ID，可选，指定获取某个部门的子部门
- `fetchChild` - 是否获取子部门，可选，默认为false
- `pageSize` - 每页返回的部门数量，可选，默认为20
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 部门列表（JSON格式），包含部门ID、名称、父部门、成员数量等信息

### 日历操作

#### `list_feishu_calendars`

获取飞书日历列表。

参数：
- `pageSize` - 每页返回的日历数量，可选，默认为20
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 日历列表（JSON格式），包含日历ID、名称、类型、权限等信息

#### `get_feishu_calendar_events`

获取飞书日历事件。

参数：
- `calendarId` - 日历ID
- `startTime` - 开始时间，ISO 8601格式
- `endTime` - 结束时间，ISO 8601格式
- `pageSize` - 每页返回的事件数量，可选，默认为20
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 日历事件列表（JSON格式），包含事件ID、标题、时间、地点、参与者等信息

### 任务操作

#### `list_feishu_tasks`

获取飞书任务列表。

参数：
- `taskListId` - 任务列表ID，可选
- `completedTaskHiddenMode` - 已完成任务的隐藏模式，可选值：'show_all'、'hide_all'
- `pageSize` - 每页返回的任务数量，可选，默认为20
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 任务列表（JSON格式），包含任务ID、标题、描述、截止时间、完成状态等信息

#### `create_feishu_task`

创建飞书任务。

参数：
- `taskListId` - 任务列表ID
- `summary` - 任务标题
- `description` - 任务描述，可选
- `due` - 截止时间，ISO 8601格式，可选
- `origin` - 任务来源，可选

返回：
- 创建的任务信息（JSON格式），包含任务ID、标题、描述、截止时间等信息

### 多维表格操作

#### `get_feishu_sheet_meta`

获取飞书多维表格的元数据信息。

参数：
- `appToken` - 多维表格ID，通常在URL中找到 (例如：feishu.cn/base/<appToken> 或 feishu.cn/app/<appToken>)

返回：
- 多维表格的元数据（JSON格式），包含表格ID、名称、修订版本、创建者、创建时间、权限等信息

#### `get_feishu_sheet_tables`

获取飞书多维表格中的数据表列表。

参数：
- `appToken` - 多维表格ID，通常在URL中找到 (例如：feishu.cn/base/<appToken> 或 feishu.cn/app/<appToken>)
- `pageSize` - 每页返回的数据表数量，可选，默认为20，最大为100
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 数据表列表（JSON格式），包含表ID、名称、字段信息等

#### `get_feishu_sheet_views`

获取飞书多维表格中数据表的视图列表。

参数：
- `appToken` - 多维表格ID，通常在URL中找到 (例如：feishu.cn/base/<appToken> 或 feishu.cn/app/<appToken>)
- `tableId` - 数据表ID
- `pageSize` - 每页返回的视图数量，可选，默认为20，最大为100
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 视图列表（JSON格式），包含视图ID、名称、类型和属性等信息

#### `get_feishu_sheet_view`

获取飞书多维表格中数据表特定视图的详细信息。

参数：
- `appToken` - 多维表格ID，通常在URL中找到 (例如：feishu.cn/base/<appToken> 或 feishu.cn/app/<appToken>)
- `tableId` - 数据表ID
- `viewId` - 视图ID，要获取详细信息的视图

返回：
- 视图详情（JSON格式），包含视图ID、名称、类型和属性等信息

#### `get_feishu_sheet_records`

获取飞书多维表格中的数据表记录。

参数：
- `appToken` - 多维表格ID，通常在URL中找到 (例如：feishu.cn/base/<appToken> 或 feishu.cn/app/<appToken>)
- `tableId` - 数据表ID
- `viewId` - 视图ID，可选，不指定时使用默认视图
- `fieldIds` - 字段ID列表，可选，指定返回哪些字段
- `filter` - 过滤条件，可选，使用FQL格式
- `sort` - 排序条件，可选，使用JSON格式
- `pageSize` - 每页返回的记录数量，可选，默认为20，最大为100
- `pageToken` - 分页标记，可选，用于获取下一页数据

返回：
- 记录列表（JSON格式），包含记录ID和字段值

#### `get_feishu_sheet_record`

获取飞书多维表格中的单条记录。

参数：
- `appToken` - 多维表格ID，通常在URL中找到 (例如：feishu.cn/base/<appToken> 或 feishu.cn/app/<appToken>)
- `tableId` - 数据表ID
- `recordId` - 记录ID
- `fieldIds` - 字段ID列表，可选，指定返回哪些字段

返回：
- 单条记录（JSON格式），包含记录ID和字段值

#### `create_feishu_sheet_record`

在飞书多维表格中创建新记录。

参数：
- `appToken` - 多维表格ID，通常在URL中找到 (例如：feishu.cn/base/<appToken> 或 feishu.cn/app/<appToken>)
- `tableId` - 数据表ID
- `fields` - 字段值，JSON对象，键为字段ID，值为字段值

返回：
- 创建的记录信息（JSON格式），包含记录ID

#### `update_feishu_sheet_record`

更新飞书多维表格中的记录。

参数：
- `appToken` - 多维表格ID，通常在URL中找到 (例如：feishu.cn/base/<appToken> 或 feishu.cn/app/<appToken>)
- `tableId` - 数据表ID
- `recordId` - 记录ID
- `fields` - 字段值，JSON对象，键为字段ID，值为字段值

返回：
- 更新状态和记录信息

#### `delete_feishu_sheet_record`

删除飞书多维表格中的记录。

参数：
- `appToken` - 多维表格ID，通常在URL中找到 (例如：feishu.cn/base/<appToken> 或 feishu.cn/app/<appToken>)
- `tableId` - 数据表ID
- `recordId` - 记录ID

返回：
- 删除状态

## 开发指南

### 代码规范

项目使用严格的TypeScript规范和ESLint配置：

- 使用TypeScript接口和类型定义
- 避免使用 `any` 类型
- 使用 `Record<string, unknown>` 替代 `object` 类型
- 所有代码文件、注释和错误消息使用英文

运行代码检查：

```bash
# 运行代码检查
pnpm lint

# 运行代码检查并修复
pnpm lint:fix

# 运行代码格式化
pnpm format
```

### 错误处理

所有与飞书API相关的错误应使用 `FeiShuApiError` 类处理：

```typescript
try {
  // API操作
} catch (error) {
  if (error instanceof FeiShuApiError) {
    // 处理特定的API错误
    logger.error(`FeiShu API Error (${error.code}): ${error.message}`);
  } else {
    // 处理通用错误
    logger.error('Unexpected error:', error);
  }
  // 转换为用户友好消息
  throw new FeiShuApiError('操作失败', { cause: error });
}
```

### 提交规范

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

### 扩展指南

添加新功能的步骤：

1. **创建客户端类**
   - 在 `src/client/<feature>/` 目录下创建
   - 继承 `ApiClient` 基类
   - 实现API请求方法

   ```typescript
   // src/client/feature/feature-client.ts
   export class FeatureClient extends ApiClient {
     async getFeatureData(id: string): Promise<FeatureData> {
       return this.request<FeatureResponse>('/feature/get', { id });
     }
   }
   ```

2. **创建服务类**
   - 在 `src/services/<feature>/` 目录下创建
   - 使用相应的客户端类
   - 实现业务逻辑和错误处理

   ```typescript
   // src/services/feature/feature-service.ts
   export class FeatureService {
     private client: FeatureClient;
     
     constructor(config: ApiClientConfig) {
       this.client = new FeatureClient(config);
     }
     
     async getFeature(id: string): Promise<Feature> {
       try {
         const data = await this.client.getFeatureData(id);
         return this.transformData(data);
       } catch (error) {
         handleError(error);
       }
     }
   }
   ```

3. **注册服务**
   - 在 `src/services/index.ts` 中导出新服务
   - 将服务添加到 `FeiShuServices` 类

4. **创建MCP工具**
   - 在 `src/server/tools/feature-tools.ts` 中创建
   - 使用Zod进行参数验证
   - 调用服务层方法

   ```typescript
   // src/server/tools/feature-tools.ts
   export function registerFeatureTools(params: ToolRegistryParams): void {
     const { server, services, logger } = params;
     
     server.tool(
       'get_feishu_feature',
       'Get feature from FeiShu',
       {
         id: z.string().describe('Feature ID'),
       },
       async ({ id }) => {
         try {
           const feature = await services.feature.getFeature(id);
           return { content: [{ type: 'text', text: JSON.stringify(feature) }] };
         } catch (error) {
           return handleToolError(error, logger);
         }
       }
     );
   }
   ```

5. **注册工具**
   - 在 `src/server/tools/index.ts` 中引入并注册新工具

## 常见问题

### 认证失败

**问题**：API请求返回认证错误

**解决方案**：
- 检查应用ID和密钥是否正确
- 确认应用具有所需的权限范围
- 检查服务器时间是否正确同步

### 令牌刷新问题

**问题**：令牌刷新失败

**解决方案**：
- 设置更短的令牌缓存时间
- 检查网络连接稳定性
- 查看飞书开发者平台的应用状态

## 许可证

MIT

## 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 提交更改（`git commit -m 'feat: add some amazing feature'`）
4. 推送到分支（`git push origin feature/amazing-feature`）
5. 开启Pull Request

提交PR前请确保：
- 代码通过所有测试
- 更新了相关文档
- 遵循项目的代码风格和命名约定
- 添加必要的单元测试
