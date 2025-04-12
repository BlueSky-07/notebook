import { marked } from 'marked';
import * as cheerio from 'cheerio';

export async function extractImageLinksFromMarkdown(
  markdown: string = '',
): Promise<string[]> {
  const html = await marked.parse(markdown);
  const $ = cheerio.load(html);
  const images = $('img').map((_, img) => $(img).attr('src'));
  return images.get();
}
