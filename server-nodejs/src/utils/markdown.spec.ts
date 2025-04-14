import { extractImageLinksFromMarkdown } from './markdown';

describe('test markdown utils', () => {
  test('extractImageLinksFromMarkdown', async () => {
    const markdown = `# h1
## h2

link: [](markdown.png), image: ![](markdown.jpg)
\`\`\`text
![](markdown.bmp)
\`\`\`
`;
    expect(await extractImageLinksFromMarkdown(markdown)).toEqual([
      'markdown.jpg',
    ]);
  });
});
