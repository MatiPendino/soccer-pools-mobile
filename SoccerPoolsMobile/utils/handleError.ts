interface BackendError {
  error_type?: string;
  status_code?: number;
  errors?: Record<string, string | string[]>;
  details?: string;
  detail?: string;
};

export default function handleError(error: BackendError | string): string {
  // If it is already a string return as is
  if (typeof error === 'string') return error;

  // If it has a specific error_type or status_code handle those first
  if (error.details && typeof error.details === 'string') return error.details;
  if (error.detail && typeof error.detail === 'string') return error.detail;

  // Field errors under { errors: { field: msg | [msg] } }
  if (error.errors && typeof error.errors === 'object') {
    const lines: string[] = [];
    for (const [key, value] of Object.entries(error.errors)) {
      const msg = Array.isArray(value) ? (value[0] ?? '') : String(value ?? '');
      if (msg) lines.push(`${key.toUpperCase()}: ${msg}`);
    }
    if (lines.length) return lines.join('\n');
  }

  return 'An unexpected error occurred. Please try again later.';
}
