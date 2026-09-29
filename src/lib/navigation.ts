import { useSyncExternalStore } from 'react';

// Two routes don't justify a router dependency: this is a thin wrapper over the History API.

const NAV_EVENT = 'app:navigate';

const subscribe = (callback: () => void) => {
    window.addEventListener('popstate', callback);
    window.addEventListener(NAV_EVENT, callback);
    return () => {
        window.removeEventListener('popstate', callback);
        window.removeEventListener(NAV_EVENT, callback);
    };
};

export function usePathname(): string {
    return useSyncExternalStore(subscribe, () => window.location.pathname, () => '/');
}

export function scrollToHash(hash: string, behavior: ScrollBehavior = 'smooth') {
    const target = hash && document.getElementById(decodeURIComponent(hash.replace(/^#/, '')));
    if (target) target.scrollIntoView({ behavior, block: 'start' });
}

export function navigate(to: string) {
    const [, hash = ''] = to.split('#');
    if (to !== window.location.pathname + window.location.hash) {
        window.history.pushState(null, '', to);
        window.dispatchEvent(new Event(NAV_EVENT));
    }
    if (hash) {
        // Wait a frame so a route change has rendered its sections.
        requestAnimationFrame(() => scrollToHash(`#${hash}`));
    } else {
        window.scrollTo({ top: 0 });
    }
}
