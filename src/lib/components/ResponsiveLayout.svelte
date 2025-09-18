<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import MobileLandingPage from './MobileLandingPage.svelte';
	import Modal from './Modal.svelte';
	import { POLAND_MAP_CONFIG, regionCenterMap } from '$lib/types/map.js';
	import type { LatLngTuple } from 'leaflet';
	import DesktopLandingPage from './DesktopLandingPage.svelte';

	let isMobile = $state(false);
	let screenWidth = $state(0);
	let isMenuOpen = $state(false);
	let isMapOpen = $state(false);

	let currentMapCenter = $state<LatLngTuple>(POLAND_MAP_CONFIG.center);

	let isAboutModalOpen = $state(false);
	let isFaqModalOpen = $state(false);
	let isTermsModalOpen = $state(false);
	let isContactModalOpen = $state(false);

	// Detect screen size and device type
	onMount(() => {
		if (browser) {
			const checkScreenSize = () => {
				screenWidth = window.innerWidth;
				isMobile = screenWidth < 768;
			};

			checkScreenSize();
			window.addEventListener('resize', checkScreenSize);
			return () => {
				window.removeEventListener('resize', checkScreenSize);
			};
		}
	});

	const handleMenuToggle = () => {
		isMenuOpen = true;
	};

	const handleCloseMenu = () => {
		isMenuOpen = false;
	};

	const handleAboutClick = () => {
		isMenuOpen = false;
		isAboutModalOpen = true;
	};

	const handleFaqClick = () => {
		isMenuOpen = false;
		isFaqModalOpen = true;
	};

	const handleTermsClick = () => {
		isMenuOpen = false;
		isTermsModalOpen = true;
	};

	const handleContactClick = () => {
		isMenuOpen = false;
		isContactModalOpen = true;
	};

	const handleCloseAboutModal = () => {
		isAboutModalOpen = false;
	};

	const handleCloseFaqModal = () => {
		isFaqModalOpen = false;
	};

	const handleCloseTermsModal = () => {
		isTermsModalOpen = false;
	};

	const handleCloseContactModal = () => {
		isContactModalOpen = false;
	};

	const handleCloseMap = () => {
		isMapOpen = false;
	};

	const handleRegionClick = (regionId: number) => {
		// console.log(`Region ${regionId} clicked`);
		// Set the map center based on the clicked region
		currentMapCenter = regionCenterMap[regionId] || POLAND_MAP_CONFIG.center;
		isMapOpen = true;
	};

	const handleRegionKeydown = (event: KeyboardEvent, regionId: number) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleRegionClick(regionId);
		}
	};
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="block md:hidden">
	<p>CORS</p>
	<MobileLandingPage
		onMenuToggle={handleMenuToggle}
		{handleCloseMap}
		{handleRegionClick}
		{handleRegionKeydown}
		{currentMapCenter}
		{isMenuOpen}
		{isMapOpen}
		{isAboutModalOpen}
		{isFaqModalOpen}
		{isTermsModalOpen}
		{isContactModalOpen}
	/>
</div>
<div class="hidden md:block">
	<p>CORS</p>
	<DesktopLandingPage
		{handleCloseMap}
		{handleRegionClick}
		{handleRegionKeydown}
		{handleAboutClick}
		{handleFaqClick}
		{handleTermsClick}
		{handleContactClick}
		{currentMapCenter}
		{isMapOpen}
		{isAboutModalOpen}
		{isFaqModalOpen}
		{isTermsModalOpen}
		{isContactModalOpen}
	/>
</div>

