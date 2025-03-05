<script lang="ts">
	import { type Snippet } from 'svelte';
	import { page } from '$app/state';

	interface Props {
		href: string;
		children: Snippet;
	}

	const { href, children }: Props = $props();

	const pathname = $derived(page.url.pathname);
	const isRoot = href.split('/').length <= 2;
</script>

<div class="tab-bar rounded-md w-full h-16 sm:h-full">
	<a
		class="link-button text-lg sm:text-2xl flex justify-center items-center w-full h-full pt-2
    {pathname === href || pathname === `${href}/success` || (!isRoot && pathname.startsWith(href))
			? 'text-white border-b-backgroundChildBountyDetails border-b-4'
			: 'text-gray-400 border-b-transparent border-b-4'}"
		{href}
	>
		{@render children()}
	</a>
</div>
