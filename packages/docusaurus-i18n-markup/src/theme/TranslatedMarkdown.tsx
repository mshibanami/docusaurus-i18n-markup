import React, { ReactNode } from 'react';
import { translate, TranslateProps } from '@docusaurus/Translate';
import ReactMarkdown from 'react-markdown';
import type { Options } from 'react-markdown';
import Link from '@docusaurus/Link';

// Runtime sanity checks to catch broken interop early during SSR / client builds
if (typeof ReactMarkdown !== 'function' && typeof ReactMarkdown !== 'object') {
    console.error(
        '[docusaurus-i18n-markup] ReactMarkdown appears to be an unexpected type:',
        typeof ReactMarkdown,
        ReactMarkdown,
    );
}
if (Link && typeof Link !== 'function' && typeof Link !== 'object') {
    console.error(
        '[docusaurus-i18n-markup] Link appears to be an unexpected type:',
        typeof Link,
        Link,
    );
}

export type TranslatedMarkdownProps = Omit<TranslateProps<string>, 'values' | 'id'> & {
    id: string;
    values?: Record<string, string | number>;
    components?: Record<string, any>;
    markdownOptions?: Options;
}

export function TranslatedMarkdown({
    id,
    values,
    components,
    children,
    markdownOptions,
}: TranslatedMarkdownProps): ReactNode {
    const markdown = translate({ id, message: children }, values);

    return (
        <ReactMarkdown
            components={{
                a: ({ href, children, ...props }: any) => {
                    if (!href) return <a {...props}>{children}</a>;
                    // internal links -> Docusaurus Link
                    if (href.startsWith('/') || href.startsWith('#') || href.startsWith('pathname://')) {
                        const linkProps = props as React.ComponentProps<typeof Link>;
                        return <Link to={href} {...linkProps}>{children}</Link>;

                    }
                    // external link
                    return (
                        <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
                            {children}
                        </a>
                    );
                },
                ...components,
            }}
            {...markdownOptions}
        >
            {markdown}
        </ReactMarkdown>
    );
};
