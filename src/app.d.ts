// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env: {
				PAYU_CLIENT_ID?: string;
				PAYU_CLIENT_SECRET?: string;
				PAYU_ENVIRONMENT?: string;
				[key: string]: string | undefined;
			};
		}
	}

	// PayU SDK global object declarations
	// Based on PayU EMEA SDK documentation: https://secure.payu.com/res/v2/openpayu-2.1.js
	interface PayUCardData {
		cardNumber: string;
		expiryMonth: string;
		expiryYear: string;
		cvv: string;
	}

	interface PayUTokenizeResponse {
		token: string;
		status: 'SUCCESS' | 'ERROR';
		error?: string;
	}

	interface PayUTokenizeCallback {
		(response: PayUTokenizeResponse): void;
	}

	interface PayUTokenCreateOptions {
		allows_charges: boolean;
		allows_payouts: boolean;
	}

	interface PayUTokenCreateCallback {
		(response: any): void;
	}

	interface PayUToken {
		create(options: PayUTokenCreateOptions, callback: PayUTokenCreateCallback): void;
	}

	interface OpenPayUInterface {
		merchantId: string;
		Token: PayUToken;
		tokenize(cardData: PayUCardData, callback: PayUTokenizeCallback): void;
		validate(requestType: string, version: string): any[];
		Builder?: any;
		Transport?: any;
	}

	// Global PayU SDK object
	declare const OpenPayU: OpenPayUInterface;
}

export {};
