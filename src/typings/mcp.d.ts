declare module '@modelcontextprotocol/sdk/share.js' {
  export interface Tool<T = any> {
    name: string;
    description: string;
    parameters: any;
    function: (args: T) => Promise<any>;
  }
}

declare module '@/server/tools/impl/get-document-raw.js' {
  export const GET_DOCUMENT_RAW_TOOL_NAME: string;
  export class GetDocumentRawTool {
    constructor(options: any);
  }
}

declare module '@/server/tools/impl/get-document.js' {
  export const GET_DOCUMENT_TOOL_NAME: string;
  export class GetDocumentTool {
    constructor(options: any);
  }
}

declare module '@/server/tools/impl/send-card.js' {
  export const SEND_CARD_TOOL_NAME: string;
  export class SendCardTool {
    constructor(options: any);
  }
}

declare module '@/server/tools/impl/send-text-message.js' {
  export const SEND_TEXT_MESSAGE_TOOL_NAME: string;
  export class SendTextMessageTool {
    constructor(options: any);
  }
}

declare module '@/server/tools/impl/search-chats.js' {
  export const SEARCH_CHATS_TOOL_NAME: string;
  export class SearchChatsTool {
    constructor(options: any);
  }
}
