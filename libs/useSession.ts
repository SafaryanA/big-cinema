'use client'

import { useSyncExternalStore } from 'react'
import { SESSION_COOKIE, SESSION_MAX_AGE, SIGNED_OUT } from './session'

const EVENT = 'reelo:session'

function read(): boolean {
	return !document.cookie
		.split('; ')
		.includes(`${SESSION_COOKIE}=${SIGNED_OUT}`)
}

function subscribe(onChange: () => void): () => void {
	window.addEventListener(EVENT, onChange)

	return () => window.removeEventListener(EVENT, onChange)
}

function serverRead(): boolean {
	return true
}
export function useSession(): { signedIn: boolean; signOut: () => void } {
	const signedIn = useSyncExternalStore(subscribe, read, serverRead)

	function signOut() {
		document.cookie = `${SESSION_COOKIE}=${SIGNED_OUT}; path=/; max-age=${SESSION_MAX_AGE}; samesite=lax`
		window.dispatchEvent(new Event(EVENT))
	}

	return { signedIn, signOut }
}
