<script lang="ts">
	import { browser } from '$app/environment';
	import { getContext, onMount } from 'svelte';
	import PersonalInfoSection from '$lib/components/form/PersonalInfoSection.svelte';
	import AgreementSection from '$lib/components/form/AgreementSection.svelte';
	import PaymentSection from '$lib/components/form/PaymentSection.svelte';
	import Fingerprint2 from '@fingerprintjs/fingerprintjs';

	// Svelte 5 runes: props with proper typing and defaults
	let {
		isOpen,
		pointId,
		animalSpeciesId,
		animalName,
		onClose = () => {}
	}: {
		isOpen: boolean;
		pointId: number | null;
		animalSpeciesId: number | null;
		animalName: string | null;
		onClose?: () => void;
	} = $props();

	// Modal state using Svelte 5 runes
	let modalElement = $state<HTMLDivElement | null>(null);
	let blikSectionElement = $state<HTMLDivElement | null>(null);
	let payuSectionElement = $state<HTMLDivElement | null>(null);
	let isVisible = $state(false);

	// PayU authorization state
	let payuState = $state({
		isLoading: false,
		error: null as string | null,
		success: false
	});

	// Individual form state variables (flattened for better reactivity)
	let selectedAmount = $state(50);
	let customAmount = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let phone = $state(''); // Raw phone number (digits only) for validation
	let phoneDisplay = $state(''); // Formatted phone number for display
	let dataAgreement = $state(false);
	let payuAgreement = $state(false);
	let emailAgreement = $state(false);
	let phoneAgreement = $state(false);
	let selectedPaymentMethod = $state('');
	let blikCode = $state('');
	let cardData = $state({
		cardNumber: '',
		expiryMonth: '',
		expiryYear: '',
		cvv: '',
		payuAgreement: false
	});

	// Simplified error state
	let errors = $state<Record<string, string>>({});

	// Bank validation state for BLIK payments
	let bankNotAllowed = $state(false);

	// Type for base payment data
	type BasePaymentData = {
		landingPage: string;
		amount: string | number;
		name: string;
		surname: string;
		email: string;
		phone: string;
		utmSource: string | null;
		utmMedium: string | null;
		utmCampaign: string | null;
		utmTerm: string | null;
		utmContent: string | null;
		fundraiser: string | null;
		tag: string | null;
		agreementData: boolean;
		agreementPayu: boolean;
		agreementEmail: boolean;
		agreementPhone: boolean;
	};

	// Extended type for PayU payment data with tokenization fields
	type PayUPaymentData = BasePaymentData & {
		'card-expy': string;
		'card-expm': string;
		mask?: string;
		token?: string;
		type?: string;
		fingerprint?: string;
	};

	// Extended type for BLIK payment data
	type BlikPaymentData = BasePaymentData & {
		blikCode: string;
	};

	// Function to get form data for payment processing
	const getDataForPayment = (): BasePaymentData => {
		return {
			landingPage: 'ap12', // Static landing page identifier for this component
			amount: customAmount || selectedAmount, // Use custom amount if provided, otherwise selected amount
			name: firstName,
			surname: lastName,
			email: email,
			phone: phone, // Raw phone number without formatting
			utmSource: new URLSearchParams(location.search).get('utm_source'),
			utmMedium: new URLSearchParams(location.search).get('utm_medium'),
			utmCampaign: new URLSearchParams(location.search).get('utm_campaign'),
			utmTerm: new URLSearchParams(location.search).get('utm_term'),
			utmContent: new URLSearchParams(location.search).get('utm_content'),
			fundraiser: new URLSearchParams(location.search).get('fundraiser'),
			tag: pointId ? `kafelek: ${pointId}, gatunek: ${animalSpeciesId}, imię: ${animalName}` : null, // Use animal ID as tag
			agreementData: dataAgreement,
			agreementPayu: true,
			agreementEmail: emailAgreement,
			agreementPhone: phoneAgreement
		};
	};

	// Handle escape key press
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape' && isOpen) {
			onClose();
		}
	};

	// Reset PayU state when modal closes
	const resetPayUState = () => {
		payuState.isLoading = false;
		payuState.error = null;
		payuState.success = false;
	};

	// Scroll to BLIK section when BLIK payment method is selected
	const scrollToBlikSection = () => {
		if (blikSectionElement) {
			blikSectionElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	};

	// Scroll to PayU section when PayU payment method is selected
	const scrollToPayuSection = () => {
		if (payuSectionElement) {
			payuSectionElement.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	};

	// Simplified reset function
	const resetFormState = () => {
		selectedAmount = 50;
		customAmount = '';
		firstName = '';
		lastName = '';
		email = '';
		phone = '';
		phoneDisplay = '';
		dataAgreement = false;
		payuAgreement = false;
		emailAgreement = false;
		phoneAgreement = false;
		selectedPaymentMethod = '';
		bankNotAllowed = false;
		blikCode = '';
		cardData = {
			cardNumber: '',
			expiryMonth: '',
			expiryYear: '',
			cvv: '',
			payuAgreement: false
		};
		errors = {};
	};

	// Amount selection data and handler
	const amountOptions = [30, 50, 100];
	const selectAmount = (amount: number) => {
		selectedAmount = amount;
		customAmount = '';
		errors = { ...errors };
		delete errors.customAmount;
	};

	// Payment method data and handler
	const paymentMethods = [
		{
			id: 'blik',
			icon: '/blik.svg',
			alt: 'BLIK',
			bgColor: 'bg-[#2B2E31]',
			borderColor: 'border-[#2B2E31]',
			action: () => setTimeout(() => scrollToBlikSection(), 100)
		},
		{
			id: 'payu',
			icon: '',
			alt: 'Karta',
			bgColor: 'bg-[#7FC241]',
			borderColor: 'border-[#7FC241]',
			action: () => setTimeout(() => scrollToPayuSection(), 100)
		},
		{
			id: 'paypal',
			icon: '/paypal.png',
			alt: 'PayPal',
			bgColor: 'bg-[#102F80]',
			borderColor: 'border-[#102F80]'
		}
	];

	const selectPaymentMethod = (methodId: string) => {
		selectedPaymentMethod = methodId;
		bankNotAllowed = false;
		blikCode = '';
		cardData = {
			cardNumber: '',
			expiryMonth: '',
			expiryYear: '',
			cvv: '',
			payuAgreement: false
		};
		errors = { ...errors };
		delete errors.blikCode;
		delete errors.cardNumber;
		delete errors.expiryMonth;
		delete errors.expiryYear;
		delete errors.payuAgreement;
		delete errors.cvv;

		// Execute method-specific action
		const method = paymentMethods.find((m) => m.id === methodId);
		if (method?.action) {
			method.action();
		}
	};

	// BLIK code change handler
	const handleBlikCodeChange = (code: string) => {
		blikCode = code;
		errors = { ...errors };
		delete errors.blikCode;
	};

	// Card data change handler
	const handleCardDataChange = (data: {
		cardNumber: string;
		expiryMonth: string;
		expiryYear: string;
		cvv: string;
		payuAgreement: boolean;
	}) => {
		cardData = data;
		// Clear card-related errors when user starts typing
		errors = { ...errors };
		delete errors.cardNumber;
		delete errors.expiryMonth;
		delete errors.expiryYear;
		delete errors.cvv;
		delete errors.payuAgreement;
	};

	// Format phone number with spaces (XXX XXX XXX)
	const formatPhoneNumber = (value: string): string => {
		const digits = value.replace(/\D/g, '').substring(0, 9);
		return digits.replace(/(\d{3})(?=\d)/g, '$1 ');
	};

	// Handle phone number input
	const handlePhoneInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const formatted = formatPhoneNumber(target.value);
		target.value = formatted;

		phoneDisplay = formatted; // Store formatted version for display
		phone = formatted.replace(/\s/g, ''); // Store without spaces for validation

		// Clear phone error when user starts typing
		errors = { ...errors };
		delete errors.phone;
	};

	// Custom amount input handler - handles real-time validation and preset clearing
	const handleCustomAmountInput = () => {
		const customAmountStr = String(customAmount || '').trim();

		// Clear preset selection when custom amount is entered
		if (customAmountStr) {
			selectedAmount = 0;

			// Clear error immediately if amount becomes valid while typing
			const customAmountNum = parseFloat(customAmountStr);
			if (!isNaN(customAmountNum) && customAmountNum >= 30 && errors.customAmount) {
				const newErrors = { ...errors };
				delete newErrors.customAmount;
				errors = newErrors;
			}
		}
	};

	// Custom amount blur handler - handles validation when user leaves the field
	const handleCustomAmountBlur = () => {
		const customAmountStr = String(customAmount || '').trim();

		if (customAmountStr) {
			const customAmountNum = parseFloat(customAmountStr);
			if (isNaN(customAmountNum) || customAmountNum < 30) {
				errors.customAmount = 'Minimalna kwota adopcji zwierzaka to 30 zł';
			} else {
				// Clear error for valid amount
				const newErrors = { ...errors };
				delete newErrors.customAmount;
				errors = newErrors;
			}
		} else {
			// Clear error when field is empty
			const newErrors = { ...errors };
			delete newErrors.customAmount;
			errors = newErrors;

			// Default to 50 if no preset amount is selected
			if (selectedAmount === 0) {
				selectedAmount = 50;
			}
		}
	};

	// Reactive status configuration
	let currentStatusConfig = $state<{
		bg: string;
		icon: string;
		title: string;
		text: string;
		titleText: string;
		message: string;
		iconType: string;
	} | null>(null);

	$effect(() => {
		if (payuState.isLoading) {
			currentStatusConfig = {
				bg: 'bg-yellow-50',
				icon: 'text-yellow-400',
				title: 'text-yellow-800',
				text: 'text-yellow-700',
				titleText: 'Przetwarzanie...',
				message: 'Autoryzujemy płatność...',
				iconType: 'loading'
			};
		} else if (payuState.success) {
			currentStatusConfig = {
				bg: 'bg-green-50',
				icon: 'text-green-400',
				title: 'text-green-800',
				text: 'text-green-700',
				titleText: 'Autoryzacja udana!',
				message: 'Czekamy na potwierdzenie płatności...',
				iconType: 'success'
			};
		} else if (payuState.error) {
			currentStatusConfig = {
				bg: 'bg-red-50',
				icon: 'text-red-400',
				title: 'text-red-800',
				text: 'text-red-700',
				titleText: 'Nieprawidłowe dane karty',
				message: payuState.error,
				iconType: 'error'
			};
		} else {
			currentStatusConfig = null;
		}
	});

	// Validation schema - centralized validation rules
	const validationSchema = {
		firstName: {
			required: true,
			message: 'Imię jest wymagane'
		},
		lastName: {
			required: true,
			message: 'Nazwisko jest wymagane'
		},
		email: {
			required: true,
			pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			messages: {
				required: 'Email jest wymagany',
				pattern: 'Nieprawidłowy email'
			}
		},
		phone: {
			required: true,
			pattern: /^[+]?[\d\s\-()]{9,}$/,
			messages: {
				required: 'Telefon jest wymagany',
				pattern: 'Nieprawidłowy numer telefonu'
			}
		},
		dataAgreement: {
			required: true,
			message: 'Zgoda na przetwarzanie danych jest wymagana'
		},
		cardNumber: {
			required: true,
			pattern: /^\d{16}$/,
			messages: {
				required: 'Numer karty jest wymagany',
				pattern: 'Numer karty musi składać się z 16 cyfr'
			}
		},
		expiryMonth: {
			required: true,
			pattern: /^(0[1-9]|1[0-2])$/,
			messages: {
				required: 'Miesiąc ważności jest wymagany',
				pattern: 'Miesiąc musi być w formacie MM (01-12)'
			}
		},
		expiryYear: {
			required: true,
			pattern: /^\d{4}$/,
			messages: {
				required: 'Rok ważności jest wymagany',
				pattern: 'Rok musi być w formacie YYYY'
			}
		},
		cvv: {
			required: true,
			pattern: /^\d{3}$/,
			messages: {
				required: 'CVV jest wymagany',
				pattern: 'CVV musi składać się z 3 cyfr'
			}
		},
		payuAgreement: {
			required: true,
			message: 'Zgoda na regulamin PayU jest wymagana'
		}
	};

	// Generic validation function
	const validateField = (value: any, fieldName: string, schema: any): string | null => {
		const rule = schema[fieldName];
		if (!rule) return null;

		// Required validation
		if (rule.required) {
			if (typeof value === 'boolean' && !value) {
				return rule.message || rule.messages?.required || `${fieldName} jest wymagane`;
			}
			if (typeof value === 'string' && !value.trim()) {
				return rule.message || rule.messages?.required || `${fieldName} jest wymagane`;
			}
		}

		// Pattern validation (only for non-empty strings)
		if (rule.pattern && typeof value === 'string' && value.trim()) {
			if (!rule.pattern.test(value.trim())) {
				return rule.messages?.pattern || rule.message || `Nieprawidłowy format ${fieldName}`;
			}
		}

		return null;
	};

	const validateForm = (): boolean => {
		let isValid = true;
		const newErrors: Record<string, string> = {};

		// Schema-based validation for standard fields
		const formData = { firstName, lastName, email, phone, dataAgreement };

		for (const [fieldName, value] of Object.entries(formData)) {
			const error = validateField(value, fieldName, validationSchema);
			if (error) {
				newErrors[fieldName] = error;
				isValid = false;
			}
		}

		// Custom amount validation
		const customAmountStr = String(customAmount || '').trim();
		if (customAmountStr) {
			const customAmountNum = parseFloat(customAmountStr);
			if (isNaN(customAmountNum) || customAmountNum < 30) {
				newErrors.customAmount = 'Minimalna kwota adopcji to 30 zł';
				isValid = false;
			}
		} else if (selectedAmount === 0) {
			newErrors.customAmount = 'Minimalna kwota adopcji to 30 zł';
			isValid = false;
		}

		// BLIK code validation
		if (selectedPaymentMethod === 'blik') {
			if (!blikCode.trim()) {
				newErrors.blikCode = 'Kod BLIK jest wymagany';
				isValid = false;
			} else if (!/^\d{6}$/.test(blikCode.trim())) {
				newErrors.blikCode = 'Kod BLIK musi składać się z 6 cyfr';
				isValid = false;
			}
		}

		// Card validation for PayU
		if (selectedPaymentMethod === 'payu') {
			const cardFields = {
				cardNumber: cardData.cardNumber,
				expiryMonth: cardData.expiryMonth,
				expiryYear: cardData.expiryYear,
				cvv: cardData.cvv,
				payuAgreement: cardData.payuAgreement
			};

			for (const [fieldName, value] of Object.entries(cardFields)) {
				const error = validateField(value, fieldName, validationSchema);
				if (error) {
					newErrors[fieldName] = error;
					isValid = false;
				}
			}

			// Additional expiry date validation (check if date is not in the past)
			if (
				cardData.expiryMonth &&
				cardData.expiryYear &&
				/^(0[1-9]|1[0-2])$/.test(cardData.expiryMonth) &&
				/^\d{4}$/.test(cardData.expiryYear)
			) {
				const month = parseInt(cardData.expiryMonth);
				const year = parseInt(cardData.expiryYear);
				const expiryDate = new Date(year, month - 1);
				const currentDate = new Date();
				currentDate.setDate(1); // Set to first day of current month for comparison

				if (expiryDate < currentDate) {
					newErrors.expiryMonth = 'Karta jest przeterminowana';
					newErrors.expiryYear = 'Karta jest przeterminowana';
					isValid = false;
				}
			}
		}

		// Update errors state
		errors = newErrors;
		return isValid;
	};

	// Handle modal open/close with animation
	$effect(() => {
		if (browser) {
			if (isOpen) {
				// Prevent body scroll when modal is open
				document.body.style.overflow = 'hidden';
				// Add slight delay for animation
				setTimeout(() => {
					isVisible = true;
				}, 10);
				// Add event listeners
				document.addEventListener('keydown', handleKeydown);
			} else {
				// Restore body scroll
				document.body.style.overflow = '';
				isVisible = false;
				// Reset PayU state when modal closes
				resetPayUState();
				// Reset form state when modal closes
				resetFormState();
				// Remove event listeners
				document.removeEventListener('keydown', handleKeydown);
			}
		}

		// Cleanup function
		return () => {
			if (browser) {
				document.body.style.overflow = '';
				document.removeEventListener('keydown', handleKeydown);
			}
		};
	});

	// Focus management for accessibility
	onMount(() => {
		if (isOpen && modalElement) {
			const focusableElements = modalElement.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			const firstElement = focusableElements[0] as HTMLElement;
			if (firstElement) {
				firstElement.focus();
			}
		}
	});

	// Handle adoption action with PayU authorization
	const handleAdopt = async () => {
		if (!pointId) return;

		// Validate form first
		if (!validateForm()) {
			return;
		}

		// Reset state
		payuState.isLoading = true;
		payuState.error = null;
		payuState.success = false;

		// Tokenize card data if PayU is selected
		if (selectedPaymentMethod === 'payu') {
			try {
				const baseData = getDataForPayment();
				const dataForPayment: PayUPaymentData = {
					...baseData,
					'card-expy': cardData.expiryYear,
					'card-expm': cardData.expiryMonth
				};

				console.log('dataForPayment', dataForPayment);

				OpenPayU.merchantId = '191309';
				OpenPayU.Token.create(
					{
						allows_charges: true,
						allows_payouts: true
					},
					function (payuResponse: any) {
						Fingerprint2.get({}, function (components) {
							var values = components.map(function (component) {
								return component.value;
							});
							var murmur = Fingerprint2.x64hash128(values.join(''), 31);

							console.log('Finerprint ' + murmur);
							console.log('payu response', payuResponse);

							dataForPayment['mask'] = payuResponse.data.mask;
							dataForPayment['token'] = payuResponse.data.token;
							dataForPayment['type'] = payuResponse.data.type;
							dataForPayment['fingerprint'] = murmur;

							console.log(dataForPayment);

							// payuState.success = true;
							// payuState.isLoading = false;

							// redirect with success
							// setTimeout(() => {
							// 	if (browser) {
							// 		window.location.href = '/dziekujemy';
							// 	}
							// }, 5000);

							// Send payment data to API using SvelteKit fetch
							// fetch('https://wspieram.greenpeace.pl/api/payment/payu/payment/recurring', {
							// 	method: 'POST',
							// 	headers: {
							// 		'Content-Type': 'application/json',
							// 		Accept: 'application/json',
							// 		'Access-Control-Allow-Origin': '*'
							// 	},
							// 	body: JSON.stringify(dataForPayment)
							// })
							// 	.then(async (response) => {
							// 		console.log('get card api response');
							// 		console.log(`card response: ${response}`);

							// 		// Handle successful payment response here
							// 		// You might want to update payuState or redirect user
							// 	})
							// 	.catch((error) => {
							// 		console.error('Payment API error:', error);
							// 		// Handle error - update payuState.error or show user feedback
							// 	});
							fetch('/api/payment/payu', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json'
								},
								body: JSON.stringify(dataForPayment)
							});
						});
					}
				);
			} catch (error) {
				console.error('Payment error:', error);
				payuState.error = 'Błąd płatności, spróbuj ponownie.';
				payuState.isLoading = false;
			}
		} else if (selectedPaymentMethod === 'blik') {
			// proceedWithAuthorization();
			try {
				const baseData = getDataForPayment();
				const dataForPayment: BlikPaymentData = {
					...baseData,
					blikCode: blikCode
				};
				console.log('dataForPaymentBlik', dataForPayment);
				// bankNotAllowed = true;
				// payuState.isLoading = false;
				// selectedPaymentMethod = '';

				fetch('/api/payment/blik', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(dataForPayment)
				});

				// fetch('https://wspieram.greenpeace.pl/api/payment/payu/payment/blik', {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/json',
				// 		Accept: 'application/json',
				// 		'Access-Control-Allow-Origin': '*'
				// 	},
				// 	body: JSON.stringify(dataForPayment)
				// }).then(async (response) => {
				// 	console.log('get blik api response');
				// 	console.log(`blik response: ${response}`);

				// 	// Check for bank not allowed error
				// 	// if (response.errorCode === 'bankNotAllowed' || response.error === 'bankNotAllowed') {
				// 	// 	bankNotAllowed = true;
				// 	// 	payuState.error =
				// 	// 		'Twój bank nie obsługuje płatności BLIK w Polsce. Wybierz inną metodę płatności.';
				// 	// } else if (!response.ok) {
				// 	// 	payuState.error = 'Błąd płatności BLIK, spróbuj ponownie.';
				// 	// } else {
				// 	// 	// Handle successful payment response
				// 	// 	payuState.success = true;
				// 	// }
				// });
			} catch (error) {
				console.error('Błąd płatności BLIK:', error);
			}
		}

		// Helper function to handle PayU authorization
		async function proceedWithAuthorization() {
			try {
				console.log(`Starting PayU authorization for animal ID: ${pointId}`);

				// Call PayU authorization endpoint
				const response = await fetch('/api/payu/auth', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					}
				});

				const result = await response.json();

				if (result.success) {
					console.log('PayU authorization successful:', result.data);
					payuState.success = true;

					// TODO: Proceed with payment creation using the access token
					// Redirect to thank you page after showing success message
					setTimeout(() => {
						if (browser) {
							window.location.href = '/dziekujemy';
						}
					}, 2000);
				} else {
					console.error('PayU authorization failed:', result);
					payuState.error = result.error || 'Authorization failed';
				}
			} catch (error) {
				console.error('PayU authorization request failed:', error);
				payuState.error = 'Network error occurred';
			} finally {
				payuState.isLoading = false;
			}
		}
	};
