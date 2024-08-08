import { writable } from 'svelte/store';

export const isLoggedIn = writable(false);
const addresses: string[] = [];
export const loggedAddresses = writable(addresses);
export const activeAddress = writable('');
export const usedExtension = writable('');
