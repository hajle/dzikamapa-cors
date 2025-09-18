<!--
	PopupCloseButton - Reusable close button component for popups
	Extracted from MapContainer for shared close button functionality
-->
<script lang="ts">
	import { useDeviceDetection } from '$lib/composables/useDeviceDetection';

	// Props with proper typing and defaults
	let {
		close,
		onClick
	}: {
		close: boolean;
		onClick?: () => void;
	} = $props();

	// Device detection using composable
	const { isDesktop } = useDeviceDetection();

	// Handle click event
	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
	class="absolute top-2 right-2 flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-full bg-white text-[#666666] transition md:bg-[#010101] md:text-white {!close
		? 'md:hidden'
		: ''} "
	onclick={handleClick}
>
	{#if isDesktop()}
		<!-- Desktop SVG icon (white fill) -->
		<svg xmlns="http://www.w3.org/2000/svg" width="26" height="25" viewBox="0 0 26 25" fill="none">
			<mask
				id="mask0_350_120"
				style="mask-type:alpha"
				maskUnits="userSpaceOnUse"
				x="-12"
				y="-13"
				width="50"
				height="51"
			>
				<rect x="-11.9434" y="-12.4453" width="49.8906" height="49.8906" fill="#D9D9D9" />
			</mask>
			<g mask="url(#mask0_350_120)">
				<path
					d="M8.50967 18.7358L6.7666 16.9927L11.2488 12.5105L6.7666 8.05948L8.50967 6.31641L12.9919 10.7986L17.4429 6.31641L19.186 8.05948L14.7038 12.5105L19.186 16.9927L17.4429 18.7358L12.9919 14.2536L8.50967 18.7358Z"
					fill="#F7F4FF"
				/>
			</g>
		</svg>
	{:else}
		<!-- Mobile SVG icon (black fill) -->
		<svg xmlns="http://www.w3.org/2000/svg" width="26" height="25" viewBox="0 0 26 25" fill="none">
			<mask
				id="mask0_211_12"
				style="mask-type:alpha"
				maskUnits="userSpaceOnUse"
				x="-12"
				y="-13"
				width="50"
				height="51"
			>
				<rect x="-11.9453" y="-12.4453" width="49.8906" height="49.8906" fill="#D9D9D9" />
			</mask>
			<g mask="url(#mask0_211_12)">
				<path
					d="M8.50723 18.7357L6.76416 16.9927L11.2463 12.5105L6.76416 8.05942L8.50723 6.31635L12.9894 10.7985L17.4405 6.31635L19.1835 8.05942L14.7014 12.5105L19.1835 16.9927L17.4405 18.7357L12.9894 14.2535L8.50723 18.7357Z"
					fill="black"
				/>
			</g>
		</svg>
	{/if}
</button>
