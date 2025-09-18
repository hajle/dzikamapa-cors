<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { getContentContext } from '$lib/utils/context';

	const data = getContentContext();

	// Device detection following ResponsiveLayout pattern
	let isMobile = $state(false);
	let screenWidth = $state(0);

	// Detect screen size and device type
	onMount(() => {
		if (browser) {
			const checkScreenSize = () => {
				screenWidth = window.innerWidth;
				// Show mobile layout for screens smaller than Tailwind's md breakpoint (768px)
				isMobile = screenWidth < 768;
			};

			checkScreenSize();
			window.addEventListener('resize', checkScreenSize);

			return () => {
				window.removeEventListener('resize', checkScreenSize);
			};
		}
	});

	// Image assets (using existing assets from the project)
	const imgLogo = '/logo_green.png';
	const imgBg = '/las.png';
	const jelen = '/jelen.png';

	// Social media links
	const socialLinks = [
		{
			name: 'Facebook',
			url: 'https://facebook.com/greenpeacepolska',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
  <g clip-path="url(#clip0_315_295)">
    <path d="M31 15.5949C31 6.9808 24.0598 -0.00195312 15.5 -0.00195312C6.93622 -1.56249e-05 -0.00390625 6.9808 -0.00390625 15.5969C-0.00390625 23.3798 5.66522 29.8317 13.0742 31.0019V20.1035H9.14109V15.5969H13.0781V12.1578C13.0781 8.24986 15.3934 6.09148 18.9332 6.09148C20.6305 6.09148 22.4033 6.39567 22.4033 6.39567V10.2319H20.4483C18.5244 10.2319 17.9238 11.4351 17.9238 12.6693V15.5949H22.2212L21.5353 20.1015H17.9218V31C25.3308 29.8297 31 23.3779 31 15.5949Z" fill="#7FC241"/>
  </g>
  <defs>
    <clipPath id="clip0_315_295">
      <rect width="31" height="31" fill="white"/>
    </clipPath>
  </defs>
</svg>`,
			iconDesktop: `<svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
  <path d="M41.0002 20.6254C41.0002 9.23256 31.8214 -0.00268555 20.5002 -0.00268555C9.17399 -0.000123047 -0.00488281 9.23257 -0.00488281 20.628C-0.00488281 30.9216 7.49299 39.4547 17.292 41.0024V26.5884H12.0901V20.628H17.2971V16.0796C17.2971 10.911 20.3593 8.05638 25.041 8.05638C27.2857 8.05638 29.6304 8.45869 29.6304 8.45869V13.5324H27.0449C24.5003 13.5324 23.7059 15.1238 23.7059 16.7561V20.6254H29.3896L28.4824 26.5858H23.7034V40.9999C33.5024 39.4521 41.0002 30.919 41.0002 20.6254Z" fill="#7FC241"/>
</svg>`
		},
		{
			name: 'X',
			url: 'https://twitter.com/greenpeace_pl',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
  <path d="M27.5557 0C29.4578 5.87618e-05 30.9999 1.54223 31 3.44434V27.5557C30.9999 29.4578 29.4578 30.9999 27.5557 31H3.44434C1.54223 30.9999 5.87622e-05 29.4578 0 27.5557V3.44434C5.8633e-05 1.54223 1.54223 5.86334e-05 3.44434 0H27.5557ZM6.74219 6.88867L13.4023 16.4102L6.73633 24.1113H8.49609L14.1816 17.5244L18.79 24.1113H24.332L17.2441 13.9785L23.3672 6.88867H21.6445L16.4668 12.8682L12.2842 6.88867H6.74219ZM11.624 8.34961L21.6572 22.6504H19.4502L9.41797 8.34961H11.624Z" fill="#7FC241"/>
</svg>`,
			iconDesktop: `<svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
  <path d="M36.4443 0C38.9601 0 41 2.03986 41 4.55566V36.4443C41 38.9601 38.9601 41 36.4443 41H4.55566C2.03986 41 0 38.9601 0 36.4443V4.55566C0 2.03986 2.03986 0 4.55566 0H36.4443ZM8.91602 9.11133L17.7246 21.7031L8.91016 31.8887H11.2363L18.7559 23.1768L24.8506 31.8887H32.1816L22.8066 18.4883L30.9043 9.11133H28.627L21.7793 17.0186L16.2471 9.11133H8.91602ZM15.374 11.043L28.6436 29.957H25.7236L12.4551 11.043H15.374Z" fill="#7FC241"/>
</svg>`
		},
		{
			name: 'Email',
			url: 'mailto:info.poland@greenpeace.org',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="31" viewBox="0 0 32 31" fill="none">
  <circle cx="16.0912" cy="15.4723" r="15.475" fill="#7FC241"/>
  <path d="M22.9794 22.3607C23.4529 22.3607 23.8583 22.192 24.1956 21.8548C24.5328 21.5175 24.7015 21.1121 24.7015 20.6386V10.306C24.7015 9.83238 24.5328 9.42697 24.1956 9.08973C23.8583 8.75248 23.4529 8.58386 22.9794 8.58386H9.20257C8.72899 8.58386 8.32358 8.75248 7.98633 9.08973C7.64909 9.42697 7.48047 9.83238 7.48047 10.306V20.6386C7.48047 21.1121 7.64909 21.5175 7.98633 21.8548C8.32358 22.192 8.72899 22.3607 9.20257 22.3607H22.9794ZM16.091 16.3333L22.9794 12.0281V20.6386H9.20257V12.0281L16.091 16.3333ZM16.091 14.6112L9.20257 10.306H22.9794L16.091 14.6112ZM22.9794 12.0281V11.167V10.306V20.6386V12.0281Z" fill="white"/>
</svg>`,
			iconDesktop: `<div class="flex items-center justify-center w-[41px] h-[41px] rounded-full bg-[#7FC241]"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="21" viewBox="0 0 30 21" fill="none">
  <path d="M26.1244 20.073C26.9211 20.073 27.6032 19.8273 28.1705 19.3359C28.7378 18.8446 29.0215 18.2539 29.0215 17.5639V2.50913C29.0215 1.81912 28.7378 1.22843 28.1705 0.737056C27.6032 0.245685 26.9211 0 26.1244 0H2.94786C2.15116 0 1.46914 0.245685 0.901795 0.737056C0.334452 1.22843 0.0507812 1.81912 0.0507812 2.50913V17.5639C0.0507812 18.2539 0.334452 18.8446 0.901795 19.3359C1.46914 19.8273 2.15116 20.073 2.94786 20.073H26.1244ZM14.5361 11.2911L26.1244 5.01825V17.5639H2.94786V5.01825L14.5361 11.2911ZM14.5361 8.78194L2.94786 2.50913H26.1244L14.5361 8.78194ZM26.1244 5.01825V3.76369V2.50913V17.5639V5.01825Z" fill="white"/>
</svg></div>`
		}
		// 		{
		// 			name: 'Telefon',
		// 			url: 'mailto:info.poland@greenpeace.org',
		// 			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none">
		//   <path d="M16.2422 0.526123C20.4581 0.527123 24.4194 2.17015 27.3994 5.1521C30.3794 8.1341 32.0186 12.0982 32.0176 16.3132C32.0145 25.0122 24.9353 32.0896 16.2373 32.0896H16.2314C13.3995 32.0886 10.6212 31.3284 8.19922 29.8904L7.62305 29.5486L1.64941 31.114L3.24414 25.2927L2.86816 24.696C1.28833 22.1832 0.455132 19.2813 0.456055 16.3005C0.460055 7.60266 7.53836 0.526329 16.2422 0.526123ZM9.51465 7.53394C9.19868 7.53399 8.68486 7.65297 8.25 8.12769C7.81501 8.60267 6.58894 9.74989 6.58887 12.0837C6.58887 14.4172 8.2878 16.6732 8.52539 16.99C8.76239 17.306 11.8079 22.2491 16.6299 24.1511C20.6368 25.7311 21.4532 25.4166 22.3232 25.3376C23.1934 25.2584 25.1295 24.1906 25.5244 23.0828C25.9194 21.9748 25.9198 21.0259 25.8018 20.8279C25.6827 20.6299 25.3665 20.5121 24.8926 20.2742C24.4182 20.036 22.0853 18.8892 21.6504 18.7312C21.2157 18.5733 20.8998 18.494 20.583 18.9685C20.2671 19.4424 19.3582 20.5117 19.0811 20.8279C18.8041 21.1449 18.5267 21.185 18.0527 20.947C17.5786 20.709 16.0512 20.2084 14.2383 18.5925C12.8285 17.3357 11.8758 15.7836 11.5986 15.3083C11.3216 14.8343 11.5686 14.5766 11.8066 14.3396C12.0196 14.1266 12.2806 13.7855 12.5186 13.5085C12.7555 13.2316 12.8352 13.0335 12.9932 12.7175C13.1509 12.4007 13.0721 12.1234 12.9531 11.8865C12.8355 11.6469 11.914 9.30271 11.4922 8.36499C11.1372 7.57499 10.7628 7.55868 10.4238 7.54468C10.1468 7.53268 9.83063 7.53394 9.51465 7.53394Z" fill="#7FC241"/>
		// </svg>`
		// 		}
	];

	// Handle social media clicks
	const handleSocialClick = (url: string) => {
		if (browser) {
			window.open(url, '_blank', 'noopener,noreferrer');
		}
	};

	// Handle back to map click
	const handleBackToMap = () => {
		if (browser) {
			window.location.href = '/';
		}
	};
</script>

<svelte:window bind:innerWidth={screenWidth} />

<svelte:head>
	<title>{data.content.seo.thankyou.title}</title>
	<meta name="description" content={data.content.seo.thankyou.description} />
</svelte:head>

{#if isMobile}
	<!-- Mobile Thank You Page -->
	<div class="relative w-full overflow-hidden bg-white">
		<!-- Content Container -->
		<div class="relative flex flex-col">
			<!-- Header with Logo -->
			<header class="relative h-20 w-full">
				<!-- Greenpeace Logo -->
				<a href="/">
					<img
						class="absolute top-6 left-1/2 h-[30.94px] w-[200px] -translate-x-1/2"
						src={imgLogo}
						alt="Greenpeace Logo"
						aria-label="Greenpeace Logo"
					/></a
				>
			</header>

			<!-- Main Content -->
			<main>
				<!-- Thank You Title -->
				<div class="relative z-0 flex flex-col gap-y-4 px-6 text-center">
					<h1 class="font-paytone text-[48px] leading-[56px] tracking-[1px] text-[#444444]">
						Dziękujemy!
					</h1>
					<h2
						class="font-paytone mx-auto mt-4 max-w-xs text-[22px] leading-[24px] tracking-[0.5px] text-[#444444]"
					>
						Od teraz razem chronimy dziką przyrodę.
					</h2>
					<p class="mx-auto max-w-md leading-[20px] tracking-[0.5px]">
						W podziękowaniu otrzymasz od nas zestaw upominków, dlatego sprawdź swoją skrzynkę -
						wysłaliśmy Ci wiadomość z potwierdzeniem adopcji i formularzem do zamówienia prezentu.
					</p>
				</div>
				<!-- Social Media Section -->
				<div class="relative z-[9999] mt-8 px-6">
					<h3
						class="font-paytone mx-auto max-w-[220px] text-center text-[22px] leading-[24px] tracking-[0.5px] text-[#444444]"
					>
						Zaproś znajomych do Dzikiej Mapy:
					</h3>
					<div class="mt-4 flex justify-center gap-5">
						{#each socialLinks as social}
							<button
								onclick={() => handleSocialClick(social.url)}
								aria-label={social.name}
								type="button"
							>
								{@html social.icon}
							</button>
						{/each}
					</div>
				</div>
				<div class="relative z-10 -mt-28">
					<img src={jelen} alt="Jeleń" class="absolute right-0 bottom-0" />
					<img src={imgBg} alt="Las" />
				</div>
			</main>
		</div>
	</div>
{:else}
	<!-- Desktop Version - Placeholder for future implementation -->
	<div
		class="relative h-screen min-h-[1080px] bg-[url('/las-glowna.png')] bg-contain bg-position-[bottom_center] bg-no-repeat"
	>
		<img
			src="/bielik.png"
			alt="Bielik na gałęzi"
			class="absolute -top-8 right-0 h-[200px] w-[200px] lg:h-[300px] lg:w-[300px] xl:h-[442px] xl:w-[442px]"
		/>
		<img
			src="/rys.png"
			alt="Ryś"
			class="absolute bottom-2 left-[15vw] h-[260px] w-[260px] lg:h-[332px] lg:w-[332px]"
		/>
		<img
			src="/jelen-glowna.png"
			alt="Jeleń"
			class="absolute right-[5vw] bottom-2 h-[430px] w-[430px] lg:h-[560px] lg:w-[560px]"
		/>
		<div class="relative mx-auto h-full w-full max-w-[1500px] pb-32">
			<header class="mt-8 flex items-start justify-between px-5">
				<!-- Logo -->
				<a href="/"><img src="/logo_green.png" alt="Logo" width="200" height="30.94" /></a>
			</header>
			<main class="relative mt-[41px] px-5">
				<h1 class="font-paytone text-center text-[64px] tracking-[0.5px] text-[#444444]">
					Dziękujemy!
				</h1>
				<h2
					class="font-paytone mt-4 text-center text-[28px] leading-[34px] tracking-[0.5px] text-[#444444]"
				>
					Od teraz wspólnie chronimy dziką przyrodę!
				</h2>
				<p class="mx-auto mt-8 max-w-[605px] text-center text-[20px] leading-[28px] text-[#2b2e31]">
					W podziękowaniu otrzymasz od nas zestaw upominków, dlatego sprawdź swoją skrzynkę e-mail,
					na którą wysłaliśmy wiadomość z potwierdzeniem Twojej adopcji i formularzem do zamówienia
					wysyłki.
				</p>
				<div class="mt-8">
					<h3
						class="font-paytone mx-auto max-w-[395px] text-center text-[28px] leading-[34px] tracking-[1px] text-[#444444]"
					>
						Zaproś do Dzikiej Mapy bliskich i znajomych:
					</h3>
					<div class="mt-4 flex items-center justify-center gap-x-12">
						{#each socialLinks as social}
							<button
								onclick={() => handleSocialClick(social.url)}
								aria-label={social.name}
								type="button"
							>
								{@html social.iconDesktop}
							</button>
						{/each}
					</div>
				</div>
			</main>
		</div>
	</div>
{/if}
