import * as vscode from "vscode";

export function openSettingsPanel(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    "terminalfxSettings",
    "TerminalFX Settings",
    vscode.ViewColumn.One,
    { enableScripts: true },
  );

  const config = vscode.workspace.getConfiguration("terminalfx");
  const commands = config.get<string[]>("commands") || [];
  const triggerEvents = config.get<string[]>("triggerEvents") || [
    "start",
    "success",
    "fail",
  ];
  const testCommands = config.get<string[]>("testCommands") || [];

  panel.webview.html = getWebviewContent(commands, testCommands, triggerEvents);

  panel.webview.onDidReceiveMessage(
    (message) => {
      const cfg = vscode.workspace.getConfiguration("terminalfx");
      switch (message.type) {
        case "updateCommands":
          cfg.update(
            "commands",
            message.commands,
            vscode.ConfigurationTarget.Global,
          );
          break;
        case "updateTriggerEvents":
          cfg.update(
            "triggerEvents",
            message.events,
            vscode.ConfigurationTarget.Global,
          );
          break;
        case "updateTestCommands":
          cfg.update(
            "testCommands",
            message.testCommands,
            vscode.ConfigurationTarget.Global,
          );
          break;
      }
    },
    undefined,
    context.subscriptions,
  );
}

function getWebviewContent(
  commands: string[],
  testCommands: string[],
  triggerEvents: string[],
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>TerminalFX Settings</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0d0d0f;
      --surface: #141417;
      --surface2: #1c1c21;
      --border: #2a2a32;
      --accent: #ff4d6d;
      --accent2: #ff8c42;
      --success: #39d98a;
      --text: #e8e8f0;
      --muted: #6b6b80;
      --font-display: 'Syne', sans-serif;
      --font-mono: 'Space Mono', monospace;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-display);
      min-height: 100vh;
      padding: 0;
      overflow-x: hidden;
    }

    /* Animated background grid */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,77,109,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,77,109,0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 0;
    }

    .container {
      position: relative;
      z-index: 1;
      max-width: 720px;
      margin: 0 auto;
      padding: 48px 32px;
    }

    /* Header */
    .header {
      margin-bottom: 48px;
    }

    .header-eyebrow {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.2em;
      color: var(--accent);
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .header h1 {
      font-size: 42px;
      font-weight: 800;
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .header h1 span {
      color: var(--accent);
    }

    .header-sub {
      margin-top: 10px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--muted);
    }

    /* Divider */
    .divider {
      height: 1px;
      background: linear-gradient(90deg, var(--accent) 0%, transparent 60%);
      margin-bottom: 40px;
      opacity: 0.4;
    }

    /* Section */
    .section {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 28px;
      margin-bottom: 24px;
      transition: border-color 0.2s;
    }

    .section:hover {
      border-color: rgba(255,77,109,0.3);
    }

    .section-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .section-label {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--accent);
      margin-bottom: 4px;
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.02em;
    }

    .section-desc {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--muted);
      margin-top: 3px;
      line-height: 1.6;
    }

    /* Tags */
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      min-height: 40px;
      margin-bottom: 16px;
    }

    .tag {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 6px 10px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text);
      animation: tagIn 0.15s ease;
      transition: border-color 0.15s, background 0.15s;
    }

    .tag:hover {
      border-color: var(--accent);
      background: rgba(255,77,109,0.08);
    }

    @keyframes tagIn {
      from { opacity: 0; transform: scale(0.85); }
      to { opacity: 1; transform: scale(1); }
    }

    .tag-remove {
      background: none;
      border: none;
      color: var(--muted);
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      padding: 0;
      display: flex;
      align-items: center;
      transition: color 0.15s;
    }

    .tag-remove:hover { color: var(--accent); }

    .empty-state {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--muted);
      padding: 8px 0;
    }

    /* Input row */
    .input-row {
      display: flex;
      gap: 10px;
    }

    .input-row input {
      flex: 1;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 6px;
      color: var(--text);
      font-family: var(--font-mono);
      font-size: 13px;
      padding: 10px 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .input-row input:focus {
      border-color: var(--accent);
    }

    .input-row input::placeholder {
      color: var(--muted);
    }

    .btn-add {
      background: var(--accent);
      border: none;
      border-radius: 6px;
      color: #fff;
      cursor: pointer;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 10px 18px;
      transition: opacity 0.15s, transform 0.1s;
      white-space: nowrap;
    }

    .btn-add:hover { opacity: 0.85; }
    .btn-add:active { transform: scale(0.97); }

    /* Toggle grid for trigger events */
    .toggle-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .toggle-card {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.2s;
      user-select: none;
      position: relative;
      overflow: hidden;
    }

    .toggle-card::before {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .toggle-card.start::before { background: radial-gradient(circle at top left, rgba(255,140,66,0.15), transparent 70%); }
    .toggle-card.success::before { background: radial-gradient(circle at top left, rgba(57,217,138,0.15), transparent 70%); }
    .toggle-card.fail::before { background: radial-gradient(circle at top left, rgba(255,77,109,0.15), transparent 70%); }

    .toggle-card.active::before { opacity: 1; }

    .toggle-card.active.start { border-color: var(--accent2); }
    .toggle-card.active.success { border-color: var(--success); }
    .toggle-card.active.fail { border-color: var(--accent); }

    .toggle-icon {
      font-size: 24px;
      margin-bottom: 10px;
      display: block;
    }

    .toggle-name {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: -0.01em;
      margin-bottom: 4px;
    }

    .toggle-desc {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--muted);
    }

    .toggle-indicator {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--border);
      transition: background 0.2s;
    }

    .toggle-card.active.start .toggle-indicator { background: var(--accent2); box-shadow: 0 0 6px var(--accent2); }
    .toggle-card.active.success .toggle-indicator { background: var(--success); box-shadow: 0 0 6px var(--success); }
    .toggle-card.active.fail .toggle-indicator { background: var(--accent); box-shadow: 0 0 6px var(--accent); }

    /* Save toast */
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--surface2);
      border: 1px solid var(--success);
      border-radius: 8px;
      padding: 12px 20px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--success);
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s;
      pointer-events: none;
      z-index: 100;
    }

    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }

    /* Hardcoded badge */
    .badge {
      font-family: var(--font-mono);
      font-size: 9px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      background: rgba(255,140,66,0.15);
      color: var(--accent2);
      border: 1px solid rgba(255,140,66,0.3);
      border-radius: 4px;
      padding: 2px 7px;
      margin-left: 8px;
      vertical-align: middle;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-eyebrow">// config</div>
      <h1>Terminal<span>FX</span></h1>
      <div class="header-sub">sound feedback for your terminal — configure below</div>
    </div>

    <div class="divider"></div>

    <!-- Commands Section -->
    <div class="section">
      <div class="section-header">
        <div>
          <div class="section-label">01 / monitored</div>
          <div class="section-title">Commands</div>
          <div class="section-desc">Sounds trigger when these commands run in your terminal.</div>
        </div>
      </div>

      <div class="tags-container" id="commands-tags">
        <!-- rendered by JS -->
      </div>

      <div class="input-row">
        <input id="cmd-input" type="text" placeholder="e.g. npm run, python, cargo run" />
        <button class="btn-add" onclick="addCommand()">+ Add</button>
      </div>
    </div>

    <!-- Test Commands Section -->
<div class="section">
  <div class="section-header">
    <div>
      <div class="section-label">02 / test runner</div>
      <div class="section-title">Test Commands</div>
      <div class="section-desc">Detected via exit code — success if 0, fail otherwise.</div>
    </div>
  </div>

  <div class="tags-container" id="test-commands-tags"></div>

  <div class="input-row">
    <input id="test-cmd-input" type="text" placeholder="e.g. jest, pytest, go test" />
    <button class="btn-add" onclick="addTestCommand()">+ Add</button>
  </div>
</div>

    <!-- Trigger Events Section -->
    <div class="section">
      <div class="section-header">
        <div>
          <div class="section-label">03 / events</div>
          <div class="section-title">Trigger Events</div>
          <div class="section-desc">Choose which events play a sound.</div>
        </div>
      </div>

      <div class="toggle-grid">
        <div class="toggle-card start" id="toggle-start" onclick="toggleEvent('start')">
          <div class="toggle-indicator"></div>
          <span class="toggle-icon">💣</span>
          <div class="toggle-name">Start</div>
          <div class="toggle-desc">Command begins</div>
        </div>
        <div class="toggle-card success" id="toggle-success" onclick="toggleEvent('success')">
          <div class="toggle-indicator"></div>
          <span class="toggle-icon">✅</span>
          <div class="toggle-name">Success</div>
          <div class="toggle-desc">Exits clean / server up</div>
        </div>
        <div class="toggle-card fail" id="toggle-fail" onclick="toggleEvent('fail')">
          <div class="toggle-indicator"></div>
          <span class="toggle-icon">💥</span>
          <div class="toggle-name">Fail</div>
          <div class="toggle-desc">Crash or non-zero exit</div>
        </div>
      </div>
    </div>
  </div>

  <div class="toast" id="toast">✓ Settings saved</div>

  <script>
    const vscode = acquireVsCodeApi();

    let commands = ${JSON.stringify(commands)};
    let triggerEvents = ${JSON.stringify(triggerEvents)};
let testCommands = ${JSON.stringify(testCommands)};

    function renderCommands() {
      const container = document.getElementById("commands-tags");
      if (commands.length === 0) {
        container.innerHTML = '<span class="empty-state">No commands added yet.</span>';
        return;
      }
      container.innerHTML = commands.map(cmd => \`
        <span class="tag">
          \${cmd}
          <button class="tag-remove" onclick="removeCommand('\${cmd}')">×</button>
        </span>
      \`).join("");
    }

    function renderToggles() {
      ["start", "success", "fail"].forEach(event => {
        const card = document.getElementById("toggle-" + event);
        if (triggerEvents.includes(event)) {
          card.classList.add("active");
        } else {
          card.classList.remove("active");
        }
      });
    }

    function addCommand() {
      const input = document.getElementById("cmd-input");
      const val = input.value.trim();
      if (val && !commands.includes(val)) {
        commands.push(val);
        input.value = "";
        renderCommands();
        save("updateCommands", { commands });
      }
    }

    function removeCommand(cmd) {
      commands = commands.filter(c => c !== cmd);
      renderCommands();
      save("updateCommands", { commands });
    }

    function toggleEvent(event) {
      if (triggerEvents.includes(event)) {
        triggerEvents = triggerEvents.filter(e => e !== event);
      } else {
        triggerEvents.push(event);
      }
      renderToggles();
      save("updateTriggerEvents", { events: triggerEvents });
    }

    function save(type, data) {
      vscode.postMessage({ type, ...data });
      showToast();
    }

    function showToast() {
      const toast = document.getElementById("toast");
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2000);
    }

    document.getElementById("cmd-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") addCommand();
    });

    function renderTestCommands() {
  const container = document.getElementById("test-commands-tags");
  if (testCommands.length === 0) {
    container.innerHTML = '<span class="empty-state">No test commands added yet.</span>';
    return;
  }
  container.innerHTML = testCommands.map(cmd => \`
    <span class="tag">
      \${cmd}
      <button class="tag-remove" onclick="removeTestCommand('\${cmd}')">×</button>
    </span>
  \`).join("");
}

function addTestCommand() {
  const input = document.getElementById("test-cmd-input");
  const val = input.value.trim();
  if (val && !testCommands.includes(val)) {
    testCommands.push(val);
    input.value = "";
    renderTestCommands();
    save("updateTestCommands", { testCommands });
  }
}

function removeTestCommand(cmd) {
  testCommands = testCommands.filter(c => c !== cmd);
  renderTestCommands();
  save("updateTestCommands", { testCommands });
}

document.getElementById("test-cmd-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTestCommand();
});


// Init
renderCommands();
renderTestCommands();
    renderToggles();
  </script>
</body>
</html>`;
}
