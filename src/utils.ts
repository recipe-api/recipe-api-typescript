// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

export function header(text: string): void {
  console.log(
    `\n${colors.bright}${colors.cyan}=== ${text} ===${colors.reset}\n`
  );
}

export function subheader(text: string): void {
  console.log(`${colors.bright}${text}${colors.reset}`);
}

export function label(name: string, value: string | number): void {
  console.log(`  ${colors.dim}${name}:${colors.reset} ${value}`);
}

export function listItem(text: string, indent = 0): void {
  const spaces = '  '.repeat(indent);
  console.log(`${spaces}${colors.green}*${colors.reset} ${text}`);
}

export function divider(): void {
  console.log(`${colors.dim}${'─'.repeat(50)}${colors.reset}`);
}

export function highlight(text: string): string {
  return `${colors.yellow}${text}${colors.reset}`;
}

export function success(text: string): void {
  console.log(`${colors.green}${text}${colors.reset}`);
}

export function warning(text: string): void {
  console.log(`${colors.yellow}${text}${colors.reset}`);
}

/**
 * Parse ISO 8601 duration to human-readable format
 * e.g., "PT30M" -> "30 min", "PT1H30M" -> "1h 30m"
 */
export function formatDuration(isoDuration: string): string {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return isoDuration;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;

  if (hours === 0 && minutes === 0) return 'instant';
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

/**
 * Parse command line arguments in --key=value format
 */
export function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--')) {
      const [key, ...valueParts] = arg.slice(2).split('=');
      args[key] = valueParts.join('=') || 'true';
    }
  });
  return args;
}

/**
 * Truncate text to max length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
