import 'server-only';

const dictionaries = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    vi: () => import('./dictionaries/vi.json').then((module) => module.default),
};

export const getDictionary = async (locale: string) => {
    switch (locale) {
        case 'en':
            return await dictionaries.en();
        case 'vi':
            return await dictionaries.vi();
        default:
            return await dictionaries.vi();
    }
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
export type LoginDictionary = Dictionary['auth']['login'];
