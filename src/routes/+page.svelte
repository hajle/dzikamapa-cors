<script lang="ts">
	import ResponsiveLayout from '$lib/components/ResponsiveLayout.svelte';
	import { getContentContext } from '$lib/utils/context';

	let data = getContentContext();
</script>

<svelte:head>
	<title>{data.content.seo.frontpage.title}</title>
	<meta name="description" content={data.content.seo.frontpage.description} />
</svelte:head>

<ResponsiveLayout />
