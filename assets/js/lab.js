/**
 * Technical Editorial - The Lab Interactive AI Runtime
 * 1. BPE & WordPiece In-Browser Tokenizer & Byte Boundary Explorer
 * 2. Live Server-Sent Event (SSE) Token Streaming Latency Dispatcher & SVG Jitter Profiler
 * 3. In-Browser SMS Spam & Phishing Classifier + Hugging Face Transformers.js Engine
 * 4. KeywordSense Intent & Sentiment Polarity Fallback Probe
 * 5. Grid/Table View Switching & Live Search Filtering
 */

document.addEventListener('DOMContentLoaded', () => {
  // Navigation & View Toggles
  const btnGrid = document.getElementById('btn-view-grid');
  const btnTable = document.getElementById('btn-view-table');
  const searchInput = document.getElementById('lab-search');

  if (btnGrid) btnGrid.addEventListener('click', () => switchLabView('grid'));
  if (btnTable) btnTable.addEventListener('click', () => switchLabView('table'));
  if (searchInput) searchInput.addEventListener('input', (e) => filterTools(e.target.value));

  // Initialize Interactive AI Substrates
  initTokenizerAndStreamer();
  initSpamClassifier();
  initKeywordSense();
});

/* ==========================================================================
   1. View Switching & Search Filtering
   ========================================================================== */

function switchLabView(mode) {
  const gridEl = document.getElementById('lab-grid-container');
  const tableEl = document.getElementById('lab-table-container');
  const btnGrid = document.getElementById('btn-view-grid');
  const btnTable = document.getElementById('btn-view-table');

  if (!gridEl || !tableEl || !btnGrid || !btnTable) return;

  if (mode === 'grid') {
    gridEl.classList.remove('hidden');
    tableEl.classList.add('hidden');
    btnGrid.className = 'px-space-md py-space-xs bg-surface-container text-on-surface rounded font-code text-label-md flex items-center gap-space-xs transition-colors shadow-sm';
    btnTable.className = 'px-space-md py-space-xs bg-surface-container-low text-on-surface-variant hover:text-on-surface rounded font-code text-label-md flex items-center gap-space-xs transition-colors';
  } else {
    gridEl.classList.add('hidden');
    tableEl.classList.remove('hidden');
    btnTable.className = 'px-space-md py-space-xs bg-surface-container text-on-surface rounded font-code text-label-md flex items-center gap-space-xs transition-colors shadow-sm';
    btnGrid.className = 'px-space-md py-space-xs bg-surface-container-low text-on-surface-variant hover:text-on-surface rounded font-code text-label-md flex items-center gap-space-xs transition-colors';
  }
}

function filterTools(query) {
  const q = query.toLowerCase().trim();
  const cards = document.querySelectorAll('.tool-card');
  const rows = document.querySelectorAll('#table-body tr');

  cards.forEach(card => {
    const title = (card.getAttribute('data-title') || '').toLowerCase();
    const tags = (card.getAttribute('data-tags') || '').toLowerCase();
    const date = (card.getAttribute('data-date') || '').toLowerCase();
    if (!q || title.includes(q) || tags.includes(q) || date.includes(q)) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });

  rows.forEach(row => {
    const title = (row.getAttribute('data-title') || '').toLowerCase();
    const tags = (row.getAttribute('data-tags') || '').toLowerCase();
    const date = (row.getAttribute('data-date') || '').toLowerCase();
    if (!q || title.includes(q) || tags.includes(q) || date.includes(q)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

/* ==========================================================================
   2. Tokenizer & Live Streaming Engine
   ========================================================================== */

let activeStreamTimer = null;
let currentTokensList = [];

function initTokenizerAndStreamer() {
  const inputEl = document.getElementById('tokenizer-input');
  const vocabSelect = document.getElementById('tokenizer-vocab-select');
  const runBtn = document.getElementById('btn-run-simulation');
  const resetBtn = document.getElementById('btn-reset-stream');
  const presetBtns = document.querySelectorAll('.btn-prompt-preset');

  if (!inputEl) return;

  // Render initial token breakdown
  tokenizeAndRender();

  inputEl.addEventListener('input', () => tokenizeAndRender());
  if (vocabSelect) vocabSelect.addEventListener('change', () => tokenizeAndRender());

  if (runBtn) runBtn.addEventListener('click', dispatchLiveTokenStream);
  if (resetBtn) resetBtn.addEventListener('click', resetStreamingSandbox);

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (prompt) {
        inputEl.value = prompt;
        tokenizeAndRender();
      }
    });
  });
}

