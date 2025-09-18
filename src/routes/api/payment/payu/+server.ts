import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const paymentData = await request.json();

		// Server-to-server request (no CORS restrictions)
		const response = await fetch(
			'https://wspieram.greenpeace.pl/api/payment/payu/payment/recurring',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json'
				},
				body: JSON.stringify(paymentData)
			}
		);

		const result = await response.json();
		console.log(`result payu: ${result}`);

		return json(result, { status: response.status });
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
	} catch (error) {
		console.log(`payu error: ${error}`);
		return json({ error: 'Payment processing failed' }, { status: 500 });
	}
};
export const prerender = false;
