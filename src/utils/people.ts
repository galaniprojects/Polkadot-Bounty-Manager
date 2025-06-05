import { writable } from 'svelte/store';
import { type createPeopleTypedApi } from './createPeopleTypedApi';

export const peopleApi = new Map<string, Awaited<ReturnType<typeof createPeopleTypedApi>>>();

export const names = writable<Record<string, string>>({});
