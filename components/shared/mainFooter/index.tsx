import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import style from './mainFooter.module.scss'

export default async function MainFooter() {
	const t = await getTranslations('MainFooter')
	const tLegal = await getTranslations('Legal')
	return (
		<footer
			className={`container_body flex justify-between ${style.wrapperFooter}`}
		>
			<div className={style.innerLeft}>
				<strong>{t('Contact')}</strong>
				<div className={style.phone}>
					<span>{t('Phone')}.</span>
					<a href='tel:+37498xxxxxx'>+(374)-98-xx-xx-xx</a>
				</div>
				<div className={style.email}>
					<span>{t('E-mail')}.</span>
					<a href='mailto:reelo@info.com'>reelo@info.com</a>
				</div>
			</div>
			<div className={style.innerRight}>
				<div>
					<span>&#169; </span> <span>{t('Registration')}</span>{' '}
					<span> OOO REELO</span>
				</div>
				<div className={style.blockWarning}>
					<span>
						{t('WarningFirstPart')} <span>&#174;</span>
					</span>
					<span>{t('WarningLastPart')}</span>
				</div>
			</div>

			<nav className={style.legalLinks}>
				<Link href='/user-agreement'>{tLegal('UserAgreement.title')}</Link>
				<Link href='/privacy-policy'>{tLegal('PrivacyPolicy.title')}</Link>
			</nav>
		</footer>
	)
}
