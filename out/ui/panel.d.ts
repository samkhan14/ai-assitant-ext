import * as vscode from "vscode";
export type AssistantMode = "ask" | "agent";
export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    fileChanges?: FileChange[];
}
export interface FileChange {
    filename: string;
    summary: string;
}
export declare class AiAssistantPanel implements vscode.WebviewViewProvider {
    private readonly _extensionUri;
    static readonly viewType = "aiDevAssistant.panel";
    private _view?;
    private _mode;
    private _messages;
    constructor(_extensionUri: vscode.Uri);
    resolveWebviewView(webviewView: vscode.WebviewView, _context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void;
    private _handleWebviewMessage;
    private _handleSendMessage;
    private _buildMockResponse;
    private _postMessage;
}
