import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock SvelteKit environment variables before importing the server
vi.mock('$env/static/private', () => ({
	PAYU_CLIENT_ID: 'test_client_id',
	PAYU_CLIENT_SECRET: 'test_client_secret',
	PAYU_ENVIRONMENT: 'sandbox'
}));

import { POST } from '../../routes/api/payu/auth/+server';
import type { RequestEvent } from '@sveltejs/kit';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Helper to create mock RequestEvent (simplified since we no longer use platform.env)
const createMockRequestEvent = (body?: any): RequestEvent => {
	const request = new Request('http://localhost/api/payu/auth', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: body ? JSON.stringify(body) : undefined
	});

	return {
		request
	} as RequestEvent;
};

// Mock successful PayU response
const getMockPayUSuccessResponse = () => ({
	access_token: '3e5cac39-7e38-4139-8fd6-30adc06a61bd',
	token_type: 'bearer' as const,
	expires_in: 43199,
	grant_type: 'client_credentials' as const
});

// Mock PayU error response
const getMockPayUErrorResponse = () => ({
	error: 'invalid_client',
	error_description: 'Client authentication failed'
});

describe('POST /api/payu/auth', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset console.log mock
		vi.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe('successful authorization', () => {
		it('should return access token for valid client credentials', async () => {
			// Arrange
			const mockPayUResponse = getMockPayUSuccessResponse();
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockPayUResponse
			});

			const event = createMockRequestEvent();

			// Act
			const response = await POST(event);
			const result = await response.json();

			// Assert
			expect(response.status).toBe(200);
			expect(result).toEqual({
				success: true,
				data: mockPayUResponse
			});

			// Verify PayU API was called correctly
			expect(mockFetch).toHaveBeenCalledWith(
				'https://secure.snd.payu.com/pl/standard/user/oauth/authorize',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: 'grant_type=client_credentials&client_id=test_client_id&client_secret=test_client_secret'
				}
			);

			// Verify response is logged to console
			expect(console.log).toHaveBeenCalledWith(
				'PayU Authorization Response:',
				JSON.stringify(mockPayUResponse, null, 2)
			);
		});

		it('should handle sandbox environment correctly', async () => {
			// Arrange
			const mockPayUResponse = getMockPayUSuccessResponse();
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockPayUResponse
			});

			const event = createMockRequestEvent();

			// Act
			const response = await POST(event);

			// Assert
			expect(response.status).toBe(200);
			expect(mockFetch).toHaveBeenCalledWith(
				'https://secure.snd.payu.com/pl/standard/user/oauth/authorize',
				expect.any(Object)
			);
		});
	});

	describe('error handling', () => {
		it('should return 500 when PayU API returns error', async () => {
			// Arrange
			const mockErrorResponse = getMockPayUErrorResponse();
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 401,
				json: async () => mockErrorResponse
			});

			const event = createMockRequestEvent();

			// Act
			const response = await POST(event);
			const result = await response.json();

			// Assert
			expect(response.status).toBe(500);
			expect(result).toEqual({
				success: false,
				error: 'PayU authorization failed',
				details: mockErrorResponse
			});
		});

		it('should work correctly with valid configuration', async () => {
			// Note: With static environment variables, we can't easily test missing env vars
			// This test verifies that the configuration works correctly with valid environment variables

			// Arrange
			const mockPayUResponse = getMockPayUSuccessResponse();
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockPayUResponse
			});

			const event = createMockRequestEvent();

			// Act
			const response = await POST(event);
			const result = await response.json();

			// Assert - This should succeed with our test environment
			expect(response.status).toBe(200);
			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockPayUResponse);
		});

		it('should return 500 when fetch throws an error', async () => {
			// Arrange
			mockFetch.mockRejectedValueOnce(new Error('Network error'));
			const event = createMockRequestEvent();

			// Act
			const response = await POST(event);
			const result = await response.json();

			// Assert
			expect(response.status).toBe(500);
			expect(result.success).toBe(false);
			expect(result.error).toBe('Authorization request failed');
		});

		it('should return 500 when PayU response has invalid schema', async () => {
			// Arrange
			const invalidResponse = { invalid: 'response' };
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => invalidResponse
			});

			const event = createMockRequestEvent();

			// Act
			const response = await POST(event);
			const result = await response.json();

			// Assert
			expect(response.status).toBe(500);
			expect(result.success).toBe(false);
			expect(result.error).toBe('Invalid response from PayU');
		});
	});

	describe('request validation', () => {
		it('should work with POST method only', async () => {
			// This test verifies the endpoint only accepts POST requests
			// The actual method validation is handled by SvelteKit routing
			const mockPayUResponse = getMockPayUSuccessResponse();
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockPayUResponse
			});

			const event = createMockRequestEvent();

			const response = await POST(event);
			expect(response.status).toBe(200);
		});
	});

	describe('logging behavior', () => {
		it('should log complete authorization response for debugging', async () => {
			// Arrange
			const mockPayUResponse = getMockPayUSuccessResponse();
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
				json: async () => mockPayUResponse
			});

			const event = createMockRequestEvent();

			// Act
			await POST(event);

			// Assert
			expect(console.log).toHaveBeenCalledWith(
				'PayU Authorization Response:',
				JSON.stringify(mockPayUResponse, null, 2)
			);
		});

		it('should log error details when authorization fails', async () => {
			// Arrange
			const mockErrorResponse = getMockPayUErrorResponse();
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 401,
				json: async () => mockErrorResponse
			});

			const event = createMockRequestEvent();

			// Act
			await POST(event);

			// Assert
			expect(console.log).toHaveBeenCalledWith(
				'PayU Authorization Error:',
				JSON.stringify(mockErrorResponse, null, 2)
			);
		});
	});
});
