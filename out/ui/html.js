"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebviewContent = getWebviewContent;
function getWebviewContent() {
    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Dev Assistant</title>
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --bg-primary:    var(--vscode-sideBar-background, #1e1e1e);
      --bg-secondary:  var(--vscode-input-background, #2d2d2d);
      --bg-user-msg:   var(--vscode-button-background, #0e639c);
      --bg-ai-msg:     var(--vscode-editor-inactiveSelectionBackground, #3a3d41);
      --border:        var(--vscode-panel-border, #444);
      --text-primary:  var(--vscode-foreground, #cccccc);
      --text-secondary:var(--vscode-descriptionForeground, #9d9d9d);
      --text-on-accent:var(--vscode-button-foreground, #ffffff);
      --accent:        var(--vscode-button-background, #0e639c);
      --accent-hover:  var(--vscode-button-hoverBackground, #1177bb);
      --danger:        #f44747;
      --danger-hover:  #c73232;
      --success:       #4ec9b0;
      --radius-sm:     4px;
      --radius-md:     8px;
      --font:          var(--vscode-font-family, 'Segoe UI', system-ui, sans-serif);
      --font-mono:     var(--vscode-editor-font-family, 'Cascadia Code', monospace);
      --font-size:     13px;
    }

    body {
      font-family: var(--font);
      font-size: var(--font-size);
      color: var(--text-primary);
      background: var(--bg-primary);
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    /* ── Mode switcher ────────────────────────────────── */
    .mode-bar {
      display: flex;
      gap: 6px;
      padding: 10px 12px 8px;
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
    }

    .mode-btn {
      flex: 1;
      padding: 5px 0;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      background: transparent;
      color: var(--text-secondary);
      font-size: 11px;
      font-family: var(--font);
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.15s, color 0.15s, border-color 0.15s;
    }

    .mode-btn:hover {
      background: var(--bg-secondary);
      color: var(--text-primary);
    }

    .mode-btn.active {
      background: var(--accent);
      border-color: var(--accent);
      color: var(--text-on-accent);
    }

    /* ── Mode label ───────────────────────────────────── */
    .mode-label {
      padding: 5px 12px;
      font-size: 11px;
      color: var(--text-secondary);
      border-bottom: 1px solid var(--border);
      flex-shrink: 0;
      letter-spacing: 0.03em;
    }

    .mode-label span {
      color: var(--accent);
      font-weight: 600;
    }

    /* ── Messages ─────────────────────────────────────── */
    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }

    .messages::-webkit-scrollbar { width: 4px; }
    .messages::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 2px;
    }

    .message-row {
      display: flex;
      flex-direction: column;
      max-width: 90%;
    }

    .message-row.user {
      align-self: flex-end;
      align-items: flex-end;
    }

    .message-row.assistant {
      align-self: flex-start;
      align-items: flex-start;
    }

    .message-label {
      font-size: 10px;
      color: var(--text-secondary);
      margin-bottom: 3px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .bubble {
      padding: 8px 12px;
      border-radius: var(--radius-md);
      line-height: 1.5;
      word-break: break-word;
    }

    .message-row.user .bubble {
      background: var(--bg-user-msg);
      color: var(--text-on-accent);
      border-bottom-right-radius: var(--radius-sm);
    }

    .message-row.assistant .bubble {
      background: var(--bg-ai-msg);
      color: var(--text-primary);
      border-bottom-left-radius: var(--radius-sm);
    }

    /* ── File change cards ────────────────────────────── */
    .file-changes {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 8px;
      width: 100%;
    }

    .file-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      padding: 8px 10px;
    }

    .file-card-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
    }

    .file-icon {
      font-size: 12px;
      opacity: 0.7;
    }

    .file-name {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--success);
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .file-summary {
      font-size: 11px;
      color: var(--text-secondary);
      margin-bottom: 8px;
    }

    .file-actions {
      display: flex;
      gap: 5px;
    }

    .action-btn {
      padding: 3px 9px;
      border-radius: var(--radius-sm);
      border: 1px solid transparent;
      font-size: 11px;
      font-family: var(--font);
      cursor: pointer;
      transition: background 0.15s, opacity 0.15s;
    }

    .action-btn:hover { opacity: 0.85; }

    .action-btn.diff {
      background: transparent;
      border-color: var(--border);
      color: var(--text-primary);
    }

    .action-btn.diff:hover { background: var(--bg-ai-msg); }

    .action-btn.apply {
      background: var(--accent);
      color: var(--text-on-accent);
    }

    .action-btn.reject {
      background: var(--danger);
      color: #fff;
    }

    /* ── Loading indicator ────────────────────────────── */
    .loading-row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 0;
      align-self: flex-start;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--text-secondary);
      animation: bounce 1.2s infinite ease-in-out;
    }

    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
      40%            { transform: scale(1);   opacity: 1; }
    }

    /* ── Empty state ──────────────────────────────────── */
    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--text-secondary);
      font-size: 12px;
      padding: 24px;
      text-align: center;
    }

    .empty-state-icon { font-size: 28px; opacity: 0.4; }

    /* ── Input area ───────────────────────────────────── */
    .input-area {
      display: flex;
      gap: 6px;
      padding: 10px 12px;
      border-top: 1px solid var(--border);
      flex-shrink: 0;
      align-items: flex-end;
    }

    .input-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      overflow: hidden;
      transition: border-color 0.15s;
    }

    .input-wrap:focus-within { border-color: var(--accent); }

    #message-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      padding: 8px 10px;
      color: var(--text-primary);
      font-size: var(--font-size);
      font-family: var(--font);
      resize: none;
      line-height: 1.4;
      max-height: 100px;
      overflow-y: auto;
    }

    #message-input::placeholder { color: var(--text-secondary); }
    #message-input::-webkit-scrollbar { width: 3px; }
    #message-input::-webkit-scrollbar-thumb { background: var(--border); }

    #send-btn {
      padding: 7px 12px;
      background: var(--accent);
      border: none;
      border-radius: var(--radius-md);
      color: var(--text-on-accent);
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s;
      flex-shrink: 0;
      line-height: 1;
    }

    #send-btn:hover { background: var(--accent-hover); }
    #send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  </style>
