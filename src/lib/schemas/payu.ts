import { z } from 'zod';

/**
 * PayU EMEA OAuth2 Authorization Schemas
 * Based on PayU EMEA API documentation: https://developers.payu.com/europe/docs/payment-flows/auth-and-order/
 */

// OAuth2 Grant Types supported by PayU EMEA
export const PayUGrantTypeSchema = z.enum(['client_credentials', 'trusted_merchant', 'partner']);

// OAuth2 Authorization Request Schema
export const PayUAuthRequestSchema = z.object({
	grant_type: PayUGrantTypeSchema,
	client_id: z.string().min(1, 'Client ID is required'),
	client_secret: z.string().min(1, 'Client secret is required'),
	// Optional parameters for trusted_merchant grant type
	email: z.string().email().optional(),
	extCustomerId: z.string().optional(),
	// Optional parameter for partner grant type
	firm_id: z.string().optional()
});

// OAuth2 Authorization Response Schema
export const PayUAuthResponseSchema = z.object({
	access_token: z.string().min(1, 'Access token is required'),
	token_type: z.literal('bearer'),
	expires_in: z.number().positive('Expires in must be positive'),
	grant_type: PayUGrantTypeSchema
});

// Error Response Schema
export const PayUErrorResponseSchema = z.object({
	error: z.string(),
	error_description: z.string().optional(),
	error_uri: z.string().url().optional()
});

// Environment Configuration Schema
export const PayUConfigSchema = z.object({
	clientId: z.string().min(1, 'PayU client ID is required'),
	clientSecret: z.string().min(1, 'PayU client secret is required'),
	environment: z.enum(['sandbox', 'production']).default('sandbox'),
	baseUrl: z.string().url().optional()
});

// Derived types from schemas
export type PayUGrantType = z.infer<typeof PayUGrantTypeSchema>;
export type PayUAuthRequest = z.infer<typeof PayUAuthRequestSchema>;
export type PayUAuthResponse = z.infer<typeof PayUAuthResponseSchema>;
export type PayUErrorResponse = z.infer<typeof PayUErrorResponseSchema>;
export type PayUConfig = z.infer<typeof PayUConfigSchema>;

// PayU EMEA API URLs
export const PAYU_URLS = {
	sandbox: {
		auth: 'https://secure.snd.payu.com/pl/standard/user/oauth/authorize',
		api: 'https://secure.snd.payu.com/api/v2_1'
	},
	production: {
		auth: 'https://secure.payu.com/pl/standard/user/oauth/authorize',
		api: 'https://secure.payu.com/api/v2_1'
	}
} as const;

// Helper function to get PayU URLs based on environment
export const getPayUUrls = (environment: 'sandbox' | 'production') => {
	return PAYU_URLS[environment];
};

// Validation helper for client credentials grant type
export const validateClientCredentialsRequest = (data: unknown) => {
	const baseSchema = PayUAuthRequestSchema.omit({ email: true, extCustomerId: true, firm_id: true });
	return baseSchema.parse(data);
};

// Validation helper for trusted merchant grant type
export const validateTrustedMerchantRequest = (data: unknown) => {
	const trustedMerchantSchema = PayUAuthRequestSchema.omit({ firm_id: true }).extend({
		email: z.string().email('Valid email is required for trusted_merchant grant'),
		extCustomerId: z.string().min(1, 'External customer ID is required for trusted_merchant grant')
	});
	return trustedMerchantSchema.parse(data);
};

// Validation helper for partner grant type
export const validatePartnerRequest = (data: unknown) => {
	const partnerSchema = PayUAuthRequestSchema.omit({ email: true, extCustomerId: true }).extend({
		firm_id: z.string().min(1, 'Firm ID is required for partner grant')
	});
	return partnerSchema.parse(data);
};
