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

// Shared Gemini AI Client instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Semantic synonym dictionary for high-quality fallback and fuzzy search
const SYNONYM_MAP: Record<string, string[]> = {
  inspo: ['inspiration', 'inspo', 'gallery', 'showcase', 'archive', 'design'],
  mobile: ['mobile', 'appshot', 'appstore', 'ios', 'android', 'phone', 'device', 'responsive'],
  screen: ['screen', 'screenshot', 'ui', 'interface', 'surface', 'layout', 'pattern'],
  screens: ['screen', 'screenshot', 'ui', 'interface', 'surface', 'layout'],
  app: ['app', 'application', 'appstore', 'mobile', 'ios', 'android', 'product'],
  apps: ['app', 'application', 'appstore', 'mobile', 'ios', 'android', 'product'],
  vibe: ['vibe', 'vibecoding', 'cursor', 'claude', 'lovable', 'bolt', 'v0'],
  prompt: ['prompt', 'prompts', 'vibeprompts', 'system', 'instructions', 'claude', 'cursor'],
  prompts: ['prompt', 'prompts', 'vibeprompts', 'system', 'instructions', 'claude', 'cursor'],
  threejs: ['threejs', 'three', 'three.js', 'webgl', '3d', 'shader', 'canvas'],
  '3d': ['3d', 'threejs', 'three', 'three.js', 'webgl', 'shader', 'canvas', 'mesh', 'spline'],
  motion: ['motion', 'animation', 'animate', 'animista', 'transition', 'spring', 'gsap'],
  animation: ['animation', 'motion', 'animate', 'animista', 'transition', 'keyframes'],
  sound: ['sound', 'audio', 'sfx', 'uisfx', 'sound-library', 'haptic', 'noise'],
  audio: ['sound', 'audio', 'sfx', 'uisfx', 'sound-library'],
  loader: ['loader', 'loaders', 'loading', 'spinner', 'circleloader', 'progress', 'circleloaders'],
  loaders: ['loader', 'loaders', 'loading', 'spinner', 'circleloader', 'progress', 'circleloaders'],
  icon: ['icon', 'icons', '3dicons', 'svg', 'glyph', 'symbol'],
  icons: ['icon', 'icons', '3dicons', 'svg', 'glyph', 'symbol'],
  component: ['component', 'components', 'ui', 'kit', 'library', 'radix', 'shadcn', 'tailwind'],
  components: ['component', 'components', 'ui', 'kit', 'library', 'radix', 'shadcn', 'tailwind'],
  repo: ['repo', 'repository', 'github', 'git', 'opensource', 'code'],
  repository: ['repo', 'repository', 'github', 'git', 'opensource', 'code'],
  landing: ['landing', 'landingpage', 'homepage', 'marketing', 'showcase'],
  design: ['design', 'ui', 'ux', 'inspiration', 'style', 'system'],
  cursor: ['cursor', 'cursor-lab', 'vibe', 'vibecoding', 'ai', 'claude'],
};

