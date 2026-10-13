import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to determine smart category & tags
function getSmartCategorization(url: string, title = '', description = '') {
  const lowerUrl = url.toLowerCase();
  const lowerText = `${title} ${description}`.toLowerCase();

  if (lowerUrl.includes('github.com')) {
    return {
      category: 'GitHub',
      suggestedTags: ['#GitHub', '#OpenSource', '#Repository'],
    };
  }

  if (
    lowerUrl.includes('threejs') ||
    lowerUrl.includes('webgl') ||
    lowerUrl.includes('spline.design') ||
    lowerText.includes('three.js') ||
    lowerText.includes('3d') ||
    lowerText.includes('webgl') ||
    lowerText.includes('shader')
  ) {
    return {
      category: '3D & Motion',
      suggestedTags: ['#ThreeJS', '#WebGL', '#3D', '#Animation'],
    };
  }

  if (
    lowerUrl.includes('shadcn') ||
    lowerUrl.includes('magicui') ||
    lowerUrl.includes('tailwind') ||
    lowerUrl.includes('radix') ||
    lowerText.includes('component') ||
    lowerText.includes('design system') ||
    lowerText.includes('ui library')
  ) {
    return {
      category: 'UI Components',
      suggestedTags: ['#UI', '#DesignSystem', '#React', '#Components'],
    };
  }

  if (
    lowerUrl.includes('cursor') ||
    lowerUrl.includes('lovable') ||
    lowerUrl.includes('bolt.new') ||
    lowerUrl.includes('v0.dev') ||
    lowerUrl.includes('replit') ||
    lowerText.includes('vibe coding') ||
    lowerText.includes('ai builder')
  ) {
    return {
      category: 'Vibe Coding',
      suggestedTags: ['#VibeCoding', '#AIBuilder', '#FullStack'],
    };
  }

  if (
    lowerUrl.includes('claude') ||
    lowerUrl.includes('chatgpt') ||
    lowerUrl.includes('openai') ||
    lowerUrl.includes('anthropic') ||
    lowerUrl.includes('perplexity') ||
    lowerUrl.includes('midjourney') ||
    lowerText.includes('artificial intelligence') ||
    lowerText.includes('llm')
  ) {
    return {
      category: 'AI Tools',
      suggestedTags: ['#AI', '#Productivity', '#LLM'],
    };
  }

  if (
    lowerText.includes('prompt') ||
    lowerUrl.includes('prompt') ||
    lowerText.includes('system prompt')
  ) {
    return {
      category: 'Prompts',
      suggestedTags: ['#Prompts', '#PromptEngineering'],
    };
  }

  if (
    lowerUrl.includes('godly') ||
    lowerUrl.includes('awwwards') ||
    lowerUrl.includes('siteinspire') ||
    lowerUrl.includes('mobbin') ||
    lowerUrl.includes('dribbble') ||
    lowerUrl.includes('lapa.ninja') ||
    lowerText.includes('inspiration') ||
    lowerText.includes('portfolio') ||
    lowerText.includes('landing page')
  ) {
    return {
      category: 'Website Inspiration',
      suggestedTags: ['#Inspiration', '#LandingPage', '#WebDesign'],
    };
  }

  return {
    category: 'Website Inspiration',
    suggestedTags: ['#Inspiration', '#Design'],
  };
}

// API endpoint to fetch link metadata cleanly and fast
app.post('/api/fetch-metadata', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'URL is required' });
    }

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    let domain = '';
    try {
      domain = new URL(targetUrl).hostname.replace(/^www\./, '');
    } catch {
      domain = targetUrl;
    }

    const favicon = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

    // Fetch site data with reasonable timeout
    let title = domain;
    let description = '';
    let ogImage = '';

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      clearTimeout(timeout);

      if (response.ok) {
        const html = await response.text();

        // Extract title
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].trim();
        }

        // Extract description
        const descMatch =
          html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i) ||
          html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i);
        if (descMatch && descMatch[1]) {
          description = descMatch[1].trim();
        }

        // Extract og:image
        const ogImageMatch =
          html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
          html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
          html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i);
        if (ogImageMatch && ogImageMatch[1]) {
          let rawImg = ogImageMatch[1].trim();
          if (rawImg.startsWith('//')) {
            rawImg = 'https:' + rawImg;
          } else if (rawImg.startsWith('/')) {
            rawImg = new URL(rawImg, targetUrl).href;
          }
          ogImage = rawImg;
        }
      }
    } catch (fetchErr) {
      // Fallback gracefully without crashing
      console.log(`Direct fetch for ${targetUrl} had notice:`, (fetchErr as any).message);
    }

    const { category, suggestedTags } = getSmartCategorization(targetUrl, title, description);

    return res.json({
      success: true,
      data: {
        url: targetUrl,
        domain,
        title,
        description,
        ogImage,
        favicon,
        category,
        suggestedTags,
      },
    });
  } catch (err: any) {
    console.error('Error fetching metadata:', err);
    return res.status(500).json({ error: 'Failed to extract metadata', details: err.message });
  }
});

// Setup Vite in development or static serve in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Stash Inspiration Library Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
