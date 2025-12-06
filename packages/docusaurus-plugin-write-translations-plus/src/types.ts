import { LoadContextParams } from "./packages/docusaurus/server/site";
import { WriteTranslationsOptions } from "./packages/docusaurus/server/translations/translations";

export type WriteTranslationsCLIOptions = Pick<
    LoadContextParams,
    'config' | 'locale'
> & WriteTranslationsOptions & {
    tagAliases?: string | string[];
    functionAliases?: string | string[];
};
