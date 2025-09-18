<!--
	PopupContainer - Reusable popup container component
	Extracted from MapContainer for shared popup structure and styling
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import PopupCloseButton from './PopupCloseButton.svelte';

	// Props with proper typing and defaults
	let {
		visible = false,
		zIndex = 99999,
		close,
		closeMobile,
		onClose,
		children
	}: {
		visible?: boolean;
		zIndex?: number;
		close: boolean;
		closeMobile: boolean;
		onClose?: () => void;
		children: Snippet;
	} = $props();
</script>

{#if visible}
	<!-- Popup container with responsive positioning -->
	<div
		role="dialog"
		aria-modal="true"
		class="fixed inset-0 overflow-auto bg-white/90 px-3 pt-4 pb-8 min-sm:pt-12 {!close
			? 'md:top-[146px] md:right-0 md:bottom-auto md:left-auto md:bg-transparent md:px-[34px] md:pt-0'
			: ''}"
		style="z-index: {zIndex};"
	>
		<!-- Inner container with styling -->
		<div
			class="relative mx-auto flex w-full max-w-md flex-col gap-y-6 rounded-md bg-[#F8F8F8] p-5 text-center {close
				? 'md:w-[496px]'
				: 'md:w-[372px]'}"
			style="box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.25);"
		>
			<!-- Content injection -->
			{@render children()}

			<!-- Render additional content like close buttons -->
			{#if close || closeMobile}
				<PopupCloseButton {close} onClick={onClose} />
			{/if}
		</div>
	</div>
{/if}
