<script lang="ts">
	// Props with proper typing
	let {
		dataAgreement = $bindable(false),
		emailAgreement = $bindable(false),
		phoneAgreement = $bindable(false),

		errors = {}
	}: {
		dataAgreement: boolean;
		emailAgreement: boolean;
		phoneAgreement: boolean;
		errors: Record<string, string>;
	} = $props();
</script>

<!-- Agreement Checkboxes -->
<div class="mt-6 px-5">
	<!-- Data Processing Agreement -->
	<div class="flex w-full items-start gap-x-3">
		<input
			type="checkbox"
			id="dataAgreement"
			name="agreementData"
			bind:checked={dataAgreement}
			class="mt-1 h-4 w-4 rounded-xs border border-gray-300 checked:border-[#7FC241] checked:bg-[#7FC241] focus:ring-0 focus:outline-0"
		/>
		<label for="dataAgreement" class="text-start text-xs leading-[15px] font-bold text-[#2B2E31]">
			Wyrażam zgodę na przetwarzanie przez Greenpeace Polska moich danych na potrzeby płatności i
			prowadzonej kampanii*
		</label>
	</div>
	{#if errors.dataAgreement}
		<p class="mt-1 pl-7 text-left text-xs text-red-600">{errors.dataAgreement}</p>
	{/if}

	<!-- Contact Agreement -->
	<div class="mt-4">
		<p class="mb-3 text-start text-xs text-[#2B2E31]">
			Wyrażam zgodę na kontakt ze strony Greenpeace Polska w sprawie moich płatności i kampanii:
		</p>
		<div class="flex flex-col gap-y-2 md:flex-row md:items-center md:gap-x-8">
			<div class="flex items-center gap-x-3">
				<input
					type="checkbox"
					id="emailAgreement"
					name="emailAgreement"
					bind:checked={emailAgreement}
					class="h-4 w-4 rounded-xs border border-gray-300 checked:border-[#7FC241] checked:bg-[#7FC241] focus:ring-0 focus:outline-0"
				/>
				<label for="emailAgreement" class="text-xs font-bold text-[#2B2E31]">mailowo</label>
			</div>
			<div class="flex items-center gap-x-3">
				<input
					type="checkbox"
					id="phoneAgreement"
					bind:checked={phoneAgreement}
					class="h-4 w-4 rounded-xs border border-gray-300 checked:border-[#7FC241] checked:bg-[#7FC241] focus:ring-0 focus:outline-0"
				/>
				<label for="phoneAgreement" class="text-xs font-bold text-[#2B2E31]"
					>telefonicznie (to miłe telefony)</label
				>
			</div>
		</div>
	</div>
</div>
