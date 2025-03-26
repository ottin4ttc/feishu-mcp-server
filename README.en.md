# FeiShu MCP Server

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js->=23-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

FeiShu MCP Server is a service based on the [Model Context Protocol](https://modelcontextprotocol.ai/) that provides FeiShu API integration, supporting document reading and bot message sending capabilities, allowing AI models to easily interact with FeiShu services.

## Features

- **Document Services**: Read FeiShu document content and metadata
- **Bot Services**: Send text messages and interactive cards to FeiShu chats
- **Dual Mode Support**:
  - STDIO mode: Suitable for CLI environments, communicates via standard input/output
  - HTTP mode: Provides HTTP interfaces with SSE connection support
- **Modular Architecture**: Easy to extend with new features and integrate other FeiShu APIs

## Project Structure

The project uses a modular, layered architecture design to ensure the code is easy to understand and extend:

```
/src
  /client        # API client implementations (low-level API requests)
    /bots        # Bot API clients
    /documents   # Document API clients
    ...
  /server        # MCP server implementation
    /tools       # MCP tool registrations
  /services      # Service layer implementations (business logic and error handling)
    /documents   # Document-related services
    /bots        # Bot-related services
  /typings       # Type definitions
  /utils         # Utility functions
  config.ts      # Configuration management
  index.ts       # Entry point
```

## Installation

### Prerequisites

- Node.js 23.0 or higher
- npm or yarn package manager
- Valid FeiShu developer account and application

### Installation Steps

1. Clone the repository

```bash
git clone https://github.com/yourusername/feishu-mcp-server.git
cd feishu-mcp-server
```

2. Install dependencies

```bash
pnpm install
```

3. Create a `.env` file (or set environment variables)

```
FEISHU_APP_ID=your_app_id
FEISHU_APP_SECRET=your_app_secret
PORT=3344
```

## Development Standards

This project uses husky and lint-staged to ensure code quality and consistency:

### Code Organization Standards

The project follows these directory structure and responsibility division standards:

#### 1. Client Implementations (`/src/client`)

- All API client implementations must be placed in the `/src/client` directory
- Specific feature clients should be placed in appropriate subdirectories (e.g., `/src/client/bots/`)
- Client classes are responsible for:
  - Encapsulating HTTP request details
  - Handling low-level API parameters and response formats
  - Not containing business logic or error handling strategies

Examples: `DocumentClient`, `BotClient` classes should be placed in this directory

#### 2. Service Implementations (`/src/services`)

- All business service implementations must be placed in the `/src/services` directory
- Specific feature services should be placed in appropriate subdirectories (e.g., `/src/services/bots/`)
- Service classes are responsible for:
  - Using client classes to execute API operations
  - Implementing business logic
  - Handling errors and exceptions
  - Providing external service interfaces

Examples: `DocumentService`, `BotService` classes should be placed in this directory

#### 3. Tool Registrations (`/src/server/tools`)

- MCP tool registrations and implementations are placed in the `/src/server/tools` directory
- Each feature module should have its own tools file (e.g., `document-tools.ts`)

### Architecture Principles

1. **Layer Responsibilities**
   - Client Layer (Client): Handles API requests and responses
   - Service Layer (Service): Handles business logic and error management
   - Tool Layer (Tools): Exposes functionality to the MCP protocol

2. **Dependency Direction**
   - Service layer depends on client layer, not the other way around
   - Tool layer depends on service layer, not the other way around

3. **Error Handling**
   - Client layer should return original errors or generic errors
   - Service layer should catch errors and convert them to business-related errors
   - Use the `FeiShuApiError` class to handle API errors uniformly

4. **Type Safety**
   - Use TypeScript interfaces and type definitions
   - Avoid using `any` type
   - Correctly use `Record<string, unknown>` instead of `object` type

5. **Language Standard**
   - All code comments and error messages must be in English
   - Variable names, function names, and class names must be in English
   - Documentation in code should be clear and concise English

### Git Commit Standards

Commit messages must follow this format:
```
<type>(<scope>): <subject>
```

Examples:
- `feat(bot): add card sending feature`
- `fix(documents): fix document content retrieval error`

Supported types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style adjustments
- `refactor`: Code refactoring
- `perf`: Performance optimization
- `test`: Test-related
- `chore`: Build process or auxiliary tool changes

### Automatic Code Checking

- Code checking and formatting run automatically before commits
- Type checking and build verification run before pushes

### Manual Checking

```bash
# Run code checking
pnpm lint

# Run code checking and fix
pnpm lint:fix

# Run code formatting
pnpm format
```

## Usage

### Development Mode

```bash
pnpm start
```

### Build and Run

```bash
pnpm build
node dist/index.js
```

### Command Line Arguments

The server supports the following command line arguments:

```bash
node dist/index.js --feishu-app-id=your_app_id --feishu-app-secret=your_app_secret --port=3344
```

### STDIO Mode

For integration with other applications, you can use STDIO mode:

```bash
NODE_ENV=cli node dist/index.js
```

or

```bash
node dist/index.js --stdio
```

## Configuration Options

| Option | Environment Variable | Command Line Argument | Default Value | Description |
|--------|---------------------|----------------------|---------------|-------------|
| FeiShu App ID | `FEISHU_APP_ID` | `--feishu-app-id` | - | App ID of your FeiShu application |
| FeiShu App Secret | `FEISHU_APP_SECRET` | `--feishu-app-secret` | - | App Secret of your FeiShu application |
| Server Port | `PORT` | `--port` | 3344 | HTTP server port number |

## API Documentation

### Document Operations

#### `get_feishu_doc_raw`

Get the raw content of a FeiShu document.

Parameters:
- `docId` - Document ID, typically found in the URL (e.g., feishu.cn/wiki/<documentId>)

Returns:
- The text content of the document

#### `get_feishu_doc_info`

Get metadata for a FeiShu document.

Parameters:
- `docId` - Document ID

Returns:
- Document metadata (in JSON format)

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
- `cardContent` - Card content (as a JSON string)

Returns:
- Send status and message ID

## Extension Guide

The project is designed to be easily extensible. To add new features:

1. Create a new client class in the `client` directory (e.g., `client/[feature]/[feature]-client.ts`)
2. Create the corresponding service class in the `services` directory (e.g., `services/[feature]/[feature]-service.ts`)
3. Register the new service in `services/index.ts`
4. Add the corresponding MCP tools (in `server/tools/[feature]-tools.ts`)
5. Register the new tools in `server/tools/index.ts`

## License

MIT

## Contributing Guidelines

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 