<!-- Mobile Menu Modal -->
<Modal isOpen={isMenuOpen} onClose={handleCloseMenu}>
	<h3 class="font-paytone text-center text-[28px] leading-[34px] tracking-[1px] text-[#444444]">
		Menu
	</h3>
	<div
		class="color-[#444444] font-paytone flex h-[533px] flex-col items-center gap-y-6 text-center text-[22px] leading-[24px] tracking-[0.5px]"
	>
		<button
			class="font-inherit cursor-pointer border-none bg-transparent p-0 text-inherit transition-colors hover:text-[#7fc241]"
			onclick={handleAboutClick}
			type="button"
			aria-label="O projekcie - kliknij aby otworzyć"
		>
			O projekcie
		</button>
		<button
			class="font-inherit cursor-pointer border-none bg-transparent p-0 text-inherit transition-colors hover:text-[#7fc241]"
			onclick={handleFaqClick}
			type="button"
			aria-label="Pytania i odpowiedzi - kliknij aby otworzyć"
		>
			Pytania i odpowiedzi
		</button>
		<button
			class="font-inherit cursor-pointer border-none bg-transparent p-0 text-inherit transition-colors hover:text-[#7fc241]"
			onclick={handleTermsClick}
			type="button"
			aria-label="Regulamin - kliknij aby otworzyć"
		>
			Regulamin
		</button>
		<button
			class="font-inherit cursor-pointer border-none bg-transparent p-0 text-inherit transition-colors hover:text-[#7fc241]"
			onclick={handleContactClick}
			type="button"
			aria-label="Kontakt - kliknij aby otworzyć"
		>
			Kontakt
		</button>
	</div>
</Modal>

<!-- Individual Menu Item Modals -->

<!-- About Project Modal -->
<Modal isOpen={isAboutModalOpen} onClose={handleCloseAboutModal}>
	<h3
		class="font-paytone text-center text-[28px] leading-[34px] tracking-[1px] text-[#444444] md:rounded-t-lg md:bg-[#62C300] md:p-5 md:text-white"
	>
		O Dzikiej Mapie
	</h3>
	<div class="font-poppins flex flex-col gap-y-3 text-[16px] leading-[22px] text-[#2b2e31] md:p-5">
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu suscipit sem. Nunc
			commodo pulvinar erat, ut auctor augue sagittis et. Orci varius natoque penatibus et magnis
			dis parturient montes, nascetur ridiculus mus.
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu suscipit sem. Nunc
			commodo pulvinar erat, ut auctor augue sagittis et. Orci varius natoque penatibus et magnis
			dis parturient montes, nascetur ridiculus mus.
		</p>
		<p>
			Sed ornare viverra efficitur. Morbi fermentum gravida velit, ac dignissim turpis semper id.
			Phasellus libero lectus, tempus in posuere ut, volutpat sit amet velit. Duis eget molestie
			massa. Aliquam vitae lorem nec nisi scelerisque ullamcorper a et odio. Suspendisse rhoncus
			gravida leo, a euismod libero convallis vel. Phasellus eu augue at ipsum aliquet gravida.
		</p>
		<p class="font-bold">
			Swoje ilustracje udostępnili nam do projektu: Małgorzata Lewczuk, Szabolcs Kókay i Kate
			Romenskaya - dziękujemy!
		</p>
	</div>
</Modal>

<!-- FAQ Modal -->
<Modal isOpen={isFaqModalOpen} onClose={handleCloseFaqModal}>
	<h3
		class="font-paytone text-center text-[28px] leading-[34px] tracking-[1px] text-[#444444] md:rounded-t-lg md:bg-[#62C300] md:p-5 md:text-white"
	>
		Pytania i odpowiedzi
	</h3>
	<div
		class="font-poppins flex flex-col gap-y-3 text-[16px] leading-[22px] text-[#2b2e31] md:gap-y-2.5"
	>
		<div class="md:flex md:flex-col md:gap-y-5 md:p-5">
			<h4 class="font-paytone text-[16px] leading-[24px] tracking-[0.5px] md:text-[22px]">
				Pytanie 1
			</h4>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu suscipit sem. Nunc
				commodo pulvinar erat, ut auctor augue sagittis et. Orci varius natoque penatibus et magnis
				dis parturient montes, nascetur ridiculus mus.
			</p>
		</div>
		<div class="md:flex md:flex-col md:gap-y-5 md:p-5">
			<h4 class="font-paytone text-[16px] leading-[24px] tracking-[0.5px] md:text-[22px]">
				Pytanie 2
			</h4>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu suscipit sem. Nunc
				commodo pulvinar erat, ut auctor augue sagittis et. Orci varius natoque penatibus et magnis
				dis parturient montes, nascetur ridiculus mus.
			</p>
		</div>
		<div class="md:flex md:flex-col md:gap-y-5 md:p-5">
			<h4 class="font-paytone text-[16px] leading-[24px] tracking-[0.5px] md:text-[22px]">
				Pytanie 3
			</h4>
			<p>
				Sed ornare viverra efficitur. Morbi fermentum gravida velit, ac dignissim turpis semper id.
				Phasellus libero lectus, tempus in posuere ut, volutpat sit amet velit. Duis eget molestie
				massa. Aliquam vitae lorem nec nisi scelerisque ullamcorper a et odio. Suspendisse rhoncus
				gravida leo, a euismod libero convallis vel. Phasellus eu augue at ipsum aliquet gravida.
			</p>
		</div>
		<div class="md:flex md:flex-col md:gap-y-5 md:p-5">
			<h4 class="font-paytone text-[16px] leading-[24px] tracking-[0.5px] md:text-[22px]">
				Pytanie 4
			</h4>
			<p>
				Sed ornare viverra efficitur. Morbi fermentum gravida velit, ac dignissim turpis semper id.
				Phasellus libero lectus, tempus in posuere ut, volutpat sit amet velit. Duis eget molestie
				massa. Aliquam vitae lorem nec nisi scelerisque ullamcorper a et odio. Suspendisse rhoncus
				gravida leo, a euismod libero convallis vel. Phasellus eu augue at ipsum aliquet gravida.
			</p>
		</div>
	</div>
