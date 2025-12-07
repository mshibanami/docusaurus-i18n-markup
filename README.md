# docusaurus-i18n-markup

This is a monorepo of these packages:

- [docusaurus-plugin-write-translations-plus](./packages/docusaurus-plugin-write-translations-plus) : A Docusaurus plugin that provides `write-translations-plus` command which extends the default `write-translations` command to support additional options.
- [docusaurus-i18n-markup](./packages/docusaurus-i18n-markup): A collection of React components for Docusaurus to help with translating texts written in markup languages in Docusaurus sites. (Currently only Markdown (powered by [react-markdown](https://github.com/remarkjs/react-markdown)) is supported.)

## Why `write-translations-plus`?

The default `write-translations` command only detects `<Translate>` and `translate()`, missing custom components like `<TranslatedMarkdown>`.

`write-translations-plus` resolves this by allowing you to define **custom tag and function aliases** for extraction as aliases for `Translate` and `translate()`.

## Getting Started

1. Install the packages in your Docusaurus project:

```bash
npm install docusaurus-plugin-write-translations-plus docusaurus-i18n-markup
   # or
   pnpm add docusaurus-plugin-write-translations-plus docusaurus-i18n-markup
   # or
   yarn add docusaurus-plugin-write-translations-plus docusaurus-i18n-markup
```

## Setup

1. Add the plugin to your `docusaurus.config.js`:

   ```javascript
   module.exports = {
       // ...
       plugins: [
           'docusaurus-plugin-write-translations-plus',
       ],
   };
   ```

2. Add a script to your `package.json`:

    ```json
    {
        "scripts": {
             "write-translations": "docusaurus write-translations-plus",
        }
    }
    ```

4. Use the `TranslatedMarkdown` component in your markdown files to mark translatable content:

```jsx
import { TranslatedMarkdown } from 'docusaurus-i18n-markup';

<TranslatedMarkdown id="helloWorld" description="A greeting message.">
    Hello, **World**!
</TranslatedMarkdown>
```

5. Run `npm run write-translations` to extract translatable strings from `TranslatedMarkdown` components in your project. The extracted strings will be saved in the appropriate translation files under the `i18n` directory, for example:

    ```json
     {
          "helloWorld": {
               "message": "Hello, **World**!",
               "description": "A greeting message."
          }
     }
    ```

You can now translate the extracted strings in your translation files!

## `TranslatedMarkdown` Component

`TranslatedMarkdown` is a React component that renders translated Markdown content in `docusaurus-i18n-markup`. It uses `react-markdown` under the hood to parse and render the Markdown content.

The component accepts the following props:

| Prop              | Type                               | Description                                                                                          |
| ----------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `id`              | `string`                           | The translation key.                                                                                 |
| `description`     | `string`                           | (Optional) Description for translators.                                                              |
| `children`        | `string`                           | The default message. (Markdown)                                                                      |
| `values`          | `Record<string, string \| number>` | (Optional) Values for interpolation. Not like `Translate`'s `values`, it doesn't accept React nodes. |
| `components`      | `Record<string, any>`              | (Optional) Custom React components for Markdown elements. Passed to `react-markdown`.               |
| `markdownOptions` | `react-markdown`'s `Options`       | (Optional) Options passed to react-markdown.                                                         |

## `write-translations-plus` Command

`write-translations-plus` allows you to specify custom tag names and functions as aliases for `Translate` and `translate()` from Docusaurus, in addition to all the options provided by the default `write-translations` command.

This is the help message of the command:

```text
$ npx docusaurus write-translations-plus --help
Usage: docusaurus write-translations-plus [options] [siteDir]

Extract required translations of your site.

Options:
  -l, --locale <locale>            the locale folder to write the translations.
                                   "--locale fr" will write translations in the ./i18n/fr folder.
  --override                       By default, we only append missing translation messages to existing translation files. This option allows to
                                   override existing translation messages. Make sure to commit or backup your existing translations, as they may be
                                   overridden. (default: false)
  --config <config>                path to Docusaurus config file (default:`[siteDir]/docusaurus.config.js`)
  --messagePrefix <messagePrefix>  Allows to init new written messages with a given prefix. This might help you to highlight untranslated message
                                   by making them stand out in the UI (default: "")
  --tag-aliases <aliases...>       Extra JSX tag names to treat as translate components (example: --tag-aliases TranslatedMarkdown MyTranslate).
                                   Can be used multiple times. Default: TranslatedMarkdown
  --function-aliases <aliases...>  Extra function names to treat as translate functions (example: --function-aliases myTranslate). Can be used
                                   multiple times.
  -h, --help                       display help for command
```

Example usage in `package.json` scripts:

```json
{
    "scripts": {
        "write-translations": "docusaurus write-translations-plus --tag-aliases SomeTranslatedComponent AnotherTranslatedComponent --function-aliases myTranslateFunction"
    }
}
```

## License

This project's original code is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

In addition:

- The `write-translations-plus` command is a modification of the `write-translations` command. Its related files are located in `packages/docusaurus-plugin-write-translations-plus/src` and include code from Docusaurus, which is licensed under the MIT License. See their [LICENSE](https://github.com/facebook/docusaurus/blob/main/LICENSE) file for details.
- `TranslatedMarkdown` is a wrapper of [react-markdown](https://github.com/remarkjs/react-markdown), which is licensed under the MIT License. See their [LICENSE](https://github.com/remarkjs/react-markdown/blob/main/license) file for details.
