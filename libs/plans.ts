export const PLANS = ['Start', 'Pro', 'Family'] as const

export type Plan = (typeof PLANS)[number]
