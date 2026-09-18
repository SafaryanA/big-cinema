'use client'

import type { AuthMessage, ProfileBoxProps } from '@/@type/auth'
import AuthOverlay from '@/components/shared/authOverlay'
import FieldError from '@/components/shared/authOverlay/FieldError'
import FormStatus from '@/components/shared/authOverlay/FormStatus'
import { Link } from '@/i18n/routing'
import { profileAction } from '@/libs/actions/auth'
import { applyServerErrors } from '@/libs/applyServerErrors'
import { PLANS } from '@/libs/plans'
import { profileSchema, type ProfileValues } from '@/libs/schemas/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function ProfileBox({ closeHref = '/', user }: ProfileBoxProps) {
	const t = useTranslations('LoginBox')
	const [status, setStatus] = useState<AuthMessage | null>(null)

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<ProfileValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			name: user.name,
			login: user.login,
			email: user.email,
			password: '',
			confirmPassword: '',
		},
	})

	const onSubmit = handleSubmit(
		async values => {
			const state = await profileAction(values)

			setStatus(state.error)
			applyServerErrors(state, setError)
		},
		() => setStatus('errorCheckFields'),
	)

	return (
		<AuthOverlay title={t('profile')} closeHref={closeHref}>
			<div className='profile-plans'>
				{PLANS.map(plan =>
					plan === user.plan ? (
						<span
							key={plan}
							className='profile-plan profile-plan_active'
							aria-current='true'
						>
							{plan}
						</span>
					) : (
						<Link key={plan} href='/subscription' className='profile-plan'>
							{plan}
						</Link>
					),
				)}
			</div>

			<form className='login-form' onSubmit={onSubmit} noValidate>
				<label htmlFor='input-name'>{t('name')}: </label>
				<input
					id='input-name'
					type='text'
					autoComplete='name'
					aria-describedby='name-error'
					aria-invalid={Boolean(errors.name)}
					{...register('name')}
				/>
				<FieldError field='name' message={errors.name?.message} />

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

				<label htmlFor='input-password'>
					{`${t('change')} ${t('password')}`}:
				</label>
				<input
					id='input-password'
					type='password'
					autoComplete='new-password'
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
					aria-describedby='confirmPassword-error'
					aria-invalid={Boolean(errors.confirmPassword)}
					{...register('confirmPassword')}
				/>
				<FieldError
					field='confirmPassword'
					message={errors.confirmPassword?.message}
				/>

				<FormStatus message={status} pending={isSubmitting} />

				<button
					className='btn-registration'
					type='submit'
					disabled={isSubmitting}
				>
					{isSubmitting ? t('sending') : t('save')}
				</button>
			</form>
		</AuthOverlay>
	)
}
