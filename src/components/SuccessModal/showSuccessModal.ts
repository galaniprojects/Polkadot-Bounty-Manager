import { get, writable } from 'svelte/store';

export const dialog = writable<HTMLDialogElement>();
export const title = writable('');
export const message = writable('');
export const callData = writable('');

export function showSuccessModal(titleString: string, messageString: string, callDataString = '') {
	title.set(titleString);
	message.set(messageString);
	callData.set(callDataString);
	get(dialog).showModal();
}
