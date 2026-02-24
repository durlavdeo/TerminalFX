# Terminal FX 💣

> Dramatic sound effects for your terminal — because silent failures are boring.

Terminal FX plays satisfying audio feedback when you run commands in VS Code. Hear a sound when your server spins up, your build succeeds, or your code explodes in real time. Works with every major language and framework.

---

## Features

- 💣 **Start sound** — plays when a monitored command begins
- ✅ **Success sound** — plays when a command exits cleanly or your server comes online
- 💥 **Fail sound** — plays when your code crashes or exits with an error
- 🧪 **Automatic test detection** — Jest, Pytest, Vitest, RSpec and more are detected automatically
- 🔁 **Crash & restart tracking** — detects mid-session server crashes (nodemon, vite HMR, etc.) and plays the fail sound, then success again when it recovers
- ⚙️ **Custom settings UI** — add and remove commands without touching `settings.json`

---

## Getting Started

Install the extension, then open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:

```
TerminalFX: Open Settings
```

From there you can add commands to monitor and toggle which events play sounds.

---

## How It Works

| Event | When it fires |
|-------|--------------|
| 💣 Start | A monitored command is run in the terminal |
| ✅ Success | Command exits with code `0`, or server output matches a ready signal |
| 💥 Fail | Command exits with non-zero code, or crash detected in stream output |

**Long-running processes** (like `npm run dev` or `python manage.py runserver`) are handled via output stream watching — Terminal FX listens for signals like `"ready"`, `"listening"`, `"compiled successfully"` to know the server is up, and watches for errors like `"app crashed"` or `"SyntaxError"` to trigger the fail sound.

**Short processes** (builds, scripts, tests) rely on exit code — clean and reliable.

---

## Extension Settings

Open `TerminalFX: Open Settings` from the Command Palette for a visual UI, or edit your `settings.json` directly:

| Setting | Default | Description |
|---------|---------|-------------|
| `terminalfx.commands` | `["node", "python", "npm run", ...]` | Commands to monitor in the terminal |
| `terminalfx.testCommands` | `["jest", "pytest", "vitest", ...]` | Test runners — detected via exit code |
| `terminalfx.triggerEvents` | `["start", "success", "fail"]` | Which events play a sound |

### Default Monitored Commands
`node` `nodemon` `python` `python3` `gcc` `npm run` `npm start` `yarn` `pnpm` `cargo run` `go run` `mvn` `gradle`

### Default Test Commands (auto-detected)
`jest` `vitest` `pytest` `go test` `cargo test` `npm test` `yarn test` `pnpm test` `dotnet test` `phpunit` `rspec` `mocha`

---

## Requirements

- VS Code `^1.93.0` (required for shell execution API)
- Shell integration enabled (VS Code enables this by default for bash, zsh, fish, and PowerShell)

---

## Known Issues

- Shell integration must be active for command detection to work. If sounds aren't triggering, check that your terminal has shell integration enabled (`Terminal > Integrated > Shell Integration: Enabled` in settings).
- On Linux, `aplay` must be available for audio playback (`sudo apt install alsa-utils`).
- Broad crash signals like `"error:"` may occasionally false-positive on verbose output. You can tune the signals via settings if needed.

---

## Release Notes

### 0.0.1
Initial release — command detection, sound playback, server crash/restart tracking, settings UI.

---

## Contributing

Found a bug or want to add support for a new framework? PRs and issues are welcome at [github.com/durlavdeo/TerminalFX](https://github.com/durlavdeo/TerminalFX).

---
Made with 💥 by [durlavdeo](https://github.com/durlavdeo)