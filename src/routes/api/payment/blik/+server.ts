import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const paymentData = await request.json();

		const response = await fetch('https://wspieram.greenpeace.pl/api/payment/payu/payment/blik', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(paymentData)
		});

		const result = await response.json();

		return json(result, { status: response.status });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		return json({ error: 'BLIK payment processing failed' }, { status: 500 });
	}
};
export const prerender = false;
