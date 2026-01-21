# Vercel Deploy

A VS Code extension that lets you deploy your project to Vercel directly from the editor.

## Features

- 🚀 Deploy to Vercel with a single command
- 🔍 Auto-detects project type (Next.js, Vite, Static)
- 📊 Streams deployment logs to output channel
- ✅ Shows deployment URL with quick actions
- ⚠️ Checks for Vercel CLI availability
- 🛡️ Comprehensive error handling

## Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) installed globally
- An active VS Code workspace
- A project connected to Vercel (or ready to connect)

## Installation

1. Install the extension from VS Code Marketplace or manually:
   ```bash
   npm install
   npm run compile
   ```

2. Load the extension in VS Code (F5 in development mode)

## Usage

1. Open your project in VS Code
2. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Search for "Deploy to Vercel"
4. Press Enter to deploy

The extension will:
- Detect your project type (Next.js, Vite, or Static)
- Show a progress notification
- Stream deployment logs to the "Vercel Deploy" output channel
- Display the deployment URL on success
- Provide quick actions: "Open Deployment" or "Copy URL"

## Project Detection

- **Next.js**: Detected by `next.config.js`
- **Vite**: Detected by `vite.config.ts` or `vite.config.js`
- **Static**: Default for all other projects

## Error Handling

- **No workspace open**: Shows an error message
- **Vercel CLI not installed**: Prompts to install with link to docs
- **Deployment failure**: Shows error in output channel and notification

## Development

```bash
npm install
npm run compile    # Compile TypeScript
npm run watch      # Watch mode
```

Press F5 to launch the extension in a new VS Code window.

## Structure

- `src/extension.ts` - Extension activation and command registration
- `src/deploy.ts` - Vercel CLI integration
- `src/detectProject.ts` - Project type detection

## License

MIT
Deploy ur code from one Plateform

# Deploy to Vercel

Deploy your frontend project to Vercel directly from VS Code.

## Features
- One-command deployment
- Supports Next.js, Vite, and static sites
- Uses official Vercel CLI

## Usage
Open Command Palette → Deploy to Vercel

## Requirements
- Node.js
- Vercel CLI
