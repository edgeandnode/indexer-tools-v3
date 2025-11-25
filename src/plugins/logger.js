const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  trace: 4,
};

const DEFAULT_LEVEL = (import.meta.env?.VITE_LOG_LEVEL || 'info').toLowerCase();

let currentLevel = resolveLevel(DEFAULT_LEVEL);

function resolveLevel(level) {
  if (!level) {
    return LEVELS.info;
  }
  const normalized = String(level).toLowerCase();
  return LEVELS[normalized] ?? LEVELS.info;
}

function safeContext(context) {
  if (context == null) {
    return undefined;
  }

  try {
    return JSON.parse(JSON.stringify(context));
  } catch (_err) {
    return '[unserializable context]';
  }
}

function consoleMethod(level) {
  if (level === 'trace' || level === 'debug') {
    return 'log';
  }
  return level in console ? level : 'log';
}

export function configureLogger(level) {
  currentLevel = resolveLevel(level);
}

export function getLogLevel() {
  return Object.keys(LEVELS).find((key) => LEVELS[key] === currentLevel) || 'info';
}

export function logJson(level, message, context = {}) {
  const normalized = String(level || 'info').toLowerCase();

  if ((LEVELS[normalized] ?? LEVELS.info) > currentLevel) {
    return;
  }

  const entry = {
    timestamp: new Date().toISOString(),
    level: normalized,
    message,
    ...context,
  };

  console[consoleMethod(normalized)](JSON.stringify(entry, (_key, value) => value ?? null));
}

export const logger = {
  error: (message, context) => logJson('error', message, safeContext(context)),
  warn: (message, context) => logJson('warn', message, safeContext(context)),
  info: (message, context) => logJson('info', message, safeContext(context)),
  debug: (message, context) => logJson('debug', message, safeContext(context)),
  trace: (message, context) => logJson('trace', message, safeContext(context)),
};
