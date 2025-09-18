<script lang="ts">
	// Props interface
	let {
		blikCode = '',
		blikCodeError = '',
		amount,
		onBlikCodeChange = () => {}
	}: {
		blikCode: string;
		blikCodeError: string;
		amount: number;
		onBlikCodeChange: (code: string) => void;
	} = $props();

	// Simple input handler based on working example
	const handleInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		let value = target.value.replace(/\D/g, ''); // Remove non-digits

		if (value.length > 6) {
			value = value.substring(0, 6);
		}

		if (value.length > 3) {
			value = value.substring(0, 3) + ' ' + value.substring(3);
		}

		target.value = value;

		// Emit clean digits to parent (no spaces)
		onBlikCodeChange(value.replace(/\s/g, ''));
	};

	// Format the initial value from props
	const formatInitialValue = (code: string): string => {
		const clean = code.replace(/\D/g, '').substring(0, 6);
		return clean.length > 3 ? clean.substring(0, 3) + ' ' + clean.substring(3) : clean;
	};
</script>

<div class="flex flex-col items-center gap-y-2.5">
	<h4 class="font-paytone text-base leading-[24px] tracking-[0.5px] text-[#444444]">
		Płatności powtarzalne BLIK
	</h4>
	<p class="text-xs leading-[15px] tracking-[0.5px] text-[#2B2E31]">
		Usługa dostępna w aplikacjach: PKO BP, Alior Bank, ING Bank Śląski, Bank Millennium, Santander
		Bank Polska, Grupy SGB i Nest Bank
	</p>
	<h4 class="font-paytone mt-3 text-base leading-[24px] tracking-[0.5px] text-[#444444]">
		Wpisz kod BLIK
	</h4>
	<p class="text-xs leading-[15px] tracking-[0.5px] text-[#2B2E31]">
		aby dokończyć adopcję i ustawić <span class="block font-bold"
			>comiesięczne wsparcie w kwocie: {amount} PLN</span
		>
	</p>
	<div>
		<input
			type="text"
			value={formatInitialValue(blikCode)}
			placeholder="___ ___"
			maxlength="7"
			autocomplete="off"
			inputmode="numeric"
			class="w-[200px] rounded border border-[#CCCDCF] bg-white px-3 py-2 text-center text-sm tracking-[2px] text-[#444444] placeholder:text-[#B2B2B2] focus:border-[#7FC241] focus:ring-0 focus:outline-none {blikCodeError
				? 'border-red-500 bg-[#F5F5F5]'
				: ''}"
			oninput={handleInput}
		/>
		{#if blikCodeError}
			<p class="mt-1 text-xs text-red-600">{blikCodeError}</p>
		{/if}
	</div>
</div>
