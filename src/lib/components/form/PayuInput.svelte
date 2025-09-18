<script lang="ts">
	// PayU card payment input component following BlikInput patterns

	// Props with proper typing (following BlikInput pattern)
	let {
		cardData = {
			cardNumber: '',
			expiryMonth: '',
			expiryYear: '',
			cvv: '',
			payuAgreement: false
		},
		cardErrors = {},
		onCardDataChange = () => {}
	}: {
		cardData: {
			cardNumber: string;
			expiryMonth: string;
			expiryYear: string;
			cvv: string;
			payuAgreement: boolean;
		};
		cardErrors: Record<string, string>;
		onCardDataChange: (data: {
			cardNumber: string;
			expiryMonth: string;
			expiryYear: string;
			cvv: string;
			payuAgreement: boolean;
		}) => void;
	} = $props();

	// Format card number with spaces (XXXX XXXX XXXX XXXX)
	const formatCardNumber = (value: string): string => {
		const digits = value.replace(/\D/g, '').substring(0, 16);
		return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
	};

	// Format expiry month (MM)
	const formatExpiryMonth = (value: string): string => {
		const digits = value.replace(/\D/g, '').substring(0, 2);
		// Pad single digit with leading zero
		if (digits.length === 1 && parseInt(digits) > 1) {
			return '0' + digits;
		}
		return digits;
	};

	// Format expiry year (YYYY)
	const formatExpiryYear = (value: string): string => {
		return value.replace(/\D/g, '').substring(0, 4);
	};

	// Handle card number input
	const handleCardNumberInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const formatted = formatCardNumber(target.value);
		target.value = formatted;

		onCardDataChange({
			...cardData,
			cardNumber: formatted.replace(/\s/g, '') // Store without spaces
		});
	};

	// Handle expiry month input
	const handleExpiryMonthInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const formatted = formatExpiryMonth(target.value);
		target.value = formatted;

		// Validate month (01-12)
		const monthNum = parseInt(formatted);
		if (formatted.length === 2 && (monthNum < 1 || monthNum > 12)) {
			target.value = '';
			return;
		}

		onCardDataChange({
			...cardData,
			expiryMonth: formatted
		});
	};

	// Handle expiry year input
	const handleExpiryYearInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const formatted = formatExpiryYear(target.value);
		target.value = formatted;

		// Validate year (current year or future)
		const currentYear = new Date().getFullYear();
		if (formatted.length === 4 && parseInt(formatted) < currentYear) {
			target.value = '';
			return;
		}

		onCardDataChange({
			...cardData,
			expiryYear: formatted
		});
	};

	// Handle CVV input
	const handleCvvInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const digits = target.value.replace(/\D/g, '').substring(0, 3);
		target.value = digits;

		onCardDataChange({
			...cardData,
			cvv: digits
		});
	};

	// Handle PayU agreement checkbox
	const handlePayuAgreementChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const isChecked = target.checked;

		onCardDataChange({
			...cardData,
			payuAgreement: isChecked
		});
	};

	// Format initial values for display
	const formatInitialCardNumber = (cardNumber: string) => {
		return formatCardNumber(cardNumber);
	};
</script>