</head>
<body>

  <!-- Mode switcher -->
  <div class="mode-bar">
    <button class="mode-btn active" data-mode="ask" id="btn-ask">Ask Mode</button>
    <button class="mode-btn"        data-mode="agent" id="btn-agent">Agent Mode</button>
  </div>

  <!-- Active mode label -->
  <div class="mode-label" id="mode-label">
    Mode: <span id="mode-name">Ask</span>
  </div>

  <!-- Message list -->
  <div class="messages" id="messages">
    <div class="empty-state" id="empty-state">
      <div class="empty-state-icon">💬</div>
      <div>Ask a question or describe a task</div>
    </div>
  </div>

  <!-- Input area -->
  <div class="input-area">
    <div class="input-wrap">
      <textarea
        id="message-input"
        rows="1"
        placeholder="Type a message…"
        autocomplete="off"
        spellcheck="false"
      ></textarea>
    </div>
    <button id="send-btn" title="Send">&#9658;</button>
  </div>

  <script>
    (function () {
      const vscode = acquireVsCodeApi();

      // ── State ────────────────────────────────────────
      let currentMode = 'ask';
      let isLoading   = false;

      // ── Elements ─────────────────────────────────────
      const messagesEl  = document.getElementById('messages');
      const inputEl     = document.getElementById('message-input');
      const sendBtn     = document.getElementById('send-btn');
      const modeNameEl  = document.getElementById('mode-name');
      const emptyState  = document.getElementById('empty-state');
      const btnAsk      = document.getElementById('btn-ask');
      const btnAgent    = document.getElementById('btn-agent');

      // ── Mode switching ────────────────────────────────
      function setMode(mode) {
        currentMode = mode;
        btnAsk.classList.toggle('active',   mode === 'ask');
        btnAgent.classList.toggle('active', mode === 'agent');
        modeNameEl.textContent = mode === 'ask' ? 'Ask' : 'Agent';
        vscode.postMessage({ type: 'switchMode', payload: mode });
      }

      btnAsk.addEventListener('click',   () => setMode('ask'));
      btnAgent.addEventListener('click', () => setMode('agent'));

      // ── Auto-resize textarea ──────────────────────────
      inputEl.addEventListener('input', () => {
        inputEl.style.height = 'auto';
        inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
      });

      // ── Send on Enter (Shift+Enter = new line) ────────
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      });

      sendBtn.addEventListener('click', sendMessage);

      function sendMessage() {
        const text = inputEl.value.trim();
        if (!text || isLoading) return;

        vscode.postMessage({ type: 'sendMessage', payload: text });

        inputEl.value = '';
        inputEl.style.height = 'auto';
      }

      // ── Render a message ──────────────────────────────
      function renderMessage(msg) {
        hideEmptyState();

        const row = document.createElement('div');
        row.className = 'message-row ' + msg.role;

        const label = document.createElement('div');
        label.className = 'message-label';
        label.textContent = msg.role === 'user' ? 'You' : 'Assistant';
        row.appendChild(label);

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.textContent = msg.content;
        row.appendChild(bubble);

        if (msg.role === 'assistant' && msg.fileChanges && msg.fileChanges.length > 0) {
          const changes = document.createElement('div');
          changes.className = 'file-changes';

          msg.fileChanges.forEach((fc) => {
            changes.appendChild(buildFileCard(fc));
          });

          row.appendChild(changes);
        }

        messagesEl.appendChild(row);
        scrollToBottom();
      }

      // ── Build a file-change card ──────────────────────
      function buildFileCard(fc) {
        const card = document.createElement('div');
        card.className = 'file-card';

        const header = document.createElement('div');
        header.className = 'file-card-header';

        const icon = document.createElement('span');
        icon.className = 'file-icon';
        icon.textContent = '📄';

        const name = document.createElement('span');
        name.className = 'file-name';
        name.textContent = fc.filename;

        header.appendChild(icon);
        header.appendChild(name);

        const summary = document.createElement('div');
        summary.className = 'file-summary';
        summary.textContent = fc.summary;

        const actions = document.createElement('div');
        actions.className = 'file-actions';

        const diffBtn  = makeActionBtn('diff',  'View Diff',       () => vscode.postMessage({ type: 'viewDiff',      payload: fc.filename }));
        const applyBtn = makeActionBtn('apply', 'Apply Changes',    () => vscode.postMessage({ type: 'applyChanges', payload: fc.filename }));
        const rejectBtn= makeActionBtn('reject','Reject',           () => vscode.postMessage({ type: 'rejectChanges',payload: fc.filename }));

        actions.appendChild(diffBtn);
        actions.appendChild(applyBtn);
        actions.appendChild(rejectBtn);

        card.appendChild(header);
        card.appendChild(summary);
        card.appendChild(actions);
        return card;
      }

      function makeActionBtn(cls, label, onClick) {
        const btn = document.createElement('button');
        btn.className = 'action-btn ' + cls;
        btn.textContent = label;
        btn.addEventListener('click', onClick);
        return btn;
      }

      // ── Loading indicator ─────────────────────────────
      let loadingRow = null;

      function showLoading() {
        hideEmptyState();
        loadingRow = document.createElement('div');
        loadingRow.className = 'loading-row';
        [0, 1, 2].forEach(() => {
          const dot = document.createElement('div');
          dot.className = 'dot';
          loadingRow.appendChild(dot);
        });
        messagesEl.appendChild(loadingRow);
        scrollToBottom();
        sendBtn.disabled = true;
        isLoading = true;
      }

      function hideLoading() {
        if (loadingRow) {
          loadingRow.remove();
          loadingRow = null;
        }
        sendBtn.disabled = false;
        isLoading = false;
      }

      // ── Helpers ───────────────────────────────────────
      function hideEmptyState() {
        if (emptyState) emptyState.style.display = 'none';
      }

      function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }

      // ── Messages from extension ───────────────────────
      window.addEventListener('message', (event) => {
        const { type, payload } = event.data;

        switch (type) {
          case 'appendMessage':
            hideLoading();
            renderMessage(payload);
            break;

          case 'setLoading':
            if (payload) showLoading();
            else hideLoading();
            break;
        }
      });
    })();
  </script>
</body>
</html>`;
}
//# sourceMappingURL=html.js.map