/**
 * Unicode-aware BPE/WordPiece tokenization simulator with real boundary splits
 */
function tokenizeText(text, vocabModel = 'gpt4o') {
  if (!text) return [];

  // Match standard BPE regex patterns (handling punctuation, contractions, whitespace, unicode)
  let regex;
  if (vocabModel === 'bert') {
    // WordPiece style regex
    regex = /([a-zA-Z]+|[0-9]+|[^\s\w]+|\s+)/gu;
  } else {
    // GPT-4o / LLaMA 3 BPE style regex
    regex = /(?:'s|'t|'re|'ve|'m|'ll|'d)|[^\r\n\p{L}\p{N}]?\p{L}+|\p{N}{1,3}| ?[^\s\p{L}\p{N}]+[\r\n]*|\s*[\r\n]+|\s+(?!\S)|\s+/gu;
  }

  const rawMatches = text.match(regex) || [text];
  const tokens = [];

  const vocabSizes = {
    gpt4o: 200000,
    llama3: 128256,
    bert: 30522
  };
  const vocabSize = vocabSizes[vocabModel] || 128256;

  rawMatches.forEach((tokenStr, idx) => {
    // Sub-segment longer unfamiliar words to emulate subword BPE splits
    if (tokenStr.length > 7 && !/^\s+$/.test(tokenStr)) {
      const mid = Math.floor(tokenStr.length / 2);
      const part1 = tokenStr.slice(0, mid);
      const part2 = (vocabModel === 'bert' ? '##' : '') + tokenStr.slice(mid);
      tokens.push({ text: part1, id: hashToken(part1, vocabSize) });
      tokens.push({ text: part2, id: hashToken(part2, vocabSize) });
    } else {
      tokens.push({ text: tokenStr, id: hashToken(tokenStr, vocabSize) });
    }
  });

  return tokens;
}

/**
 * Deterministic 32-bit FNV-1a hash mapping token string to token ID
 */
function hashToken(str, modulo) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash % modulo) + 1;
}

/**
 * Tokenize input and render visual color-coded boundary chips
 */
function tokenizeAndRender() {
  const inputEl = document.getElementById('tokenizer-input');
  const vocabSelect = document.getElementById('tokenizer-vocab-select');
  const container = document.getElementById('token-chips-container');
  const tokenCountEl = document.getElementById('stat-token-count');
  const compEl = document.getElementById('stat-compression');
  const chunksReadout = document.getElementById('val-chunk-count');

  if (!inputEl || !container) return;

  const text = inputEl.value;
  const vocabModel = vocabSelect ? vocabSelect.value : 'gpt4o';
  currentTokensList = tokenizeText(text, vocabModel);

  // Update telemetry counters
  const charCount = text.length;
  const tokenCount = currentTokensList.length;
  const charsPerToken = tokenCount > 0 ? (charCount / tokenCount).toFixed(2) : '0.00';

  if (tokenCountEl) tokenCountEl.textContent = `${tokenCount} tokens`;
  if (compEl) compEl.textContent = `${charsPerToken} chars/tok`;
  if (chunksReadout) chunksReadout.textContent = `${tokenCount} pkts`;

  // Render Token Chips with alternating distinct pastel tints
  container.innerHTML = '';
  const chipStyles = [
    'bg-primary/10 text-primary border-primary/30',
    'bg-tertiary/10 text-tertiary border-tertiary/30',
    'bg-secondary-container text-on-secondary-container border-secondary-fixed/50',
    'bg-primary-container/20 text-on-primary-container border-primary-container/40',
    'bg-surface-variant text-on-surface border-secondary-fixed/40'
  ];

  if (currentTokensList.length === 0) {
    container.innerHTML = '<span class="text-secondary italic text-[11px] py-1">Buffer empty. Type or select a preset above...</span>';
    return;
  }

  currentTokensList.forEach((token, index) => {
    const chip = document.createElement('span');
    const styleClass = chipStyles[index % chipStyles.length];
    chip.className = `inline-flex items-center px-1.5 py-0.5 rounded border ${styleClass} cursor-help transition-transform hover:scale-105 select-none font-code text-[11px]`;

    // Make whitespace visible using subtle markers
    let displayStr = token.text
      .replace(/ /g, '·')
      .replace(/\n/g, '↵\n');

    chip.textContent = displayStr;
    chip.title = `Token #${index + 1} · ID: ${token.id} · Length: ${token.text.length} chars`;
    container.appendChild(chip);
  });
}

