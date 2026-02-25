import * as vscode from "vscode";
import { exec } from "child_process";
import * as path from "path";
import * as os from "os";
import { crashSignals, successSignals } from "./constants/signals";
import { openSettingsPanel } from "./settingsPanel";

const successfulExecutions = new Set<vscode.TerminalShellExecution>();

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("terminalfx.openSettings", () => {
      openSettingsPanel(context);
    }),
  );

  context.subscriptions.push(
    vscode.window.onDidStartTerminalShellExecution(async (event) => {
      const config = vscode.workspace.getConfiguration("terminalfx");
      const command = event.execution.commandLine.value.toLowerCase();
      const commands = config.get<string[]>("commands") || [];
      const testCommands = config.get<string[]>("testCommands") || [];

      const matched = commands.some((cmd) =>
        command.includes(cmd.toLowerCase()),
      );
      const isTestCommand = testCommands.some((cmd) => command.includes(cmd));

      if (!matched && !isTestCommand) return;

      playSound("start");
      const stream = event.execution.read();

      if (isTestCommand) return;

      let crashPlayed = false;
      let serverStarted = false;

      for await (const data of stream) {
        const lower = data.toLowerCase();

        if (!serverStarted && successSignals.some((s) => lower.includes(s))) {
          playSound("success");
          serverStarted = true;
          crashPlayed = false;
          successfulExecutions.add(event.execution);
        }
        if (
          serverStarted &&
          !crashPlayed &&
          crashSignals.some((s) => lower.includes(s))
        ) {
          playSound("fail");
          crashPlayed = true;
        }

        if (crashPlayed && successSignals.some((s) => lower.includes(s))) {
          crashPlayed = false;
        }
      }
    }),
  );

  context.subscriptions.push(
    vscode.window.onDidEndTerminalShellExecution((event) => {
      console.log(
        `command: ${event.execution.commandLine.value} | exitCode: ${event.exitCode}`,
      );
      const config = vscode.workspace.getConfiguration("terminalfx");
      const command = event.execution.commandLine.value.toLowerCase();
      const commands = config.get<string[]>("commands") || [];
      const matched = commands.some((cmd) =>
        command.trimStart().startsWith(cmd.toLowerCase()),
      );
      const testCommands = config.get<string[]>("testCommands") || [];
      const isTestCommand = testCommands.some((cmd) => command.includes(cmd));

      if (!matched && !isTestCommand) return;

      if (successfulExecutions.has(event.execution)) {
        successfulExecutions.delete(event.execution);
        return;
      }

      event.exitCode === 0 ? playSound("success") : playSound("fail");
    }),
  );
}

function playSound(type: "start" | "success" | "fail") {
  const config = vscode.workspace.getConfiguration("terminalfx");
  const enabledEvents = config.get<string[]>("triggerEvents") || [];
  if (!enabledEvents.includes(type)) return;

  const fileMap = {
    start: "planted.wav",
    success: "success.wav",
    fail: "fail.wav",
  };
  const soundPath = path.join(__dirname, "../media", fileMap[type]);
  const platform = os.platform();

  try {
    if (platform === "win32") {
      exec(
        `powershell -c (New-Object Media.SoundPlayer '${soundPath}').PlaySync()`,
      );
    } else if (platform === "darwin") {
      exec(`afplay "${soundPath}"`);
    } else {
      exec(`aplay "${soundPath}"`);
    }
  } catch (err) {
    console.log("Audio play error:", err);
  }
}

export function deactivate() {}
