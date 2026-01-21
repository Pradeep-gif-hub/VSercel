import { spawn } from 'child_process';
import * as vscode from 'vscode';

interface DeploymentResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function deployToVercel(
  workspaceRoot: string,
  outputChannel: vscode.OutputChannel
): Promise<DeploymentResult> {
  // Check if Vercel CLI is installed
    const cliCheck = await checkVercelCliInstalled();
  if (!cliCheck.installed) {
    const action = await vscode.window.showErrorMessage(
      'Vercel CLI is not installed. Please install it to continue.',
      'Install Vercel CLI'
    );

    if (action === 'Install Vercel CLI') {
      vscode.env.openExternal(
        vscode.Uri.parse('https://vercel.com/docs/cli')
      );
    }

    return {
      success: false,
      error: 'Vercel CLI not installed',
    };
  }

  // Run deployment
  return new Promise((resolve) => {
    const vercelProcess = spawn('vercel', ['--prod', '--yes'], {
      cwd: workspaceRoot,
      shell: process.platform === 'win32',
    });

    let stdout = '';
    let stderr = '';
    let deploymentUrl: string | undefined;

    vercelProcess.stdout.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      outputChannel.append(output);

      // Try to extract deployment URL from Vercel output
      // Vercel outputs something like: "Production: https://..."
      const urlMatch = output.match(/https:\/\/[^\s]+/);
      if (urlMatch && !deploymentUrl) {
        deploymentUrl = urlMatch[0];
      }
    });

    vercelProcess.stderr.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      outputChannel.append(output);
    });

    vercelProcess.on('close', (code) => {
      if (code === 0) {
        // Parse deployment URL from stdout if available
        const urlMatch = stdout.match(/https:\/\/[^\s]+/);
        const url = urlMatch ? urlMatch[0] : deploymentUrl;

        resolve({
          success: true,
          url: url || 'https://vercel.com',
        });
      } else {
        outputChannel.appendLine(
          `\nProcess exited with code ${code}`
        );
        resolve({
          success: false,
          error: `Deployment failed with exit code ${code}. Check the output above for details.`,
        });
      }
    });

    vercelProcess.on('error', (error) => {
      const errorMessage = error.message || 'Unknown error';
      outputChannel.appendLine(`\nProcess error: ${errorMessage}`);
      resolve({
        success: false,
        error: `Failed to execute Vercel CLI: ${errorMessage}`,
      });
    });
  });
}

async function checkVercelCliInstalled(): Promise<{ installed: boolean }> {
  return new Promise((resolve) => {
    const cliProcess = spawn('vercel', ['--version'], {
      shell: process.platform === 'win32',
    });

    cliProcess.on('close', (code: number) => {
      resolve({ installed: code === 0 });
    });

    cliProcess.on('error', () => {
      resolve({ installed: false });
    });
  });
}