</script>

<!-- Modal backdrop and container -->
{#if isOpen}
	<div
		bind:this={modalElement}
		class="modal-backdrop fixed inset-0 z-[99999] items-center justify-center overflow-auto bg-white/95 px-3 pt-12 pb-8 transition-opacity duration-300"
		class:opacity-0={!isVisible}
		class:opacity-100={isVisible}
		onkeydown={(e) => e.key === 'Escape' && onClose()}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<button
			aria-label="zamknij"
			onclick={onClose}
			class="absolute top-2 right-2 flex h-[38px] w-[38px] items-center justify-center rounded-full bg-black md:top-4 md:right-4"
			type="button"
			><svg
				xmlns="http://www.w3.org/2000/svg"
				width="18"
				height="18"
				viewBox="0 0 18 18"
				fill="none"
			>
				<path
					d="M2.99854 17.3338L0.666504 15.0018L6.66317 9.00514L0.666504 3.05012L2.99854 0.718079L8.99521 6.71475L14.9502 0.718079L17.2823 3.05012L11.2856 9.00514L17.2823 15.0018L14.9502 17.3338L8.99521 11.3372L2.99854 17.3338Z"
					fill="#F7F4FF"
				/>
			</svg></button
		>
		<!-- Modal content -->
		<div
			class="relative mx-auto flex w-full max-w-md flex-col gap-y-2.5 rounded-lg bg-[#ffffff] pb-5 text-center md:max-w-[496px]"
			role="document"
			style="box-shadow: 0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px 0 rgba(0, 0, 0, 0.30);"
		>
			<div class="rounded-tl-lg rounded-tr-lg bg-[#7FC241]">
				<h4
					class="py-2.5 text-[20px] leading-[28px] font-black tracking-[1px] text-white md:px-5 md:py-5 md:text-[24px]"
				>
					{#if !bankNotAllowed}
						Hurra, już prawie gotowe!
					{:else}
						Ups...{/if}
				</h4>
			</div>

			<!-- Modal body -->
			{#if pointId !== null}
				{#if !bankNotAllowed}
					<p class="px-5 text-sm text-[#2B2E31]">
						Dokończ adopcję i wspieraj ochronę dzikiej przyrody <span class="font-bold"
							>niewielką, comiesięczną darowizną</span
						>. W podziękowaniu <span class="font-bold">otrzymasz certyfikat, audiobooka</span>
						<span class="italic">Serce i Pazur</span> i <span class="font-bold">kalendarz</span> przyrodniczy
						Greenpeace.
					</p>
				{/if}
				<div class="px-3 pb-5">
					{#if !bankNotAllowed}
						<div class="flex flex-col gap-y-2.5 py-2.5">
							<h3
								class="font-paytone text-[22px] leading-[24px] tracking-[0.5px] text-[#444444] md:mx-auto md:max-w-[394px] md:text-[24px]"
							>
								Jaką kwotą chcesz wspierać ochronę polskiej przyrody?
							</h3>
							<p class="px-5 text-xs leading-[16px] text-[#2B2E31] md:mx-auto md:max-w-[344px]">
								Twoje zwierzątko będzie widoczne na mapie przez cały okres trwania wsparcia.
							</p>
						</div>
					{/if}
					<!-- Amount Selection -->
					{#if !bankNotAllowed}
						<div class="px-5">
							<div class="grid grid-cols-2 gap-2 md:grid-cols-4">
								{#each amountOptions as amount}
									<button
										type="button"
										class="font-paytone rounded border px-4 py-2 text-[24px] leading-[24px] tracking-[0.5px] transition-colors {selectedAmount ===
											amount && !String(customAmount || '').trim()
											? 'border-[#7FC241] bg-[#7FC241] text-white'
											: 'border-[#CCCDCF] bg-white text-[#444444]'}"
										onclick={() => selectAmount(amount)}
									>
										{amount}
									</button>
								{/each}
								<input
									type="number"
									bind:value={customAmount}
									placeholder="Inna"
									class="font-paytone rounded border px-3 py-0 text-center text-[24px] leading-[24px] tracking-[0.5px] transition-colors focus:ring-0 focus:outline-none {errors.customAmount
										? 'border-red-500 bg-white text-gray-700'
										: String(customAmount || '').trim()
											? 'border-[#7FC241] bg-[#7FC241] text-white placeholder:text-white/70'
											: 'border-[#CCCDCF] bg-white text-gray-700 focus:border-[#7FC241]'}"
									min="30"
									oninput={handleCustomAmountInput}
									onblur={handleCustomAmountBlur}
								/>
							</div>
							<p class={`mt-1 text-xs ${errors.customAmount ? 'text-red-600' : ''}`}>
								Minimalna kwota wsparcia: 30 pln miesięczne
							</p>
						</div>
					{/if}

					<!-- Personal Data Form -->
					{#if !bankNotAllowed}
						<PersonalInfoSection
							bind:firstName
							bind:lastName
							bind:email
							bind:phone={phoneDisplay}
							{errors}
							onPhoneInput={handlePhoneInput}
						/>

						<!-- Agreement Checkboxes -->
						<AgreementSection bind:dataAgreement bind:emailAgreement bind:phoneAgreement {errors} />
					{:else}
						<div class="my-8 flex flex-col gap-y-6 text-center">
							<h3 class="text-[20px] leading-[24px] font-black tracking-[0.5px] text-[#444444]">
								Twój bank nie obsługuje Płatności powtarzalnych BLIK.
							</h3>
							<p class="text-sm leading-[16px] font-bold text-[#444444]">
								Wybierz inną metodę płatności lub skorzystaj z aplikacji odpowiedniego banku.
							</p>
							<p class="text-sm leading-[16px] text-[#444444]">
								Banki, w których dostępne są Płatności powtarzalne BLIK: PKO BP, Alior Bank, ING
								Bank Śląski, Bank Millennium, Santander Bank Polska, banki Grupy SGB, Nest Bank.
							</p>
						</div>
					{/if}
				</div>
				<div class="mb-2.5">
					<h4 class="font-paytone text-[22px] leading-[24px] tracking-[0.5px] text-[#444444]">
						Wybierz metodę płatności:
					</h4>
				</div>
				<!-- Payment Section -->
				<PaymentSection
					bind:selectedPaymentMethod
					bind:blikCode
					bind:cardData
					{paymentMethods}
					{errors}
					amount={Number(customAmount) || selectedAmount}
					onPaymentMethodSelect={selectPaymentMethod}
					onBlikCodeChange={handleBlikCodeChange}
					onCardDataChange={handleCardDataChange}
					bind:blikSectionElement
					bind:payuSectionElement
				/>

				<!-- Status Messages -->
				{#if currentStatusConfig}
					<div class="mt-4 rounded-lg {currentStatusConfig.bg} p-4">
						<div class="flex items-center justify-center">
							<div class="flex-shrink-0">
								{#if currentStatusConfig.iconType === 'loading'}
									<svg
										class="h-5 w-5 animate-spin {currentStatusConfig.icon}"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											class="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											class="opacity-75"
											fill="currentColor"
											d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								{:else if currentStatusConfig.iconType === 'success'}
									<svg
										class="h-5 w-5 {currentStatusConfig.icon}"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
											clip-rule="evenodd"
										/>
									</svg>
								{:else if currentStatusConfig.iconType === 'error'}
									<svg
										class="h-5 w-5 {currentStatusConfig.icon}"
										fill="currentColor"
										viewBox="0 0 20 20"
									>
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clip-rule="evenodd"
										/>
									</svg>
								{/if}
							</div>
							<div class="ml-3">
								<h4 class="text-sm font-medium {currentStatusConfig.title}">
									{currentStatusConfig.titleText}
								</h4>
								<p class="text-sm {currentStatusConfig.text}">{currentStatusConfig.message}</p>
							</div>
						</div>
					</div>
				{/if}
			{:else}
				<div class="text-center text-gray-500">
					<p>Nie wybrano zwierzęcia do adopcji.</p>
				</div>
			{/if}

			<!-- Modal footer -->
			<div class="px-8">
				{#if pointId !== null && selectedPaymentMethod}
					<button
						type="button"
						class={`font-paytone {payuState.isLoading || payuState.success ? 'cursor-not-allowed bg-gray-400' : ''} mx-auto mt-2 flex w-[200px] items-center justify-center rounded-md border border-transparent bg-[#7FC241] px-4 py-[9px] text-base leading-[20px] tracking-[1px]
						text-white
							uppercase shadow-sm focus:ring-2 focus:ring-green-500
							focus:ring-offset-2 focus:outline-none`}
						onclick={handleAdopt}
						disabled={payuState.isLoading || payuState.success}
					>
						{#if payuState.isLoading}
							<div class="flex items-center justify-center">
								<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Autoryzacja...
							</div>
						{:else if payuState.success}
							<div class="flex items-center justify-center">
								<svg class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
										clip-rule="evenodd"
									/>
								</svg>
								Gotowe!
							</div>
						{:else}
							Adoptuję
						{/if}
					</button>
				{/if}
			</div>
		</div>
		{#if !bankNotAllowed}
			<p
				class="mx-auto mt-4 max-w-[350px] text-center text-[10px] leading-[14px] text-[#2B2E31] md:leading-4"
			>
				Administratorem Twoich danych jest Fundacja Greenpeace Polska. Prosimy o zapoznanie się z
				<a
					href="https://www.greenpeace.org/poland/prywatnosc/"
					target="_blank"
					class="font-bold text-[#3579F6]">pełną klauzulą informacyjną</a
				> wyjaśniającą, jak przetwarzamy Twoje dane osobowe.
			</p>
		{/if}
	</div>
{/if}

<style>
	/* Ensure modal has the highest z-index to appear above Leaflet map */
	/* Leaflet typically uses z-index values up to 1000, so we use 99999 to be safe */
	.modal-backdrop {
		z-index: 99999 !important;
		position: fixed !important;
	}
</style>