</Modal>

<!-- Terms Modal -->
<Modal isOpen={isTermsModalOpen} onClose={handleCloseTermsModal}>
	<h3
		class="font-paytone text-center text-[28px] leading-[34px] tracking-[1px] text-[#444444] md:rounded-t-lg md:bg-[#62C300] md:p-5 md:text-white"
	>
		Regulamin
	</h3>
	<div class="font-poppins flex flex-col gap-y-3 text-[16px] leading-[22px] text-[#2b2e31] md:p-5">
		<!-- Placeholder content - to be filled later -->
		<p>
			Regulamin strony reguluje zasady świadczenia usług drogą elektroniczną przez Fundację
			Greenpeace Polska, polegających na umożliwieniu Użytkownikom wsparcia kampanii Fundacji
			związanej z ochroną dzikiej przyrody. Ilekroć w niniejszym Regulaminie jest mowa o: •
			Użytkowniku, należy przez to rozumieć każdą osobę korzystającą ze strony dzikamapa.pl, •
			Fundacji, należy przez to rozumieć Fundację Greenpeace Polska z siedzibą w Warszawie, ul.
			Altowa 4. Strona internetowa dzikamapa.pl jest zarządzana przez Fundację. Korzystanie ze
			strony jest nieodpłatne. Za pośrednictwem strony można przez system PayU, Blik lub PayPal
			przekazać darowiznę na projekty związane z ochroną dzikiej przyrody. Darowizna ma symboliczną
			formę „adopcji dzikiego zwierzęcia”. Adoptować zwierzę może każda osoba fizyczna. Koszt
			adopcji to minimum 30 złotych miesięcznie. Jeden użytkownik może adoptować dowolną liczbę
			zwierząt. Każdy Użytkownik korzystający z tej strony zobowiązany jest do przestrzegania
			niniejszego Regulaminu. Fundacja zastrzega sobie prawo do jednostronnego decydowania o
			zawartości strony oraz podstron i modyfikowania jej, bez uprzedzania użytkowników o swoich
			zamiarach.
		</p>
	</div>
</Modal>

<!-- Contact Modal -->
<Modal isOpen={isContactModalOpen} onClose={handleCloseContactModal}>
	<h3
		class="font-paytone text-center text-[28px] leading-[34px] tracking-[1px] text-[#444444] md:rounded-t-lg md:bg-[#62C300] md:p-5 md:text-white"
	>
		Kontakt
	</h3>
	<div class="font-poppins text-[16px] leading-[22px] text-[#2b2e31] md:p-5">
		<!-- Placeholder content - to be filled later -->
		<h4 class="text-center text-[16px] leading-[22px] font-bold">Fundacja Greenpeace Polska</h4>
		<div class="mt-2 text-center">
			<p>Altowa 4</p>
			<p>02-386 Warszawa</p>
			<p>info.poland@greenpeace.org</p>
		</div>
	</div>
</Modal>
