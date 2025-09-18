<script lang="ts">
	// Component props
	let {
		value = $bindable(''),
		placeholder = '',
		type = 'text',
		error = '',
		required = false,
		oninput = undefined,
		id = '',
		className = ''
	}: {
		value: string;
		placeholder?: string;
		type?: string;
		error?: string;
		required?: boolean;
		oninput?: ((e: Event) => void) | undefined;
		id?: string;
		className?: string;
	} = $props();
</script>

<div>
	<input
		{type}
		bind:value
		{placeholder}
		{id}
		{required}
		{oninput}
		class="w-full rounded border border-[#CCCDCF] px-3 py-2 text-sm text-[#444444] placeholder:text-[#B2B2B2] focus:border-[#7FC241] focus:bg-white focus:outline-none {error
			? 'border-red-500 bg-[#F5F5F5]'
			: value.trim()
				? 'bg-white'
				: 'bg-[#F5F5F5]'} {className}"
	/>
	{#if error}
		<p class="mt-1 text-left text-xs text-red-600">{error}</p>
	{/if}
</div>
