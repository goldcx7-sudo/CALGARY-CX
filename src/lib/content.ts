import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

// ── Articles ──────────────────────────────────────────────
export interface Article {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  category: string;
  categoryLabel: string;
  readTime: string;
  author: string;
  featured: boolean;
  content: string;
}

export function getAllArticles(): Article[] {
  const dir = join(process.cwd(), 'src/content/articles');
  return readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(file => {
      const { data, content } = matter(readFileSync(join(dir, file), 'utf-8'));
      return {
        slug: file.replace('.md', ''),
        title: data.title,
        description: data.description,
        pubDate: new Date(data.pubDate),
        category: data.category,
        categoryLabel: data.categoryLabel,
        readTime: data.readTime,
        author: data.author ?? 'Calgary CX Editorial',
        featured: data.featured ?? false,
        content,
      } as Article;
    })
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

export function getArticleBySlug(slug: string) {
  return getAllArticles().find(a => a.slug === slug);
}

// ── Videos ───────────────────────────────────────────────
export interface Video {
  slug: string;
  title: string;
  description: string;
  pubDate: Date;
  youtubeId: string;       // just the YouTube video ID e.g. "dQw4w9WgXcQ"
  duration: string;        // e.g. "12:34"
  category: string;
  categoryLabel: string;
  featured: boolean;
}

export function getAllVideos(): Video[] {
  const dir = join(process.cwd(), 'src/content/videos');
  try {
    return readdirSync(dir)
      .filter(f => f.endsWith('.md'))
      .map(file => {
        const { data } = matter(readFileSync(join(dir, file), 'utf-8'));
        return {
          slug: file.replace('.md', ''),
          title: data.title,
          description: data.description,
          pubDate: new Date(data.pubDate),
          youtubeId: data.youtubeId,
          duration: data.duration ?? '',
          category: data.category,
          categoryLabel: data.categoryLabel,
          featured: data.featured ?? false,
        } as Video;
      })
      .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  } catch {
    return [];
  }
}

export function getVideoBySlug(slug: string) {
  return getAllVideos().find(v => v.slug === slug);
}

// ── Categories ────────────────────────────────────────────
export const CATEGORIES = [
  { slug: 'ccaas',      label: 'CCaaS',                 description: 'Cloud contact center platforms, migrations, and vendor evaluations.' },
  { slug: 'cx-ai',      label: 'CX AI',                 description: 'Artificial intelligence applied to customer experience functions.' },
  { slug: 'ai-agents',  label: 'AI Agents',             description: 'Autonomous AI agents for voice and digital customer interactions.' },
  { slug: 'wfo',        label: 'Workforce Optimization', description: 'WFM, QM, analytics, and agent performance management.' },
  { slug: 'strategy',   label: 'CX Strategy',           description: 'Thought leadership on CX operating models and leadership.' },
  { slug: 'ops',        label: 'CX Operations',         description: 'Day-to-day contact center operations and managed services.' },
];

// ── Helpers ───────────────────────────────────────────────
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function youtubeThumbnail(id: string): string {
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}

export function youtubeEmbed(id: string): string {
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`;
}
