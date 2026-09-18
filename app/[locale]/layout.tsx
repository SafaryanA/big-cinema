import type { ClientMessages } from '@/@type/translate'
import MainFooter from '@/components/shared/mainFooter'
import MobileMenu from '@/components/shared/mobileMenu'
import Header from '@/components/shared/topHeader'
import ThemeKeeper from '@/components/ui/themeKeeper'
import { routing } from '@/i18n/routing'
import type { Metadata, Viewport } from 'next'
import { THEME_COOKIE } from '@/libs/theme'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Geist, Geist_Mono } from 'next/font/google'
import { notFound } from 'next/navigation'

import '@/styles/fonts.css'
import InlineScript from '@/components/ui/inlineScript'
import '../globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export function generateStaticParams() {
	return routing.locales.map(locale => ({ locale }))
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#f3f3f6' },
		{ media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
	],
}

export const metadata: Metadata = {
	metadataBase: new URL('https://reelo.am'),
	title: {
		default: 'Reelo',
		template: '%s | Reelo',
	},
	description:
		'Watch movies, TV shows, and cartoons online in HD. A huge library of new releases and classics, easy search, and unlimited streaming with your subscription.',

	openGraph: {
		title: 'Reelo',
		description: 'Movies, TV series, and cartoons online in HD.',
		siteName: 'Reelo',
		locale: 'en_US',
		alternateLocale: ['ru_RU', 'hy_AM'],
		type: 'website',
	},
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ locale: string }>
}>) {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	setRequestLocale(locale)

	const messages: ClientMessages = await getMessages()
	const clientMessages = {
		LoginBox: messages.LoginBox,
		language: messages.language,
		Error: messages.Error,
		PopUp: messages.PopUp,
		Catalog: messages.Catalog,
		Card: messages.Card,
	}

	return (
		<html
			lang={locale}
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<head>
				<InlineScript
					html={`try{if(document.cookie.split('; ').indexOf('${THEME_COOKIE}=light')>-1)document.documentElement.dataset.theme='light'}catch(e){}`}
				/>
			</head>
			<body className='min-h-full flex flex-col'>
				<ThemeKeeper />
				<NextIntlClientProvider messages={clientMessages}>
					<Header />
					<MobileMenu />
					{children}
					<hr className='mt-12' />
					<MainFooter />
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
