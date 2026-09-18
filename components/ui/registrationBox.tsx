'use client'

import type { AuthMessage, RegistrationBoxProps } from '@/@type/auth'
import AuthOverlay from '@/components/shared/authOverlay'
import FieldError from '@/components/shared/authOverlay/FieldError'
import FormStatus from '@/components/shared/authOverlay/FormStatus'
import { Link } from '@/i18n/routing'
import { registerAction } from '@/libs/actions/auth'
import { applyServerErrors } from '@/libs/applyServerErrors'
import {
	MIN_LOGIN,
	MIN_PASSWORD,
	registrationSchema,
	type RegistrationValues,
} from '@/libs/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function RegistrationBox({
	closeHref = '/',
}: RegistrationBoxProps) {
	const t = useTranslations('LoginBox')
	const [status, setStatus] = useState<AuthMessage | null>(null)

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<RegistrationValues>({
		resolver: zodResolver(registrationSchema),
		defaultValues: { acceptTerms: false },
	})

	const onSubmit = handleSubmit(
		async values => {
			const state = await registerAction(values)

			setStatus(state.error)
			applyServerErrors(state, setError)
		},
		() => setStatus('errorCheckFields'),
	)

	return (
		<AuthOverlay title={t('registration')} closeHref={closeHref}>
			<form className='login-form' onSubmit={onSubmit} noValidate>
				<label htmlFor='input-login'>{t('login')}: </label>
				<input
					id='input-login'
					type='text'
					autoComplete='username'
					minLength={MIN_LOGIN}
					aria-describedby='login-error'
					aria-invalid={Boolean(errors.login)}
					{...register('login')}
				/>
				<FieldError field='login' message={errors.login?.message} />

				<label htmlFor='input-password'>{t('password')}:</label>
				<input
					id='input-password'
					type='password'
					autoComplete='new-password'
					minLength={MIN_PASSWORD}
					aria-describedby='password-error'
					aria-invalid={Boolean(errors.password)}
					{...register('password')}
				/>
				<FieldError field='password' message={errors.password?.message} />

				<label htmlFor='input-confirm-password'>{t('confirmPassword')}:</label>
				<input
					id='input-confirm-password'
					type='password'
					autoComplete='new-password'
					minLength={MIN_PASSWORD}
					aria-describedby='confirmPassword-error'
					aria-invalid={Boolean(errors.confirmPassword)}
					{...register('confirmPassword')}
				/>
				<FieldError
					field='confirmPassword'
					message={errors.confirmPassword?.message}
				/>

				<label htmlFor='input-email'>{t('email')}:</label>
				<input
					id='input-email'
					type='email'
					autoComplete='email'
					aria-describedby='email-error'
					aria-invalid={Boolean(errors.email)}
					{...register('email')}
				/>
				<FieldError field='email' message={errors.email?.message} />

				<label className='input-elses-computer'>
					<input type='checkbox' {...register('acceptTerms')} />
					<p>
						<Link href='/privacy-policy'>
							{t('PrivacyPolicy')} {t('and')}
						</Link>
						<Link href='/user-agreement'>{t('UserAgreement')}</Link>
					</p>
				</label>
				<FieldError field='acceptTerms' message={errors.acceptTerms?.message} />

				<FormStatus message={status} pending={isSubmitting} />

				<div className='auth-links'>
					<Link href='/login'>{t('loginSite')}</Link>
				</div>

				<button
					className='btn-registration'
					type='submit'
					disabled={isSubmitting}
				>
					{isSubmitting ? t('sending') : t('registration')}
				</button>
			</form>
		</AuthOverlay>
	)
}
