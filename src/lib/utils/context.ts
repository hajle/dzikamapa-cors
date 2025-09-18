import { getContext, setContext } from 'svelte';

interface ContentProps {
	content: {
		seo: {
			frontpage: {
				title: string;
				description: string;
			};
			thankyou: {
				title: string;
				description: string;
			};
		};
		frontpage: {
			intro: {
				title: string;
				subTitle: string;
				selectRegion: string;
				howItWorks: {
					title: string;
					steps: {
						desktop: string[];
						mobile: string[];
					};
					mobileSubSteps: string;
				};
				btn: string;
			};
		};
	};
}

export function setContentContext(content: ContentProps) {
	setContext('content', content);
}

export function getContentContext() {
	return getContext('content') as ContentProps;
}