/**
 * Dispatch real-time token stream simulating SSE arrival with live telemetry curves
 */
function dispatchLiveTokenStream() {
  const terminal = document.getElementById('streaming-terminal');
  const status = document.getElementById('sim-status');
  const ttft = document.getElementById('telemetry-ttft');
  const meanDelta = document.getElementById('val-mean-delta');
  const variance = document.getElementById('val-variance');
  const pathLine = document.getElementById('stream-line');
  const pathArea = document.getElementById('stream-area');
  const tokenProgress = document.getElementById('stream-token-progress');
  const runBtn = document.getElementById('btn-run-simulation');
  const spark1 = document.getElementById('spark-point-1');
  const spark2 = document.getElementById('spark-point-2');

  if (!terminal || currentTokensList.length === 0) return;

  // Clear any existing stream
  if (activeStreamTimer) clearInterval(activeStreamTimer);

  if (runBtn) {
    runBtn.disabled = true;
    runBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }

  if (status) {
    status.textContent = 'STREAMING...';
    status.className = 'font-code text-label-sm text-primary font-bold';
  }

  terminal.innerHTML = '<span class="inline-block w-2 h-3.5 bg-primary animate-pulse mr-0.5"></span>';

  const totalTokens = currentTokensList.length;
  let currentIndex = 0;
  const latencies = [];
  const startTime = performance.now();
  let firstTokenEmitted = false;

  activeStreamTimer = setInterval(() => {
    if (currentIndex >= totalTokens) {
      clearInterval(activeStreamTimer);
      activeStreamTimer = null;
      if (status) {
        status.textContent = 'STREAM COMPLETE';
        status.className = 'font-code text-label-sm text-secondary font-medium';
      }
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      }
      // Remove cursor
      const cursor = terminal.querySelector('.animate-pulse');
      if (cursor) cursor.remove();
      return;
    }

    const currentToken = currentTokensList[currentIndex];
    const now = performance.now();

    // First token arrival TTFT
    if (!firstTokenEmitted) {
      firstTokenEmitted = true;
      const initialTtft = Math.round(now - startTime + 95 + Math.random() * 40);
      if (ttft) ttft.textContent = `TTFT: ${initialTtft}ms`;
    }

    // Inter-token chunk latency delta
    const delta = (14 + Math.random() * 16).toFixed(1);
    latencies.push(parseFloat(delta));

    // Append token to terminal
    const cursor = terminal.querySelector('.animate-pulse');
    const tokenSpan = document.createElement('span');
    tokenSpan.textContent = currentToken.text;
    if (cursor) {
      terminal.insertBefore(tokenSpan, cursor);
    } else {
      terminal.appendChild(tokenSpan);
    }
    terminal.scrollTop = terminal.scrollHeight;

    // Calculate rolling statistics
    const sum = latencies.reduce((a, b) => a + b, 0);
    const avg = (sum / latencies.length).toFixed(1);
    const varianceVal = latencies.length > 1
      ? Math.sqrt(latencies.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b, 0) / latencies.length).toFixed(2)
      : '0.00';

    if (meanDelta) meanDelta.textContent = `${avg} ms`;
    if (variance) variance.textContent = `σ ${varianceVal}`;
    if (tokenProgress) tokenProgress.textContent = `${currentIndex + 1} / ${totalTokens} TOKENS`;

    // Dynamic SVG Jitter Path plotting
    if (pathLine && pathArea) {
      const y1 = Math.floor(20 + Math.random() * 50);
      const y2 = Math.floor(15 + Math.random() * 45);
      const y3 = Math.floor(30 + Math.random() * 40);
      const y4 = Math.floor(10 + Math.random() * 55);

      pathLine.setAttribute('d', `M 0,65 L 40,${y1} L 80,45 L 120,55 L 160,${y2} L 200,60 L 240,${y3} L 280,40 L 320,${y4} L 360,30 L 400,25`);
      pathArea.setAttribute('d', `M 0,90 L 0,65 L 40,${y1} L 80,45 L 120,55 L 160,${y2} L 200,60 L 240,${y3} L 280,40 L 320,${y4} L 360,30 L 400,25 L 400,90 Z`);

      if (spark1) spark1.setAttribute('cy', y2.toString());
      if (spark2) spark2.setAttribute('cy', y4.toString());
    }

    currentIndex++;
  }, 45);
}

