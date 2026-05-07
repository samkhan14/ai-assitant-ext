"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAssistantPanel = void 0;
const vscode = __importStar(require("vscode"));
const html_1 = require("./html");
class AiAssistantPanel {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
        this._mode = "ask";
        this._messages = [];
    }
    resolveWebviewView(webviewView, _context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };
        webviewView.webview.html = (0, html_1.getWebviewContent)();
        webviewView.webview.onDidReceiveMessage((message) => {
            this._handleWebviewMessage(message);
        });
    }
    _handleWebviewMessage(message) {
        switch (message.type) {
            case "switchMode":
                this._mode = message.payload;
                break;
            case "sendMessage":
                this._handleSendMessage(message.payload);
                break;
            case "viewDiff":
                vscode.window.showInformationMessage(`Viewing diff for: ${message.payload}`);
                break;
            case "applyChanges":
                vscode.window.showInformationMessage(`Applied changes to: ${message.payload}`);
                break;
            case "rejectChanges":
                vscode.window.showInformationMessage(`Rejected changes for: ${message.payload}`);
                break;
        }
    }
    _handleSendMessage(text) {
        if (!text.trim()) {
            return;
        }
        const userMessage = { role: "user", content: text };
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
    _buildMockResponse(userText) {
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
    _postMessage(message) {
        this._view?.webview.postMessage(message);
    }
}
exports.AiAssistantPanel = AiAssistantPanel;
AiAssistantPanel.viewType = "aiDevAssistant.panel";
//# sourceMappingURL=panel.js.map