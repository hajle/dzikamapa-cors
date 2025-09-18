// import niedzwiedzImg from '../../static/niedzwiedz.png';

export default {
	seo: {
		frontpage: {
			title: 'Dzika Mapa Greenpeace - Chroń dziką przyrodę razem z nami!',
			description: 'Adoptuj ulubione polskie dzikie zwierzę i chroń przyrodę razem z Greenpeace'
		},
		thankyou: {
			title: 'Dziękujemy, że pomagasz chronić dziką przyrodę | DzikaMapa.pl Greenpeace',
			description: 'Adoptuj ulubione polskie dzikie zwierzę i chroń przyrodę razem z Greenpeace'
		}
	},
	frontpage: {
		intro: {
			title: 'Pomóż polskiej przyrodzie, adoptuj ulubione zwierzę!',
			subTitle:
				'Chroń z nami dziką przyrodę w Polsce - wybierz ulubione zwierzę na mapie, symbolicznie je zaadoptuj i dołącz do osób, które wraz z nami dbają o to, co najcenniejsze w naszej przyrodzie.',
			selectRegion: 'Wybierz na mapie<br />interesujący Cię region:',
			howItWorks: {
				title: 'Jak to działa?',
				steps: {
					desktop: [
						'Kliknij na mapie interesujący Cię region Polski i znajdź swoje ulubione zwierzę.',
						'Nazwij je i symbolicznie adoptuj, przekazując na cele ochrony przyrody comiesięczną, niewielką darowiznę.',
						'Objęte przez Ciebie opieką zwierzę wraz z nadanym przez Ciebie imieniem będzie widoczne na mapie przez cały okres Twojego wsparcia.',
						"W podziękowaniu <span class='font-bold'>otrzymasz od nas certyfikat, audiobooka pięknej książki Simony Kossak i przyrodniczy kalendarz</span> ścienny Greenpeace na rok 2026."
					],
					mobile: [
						'Kliknij na mapie interesujący Cię region Polski i znajdź swoje ulubione zwierzę.',
						'Nazwij je i symbolicznie adoptuj, przekazując na cele ochrony przyrody comiesięczną, niewielką darowiznę.',
						'Objęte przez Ciebie opieką zwierzę wraz z nadanym przez Ciebie imieniem będzie widoczne na mapie przez cały okres Twojego wsparcia.',
						'W podziękowaniu otrzymasz:'
					]
				},
				mobileSubSteps:
					"<li class='mt-2'><spanclass='font-bold'>certyfikat</span></li><li><span class='font-bold'>audiobooka</span> książki Simony Kossak pt.<span class='italic'>Serce i Pazur</span></li><li><span class='font-bold'>kalendarz przyrodniczy</span> Greenpeace na rok 2026.</li>"
			},
			btn: 'Otwórz mapę!'
		}
	},
	navigation: [
		{
			name: 'O projekcie',
			href: '/o-projekcie'
		}
	]
};
