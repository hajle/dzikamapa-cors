<script lang="ts">
	import Modal from './Modal.svelte';
	import MapContainer from './map/MapContainer.svelte';
	import type { LatLngTuple } from 'leaflet';
	import { POLAND_MAP_CONFIG } from '$lib/types/map';
	import { getContentContext } from '$lib/utils/context';

	const data = getContentContext();

	const imgBg1 = '/las-glowna.png';
	const imgNiedzwiedz1 = '/niedzwiedz-mobile.png';
	const imgWilk21 = '/wilk.png';
	const imgLogo = '/logo_green.png';

	// Props for menu interaction and region handling
	let {
		onMenuToggle,
		isMenuOpen,
		isMapOpen,
		handleCloseMap,
		handleRegionClick,
		handleRegionKeydown,
		currentMapCenter,
		isAboutModalOpen,
		isFaqModalOpen,
		isTermsModalOpen,
		isContactModalOpen
	}: {
		onMenuToggle?: () => void;
		isMenuOpen: boolean;
		isMapOpen: boolean;
		handleCloseMap: () => void;
		handleRegionClick: (regionId: number) => void;
		handleRegionKeydown: (event: KeyboardEvent, regionId: number) => void;
		currentMapCenter: LatLngTuple;
		isAboutModalOpen: boolean;
		isFaqModalOpen: boolean;
		isTermsModalOpen: boolean;
		isContactModalOpen: boolean;
	} = $props();

	// Modal state
	let isModalOpen = $state(false);

	const handleMenuClick = () => {
		onMenuToggle?.();
	};

	const handleHowItWorksClick = () => {
		isModalOpen = true;
	};

	const handleCloseModal = () => {
		isModalOpen = false;
	};
</script>

<div
	class="relative mx-auto min-h-screen w-full overflow-x-hidden overflow-y-auto {isModalOpen ||
	isMapOpen ||
	isMenuOpen ||
	isAboutModalOpen ||
	isFaqModalOpen ||
	isTermsModalOpen ||
	isContactModalOpen
		? 'fixed top-0 max-h-screen overflow-y-hidden'
		: ''}"
