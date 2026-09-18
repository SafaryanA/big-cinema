'use client'

import type { UserAreaProps } from '@/@type/auth'
import Dropdowns from '@/components/shared/dropDowns'
import { Link, useRouter } from '@/i18n/routing'
import { useSession } from '@/libs/useSession'
import Image from 'next/image'

export default function UserArea({
	profileLabel,
	logoutLabel,
	loginLabel,
	className,
}: UserAreaProps) {
	const { signedIn, signOut } = useSession()
	const router = useRouter()

	if (!signedIn) {
		return (
			<Link href='/login' className={className}>
				<span className='img-wrapper'>
					<Image src='/icons/login.svg' width={20} height={25} alt='' />
				</span>
				<span>{loginLabel}</span>
			</Link>
		)
	}

	return (
		<div className='user-dropdown'>
			<Dropdowns
				classStyle='right'
				trigger={{
					icon: '/icons/user.svg',
					alt: profileLabel,
					iconWidth: 20,
					iconHeight: 27,
				}}
				items={[
					{
						label: profileLabel,
						icon: '/icons/user.svg',
						iconWidth: 20,
						iconHeight: 27,
						href: '/profile',
					},
					{
						label: logoutLabel,
						icon: '/icons/logout.svg',
						iconWidth: 20,
						iconHeight: 23,
						onSelect: () => {
							signOut()
							router.refresh()
							router.push('/')
						},
					},
				]}
			/>
		</div>
	)
}
