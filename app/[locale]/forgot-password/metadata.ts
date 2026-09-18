import type { PageContent, SiteLocale } from '@/@type/metadataLib'
export const CONTENT: Record<SiteLocale, PageContent> = {
	en: {
		title: 'Password Recovery',
		description:
			'Set a new password for your Reelo account: enter your login, then the new password twice.',
		ogTitle: 'Reelo Password Recovery',
		ogDescription:
			'Forgot your Reelo password? Set a new one and get back to watching.',
	},
	ru: {
		title: 'Восстановление пароля',
		description:
			'Задайте новый пароль для аккаунта Рилло: укажите логин и дважды введите новый пароль.',
		ogTitle: 'Восстановление пароля в Рилло',
		ogDescription:
			'Забыли пароль от Рилло? Задайте новый и вернитесь к просмотру.',
	},
	hy: {
		title: 'Գաղտնաբառի վերականգնում',
		description:
			'Սահմանեք նոր գաղտնաբառ Ռիլլո հաշվի համար՝ նշեք մուտքանունը և երկու անգամ մուտքագրեք նոր գաղտնաբառը:',
		ogTitle: 'Ռիլլո գաղտնաբառի վերականգնում',
		ogDescription:
			'Մոռացե՞լ եք Ռիլլոյի գաղտնաբառը: Սահմանեք նորը և վերադարձեք դիտմանը:',
	},
}
