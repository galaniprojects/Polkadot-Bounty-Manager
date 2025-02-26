import { get, writable, type Writable } from 'svelte/store';
import styles from './Modal.module.css';

export const modalStyles = styles;

const singleton = writable<HTMLDialogElement | undefined>();

export function showModal(element: HTMLDialogElement, store: Writable<boolean>) {
	function handleClose() {
		store.set(false);
	}

	element.addEventListener('close', handleClose);

	const cleanup = store.subscribe((open) => {
		if (open) {
			get(singleton)?.close();
			singleton.set(element);

			element.showModal();
		} else {
			singleton.set(undefined);

			element.close();
		}
	});

	return {
		destroy() {
			cleanup();
			element.removeEventListener('close', handleClose);
		}
	};
}

export function clickAway(element: HTMLDialogElement) {
	function handleClick({ target }: MouseEvent) {
		if (target === element) {
			element.close();
		}
	}

	element.addEventListener('click', handleClick);

	return {
		destroy() {
			element.removeEventListener('click', handleClick);
		}
	};
}
