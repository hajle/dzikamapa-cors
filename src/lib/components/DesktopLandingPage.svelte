<script lang="ts">
	import { POLAND_MAP_CONFIG } from '$lib/types/map';
	import type { LatLngTuple } from 'leaflet';
	import MapContainer from './map/MapContainer.svelte';
	import { getContentContext } from '$lib/utils/context';

	const data = getContentContext();

	let {
		isMapOpen,
		handleCloseMap,
		handleRegionClick,
		handleRegionKeydown,
		handleAboutClick,
		handleFaqClick,
		handleTermsClick,
		handleContactClick,
		currentMapCenter,
		isAboutModalOpen,
		isFaqModalOpen,
		isTermsModalOpen,
		isContactModalOpen
	}: {
		isMapOpen: boolean;
		handleCloseMap: () => void;
		handleRegionClick: (regionId: number) => void;
		handleRegionKeydown: (event: KeyboardEvent, regionId: number) => void;
		handleAboutClick: () => void;
		handleFaqClick: () => void;
		handleTermsClick: () => void;
		handleContactClick: () => void;
		currentMapCenter: LatLngTuple;
		isAboutModalOpen: boolean;
		isFaqModalOpen: boolean;
		isTermsModalOpen: boolean;
		isContactModalOpen: boolean;
	} = $props();

	// function showHover(patternId: string): void {
	// 	const pattern = document.getElementById(patternId) as HTMLElement;

	// 	if (!pattern) return;

	// 	const normal = pattern.querySelector('.region-image') as SVGUseElement;
	// 	const hover = pattern.querySelector('.region-image-hover') as SVGUseElement;

	// 	if (normal && hover) {
	// 		normal.style.opacity = '0';
	// 		hover.style.opacity = '1';
	// 	}
	// }

	// function hideHover(patternId: string): void {
	// 	const pattern = document.getElementById(patternId);
	// 	if (!pattern) return;

	// 	const normal = pattern.querySelector('.region-image') as SVGUseElement;
	// 	const hover = pattern.querySelector('.region-image-hover') as SVGUseElement;

	// 	if (normal && hover) {
	// 		normal.style.opacity = '1';
	// 		hover.style.opacity = '0';
	// 	}
	// }

	// onmouseover={() => showHover('pattern_rzeki_polnocny_wschod')}
	// onmouseout={() => hideHover('pattern_rzeki_polnocny_wschod')}
</script>

