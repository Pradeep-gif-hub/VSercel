import * as vscode from 'vscode';
import { detectProjectType } from './detectProject';
import { deployToVercel } from './deploy';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext): void {
  // Create output channel for deployment logs
  outputChannel = vscode.window.createOutputChannel('Vercel Deploy');

  // Register the deploy command
  const disposable = vscode.commands.registerCommand(
    'vsercel.deployToVercel',
    async () => {
      await handleDeployCommand();
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(outputChannel);

  outputChannel.appendLine('Vercel Deploy extension activated');
}

async function handleDeployCommand(): Promise<void> {
  // Check if a workspace is open
  if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('No workspace folder open. Please open a project folder.');
    return;
  }

  const workspaceRoot = vscode.workspace.workspaceFolders[0].uri.fsPath;
  outputChannel.clear();
  outputChannel.show();
  outputChannel.appendLine('Starting Vercel deployment...');
  outputChannel.appendLine(`Workspace: ${workspaceRoot}`);

  try {
    // Detect project type
    outputChannel.appendLine('\n--- Project Detection ---');
    const projectType = detectProjectType(workspaceRoot);
    outputChannel.appendLine(`Detected project type: ${projectType}`);

    // Show progress notification
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Deploying to Vercel...',
        cancellable: false,
      },
      async (progress) => {
        progress.report({ increment: 0 });

        // Deploy to Vercel
        outputChannel.appendLine('\n--- Deployment ---');
        const result = await deployToVercel(workspaceRoot, outputChannel);

        if (!result.success) {
          outputChannel.appendLine(`\n❌ Deployment failed: ${result.error}`);
          vscode.window.showErrorMessage(
            `Deployment failed: ${result.error}`
          );
          return;
        }

        // Success handling
        outputChannel.appendLine(`\n✅ Deployment successful!`);
        outputChannel.appendLine(`Deployment URL: ${result.url}`);

        const action = await vscode.window.showInformationMessage(
          `✅ Deployed successfully!\n${result.url}`,
          'Open Deployment',
          'Copy URL'
        );

        if (action === 'Open Deployment' && result.url) {
          vscode.env.openExternal(vscode.Uri.parse(result.url));
        } else if (action === 'Copy URL' && result.url) {
          vscode.env.clipboard.writeText(result.url);
          vscode.window.showInformationMessage('Deployment URL copied to clipboard');
        }

        progress.report({ increment: 100 });
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    outputChannel.appendLine(`\n❌ Error: ${errorMessage}`);
    vscode.window.showErrorMessage(`Deployment error: ${errorMessage}`);
  }
}

export function deactivate(): void {
  // Extension cleanup
}
