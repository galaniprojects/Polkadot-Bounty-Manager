import { get, writable } from 'svelte/store';

export const dialog = writable<HTMLDialogElement>();

export function showLoginModal() {
	get(dialog).showModal();
}
