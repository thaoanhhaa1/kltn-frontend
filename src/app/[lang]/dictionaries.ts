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
export type RegisterDictionary = Dictionary['auth']['register'];
export type AccountTypeDictionary = Dictionary['account_type'];
export type HeaderDictionary = Dictionary['header'];
export type ModeDictionary = Dictionary['mode'];
export type SidebarDictionary = Dictionary['sidebar'];
export type UserDashboardDictionary = Dictionary['user-dashboard'];
export type PropertyDashboardDictionary = Dictionary['property-dashboard'];
export type OwnerSidebarDictionary = Dictionary['owner-sidebar'];
export type PropertyOwnerDictionary = Dictionary['property-owner'];
export type AddPropertyDictionary = Dictionary['add-property'];
