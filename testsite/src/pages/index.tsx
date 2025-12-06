import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { TranslatedMarkdown } from 'docusaurus-i18n-markup';
import remarkGfm from 'remark-gfm'

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <main>
      <h1><code>TranslatedMarkdown</code> - Use cases</h1>

      <TranslatedMarkdown
        id="italicTextExample"
        description="Example of italic text">
        _This is italic text._
      </TranslatedMarkdown>

      <TranslatedMarkdown
        id="replacePWithSpan"
        description='Example of replacing <p> with <span>'
        components={{ p: 'span' }}>
        This text is wrapped in a &lt;span&gt; instead of a &lt;p&gt;.
      </TranslatedMarkdown>

      <TranslatedMarkdown
        id="customComponentExample"
        description="Example of injecting a value"
        values={{ link: "https://www.youtube.com/watch?v=0Haxy5PvCuk" }}
      >
        {'You can also [inject a link]({link}).'}
      </TranslatedMarkdown>

      <TranslatedMarkdown
        id="remarkPluginExample"
        description="Example of using remark-gfm plugin"
        markdownOptions={{ remarkPlugins: [remarkGfm] }}
      >
        {'You can specify `react-markdown` options. For example, this is table rendered with `remark-gfm` plugin:\n\n| Syntax | Description |\n| - | - |\n| Header | Title |\n| Paragraph | Text |'}
      </TranslatedMarkdown>
    </main>
  );
}
