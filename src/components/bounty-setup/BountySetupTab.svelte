<script lang="ts">
	import { page } from '$app/stores';

	export let href: string;

	const isRoot = href.split('/').length <= 2;
</script>

<div class="tab-bar rounded-md w-full h-16 sm:h-full">
	<a
		class="link-button text-lg sm:text-2xl flex justify-center items-center w-full h-full pt-2
    {$page.url.pathname === href || (!isRoot && $page.url.pathname.startsWith(href))
			? 'text-white border-b-accent border-b-4'
			: 'text-gray-400 border-b-transparent border-b-4'}"
		{href}
	>
		<slot />
	</a>
</div>
