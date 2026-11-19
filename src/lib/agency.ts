// The agency has been working since 2009: years in business and the copyright range update automatically.
export const FOUNDED_YEAR = 2009

export function currentYear(): number {
    return new Date().getFullYear()
}

// "17 лет" / "21 год" / "22 года" (ru) or "17 years" (en)
export function yearsInBusiness(locale: string): string {
    const n = currentYear() - FOUNDED_YEAR
    if (locale === 'ru') {
        const mod10 = n % 10
        const mod100 = n % 100
        const word = mod10 === 1 && mod100 !== 11 ? 'год'
            : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'года'
            : 'лет'
        return `${n} ${word}`
    }
    return `${n} ${n === 1 ? 'year' : 'years'}`
}
