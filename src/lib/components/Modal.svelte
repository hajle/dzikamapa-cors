<script lang="ts">
	import type { Snippet } from 'svelte';

	// Props for controlling modal state
	let { isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children?: Snippet } =
		$props();

	// Close modal when clicking outside or pressing Escape
	const handleBackdropClick = (event: MouseEvent) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			onClose();
		}
	};
</script>

{#if isOpen}
	<div
		class="absolute inset-0 overflow-auto bg-white/90 px-2.5 pt-5 pb-2.5 min-[385px]:pt-[74px] md:pb-8 {isOpen
			? 'z-50'
			: 'z-[7000]'}"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<!-- Modal Content -->
		<div
			class="relative mx-auto flex min-h-[360px] w-full max-w-md flex-col gap-y-6 rounded-md bg-[#F8F8F8] p-5 md:absolute md:top-[126px] md:left-1/2 md:min-h-[600px] md:max-w-[800px] md:-translate-x-1/2 md:gap-y-2.5 md:rounded-lg md:pt-0 md:pr-0 md:pb-8 md:pl-0"
			style="box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.25);"
		>
			<button
				aria-label="Zamknij"
				onclick={onClose}
				class="absolute top-0 right-0 flex h-[32px] w-[32px] cursor-pointer items-center justify-center p-1.5 md:top-2.5 md:right-2.5"
			>
				<div class="h-[26px] w-[26px] rounded-full bg-[#010101]">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="26"
						height="25"
						viewBox="0 0 26 25"
						fill="none"
					>
						<mask
							id="mask0_175_167"
							style="mask-type:alpha"
							maskUnits="userSpaceOnUse"
							x="-12"
							y="-13"
							width="50"
							height="51"
						>
							<rect x="-11.9453" y="-12.4453" width="49.8906" height="49.8906" fill="#D9D9D9" />
						</mask>
						<g mask="url(#mask0_175_167)">
							<path
								d="M8.50723 18.7357L6.76416 16.9927L11.2463 12.5105L6.76416 8.05942L8.50723 6.31635L12.9894 10.7985L17.4405 6.31635L19.1835 8.05942L14.7014 12.5105L19.1835 16.9927L17.4405 18.7357L12.9894 14.2535L8.50723 18.7357Z"
								fill="#F7F4FF"
							/>
						</g>
					</svg>
				</div>
			</button>
			{@render children?.()}
		</div>
	</div>
{/if}
