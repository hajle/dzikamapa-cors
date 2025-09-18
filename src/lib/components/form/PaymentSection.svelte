<script lang="ts">
	import BlikInput from './BlikInput.svelte';
	import PayuInput from './PayuInput.svelte';

	// Props with proper typing
	let {
		selectedPaymentMethod = $bindable(''),
		blikCode = $bindable(''),
		cardData = $bindable({
			cardNumber: '',
			expiryMonth: '',
			expiryYear: '',
			cvv: '',
			payuAgreement: false
		}),
		paymentMethods = [],
		errors = {},
		amount = $bindable(0),
		onPaymentMethodSelect = () => {},
		onBlikCodeChange = () => {},
		onCardDataChange = () => {},
		blikSectionElement = $bindable(null),
		payuSectionElement = $bindable(null)
	}: {
		selectedPaymentMethod: string;
		blikCode: string;
		cardData: {
			cardNumber: string;
			expiryMonth: string;
			expiryYear: string;
			cvv: string;
			payuAgreement: boolean;
		};
		paymentMethods: Array<{
			id: string;
			icon: string;
			alt: string;
			bgColor: string;
			borderColor: string;
			action?: () => void;
		}>;
		errors: Record<string, string>;
		amount: number;
		onPaymentMethodSelect: (methodId: string) => void;
		onBlikCodeChange: (code: string) => void;
		onCardDataChange: (data: {
			cardNumber: string;
			expiryMonth: string;
			expiryYear: string;
			cvv: string;
			payuAgreement: boolean;
		}) => void;
		blikSectionElement: HTMLDivElement | null;
		payuSectionElement: HTMLDivElement | null;
	} = $props();

	// Extract card-specific errors for PayuInput
	const getCardErrors = () => {
		return {
			cardNumber: errors.cardNumber || '',
			expiryMonth: errors.expiryMonth || '',
			expiryYear: errors.expiryYear || '',
			cvv: errors.cvv || '',
			payuAgreement: errors.payuAgreement || ''
		};
	};
</script>

<div>
	<!-- Payment Method Selection -->
	<div class="px-8">
		<div class="flex justify-between gap-x-2">
			{#each paymentMethods as method}
				<div class="flex w-full flex-col">
					<button
						type="button"
						class={`flex h-10 w-full items-center justify-center rounded-md ${method.borderColor} ${method.bgColor} transition-colors ${
							selectedPaymentMethod && selectedPaymentMethod !== method.id
								? '${method.bgColor} opacity-50'
								: ''
						}`}
						style="box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.30), 0 2px 6px 2px rgba(0, 0, 0, 0.15);"
						onclick={() => onPaymentMethodSelect(method.id)}
					>
						<span class="hidden">{method.alt}</span>
						{#if method.icon === ''}
							<span class="text-[17px] font-bold text-white">Karta</span>
						{:else}
							<img src={method.icon} alt={method.alt} />
						{/if}
					</button>
					{#if method.id === 'blik'}
						<p
							class={`mx-auto mt-1 max-w-[75px] text-center text-[10px] leading-[11px] font-bold ${
								selectedPaymentMethod && selectedPaymentMethod !== method.id
									? '${method.bgColor} opacity-50'
									: ''
							}`}
						>
							Płatności powtarzalne
						</p>
					{:else if method.id === 'payu'}
						<img
							src="/visa-mastercard.png"
							alt="Visa Mastercard"
							width="75"
							height="31"
							class={`mx-auto ${
								selectedPaymentMethod && selectedPaymentMethod !== method.id
									? '${method.bgColor} opacity-50'
									: ''
							}`}
						/>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<!-- BLIK Input Field (conditional) -->
	{#if selectedPaymentMethod === 'blik'}
		<div bind:this={blikSectionElement} class="mt-5 px-8">
			<BlikInput {blikCode} blikCodeError={errors.blikCode} {onBlikCodeChange} {amount} />
		</div>
	{/if}

	<!-- PayU Card Input Field (conditional) -->
	{#if selectedPaymentMethod === 'payu'}
		<div bind:this={payuSectionElement} class="mt-5 px-8">
			<PayuInput {cardData} cardErrors={getCardErrors()} {onCardDataChange} />
		</div>
	{/if}
</div>