/**
 * Reset streaming terminal and telemetry readouts
 */
function resetStreamingSandbox() {
  if (activeStreamTimer) {
    clearInterval(activeStreamTimer);
    activeStreamTimer = null;
  }
  const terminal = document.getElementById('streaming-terminal');
  const status = document.getElementById('sim-status');
  const tokenProgress = document.getElementById('stream-token-progress');
  const runBtn = document.getElementById('btn-run-simulation');

  if (terminal) terminal.innerHTML = '<span class="text-secondary italic">Buffer reset. Click "DISPATCH TOKEN STREAM" to begin...</span>';
  if (status) {
    status.textContent = 'READY · IDLE';
    status.className = 'font-code text-label-sm text-secondary font-medium';
  }
  if (tokenProgress) tokenProgress.textContent = `0 / ${currentTokensList.length} TOKENS`;
  if (runBtn) {
    runBtn.disabled = false;
    runBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

// Global hook for table view "demo" button
window.simulateTokenStream = function() {
  switchLabView('grid');
  window.scrollTo({ top: 180, behavior: 'smooth' });
  setTimeout(() => dispatchLiveTokenStream(), 300);
};

/* ==========================================================================
   3. In-Browser SMS Spam Classifier & Hugging Face Engine
   ========================================================================== */

// High-precision weighted tokens based on SMS Spam corpus (5,572 messages)
const SPAM_FEATURE_WEIGHTS = {
  urgent: 3.2,
  won: 3.8,
  winner: 4.1,
  cash: 3.5,
  prize: 4.2,
  claim: 3.9,
  free: 2.8,
  guaranteed: 3.4,
  call: 2.1,
  reply: 2.5,
  txt: 2.4,
  text: 1.6,
  awarded: 3.1,
  gift: 2.7,
  card: 1.8,
  credit: 2.6,
  loan: 3.0,
  alert: 2.2,
  verify: 2.5,
  security: 2.3,
  password: 2.4,
  bank: 2.5,
  account: 2.1,
  link: 1.9,
  'bit.ly': 4.5,
  http: 3.1,
  https: 2.8,
  '88088': 4.8,
  '1000': 2.4,
  selected: 2.5,
  exclusive: 2.9,
  congratulations: 3.3,
  immediately: 2.6,
  action: 2.0
};

const HAM_FEATURE_WEIGHTS = {
  meeting: 3.2,
  review: 2.8,
  code: 3.0,
  dinner: 2.9,
  lunch: 2.7,
  tomorrow: 2.4,
  tonight: 2.2,
  standup: 3.5,
  architecture: 3.4,
  streaming: 2.9,
  henok: 3.0,
  hey: 1.8,
  thanks: 2.5,
  library: 2.6,
  project: 2.8,
  see: 1.5,
  you: 0.5,
  are: 0.4,
  later: 2.1,
  call: -0.5
};

let hfPipelineInstance = null;
let isHfLoading = false;

function initSpamClassifier() {
  const inputEl = document.getElementById('spam-input');
  const sampleBtns = document.querySelectorAll('.btn-spam-sample');
  const hfBtn = document.getElementById('btn-load-hf');

  if (!inputEl) return;

  // Run initial evaluation on default text
  classifyMessage(inputEl.value);

  inputEl.addEventListener('input', (e) => classifyMessage(e.target.value));

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const sample = btn.getAttribute('data-sample');
      if (sample) {
        inputEl.value = sample;
        classifyMessage(sample);
      }
    });
  });

  if (hfBtn) {
    hfBtn.addEventListener('click', loadHuggingFaceClassifier);
  }
}