// Fallback semantic search ranker
function performSemanticTokenSearch(query: string, candidateLinks: any[]) {
  const queryTokens = query.toLowerCase().replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(Boolean);
  if (queryTokens.length === 0) {
    return {
      matchedLinkIds: [],
      relevanceReasons: {},
      summary: 'No query provided.',
      suggestedQueries: ['Mobile screen inspo', 'Vibe coding prompts', '3D WebGL experiments'],
    };
  }

  // Expand each token to its synonym list
  const expandedTokenGroups = queryTokens.map((token) => {
    const list = new Set<string>([token]);
    // check prefix match in synonym map
    for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
      if (key === token || key.startsWith(token) || token.startsWith(key)) {
        synonyms.forEach((s) => list.add(s));
      }
    }
    return Array.from(list);
  });

  const scored = candidateLinks.map((link) => {
    let score = 0;
    const reasons: string[] = [];

    const titleLower = (link.title || '').toLowerCase();
    const descLower = (link.description || '').toLowerCase();
    const domainLower = (link.domain || '').toLowerCase();
    const notesLower = (link.notes || '').toLowerCase();
    const catLower = (link.category || '').toLowerCase();
    const tagsLower = Array.isArray(link.tags) ? link.tags.join(' ').toLowerCase() : '';
    const promptLower = (link.vibeCodePrompt || '').toLowerCase();

    const fullBlob = `${titleLower} ${descLower} ${domainLower} ${notesLower} ${catLower} ${tagsLower} ${promptLower}`;

    // Test token groups
    let matchedGroupCount = 0;
    for (const group of expandedTokenGroups) {
      let groupMatched = false;
      for (const synonym of group) {
        if (titleLower.includes(synonym)) {
          score += 15;
          groupMatched = true;
          reasons.push(`matches "${synonym}" in title`);
          break;
        } else if (tagsLower.includes(synonym)) {
          score += 12;
          groupMatched = true;
          reasons.push(`tagged with #${synonym}`);
          break;
        } else if (descLower.includes(synonym)) {
          score += 8;
          groupMatched = true;
          reasons.push(`matches description`);
          break;
        } else if (notesLower.includes(synonym)) {
          score += 6;
          groupMatched = true;
          reasons.push(`notes match "${synonym}"`);
          break;
        } else if (fullBlob.includes(synonym)) {
          score += 4;
          groupMatched = true;
          break;
        }
      }
      if (groupMatched) matchedGroupCount++;
    }

    // Heavy boost if multiple tokens matched
    if (matchedGroupCount === expandedTokenGroups.length) {
      score += 30; // matched all user intent concepts
    } else if (matchedGroupCount > 0) {
      score += matchedGroupCount * 10;
    }

    return {
      link,
      score,
      matchedGroupCount,
    };
  });

  const matches = scored
    .filter((item) => item.score > 12)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  const matchedLinkIds = matches.map((m) => m.link.id);
  const relevanceReasons: Record<string, string> = {};

  matches.forEach((m) => {
    const l = m.link;
    if (l.domain?.includes('appshot') || l.title?.toLowerCase().includes('appshot')) {
      relevanceReasons[l.id] = 'Dedicated archive of mobile App Store screenshots, iOS/Android device screens, and mobile onboarding UI patterns.';
    } else if (l.domain?.includes('kage') || l.title?.toLowerCase().includes('kage')) {
      relevanceReasons[l.id] = 'Curated showcase of real-world mobile and web product interfaces, flows, and interactive layouts.';
    } else if (l.domain?.includes('vibeprompts')) {
      relevanceReasons[l.id] = 'Curated library of ready-to-use UI layout prompts and Tailwind snippets for AI coding agents.';
    } else if (l.domain?.includes('designmd')) {
      relevanceReasons[l.id] = 'Community DESIGN.md style guides and design systems specifically tailored for Cursor, Claude Code, and Lovable.';
    } else if (l.domain?.includes('3dicons')) {
      relevanceReasons[l.id] = 'Open-source library of 3D icons and visual assets ready for mobile screens and web apps.';
    } else if (l.domain?.includes('circleloaders')) {
      relevanceReasons[l.id] = 'Collection of pure CSS & SVG circular loading spinners and animated progress indicators.';
    } else {
      relevanceReasons[l.id] = `${l.title || l.domain} (${l.category || 'Library'}) — ${l.description?.slice(0, 100) || 'Relevant match for query'}`;
    }
  });

  const topTitles = matches.slice(0, 3).map((m) => m.link.title || m.link.domain).join(', ');
  const summary =
    matches.length > 0
      ? `Found ${matches.length} relevant resource${matches.length === 1 ? '' : 's'} matching "${query}". Top recommendations: ${topTitles}.`
      : `No direct matches for "${query}". Try searching for categories like Mobile UI, Prompts, 3D, or Components.`;

  return {
    matchedLinkIds,
    relevanceReasons,
    summary,
    suggestedQueries: [
      'Mobile screen inspo',
      'Vibe coding tools for Cursor',
      '3D WebGL animations',
      'UI component libraries',
    ],
  };
}

