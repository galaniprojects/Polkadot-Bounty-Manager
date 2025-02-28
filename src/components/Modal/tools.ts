import { type Writable } from 'svelte/store';
import styles from './Modal.module.css';

export const modalStyles = styles;

export function showModal(element: HTMLDialogElement, store: Writable<boolean>) {
	const { classList } = document.body;

	function handleClose() {
		store.set(false);
	}

	element.addEventListener('close', handleClose);

	const cleanup = store.subscribe((open) => {
		if (open) {
			element.showModal();
			classList.add('overflow-hidden');
		} else {
			element.close();
			classList.remove('overflow-hidden');
		}
	});

	return {
		destroy() {
			cleanup();
			element.removeEventListener('close', handleClose);
			classList.remove('overflow-hidden');
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