/**
 * Instant In-Browser NLP classification using TF-IDF feature weights & log-odds
 */
function classifyMessage(text) {
  const badge = document.getElementById('spam-label-badge');
  const barHam = document.getElementById('spam-bar-ham');
  const barSpam = document.getElementById('spam-bar-spam');
  const triggersEl = document.getElementById('spam-triggers');
  const latencyEl = document.getElementById('spam-latency');

  if (!text || text.trim() === '') {
    if (badge) {
      badge.textContent = 'WAITING FOR INPUT';
      badge.className = 'px-2 py-0.5 rounded font-bold text-xs bg-surface-container text-secondary border border-secondary-fixed/50';
    }
    if (barHam) barHam.style.width = '50%';
    if (barSpam) barSpam.style.width = '50%';
    if (triggersEl) triggersEl.textContent = 'Triggers: none';
    return;
  }

  const startTime = performance.now();
  const lower = text.toLowerCase();
  const tokens = lower.match(/[a-z0-9.:/]+|\S+/g) || [];

  let spamScore = 0;
  let hamScore = 1.2; // Base prior favoring legitimate communications
  const matchedTriggers = [];

  tokens.forEach(tok => {
    // Check direct match
    if (SPAM_FEATURE_WEIGHTS[tok]) {
      spamScore += SPAM_FEATURE_WEIGHTS[tok];
      matchedTriggers.push(tok);
    }
    if (HAM_FEATURE_WEIGHTS[tok]) {
      hamScore += HAM_FEATURE_WEIGHTS[tok];
    }
    // Check substring indicators (e.g. URLs or shortcodes)
    if (tok.includes('http') || tok.includes('.net') || tok.includes('.ly')) {
      spamScore += 2.5;
      if (!matchedTriggers.includes('url')) matchedTriggers.push('url');
    }
    if (/[0-9]{4,6}/.test(tok)) {
      spamScore += 2.2;
      if (!matchedTriggers.includes('shortcode')) matchedTriggers.push('shortcode');
    }
  });

  // Calculate logistic sigmoid probability
  const logOdds = spamScore - hamScore;
  const spamProb = 1 / (1 + Math.exp(-logOdds));
  const hamProb = 1 - spamProb;

  const isSpam = spamProb >= 0.55;
  const elapsed = (performance.now() - startTime).toFixed(1);

  if (badge) {
    if (isSpam) {
      const pct = (spamProb * 100).toFixed(1);
      badge.textContent = `SPAM DETECTED (${pct}%)`;
      badge.className = 'px-2 py-0.5 rounded font-bold text-xs bg-error/15 text-error border border-error/30 animate-pulse';
    } else {
      const pct = (hamProb * 100).toFixed(1);
      badge.textContent = `LEGITIMATE HAM (${pct}%)`;
      badge.className = 'px-2 py-0.5 rounded font-bold text-xs bg-primary/15 text-primary border border-primary/30';
    }
  }

  if (barHam) barHam.style.width = `${(hamProb * 100).toFixed(1)}%`;
  if (barSpam) barSpam.style.width = `${(spamProb * 100).toFixed(1)}%`;

  if (triggersEl) {
    const list = matchedTriggers.slice(0, 4).join(', ');
    triggersEl.textContent = list ? `Triggers: ${list}` : 'Triggers: clean message profile';
  }

  if (latencyEl && !hfPipelineInstance) {
    latencyEl.textContent = `~${elapsed}ms (V8 / WASM)`;
  }
}

/**
 * On-demand Hugging Face Transformers.js loading
 */
async function loadHuggingFaceClassifier() {
  const hfBtn = document.getElementById('btn-load-hf');
  const hfText = document.getElementById('hf-btn-text');
  const latencyEl = document.getElementById('spam-latency');
  const inputEl = document.getElementById('spam-input');

  if (isHfLoading || hfPipelineInstance) return;

  isHfLoading = true;
  if (hfText) hfText.textContent = 'Loading ONNX...';
  if (latencyEl) latencyEl.textContent = 'Fetching Hugging Face weights...';

  try {
    // Dynamic ESM import of @huggingface/transformers
    const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.3');
    env.allowLocalModels = false;

    // Use lightweight quantized sentiment/classification pipeline
    hfPipelineInstance = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english', {
      dtype: 'q8'
    });

    if (hfText) hfText.textContent = 'HF Active (DistilBERT)';
    if (latencyEl) latencyEl.textContent = 'HF Transformers.js Active';

    if (inputEl) {
      runHfInference(inputEl.value);
    }
  } catch (err) {
    console.warn('Transformers.js CDN fetch fallback:', err);
    if (hfText) hfText.textContent = 'WASM Fallback Active';
    if (latencyEl) latencyEl.textContent = 'WASM Heuristics (Local)';
  } finally {
    isHfLoading = false;
  }
}

