<script>
	import { page } from '$app/state';

	const { status } = page;
	const message = status === 404 ? 'Page not found' : 'Internal server error';
</script>

<h1 class="m-12 text-2xl font-bold text-center">{message}</h1>

<a href="/" class="m-12 text-center block underline">Go to start page</a>