<!-- Desktop Layout - Conditional rendering between homepage and map -->
{#if isMapOpen}
	<!-- Desktop Map View -->
	<main class="relative h-screen w-full">
		<!-- Close Map Button -->
		<button
			class="absolute top-4 right-4 z-[9999] flex h-10 w-10 items-center justify-center rounded-full bg-[#010101] transition-colors hover:bg-[#2b2e31]"
			onclick={handleCloseMap}
			type="button"
			aria-label="Zamknij mapę"
		>
			<svg class="h-6 w-6 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
				/>
			</svg>
		</button>

		<!-- Map Container -->
		<div class="h-full w-full">
			<MapContainer
				height="100vh"
				enableControls={true}
				zoomControl={true}
				initialZoom={POLAND_MAP_CONFIG.zoom}
				fitToBounds={false}
				showLogo={true}
				center={currentMapCenter}
			/>
		</div>
	</main>
{:else}
	<div
		class={`${isAboutModalOpen || isFaqModalOpen || isTermsModalOpen || isContactModalOpen ? 'fixed top-0 bottom-0 overflow-y-hidden' : 'relative'} h-full min-h-screen bg-[url('/las-glowna.png')] bg-cover bg-position-[left_-300px_bottom_-20px] bg-no-repeat md:bg-position-[left_-300px_bottom_0px] lg:bg-position-[left_-300px_bottom_20px]`}
	>
		<div class="relative mx-auto h-full w-full max-w-[1500px] pb-32">
			<header class="relative z-10 mt-8 flex items-start justify-between px-5">
				<img src="/logo_green.png" alt="Logo" width="200" height="30.94" />
				<nav
					class={`font-poppins {isAboutModalOpen || isFaqModalOpen || isTermsModalOpen || isContactModalOpen ? 'z-50' : 'z-[6000]'}
					relative flex
					items-center gap-[23px]
					text-[16px]
						font-bold text-[#444444]
						lg:mr-16 xl:mr-28`}
				>
					<button
						class="cursor-pointer transition-colors hover:text-[#7fc241]"
						onclick={handleAboutClick}
						type="button"
					>
						O projekcie
					</button>
					<button
						class="cursor-pointer transition-colors hover:text-[#7fc241]"
						onclick={handleFaqClick}
						type="button"
					>
						Pytania i odpowiedzi
					</button>
					<button
						class="cursor-pointer transition-colors hover:text-[#7fc241]"
						onclick={handleTermsClick}
						type="button"
					>
						Regulamin
					</button>
					<button
						class="cursor-pointer transition-colors hover:text-[#7fc241]"
						onclick={handleContactClick}
						type="button"
					>
						Kontakt
					</button>
				</nav>
			</header>
			<main class="relative px-5">
				<div class="grid grid-cols-5 gap-1 lg:grid-cols-3">
					<div
						class="relative col-span-3 mt-8 lg:col-span-2 lg:-mt-8 xl:-mt-16"
						style="filter: drop-shadow(0 4px 20px rgba(0, 0, 0, 0.50));"
					>
						`<svg
							width="952"
							height="909"
							viewBox="0 0 952 909"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							class="regions w-full"
						>
							<rect x="0" y="0" width="951.647" height="951.647" fill="url(#pattern_mapa)" />
							<!-- svelte-ignore a11y_mouse_events_have_key_events -->
							<rect
								width="156"
								height="123"
								x="90"
								y="164"
								fill="url(#pattern_rzeki_polnocny_wschod)"
								class="region cursor-pointer"
								onclick={() => handleRegionClick(1)}
								onkeydown={(e) => handleRegionKeydown(e, 1)}
								role="button"
								tabindex="0"
								aria-label="Północny zachód - Kliknij aby zobaczyć mapę"
							/>
							<rect
								width="167"
								height="96"
								x="320"
								y="114"
								fill="url(#pattern_pomorze)"
								class="region cursor-pointer"
								onclick={() => handleRegionClick(2)}
								onkeydown={(e) => handleRegionKeydown(e, 2)}
								role="button"
								tabindex="0"
								aria-label="Pomorze - Kliknij aby zobaczyć mapę"
							/>
							<rect
								width="110"
								height="109"
								x="610"
								y="144"
								fill="url(#pattern_mazury)"
								class="region cursor-pointer"
								onclick={() => handleRegionClick(3)}
								onkeydown={(e) => handleRegionKeydown(e, 3)}
								role="button"
								tabindex="0"
								aria-label="Mazury - Kliknij aby zobaczyć mapę"
							/>
							<rect
								width="109"
								height="101"
								x="700"
								y="269"
								fill="url(#pattern_podlasie_puszcza)"
								class="region cursor-pointer"
								onclick={() => handleRegionClick(4)}
								onkeydown={(e) => handleRegionKeydown(e, 4)}
								role="button"
								tabindex="0"
								aria-label="Podlasie puszcza - Kliknij aby zobaczyć mapę"
							/>
							<rect
								width="128"
								height="104"
								x="445"
								y="365"
								fill="url(#pattern_centralna_polska)"
								class="region cursor-pointer"
								onclick={() => handleRegionClick(5)}
								onkeydown={(e) => handleRegionKeydown(e, 5)}
								role="button"
								tabindex="0"
								aria-label="Centralna Polska - Kliknij aby zobaczyć mapę"
							/>
							<rect
								width="106"
								height="106"
								x="200"
								y="481"
								fill="url(#pattern_poludniowy_wschod)"
								class="region cursor-pointer"
								onclick={() => handleRegionClick(6)}
								onkeydown={(e) => handleRegionKeydown(e, 6)}
								role="button"
								tabindex="0"
								aria-label="Południowy zachód - Kliknij aby zobaczyć mapę"
							/>
							<rect
								width="114"
								height="110.81"
								x="463"
								y="646"
								fill="url(#pattern_tatry)"
								class="region cursor-pointer"
								onclick={() => handleRegionClick(7)}
								onkeydown={(e) => handleRegionKeydown(e, 7)}
								role="button"
								tabindex="0"
								aria-label="Tatry - Kliknij aby zobaczyć mapę"
							/>
							<rect
								width="129"
								height="74"
								x="655"
								y="569"
								fill="url(#pattern_bieszczady)"
								class="region cursor-pointer"
								onclick={() => handleRegionClick(8)}
								onkeydown={(e) => handleRegionKeydown(e, 8)}
								role="button"
								tabindex="0"
								aria-label="Bieszczady - Kliknij aby zobaczyć mapę"
							/>
							<rect
								width="163"
								height="83"
								x="195"
								y="296"
								fill="url(#pattern_bory_tucholskie)"
								class="cursor-pointer"
								onclick={() => handleRegionClick(9)}
								onkeydown={(e) => handleRegionKeydown(e, 9)}
								role="button"
								tabindex="0"
								aria-label="Bory Tucholskie - Kliknij aby zobaczyć mapę"
							/>
							<defs class="defs">
								<pattern
									id="pattern_mapa"
									patternContentUnits="objectBoundingBox"
									width="1"
									height="1"
								>
									<use href="#image_mapa" transform="scale(0.000976562)" />
								</pattern>
								<pattern
									id="pattern_rzeki_polnocny_wschod"
									patternContentUnits="userSpaceOnUse"
									width="1"
									height="1"
								>
									<use href="#image_rzeki_polnocny_wschod" class="region-image" />
								</pattern>
								<pattern
									id="pattern_pomorze"
									patternContentUnits="userSpaceOnUse"
									width="1"
									height="1"
								>
									<use href="#image_pomorze" class="region-image" />
								</pattern>
								<pattern
									id="pattern_mazury"
									patternContentUnits="userSpaceOnUse"
									width="1"
									height="1"
								>
									<use href="#image_mazury" class="region-image" />
								</pattern>
								<pattern
									id="pattern_podlasie_puszcza"
									patternContentUnits="userSpaceOnUse"
									width="1"
									height="1"
								>
									<use href="#image_podlasie_puszcza" class="region-image" />
								</pattern>
								<pattern
									id="pattern_centralna_polska"
									patternContentUnits="userSpaceOnUse"
									width="1"
									height="1"
								>
									<use href="#image_centralna_polska" class="region-image" />
								</pattern>
								<pattern
									id="pattern_poludniowy_wschod"
									patternContentUnits="userSpaceOnUse"
									width="1"
									height="1"
								>
									<use href="#image_poludniowy_wschod" class="region-image" />
								</pattern>
								<pattern
									id="pattern_tatry"
									patternContentUnits="userSpaceOnUse"
									width="1"
									height="1"
								>
									<use href="#image_tatry" class="region-image" />
								</pattern>
								<pattern
									id="pattern_bieszczady"
									patternContentUnits="userSpaceOnUse"
									width="1"
									height="1"
								>
									<use href="#image_bieszczady" class="region-image" />
								</pattern>
								<pattern
									id="pattern_bory_tucholskie"
									patternContentUnits="userSpaceOnUse"
									width="1"
									height="1"
								>
									<use href="#image_bory_tucholskie" class="region-image" />
								</pattern>
								<image
									id="image_mapa"
									width="952"
									height="909"
									preserveAspectRatio="none"
									href="/mapa.png"
								/>
								<image
									id="image_rzeki_polnocny_wschod"
									width="156"
									height="123"
									preserveAspectRatio="none"
									href="/rzeki-polnocny-wschod.png"
								/>
								<!-- <image
									id="image_rzeki_polnocny_wschod_hover"
									width="156"
									height="123"
									preserveAspectRatio="none"
									href="/rzeki-polnocny-wschod-hover.png"
								/> -->
								<image
									id="image_pomorze"
									width="167"
									height="96"
									preserveAspectRatio="none"
									href="/pomorze.png"
								/>
								<image
									id="image_mazury"
									width="110"
									height="109"
									preserveAspectRatio="none"
									href="/mazury.png"
								/>
								<!-- <image
									id="image_mazury_hover"
									width="110"
									height="116"
									preserveAspectRatio="none"
									href="/mazury-hover.png"
								/> -->
								<image
									id="image_podlasie_puszcza"
									width="109"
									height="101"
									preserveAspectRatio="none"
									href="/podlasie-puszcza.png"
								/>
								<!-- <image
									id="image_podlasie_puszcza_hover"
									width="109"
									height="101"
									preserveAspectRatio="none"
									href="/podlasie-puszcza-hover.png"
								/> -->
								<image
									id="image_centralna_polska"
									width="128"
									height="104"
									preserveAspectRatio="none"
									href="/centralna-polska.png"
								/>
								<image
									id="image_poludniowy_wschod"
									width="106"
									height="106"
									preserveAspectRatio="none"
									href="/poludniowy-wschod.png"
								/>
								<image
									id="image_tatry"
									width="114"
									height="110.81"
									preserveAspectRatio="none"
									href="/tatry.png"
								/>
								<image
									id="image_bieszczady"
									width="129"
									height="74"
									preserveAspectRatio="none"
									href="/bieszczady.png"
								/>
								<image
									id="image_bory_tucholskie"
									width="163"
									height="83"
									preserveAspectRatio="none"
									href="/bory-tucholskie.png"
								/>
							</defs>
						</svg>`

						<img
							src="/niedzwiedz.png"
							alt="Niedźwiedź"
							width="367"
							height="367"
							class="absolute -bottom-[30px] -left-[60px]"
						/>
						<img
							src="/wilk.png"
							alt="Wilk"
							width="322"
							height="322"
							class="absolute -right-[110px] -bottom-[30px]"
						/>
					</div>
					<div class="col-span-2 lg:col-span-1">
						<div
							class="relative mt-24 flex w-full max-w-[372px] flex-col gap-y-6 rounded-md p-5 lg:pb-16"
							style="background: #FAFAFA; box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.25);"
						>
							<img
								src="/dzieciol.png"
								alt="Dzięcioł"
								class="absolute top-[10px] -left-[110px] h-[171px] w-[171px]"
							/>
							<img
								src="/wiewiorka.png"
								alt="Wiewiórka"
								class="absolute -top-[122px] -right-[15px] h-[142px] w-[142px] xl:-right-[55px]"
							/>
							<h1
								class="font-paytone text-center text-[28px] leading-[34px] tracking-[1px] text-[#444444]"
							>
								{data.content.frontpage.intro.title}
							</h1>
							<div class="mt-4 flex flex-col gap-y-6 text-sm leading-[20px] text-[#2B2E31]">
								<p class="font-bold">
									{data.content.frontpage.intro.subTitle}
								</p>

								<ol class="ml-4 list-decimal">
									<h3 class="-ml-4 font-bold">{data.content.frontpage.intro.howItWorks.title}</h3>
									{#each data.content.frontpage.intro.howItWorks.steps.desktop as step}
										<li>{@html step}</li>
									{/each}
								</ol>
								<button
									class="font-paytone mx-auto w-[146px] rounded-md bg-[#7fc241] py-2.5 text-base leading-5 tracking-[1px] text-white transition-colors hover:bg-[#6fa835]"
									style="box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);"
									type="button"
									onclick={() => handleRegionClick(5)}
									aria-label="Otwórz mapę">{data.content.frontpage.intro.btn}</button
								>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>
{/if}