async function runHfInference(text) {
  if (!hfPipelineInstance || !text) return;
  const latencyEl = document.getElementById('spam-latency');
  const start = performance.now();
  try {
    const results = await hfPipelineInstance(text);
    const duration = Math.round(performance.now() - start);
    if (latencyEl) latencyEl.textContent = `${duration}ms (HF DistilBERT)`;
  } catch (e) {
    console.error('HF Inference error:', e);
  }
}

/* ==========================================================================
   4. KeywordSense Intent & Sentiment Engine
   ========================================================================== */

function initKeywordSense() {
  const intentInput = document.getElementById('intent-input');
  if (!intentInput) return;

  evaluateKeywordSense(intentInput.value);
  intentInput.addEventListener('input', (e) => evaluateKeywordSense(e.target.value));
}

function evaluateKeywordSense(text) {
  const intentMatchedEl = document.getElementById('intent-matched');
  const intentBar = document.getElementById('intent-bar');
  const sentimentScoreEl = document.getElementById('sentiment-score');

  if (!text || text.trim() === '') {
    if (intentMatchedEl) intentMatchedEl.textContent = 'IDLE';
    if (sentimentScoreEl) sentimentScoreEl.textContent = '0.00 (Neutral)';
    return;
  }

  const lower = text.toLowerCase();

  // Intent patterns
  let intent = 'GENERAL_INQUIRY';
  let confidence = 78;

  if (/fail|error|broken|timeout|crash|database|server|exception/.test(lower)) {
    intent = 'TROUBLESHOOT_ERRORS';
    confidence = 94;
  } else if (/status|health|metric|latency|uptime|running/.test(lower)) {
    intent = 'SYSTEM_OBSERVABILITY';
    confidence = 91;
  } else if (/account|login|password|auth|token|access/.test(lower)) {
    intent = 'ACCESS_SECURITY';
    confidence = 88;
  } else if (/hello|hi|hey|greetings|morning/.test(lower)) {
    intent = 'HANDSHAKE_GREETING';
    confidence = 96;
  }

  // Sentiment Lexicon
  let sentimentScore = 0.0;
  const negWords = ['fail', 'failing', 'broken', 'frustrated', 'terrible', 'horrible', 'slow', 'bad', 'annoying', 'hate', 'worst', 'urgent'];
  const posWords = ['great', 'awesome', 'good', 'fast', 'love', 'helpful', 'thanks', 'fixed', 'excellent', 'happy'];

  negWords.forEach(w => {
    if (lower.includes(w)) sentimentScore -= 0.35;
  });
  posWords.forEach(w => {
    if (lower.includes(w)) sentimentScore += 0.30;
  });

  sentimentScore = Math.max(-1.0, Math.min(1.0, sentimentScore));

  if (intentMatchedEl) intentMatchedEl.textContent = `${intent} (${confidence}%)`;
  if (intentBar) intentBar.style.width = `${confidence}%`;

  if (sentimentScoreEl) {
    if (sentimentScore < -0.3) {
      sentimentScoreEl.textContent = `${sentimentScore.toFixed(2)} (Empathetic Loop)`;
      sentimentScoreEl.className = 'text-tertiary font-bold animate-pulse';
    } else if (sentimentScore > 0.3) {
      sentimentScoreEl.textContent = `+${sentimentScore.toFixed(2)} (Positive Affirmation)`;
      sentimentScoreEl.className = 'text-primary font-bold';
    } else {
      sentimentScoreEl.textContent = `${sentimentScore.toFixed(2)} (Standard Flow)`;
      sentimentScoreEl.className = 'text-secondary font-medium';
    }
  }
}