// AI Smart Search & Librarian Endpoint
app.post('/api/ai-search', async (req, res) => {
  try {
    const { query, links } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const trimmedQuery = query.trim();
    const candidateLinks = Array.isArray(links) ? links : [];

    // Compact candidate representation to keep prompt tight and fast
    const compactLinks = candidateLinks.map((l: any) => ({
      id: l.id,
      title: l.title || '',
      domain: l.domain || '',
      description: l.description || '',
      category: l.category || '',
      tags: l.tags || [],
      notes: l.notes || '',
      vibeCodePrompt: l.vibeCodePrompt || '',
    }));

    let aiResult: any = null;

    if (process.env.GEMINI_API_KEY && compactLinks.length > 0) {
      try {
        const prompt = `You are the intelligent semantic curator for "Stash", a personal bookmarking and inspiration library for designers, vibe coders, and frontend architects.

User Query: "${trimmedQuery}"

Saved Library Items (${compactLinks.length} items):
${JSON.stringify(compactLinks)}

Task:
1. Deeply understand the user's intent, synonyms, and sub-genres. For example:
   - "mobile screen inspo" or "mobile UI screens" specifically matches items like "APPSHOT.GALLERY" (App Store screenshot inspiration, iOS/Android mobile UI), "Kage" (real product interfaces), "OriginKit", etc.
   - "vibe coding" or "cursor prompts" matches "DESIGN.md", "VibePrompts", "Cursor Lab UI", "vibeui", etc.
   - "3d motion" or "shaders" matches "Three.js Journey", "particles.casberry.in", "vanta", "react-three-fiber", "3dicons", etc.
   - "loading spinners" matches "circleloaders", "Magic UI", "SmoothUI", etc.
   - "sound design" matches "uisfx.com".
2. Identify and rank ALL links in the library that are genuinely relevant to the query. Put the highest relevance matches first.
3. For each matched link, provide a concise, punchy 1-sentence reason explaining why this link specifically answers their need.
4. Provide a crisp 1-2 sentence curator overview answering the user query and highlighting top picks.
5. Provide 2-4 suggested related searches.

Return strictly valid JSON with this exact structure:
{
  "matchedLinkIds": ["id1", "id2"],
  "relevanceReasons": {
    "id1": "Concise reason why id1 fits",
    "id2": "Concise reason why id2 fits"
  },
  "summary": "1-2 sentence curator overview of findings",
  "suggestedTags": ["#MobileUI", "#Inspiration"],
  "suggestedQueries": ["App Store screenshot layouts", "Mobile onboarding flows"]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          try {
            aiResult = JSON.parse(response.text.trim());
          } catch (pe) {
            console.warn('Failed to parse Gemini response as JSON:', pe);
          }
        }
      } catch (geminiErr: any) {
        console.warn('Gemini search call error, using semantic fallback:', geminiErr?.message);
      }
    }

    if (aiResult && Array.isArray(aiResult.matchedLinkIds) && aiResult.matchedLinkIds.length > 0) {
      return res.json({
        success: true,
        source: 'gemini',
        ...aiResult,
      });
    }

    // High quality semantic fallback
    const fallback = performSemanticTokenSearch(trimmedQuery, candidateLinks);
    return res.json({
      success: true,
      source: 'heuristic',
      ...fallback,
    });
  } catch (err: any) {
    console.error('Error in /api/ai-search:', err);
    return res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// AI Auto-Enrich Link Endpoint
app.post('/api/ai-enrich', async (req, res) => {
  try {
    const { url, title, description, domain } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      const fallback = getSmartCategorization(url, title, description);
      return res.json({
        success: true,
        source: 'heuristic',
        category: fallback.category,
        suggestedTags: fallback.suggestedTags,
        vibeCodePrompt: `Build a clean, responsive UI component inspired by ${title || domain || url}.`,
      });
    }

    const prompt = `Analyze this website bookmark for a designer and developer inspiration library:
URL: ${url}
Domain: ${domain || ''}
Title: ${title || ''}
Raw Description: ${description || ''}

Provide a clean summary, smart category, 4-6 tags, and a prompt for AI coding tools (Cursor / Claude Code).
Categories available:
- 'Website Inspiration'
- 'GitHub'
- 'Vibe Coding'
- 'AI Tools'
- 'UI Components'
- '3D & Motion'
- 'Prompts'

Return strictly JSON:
{
  "category": "one of the available categories",
  "suggestedTags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4"],
  "cleanDescription": "concise, punchy 1-sentence description (under 120 chars)",
  "vibeCodePrompt": "1-2 sentences giving a specific, actionable vibe coding prompt"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text.trim());
      return res.json({
        success: true,
        source: 'gemini',
        ...parsed,
      });
    }

    const fallback = getSmartCategorization(url, title, description);
    return res.json({
      success: true,
      source: 'heuristic',
      category: fallback.category,
      suggestedTags: fallback.suggestedTags,
      vibeCodePrompt: `Build a clean, responsive UI component inspired by ${title || domain || url}.`,
    });
  } catch (err: any) {
    console.warn('AI enrich error:', err);
    return res.json({
      success: false,
      error: (err as any).message,
    });
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
