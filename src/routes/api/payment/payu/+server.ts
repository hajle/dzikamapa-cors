import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const paymentData = await request.json();
		console.log('paymentData', paymentData);

		// Server-to-server request (no CORS restrictions)
		const response = await fetch('/api/payment/payu', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'Access-Control-Allow-Origin': '*'
			},
			body: JSON.stringify(paymentData)
		});

		const result = await response.json();

		return json(result, { status: response.status });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return json({ error: 'Payment processing failed' }, { status: 500 });
	}
};
export const prerender = false;
