// Abstract data layer switch: mock mode (default) or real mode (Django backend).
// Switch via NEXT_PUBLIC_DATA_MODE env var.
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
export const DATA_MODE = process.env.NEXT_PUBLIC_DATA_MODE || 'mock';
