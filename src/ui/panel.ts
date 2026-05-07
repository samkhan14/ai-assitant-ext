import * as vscode from "vscode";
import { getWebviewContent } from "./html";

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

export class AiAssistantPanel implements vscode.WebviewViewProvider {
  public static readonly viewType = "aiDevAssistant.panel";

  private _view?: vscode.WebviewView;
  private _mode: AssistantMode = "ask";
  private _messages: ChatMessage[] = [];

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = getWebviewContent();

    webviewView.webview.onDidReceiveMessage((message: WebviewMessage) => {
      this._handleWebviewMessage(message);
    });
  }

  private _handleWebviewMessage(message: WebviewMessage): void {
    switch (message.type) {
      case "switchMode":
        this._mode = message.payload as AssistantMode;
        break;

      case "sendMessage":
        this._handleSendMessage(message.payload as string);
        break;

      case "viewDiff":
        vscode.window.showInformationMessage(
          `Viewing diff for: ${message.payload as string}`
        );
        break;

      case "applyChanges":
        vscode.window.showInformationMessage(
          `Applied changes to: ${message.payload as string}`
        );
        break;

      case "rejectChanges":
        vscode.window.showInformationMessage(
          `Rejected changes for: ${message.payload as string}`
        );
        break;
    }
  }

  private _handleSendMessage(text: string): void {
    if (!text.trim()) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: text };
    this._messages.push(userMessage);
    this._postMessage({ type: "appendMessage", payload: userMessage });

    this._postMessage({ type: "setLoading", payload: true });

    setTimeout(() => {
      const assistantMessage = this._buildMockResponse(text);
      this._messages.push(assistantMessage);
      this._postMessage({ type: "appendMessage", payload: assistantMessage });
      this._postMessage({ type: "setLoading", payload: false });
    }, 1000);
  }

  private _buildMockResponse(userText: string): ChatMessage {
    if (this._mode === "agent") {
      return {
        role: "assistant",
        content: `Sure! I've analyzed your request: "${userText}". Here are the proposed file changes:`,
        fileChanges: [
          { filename: "src/utils/helper.ts", summary: "Added new utility function" },
          { filename: "src/components/Button.tsx", summary: "Updated button props interface" },
        ],
      };
    }

    return {
      role: "assistant",
      content: `This is a simulated response to your question: "${userText}". In a real implementation, this would be powered by an AI model.`,
    };
  }

  private _postMessage(message: PanelMessage): void {
    this._view?.webview.postMessage(message);
  }
}

interface WebviewMessage {
  type: "switchMode" | "sendMessage" | "viewDiff" | "applyChanges" | "rejectChanges";
  payload?: unknown;
}

interface PanelMessage {
  type: "appendMessage" | "setLoading";
  payload: unknown;
}
