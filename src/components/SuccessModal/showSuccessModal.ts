import { show } from './SuccessModal.svelte';

export function showSuccessModal(titleString: string, messageString: string) {
	/* eslint-disable-next-line @typescript-eslint/no-unsafe-call */
	show(titleString, messageString);
}
