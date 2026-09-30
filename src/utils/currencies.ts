export type CurrencyGroup = 'Popular' | 'Africa' | 'Asia & Middle East' | 'Europe, Americas & Pacific';

export interface CurrencyInfo {
    code: string;
    name: string;
    /** Printed before the amount. Letter symbols (e.g. "KSh") get a space after them. */
    symbol: string;
    /** Minor units per ISO 4217 (JPY has none, so ¥1,000 not ¥1,000.00). */
    decimals: 0 | 2;
    group: CurrencyGroup;
    /** Extra search terms, mostly country names. */
    keywords: string;
    /** Symbol needs the fallback font (Inter and Geist draw these poorly or not at all). */
    fallbackFont?: boolean;
}

// The first five are the original currencies and stay first; NGN is the default.
export const CURRENCIES = [
    { code: 'NGN', name: 'Nigerian naira', symbol: '₦', decimals: 2, group: 'Popular', keywords: 'nigeria', fallbackFont: true },
    { code: 'USD', name: 'US dollar', symbol: '$', decimals: 2, group: 'Popular', keywords: 'united states america usa' },
    { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, group: 'Popular', keywords: 'europe eurozone germany france spain italy netherlands ireland portugal belgium' },
    { code: 'GBP', name: 'British pound', symbol: '£', decimals: 2, group: 'Popular', keywords: 'united kingdom uk britain england scotland wales sterling' },
    { code: 'JPY', name: 'Japanese yen', symbol: '¥', decimals: 0, group: 'Popular', keywords: 'japan' },

    { code: 'GHS', name: 'Ghanaian cedi', symbol: 'GH₵', decimals: 2, group: 'Africa', keywords: 'ghana', fallbackFont: true },
    { code: 'KES', name: 'Kenyan shilling', symbol: 'KSh', decimals: 2, group: 'Africa', keywords: 'kenya' },
    { code: 'ZAR', name: 'South African rand', symbol: 'R', decimals: 2, group: 'Africa', keywords: 'south africa' },
    { code: 'EGP', name: 'Egyptian pound', symbol: 'E£', decimals: 2, group: 'Africa', keywords: 'egypt' },
    { code: 'XOF', name: 'West African CFA franc', symbol: 'CFA', decimals: 0, group: 'Africa', keywords: "senegal ivory coast cote d'ivoire benin burkina faso mali niger togo guinea-bissau" },
    { code: 'XAF', name: 'Central African CFA franc', symbol: 'FCFA', decimals: 0, group: 'Africa', keywords: 'cameroon gabon chad congo equatorial guinea central african republic' },
    { code: 'UGX', name: 'Ugandan shilling', symbol: 'USh', decimals: 0, group: 'Africa', keywords: 'uganda' },
    { code: 'TZS', name: 'Tanzanian shilling', symbol: 'TSh', decimals: 2, group: 'Africa', keywords: 'tanzania' },
    { code: 'RWF', name: 'Rwandan franc', symbol: 'FRw', decimals: 0, group: 'Africa', keywords: 'rwanda' },
    { code: 'ETB', name: 'Ethiopian birr', symbol: 'Br', decimals: 2, group: 'Africa', keywords: 'ethiopia' },
    { code: 'MAD', name: 'Moroccan dirham', symbol: 'MAD', decimals: 2, group: 'Africa', keywords: 'morocco' },
    { code: 'ZMW', name: 'Zambian kwacha', symbol: 'ZK', decimals: 2, group: 'Africa', keywords: 'zambia' },

    { code: 'AED', name: 'UAE dirham', symbol: 'AED', decimals: 2, group: 'Asia & Middle East', keywords: 'united arab emirates uae dubai abu dhabi' },
    { code: 'SAR', name: 'Saudi riyal', symbol: 'SAR', decimals: 2, group: 'Asia & Middle East', keywords: 'saudi arabia' },
    { code: 'QAR', name: 'Qatari riyal', symbol: 'QAR', decimals: 2, group: 'Asia & Middle East', keywords: 'qatar doha' },
    { code: 'INR', name: 'Indian rupee', symbol: '₹', decimals: 2, group: 'Asia & Middle East', keywords: 'india', fallbackFont: true },
    { code: 'PKR', name: 'Pakistani rupee', symbol: 'Rs', decimals: 2, group: 'Asia & Middle East', keywords: 'pakistan' },
    { code: 'CNY', name: 'Chinese yuan', symbol: 'CN¥', decimals: 2, group: 'Asia & Middle East', keywords: 'china renminbi rmb' },
    { code: 'HKD', name: 'Hong Kong dollar', symbol: 'HK$', decimals: 2, group: 'Asia & Middle East', keywords: 'hong kong' },
    { code: 'SGD', name: 'Singapore dollar', symbol: 'S$', decimals: 2, group: 'Asia & Middle East', keywords: 'singapore' },
    { code: 'MYR', name: 'Malaysian ringgit', symbol: 'RM', decimals: 2, group: 'Asia & Middle East', keywords: 'malaysia' },
    { code: 'IDR', name: 'Indonesian rupiah', symbol: 'Rp', decimals: 2, group: 'Asia & Middle East', keywords: 'indonesia' },
    { code: 'PHP', name: 'Philippine peso', symbol: '₱', decimals: 2, group: 'Asia & Middle East', keywords: 'philippines', fallbackFont: true },
    { code: 'KRW', name: 'South Korean won', symbol: '₩', decimals: 0, group: 'Asia & Middle East', keywords: 'south korea', fallbackFont: true },

    { code: 'CHF', name: 'Swiss franc', symbol: 'CHF', decimals: 2, group: 'Europe, Americas & Pacific', keywords: 'switzerland liechtenstein' },
    { code: 'CAD', name: 'Canadian dollar', symbol: 'CA$', decimals: 2, group: 'Europe, Americas & Pacific', keywords: 'canada' },
    { code: 'AUD', name: 'Australian dollar', symbol: 'A$', decimals: 2, group: 'Europe, Americas & Pacific', keywords: 'australia' },
    { code: 'NZD', name: 'New Zealand dollar', symbol: 'NZ$', decimals: 2, group: 'Europe, Americas & Pacific', keywords: 'new zealand' },
    { code: 'BRL', name: 'Brazilian real', symbol: 'R$', decimals: 2, group: 'Europe, Americas & Pacific', keywords: 'brazil' },
    { code: 'MXN', name: 'Mexican peso', symbol: 'MX$', decimals: 2, group: 'Europe, Americas & Pacific', keywords: 'mexico' },
] as const satisfies readonly CurrencyInfo[];

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];

export const DEFAULT_CURRENCY: CurrencyCode = 'NGN';

const BY_CODE = new Map<string, CurrencyInfo>(CURRENCIES.map((c) => [c.code, c]));

/** Unknown codes (e.g. from an old or edited draft) fall back to naira rather than crashing. */
export const getCurrency = (code: string): CurrencyInfo => BY_CODE.get(code) ?? BY_CODE.get(DEFAULT_CURRENCY)!;

export const isCurrencyCode = (code: string): code is CurrencyCode => BY_CODE.has(code);

const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Filters by code, name, symbol or country; exact and prefix code matches rank first. */
export const searchCurrencies = (query: string): CurrencyInfo[] => {
    const q = normalize(query.trim());
    if (!q) return [...CURRENCIES];
    const rank = (c: CurrencyInfo) => {
        const code = c.code.toLowerCase();
        if (code === q) return 0;
        if (code.startsWith(q)) return 1;
        if (normalize(c.name).startsWith(q)) return 2;
        return 3;
    };
    return CURRENCIES.filter((c) =>
        [c.code, c.name, c.symbol, c.keywords].some((field) => normalize(field).includes(q))
    ).sort((a, b) => rank(a) - rank(b));
};
