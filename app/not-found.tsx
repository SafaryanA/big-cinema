import Link from 'next/link'

export default function RootNotFound() {
	return (
		<html lang='en'>
			<body>
				<div className='not-found-page'>
					<div className='not-found-wrapper'>
						<div className='not-found-inner'>
							<h1 className='title'>404 — Page not found</h1>
							<Link href='/' className='main-btn'>
								Home page
							</Link>
						</div>
					</div>
				</div>
			</body>
		</html>
	)
}
