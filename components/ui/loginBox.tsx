'use client'

import type { AuthMessage, LoginBoxProps } from '@/@type/auth'
import AuthOverlay from '@/components/shared/authOverlay'
import FieldError from '@/components/shared/authOverlay/FieldError'
import FormStatus from '@/components/shared/authOverlay/FormStatus'
import { Link } from '@/i18n/routing'
import { loginAction } from '@/libs/actions/auth'
import { applyServerErrors } from '@/libs/applyServerErrors'
import { loginSchema, type LoginValues } from '@/libs/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function LoginBox({ closeHref = '/' }: LoginBoxProps) {
	const t = useTranslations('LoginBox')
	const [status, setStatus] = useState<AuthMessage | null>(null)

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

	const onSubmit = handleSubmit(
		async values => {
			const state = await loginAction(values)

			setStatus(state.error)
			applyServerErrors(state, setError)
		},
		() => setStatus('errorCheckFields'),
	)

	return (
		<AuthOverlay title={t('authorization')} closeHref={closeHref}>
			<form className='login-form' onSubmit={onSubmit} noValidate>
				<label htmlFor='input-login'>{t('login')}: </label>
				<input
					id='input-login'
					type='text'
					autoComplete='username'
					aria-describedby='login-error'
					aria-invalid={Boolean(errors.login)}
					{...register('login')}
				/>
				<FieldError field='login' message={errors.login?.message} />

				<label htmlFor='input-password'>{t('password')}:</label>
				<input
					id='input-password'
					type='password'
					autoComplete='current-password'
					aria-describedby='password-error'
					aria-invalid={Boolean(errors.password)}
					{...register('password')}
				/>
				<FieldError field='password' message={errors.password?.message} />

				<label className='input-elses-computer'>
					<input type='checkbox' {...register('elsesComputer')} />{' '}
					{t('elsesComputer')} ?
				</label>

				<FormStatus message={status} pending={isSubmitting} />

				<div className='auth-links'>
					<Link href='/registration'>{t('registration')}</Link>
					<Link href='/forgot-password'>{t('forgotPassword')}</Link>
				</div>

				<button
					className='btn-registration'
					type='submit'
					disabled={isSubmitting}
				>
					{isSubmitting ? t('sending') : t('loginSite')}
				</button>
			</form>
		</AuthOverlay>
	)
}
