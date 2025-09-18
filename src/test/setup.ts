import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock SvelteKit environment modules
vi.mock('$app/environment', () => ({
	browser: true,
	dev: true,
	building: false,
	version: '1.0.0'
}));

// Mock SvelteKit stores
vi.mock('$app/stores', () => ({
	page: {
		subscribe: vi.fn()
	}
}));

// Mock fetch globally if not already mocked
if (!(globalThis as any).fetch) {
	(globalThis as any).fetch = vi.fn();
}
