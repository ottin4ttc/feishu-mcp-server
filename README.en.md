# FeiShu MCP Server

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js->=23-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

FeiShu MCP Server is a service based on the [Model Context Protocol](https://modelcontextprotocol.ai/) that provides FeiShu API integration, enabling AI models to easily interact with FeiShu services.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
  - [Code Structure](#code-structure)
  - [Design Principles](#design-principles)
  - [Workflow](#workflow)
- [Quick Start](#quick-start)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Service](#running-the-service)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
  - [Document Operations](#document-operations)
  - [Bot Operations](#bot-operations)
  - [Chat Operations](#chat-operations)
  - [Sheet Operations](#sheet-operations)
- [Development Guide](#development-guide)
  - [Coding Standards](#coding-standards)
  - [Error Handling](#error-handling)
  - [Commit Standards](#commit-standards)
  - [Extension Guide](#extension-guide)
- [FAQ](#faq)
- [License](#license)
- [Contributing](#contributing)

## Features

- **Document Service**: Read FeiShu document content and metadata
- **Bot Service**: Send text messages and interactive cards to FeiShu chats
- **Chat Service**: Manage groups and chat sessions
- **Dual-Mode Support**:
  - **STDIO Mode**: Communication via standard input/output, suitable for CLI environments and integration into other applications
  - **HTTP Mode**: Provides REST API and SSE connections, suitable for web services and distributed deployments
- **Robust Error Handling**: Unified error handling mechanism providing detailed error information
- **Type Safety**: Based on TypeScript, providing complete type definitions
- **Modular Architecture**: Easy to extend with new features and integrate with other FeiShu APIs

## Architecture

### Code Structure

```
/src
  /client        # API client implementation (low-level API request encapsulation)
    /documents   # Document-related API clients
    /bots        # Bot API clients
    /chats       # Chat-related API clients
    /utils       # Client utilities
  /services      # Service layer implementation (business logic and error handling)
    /documents   # Document-related services
    /bots        # Bot-related services
    /chats       # Chat-related services
  /server        # MCP server implementation
    /tools       # MCP tool registration and implementation
  /typings       # Type definitions
  /utils         # Common utilities
  /http          # HTTP server implementation
  /logger        # Logging service
  /consts        # Constants
  config.ts      # Configuration management
  index.ts       # Entry point
```

### Design Principles

The project uses a layered architecture design to ensure separation of concerns and clear responsibilities:

#### 1. Layer Responsibilities

- **Client Layer**
  - Encapsulates HTTP request details
  - Handles low-level API parameters and response formats
  - Manages authentication and token refresh
  - Contains no business logic

- **Service Layer**
  - Uses clients to perform API operations
  - Implements business logic
  - Handles and transforms errors
  - Provides a friendly interface for upper layers

- **Tool Layer**
  - Implements tools defined by the MCP protocol
  - Handles parameter validation and format conversion
  - Calls the service layer to complete actual operations
  - Formats return results

#### 2. Dependency Direction

- Service layer depends on client layer
- Tool layer depends on service layer
- Strictly avoids circular dependencies

#### 3. Error Handling Strategy

- Uses `FeiShuApiError` to uniformly handle API errors
- Client layer returns original errors
- Service layer catches and converts to business-related errors
- Tool layer handles all exceptions and returns user-friendly messages

### Workflow

1. MCP server receives requests (STDIO or HTTP)
2. Tool layer validates parameters and calls the appropriate service
3. Service layer implements business logic and calls the client
4. Client executes the actual API request and returns the result
5. Results are processed by the service layer and returned to the tool layer
6. Tool layer formats results and returns them to the MCP server

## Quick Start

### Prerequisites

- Node.js 23.0 or higher
- pnpm package manager
- Valid FeiShu developer account and a created custom application

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/feishu-mcp-server.git
cd feishu-mcp-server
```

2. Install dependencies

```bash
pnpm install
```

3. Create a `.env` file

```
# FeiShu application credentials (required)
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret

# Server configuration (optional)
PORT=3344
LOG_LEVEL=info
```

### Running the Service

#### Development Mode

```bash
# Development mode (auto-restart)
pnpm dev

# Or use standard start
pnpm start
```

#### Production Mode

```bash
# Build the project
pnpm build

# Run the compiled code
node dist/index.js
```

#### STDIO Mode

```bash
# Method 1: Using environment variables
NODE_ENV=cli node dist/index.js

# Method 2: Using command line arguments
node dist/index.js --stdio
```

## Configuration

| Option | Environment Variable | Command Line Argument | Default | Description |
|--------|---------------------|----------------------|---------|-------------|
| FeiShu App ID | `FEISHU_APP_ID` | `--feishu-app-id` | - | FeiShu custom application App ID |
| FeiShu App Secret | `FEISHU_APP_SECRET` | `--feishu-app-secret` | - | FeiShu custom application App Secret |
| Server Port | `PORT` | `--port` | 3344 | HTTP server port number |
| Log Level | `LOG_LEVEL` | `--log-level` | info | Log level (debug/info/warn/error) |
| Token Cache Duration | `TOKEN_CACHE_DURATION` | - | 7100 | Access token cache time (seconds) |

## API Documentation

### Document Operations

#### `get_feishu_doc_raw`

Get the raw content of a FeiShu document.

Parameters:
- `docId` - Document ID, typically found in the URL (e.g.: feishu.cn/docx/<documentId>)

Returns:
- Text content of the document

#### `get_feishu_doc_info`

Get metadata information for a FeiShu document.

Parameters:
- `docId` - Document ID

Returns:
- Document metadata (JSON format)

### Bot Operations

#### `send_feishu_text_message`

Send a text message to a FeiShu chat.

Parameters:
- `chatId` - Chat ID
- `text` - Text content to send

Returns:
- Send status and message ID

#### `send_feishu_card`

Send an interactive card to a FeiShu chat.

Parameters:
- `chatId` - Chat ID
- `cardContent` - Card content (JSON string)

Returns:
- Send status and message ID

### Chat Operations

#### `get_feishu_chat_info`

Get basic information about a FeiShu chat.

Parameters:
- `chatId` - Chat ID

Returns:
- Basic chat information (JSON format)

### Sheet Operations

#### `get_feishu_sheet_meta`

Get metadata information for a FeiShu Bitable (Sheet).

Parameters:
- `appToken` - Bitable ID, typically found in the URL (e.g.: feishu.cn/base/<appToken> or feishu.cn/app/<appToken>)

Returns:
- Bitable metadata (JSON format), including sheet ID, name, revision, creator, creation time, permissions, etc.

#### `get_feishu_sheet_tables`

Get the list of tables from a FeiShu Bitable (Sheet).

Parameters:
- `appToken` - Bitable ID, typically found in the URL (e.g.: feishu.cn/base/<appToken> or feishu.cn/app/<appToken>)
- `pageSize` - Number of tables to return per page, optional, default: 20, max: 100
- `pageToken` - Token for pagination, optional, used to get the next page of data

Returns:
- List of tables (JSON format), including table ID, name, field information, etc.

#### `get_feishu_sheet_views`

Get the list of views from a table in a FeiShu Bitable (Sheet).

Parameters:
- `appToken` - Bitable ID, typically found in the URL (e.g.: feishu.cn/base/<appToken> or feishu.cn/app/<appToken>)
- `tableId` - Table ID
- `pageSize` - Number of views to return per page, optional, default: 20, max: 100
- `pageToken` - Token for pagination, optional, used to get the next page of data

Returns:
- List of views (JSON format), including view ID, name, type, and properties

#### `get_feishu_sheet_view`

Get details of a specific view from a table in a FeiShu Bitable (Sheet).

Parameters:
- `appToken` - Bitable ID, typically found in the URL (e.g.: feishu.cn/base/<appToken> or feishu.cn/app/<appToken>)
- `tableId` - Table ID
- `viewId` - View ID of the view to get details for

Returns:
- View details (JSON format), including view ID, name, type, and properties

#### `get_feishu_sheet_records`

Get records from a table in a FeiShu Bitable (Sheet).

Parameters:
- `appToken` - Bitable ID, typically found in the URL (e.g.: feishu.cn/base/<appToken> or feishu.cn/app/<appToken>)
- `tableId` - Table ID
- `viewId` - View ID, optional, uses default view if not specified
- `fieldIds` - List of field IDs to include, optional, returns all fields if not specified
- `filter` - Filter condition in FQL format, optional
- `sort` - Sort condition in JSON format, optional
- `pageSize` - Number of records to return per page, optional, default: 20, max: 100
- `pageToken` - Token for pagination, optional, used to get the next page of data

Returns:
- List of records (JSON format), including record ID and field values

#### `get_feishu_sheet_record`

Get a single record from a table in a FeiShu Bitable (Sheet).

Parameters:
- `appToken` - Bitable ID, typically found in the URL (e.g.: feishu.cn/base/<appToken> or feishu.cn/app/<appToken>)
- `tableId` - Table ID
- `recordId` - Record ID
- `fieldIds` - List of field IDs to include, optional, returns all fields if not specified

Returns:
- Single record (JSON format), including record ID and field values

## Development Guide

### Coding Standards

The project uses strict TypeScript standards and ESLint configuration:

- Use TypeScript interfaces and type definitions
- Avoid using the `any` type
- Use `Record<string, unknown>` instead of `object` type
- All code files, comments, and error messages use English

Running code checks:

```bash
# Run code checks
pnpm lint

# Run code checks and fix
pnpm lint:fix

# Run code formatting
pnpm format
```

### Error Handling

All FeiShu API-related errors should be handled using the `FeiShuApiError` class:

```typescript
try {
  // API operation
} catch (error) {
  if (error instanceof FeiShuApiError) {
    // Handle specific API errors
    logger.error(`FeiShu API Error (${error.code}): ${error.message}`);
  } else {
    // Handle generic errors
    logger.error('Unexpected error:', error);
  }
  // Convert to user-friendly message
  throw new FeiShuApiError('Operation failed', { cause: error });
}
```

### Commit Standards

Commit messages must follow this format:
```
<type>(<scope>): <subject>
```

Examples:
- `feat(bot): add card sending functionality`
- `fix(documents): fix document content retrieval error`

Supported types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting adjustments
- `refactor`: Code refactoring
- `perf`: Performance optimization
- `test`: Test-related
- `chore`: Build process or auxiliary tool changes

### Extension Guide

Steps to add new functionality:

1. **Create a Client Class**
   - Create in the `src/client/<feature>/` directory
   - Extend the `ApiClient` base class
   - Implement API request methods

   ```typescript
   // src/client/feature/feature-client.ts
   export class FeatureClient extends ApiClient {
     async getFeatureData(id: string): Promise<FeatureData> {
       return this.request<FeatureResponse>('/feature/get', { id });
     }
   }
   ```

2. **Create a Service Class**
   - Create in the `src/services/<feature>/` directory
   - Use the corresponding client class
   - Implement business logic and error handling

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

3. **Register the Service**
   - Export the new service in `src/services/index.ts`
   - Add the service to the `FeiShuServices` class

4. **Create an MCP Tool**
   - Create in `src/server/tools/feature-tools.ts`
   - Use Zod for parameter validation
   - Call the service layer method

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

5. **Register the Tool**
   - Import and register the new tool in `src/server/tools/index.ts`

## FAQ

### Authentication Failed

**Problem**: API request returns authentication error

**Solution**:
- Check if the application ID and secret are correct
- Confirm the application has the required permission scopes
- Check if the server time is correctly synchronized

### Token Refresh Issues

**Problem**: Token refresh fails

**Solution**:
- Set a shorter token cache time
- Check network connection stability
- Check the application status on the FeiShu developer platform

## License

MIT

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Before submitting a PR, please ensure:
- Your code passes all tests
- You've updated relevant documentation
- You follow the project's code style and naming conventions
- You've added necessary unit tests