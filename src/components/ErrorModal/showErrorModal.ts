import { show } from './ErrorModal.svelte';

export function showErrorModal(messageString: string) {
	/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
	show(messageString);
}
