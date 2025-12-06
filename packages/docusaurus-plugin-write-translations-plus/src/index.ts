import { writeTranslations } from './utils/writeTranslations';
import { Plugin, LoadContext } from "@docusaurus/types"
import { CommanderStatic } from "commander";
import { WriteTranslationsCLIOptions } from './types';

export default function myPlugin(
    context: LoadContext,
    options: WriteTranslationsCLIOptions
): Plugin {
    return {
        name: 'docusaurus-markdown-i18n/write-translations-plus',

        extendCli(cli: CommanderStatic) {
            cli
                .command('write-translations-plus [siteDir]')
                .description('Extract required translations of your site.')
                .option(
                    '-l, --locale <locale>',
                    'the locale folder to write the translations.\n"--locale fr" will write translations in the ./i18n/fr folder.',
                )
                .option(
                    '--override',
                    'By default, we only append missing translation messages to existing translation files. This option allows to override existing translation messages. Make sure to commit or backup your existing translations, as they may be overridden. (default: false)',
                )
                .option(
                    '--config <config>',
                    'path to Docusaurus config file (default:`[siteDir]/docusaurus.config.js`)',
                )
                .option(
                    '--messagePrefix <messagePrefix>',
                    'Allows to init new written messages with a given prefix. This might help you to highlight untranslated message by making them stand out in the UI (default: "")',
                )
                .option(
                    '--tag-aliases <aliases...>',
                    'Extra JSX tag names to treat as translate components (example: --tag-aliases TranslatedMarkdown MyTranslate). Can be used multiple times. Default: TranslatedMarkdown',
                )
                .option(
                    '--function-aliases <aliases...>',
                    'Extra function names to treat as translate functions (example: --function-aliases myTranslate). Can be used multiple times.',
                )
                .action(writeTranslations);
        },
    }
}
