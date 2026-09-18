'use client'

import type { GlobalErrorProps } from '@/@type/ui'
export default function GlobalError({
	error,
	unstable_retry,
}: GlobalErrorProps) {
	return (
		<html lang='en'>
			<body>
				<div style={{ padding: '80px 20px', textAlign: 'center' }}>
					<h1>Something went wrong</h1>
					<p>The application failed to load.</p>
					{error.digest && <p>Error ID: {error.digest}</p>}
					<button type='button' onClick={() => unstable_retry()}>
						Try again
					</button>
				</div>
			</body>
		</html>
	)
}
