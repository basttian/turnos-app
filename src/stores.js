import { readable, derived, writable } from 'svelte/store';

export const time = readable(new Date(), function start(set) {
	const interval = setInterval(() => {
		set(new Date());
    }, 1000);
    return function stop() {
		clearInterval(interval);
	};
});

export const count = writable(0);