<div class="flex flex-col items-center gap-y-4">
	<h4 class="font-paytone text-base leading-[16px] tracking-[0.5px] text-[#444444]">
		Wpisz dane karty MasterCard lub Visa
	</h4>

	<div class="w-full space-y-3 md:max-w-full">
		<!-- Card Number -->
		<div>
			<input
				type="text"
				value={formatInitialCardNumber(cardData.cardNumber)}
				placeholder="Numer karty"
				id="card-number"
				maxlength="19"
				name="card-number"
				autocomplete="cc-number"
				inputmode="numeric"
				class={`payu-card-number ${cardErrors.cardNumber ? 'border-red-500 bg-[#F5F5F5]' : ''} w-full rounded border border-[#CCCDCF] bg-white px-3 py-2 text-sm
					text-[#444444] placeholder:text-[#B2B2B2] focus:border-[#7FC241]
					focus:ring-0 focus:outline-none`}
				oninput={handleCardNumberInput}
			/>
			{#if cardErrors.cardNumber}
				<p class="mt-1 text-left text-xs text-red-600">{cardErrors.cardNumber}</p>
			{/if}
		</div>

		<!-- Expiry Month, Year and CVV Row -->
		<div class="flex gap-3 md:inline-flex">
			<!-- Expiry Month -->
			<div class="flex-1/4 md:flex-1/8">
				<input
					type="text"
					value={cardData.expiryMonth}
					placeholder="MM"
					maxlength="2"
					id="card-expm"
					name="card-expm"
					autocomplete="cc-exp-month"
					inputmode="numeric"
					class={`payu-card-expm ${cardErrors.expiryMonth ? 'border-red-500 bg-[#F5F5F5]' : ''} w-full rounded border border-[#CCCDCF] bg-white px-3 py-2 text-sm
						text-[#444444] placeholder:text-[#B2B2B2] focus:border-[#7FC241]
						focus:ring-0 focus:outline-none`}
					oninput={handleExpiryMonthInput}
				/>
				{#if cardErrors.expiryMonth}
					<p class="mt-1 text-left text-xs text-red-600">{cardErrors.expiryMonth}</p>
				{/if}
			</div>

			<!-- Expiry Year -->
			<div class="flex-1/2 md:flex-1/4">
				<input
					type="text"
					value={cardData.expiryYear}
					placeholder="RRRR"
					maxlength="4"
					id="card-expy"
					name="card-expy"
					autocomplete="cc-exp-year"
					inputmode="numeric"
					class={`payu-card-expy ${cardErrors.expiryYear ? 'border-red-500 bg-[#F5F5F5]' : ''} w-full rounded border border-[#CCCDCF] bg-white px-3 py-2 text-sm
						text-[#444444] placeholder:text-[#B2B2B2] focus:border-[#7FC241]
						focus:ring-0 focus:outline-none`}
					oninput={handleExpiryYearInput}
				/>
				{#if cardErrors.expiryYear}
					<p class="mt-1 text-left text-xs text-red-600">{cardErrors.expiryYear}</p>
				{/if}
			</div>
			<div class="max-md:hidden md:flex-1/4"></div>
			<!-- CVV -->
			<div class="flex-1/4 md:flex-1/8">
				<input
					type="text"
					value={cardData.cvv}
					placeholder="CVV"
					id="card-cvv"
					name="card-cvv"
					maxlength="3"
					autocomplete="cc-csc"
					inputmode="numeric"
					class={`payu-card-cvv ${cardErrors.cvv ? 'border-red-500 bg-[#F5F5F5]' : ''} w-full rounded border border-[#CCCDCF] bg-white px-3 py-2 text-sm
						text-[#444444] placeholder:text-[#B2B2B2] focus:border-[#7FC241]
						focus:ring-0 focus:outline-none`}
					oninput={handleCvvInput}
				/>
				{#if cardErrors.cvv}
					<p class="mt-1 text-left text-xs text-red-600">{cardErrors.cvv}</p>
				{/if}
			</div>
		</div>
		<div class="flex w-full flex-col gap-y-2">
			<div class="flex w-full items-start gap-x-3">
				<input
					type="checkbox"
					id="payu-agreement"
					name="payuAgreement"
					checked={cardData.payuAgreement}
					class="payu-agreement mt-1 h-4 w-4 rounded-xs border border-gray-300 checked:border-[#7FC241] checked:bg-[#7FC241] focus:ring-0 focus:outline-0"
					onchange={handlePayuAgreementChange}
				/>
				<label for="payu-agreement" class="text-start text-xs leading-[15px] text-[#2B2E31]">
					Zgadzam się na zapisanie danych transakcji do kolejnych darowizn na rzecz akcji Greenpeace
					"Dzika Mapa" oraz akceptuję <a
						href="https://poland.payu.com/wp-content/uploads/sites/14/2023/03/Regulamin-pojedynczej-transakcji-platniczej-PayU_LUTY2023.pdf"
						target="_blank"
						class="underline">regulamin PayU</a
					>.*
				</label>
			</div>
			{#if cardErrors.payuAgreement}
				<p class="pl-7 text-left text-xs text-red-600">{cardErrors.payuAgreement}</p>
			{/if}
		</div>
	</div>
</div>
