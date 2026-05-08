import * as vscode from "vscode";
import { AiAssistantPanel } from "./ui/panel";

export function activate(context: vscode.ExtensionContext): void {
  const provider = new AiAssistantPanel(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      AiAssistantPanel.viewType,
      provider
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("aiDevAssistant.openPanel", () => {
      vscode.commands.executeCommand(
        "workbench.view.extension.ai-dev-assistant"
      );
    })
  );
}

export function deactivate(): void {}