>
	<!-- Header with Logo and Menu -->
	<header class="relative h-20 w-full">
		<!-- Greenpeace Logo -->
		<div
			class="absolute top-6 left-1/2 h-[30.94px] w-[200px] translate-x-[-50%] bg-cover bg-center bg-no-repeat"
			style="background-image: url('{imgLogo}')"
			aria-label="Greenpeace Logo"
		></div>

		<!-- Hamburger Menu -->
		<button
			class="absolute top-[22px] right-2 z-10 p-2"
			onclick={handleMenuClick}
			aria-label="Open menu"
			type="button"
		>
			<div class="space-y-[3.42px]">
				<div class="h-[4.417px] w-5 rounded-[2px] bg-[#2b2e31]"></div>
				<div class="h-[4.417px] w-5 rounded-[2px] bg-[#2b2e31]"></div>
				<div class="h-[4.417px] w-5 rounded-[2px] bg-[#2b2e31]"></div>
			</div>
		</button>
	</header>

	<!-- Main Content -->
	<main class="relative z-20 h-full">
		<!-- Title Section -->
		<div class="flex flex-col items-center gap-3 text-center">
			<h1
				class="font-paytone max-w-[360px] px-2.5 text-[28px] leading-[34px] tracking-[1px] text-[#444444]"
			>
				{data.content.frontpage.intro.title}
			</h1>

			<p class=" max-w-[360px] px-2.5 text-[14px] leading-[18px] text-[#2b2e31]">
				{data.content.frontpage.intro.subTitle}
			</p>

			<div class="font-paytone max-w-md text-[16px] leading-[24px] tracking-[0.5px] text-[#2b2e31]">
				<p>{@html data.content.frontpage.intro.selectRegion}</p>
			</div>
		</div>

		<!-- Interactive Map Section -->
		<div class="relative z-20 flex justify-center">
			<div class="relative w-full max-w-md">
				<div
					class="flex aspect-[366/348] w-full justify-center"
					aria-label="Mapa Polski z regionami do adopcji zwierząt"
				>
					<svg
						width="366"
						height="348"
						viewBox="0 0 366 348"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
					>
						<rect width="366" height="348" fill="url(#pattern0_167_26)" />
						<circle
							cx="115.249"
							cy="122.625"
							r="10"
							fill="#005C42"
							class="pulse-circle cursor-pointer transition-colors hover:fill-[#7fc241]"
							onclick={() => handleRegionClick(9)}
							onkeydown={(e) => handleRegionKeydown(e, 9)}
							role="button"
							tabindex="0"
							aria-label="Bory Tucholskie"
						/>
						<circle
							cx="267.249"
							cy="71.625"
							r="10"
							fill="#005C42"
							class="pulse-circle cursor-pointer transition-colors hover:fill-[#7fc241]"
							onclick={() => handleRegionClick(3)}
							onkeydown={(e) => handleRegionKeydown(e, 3)}
							role="button"
							tabindex="0"
							aria-label="Mazury"
						/>
						<circle
							cx="222.249"
							cy="148.625"
							r="10"
							fill="#005C42"
							class="pulse-circle cursor-pointer transition-colors hover:fill-[#7fc241]"
							onclick={() => handleRegionClick(5)}
							onkeydown={(e) => handleRegionKeydown(e, 5)}
							role="button"
							tabindex="0"
							aria-label="Centralna Polska"
						/>
						<circle
							cx="166.249"
							cy="49.625"
							r="10"
							fill="#005C42"
							class="pulse-circle cursor-pointer transition-colors hover:fill-[#7fc241]"
							onclick={() => handleRegionClick(2)}
							onkeydown={(e) => handleRegionKeydown(e, 2)}
							role="button"
							tabindex="0"
							aria-label="Pomorze"
						/>
						<circle
							cx="284.249"
							cy="291.625"
							r="10"
							fill="#005C42"
							class="pulse-circle cursor-pointer transition-colors hover:fill-[#7fc241]"
							onclick={() => handleRegionClick(8)}
							onkeydown={(e) => handleRegionKeydown(e, 8)}
							role="button"
							tabindex="0"
							aria-label="Bieszczady"
						/>
						<circle
							cx="212.249"
							cy="282.625"
							r="10"
							fill="#005C42"
							class="pulse-circle cursor-pointer transition-colors hover:fill-[#7fc241]"
							onclick={() => handleRegionClick(7)}
							onkeydown={(e) => handleRegionKeydown(e, 7)}
							role="button"
							tabindex="0"
							aria-label="Tatry"
						/>
						<circle
							cx="81.249"
							cy="200.625"
							r="10"
							fill="#005C42"
							class="pulse-circle cursor-pointer transition-colors hover:fill-[#7fc241]"
							onclick={() => handleRegionClick(6)}
							onkeydown={(e) => handleRegionKeydown(e, 6)}
							role="button"
							tabindex="0"
							aria-label="Południowy zachód"
						/>
						<circle
							cx="42.2488"
							cy="71.625"
							r="10"
							fill="#005C42"
							class="pulse-circle cursor-pointer transition-colors hover:fill-[#7fc241]"
							onclick={() => handleRegionClick(1)}
							onkeydown={(e) => handleRegionKeydown(e, 1)}
							role="button"
							tabindex="0"
							aria-label="Północny zachód"
						/>
						<circle
							cx="320.249"
							cy="116.625"
							r="10"
							fill="#005C42"
							class="pulse-circle cursor-pointer transition-colors hover:fill-[#7fc241]"
							onclick={() => handleRegionClick(4)}
							onkeydown={(e) => handleRegionKeydown(e, 4)}
							role="button"
							tabindex="0"
							aria-label="Podlasie"
						/>
						<defs>
							<pattern
								id="pattern0_167_26"
								patternContentUnits="objectBoundingBox"
								width="1"
								height="1"
							>
								<use
									href="#image0_167_26"
									transform="matrix(0.000976562 0 0 0.00102707 0 -0.0502874)"
								/>
							</pattern>
							<image
								id="image0_167_26"
								width="1024"
								height="1024"
								preserveAspectRatio="none"
								href="/mapamobile.png"
							/>
						</defs>
					</svg>
				</div>
			</div>
		</div>
	</main>

	<div class="relative z-[10] -mt-20 aspect-[3/2] h-full w-full sm:aspect-[5/2]">
		<div
			class="h-full overflow-hidden bg-size-[400%] bg-bottom bg-no-repeat sm:bg-size-[200%]"
			style="background-image: url('{imgBg1}')"
		>
			<div
				class="absolute bottom-[24px] -left-12 aspect-square w-[247px] bg-cover bg-no-repeat"
				style="background-image: url('{imgNiedzwiedz1}'); "
			></div>

			<div
				class="absolute -right-4 bottom-[32px] aspect-square w-[170px] bg-cover bg-center bg-no-repeat min-[385px]:block"
				style="background-image: url('{imgWilk21}');"
			></div>
		</div>
	</div>

	<!-- Sticky Bottom CTA -->
	<div class="fixed bottom-0 left-1/2 z-20 w-full -translate-x-1/2 transform">
		<button
			class="flex h-10 w-full cursor-pointer items-center justify-center bg-[#7fc241] transition-colors hover:bg-[#6fa835]"
			onclick={handleHowItWorksClick}
			type="button"
			aria-label={data.content.frontpage.intro.howItWorks.title}
		>
			<p class="font-paytone text-[16px] leading-[20px] tracking-[1px] text-white uppercase">
				{data.content.frontpage.intro.howItWorks.title}
			</p>
		</button>
	</div>

	<!-- How It Works Modal -->
	<Modal isOpen={isModalOpen} onClose={handleCloseModal}>
		<h3 class="font-paytone text-center text-[28px] leading-[34px] tracking-[1px] text-[#444444]">
			{data.content.frontpage.intro.howItWorks.title}
		</h3>
		<div>
			<ol
				class=" ml-5 flex list-decimal flex-col gap-y-3 text-[16px] leading-[22px] text-[#2b2e31]"
			>
				{#each data.content.frontpage.intro.howItWorks.steps.mobile as step}
					<li>{@html step}</li>
				{/each}
			</ol>
			<ul class=" ml-5 flex list-disc flex-col text-[16px] leading-[22px] text-[#2b2e31]">
				{@html data.content.frontpage.intro.howItWorks.mobileSubSteps}
			</ul>
		</div>
	</Modal>

	<!-- Full-Screen Map Overlay -->
	{#if isMapOpen}
		<div
			class="fixed inset-0 z-50 bg-white"
			role="dialog"
			aria-modal="true"
			aria-labelledby="map-title"
		>
			<!-- Close Button -->
			<button
				onclick={handleCloseMap}
				class="absolute top-2 right-2 z-[9999] flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#010101] transition-colors hover:bg-[#2b2e31]"
				aria-label="Zamknij mapę"
				type="button"
			>
				<svg
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
				</svg>
			</button>

			<!-- Map Container -->
			<div class="h-full w-full overflow-hidden">
				<MapContainer
					height="100dvh"
					enableControls={true}
					zoomControl={false}
					initialZoom={POLAND_MAP_CONFIG.minZoom}
					fitToBounds={false}
					showLogo={true}
					center={currentMapCenter}
				/>
			</div>
		</div>
	{/if}
</div>

<style>
	.pulse-circle {
		animation: pulse 2s infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
		100% {
			opacity: 1;
		}
	}
</style>
