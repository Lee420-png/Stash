# VibeInspire: Curated Website Inspiration & Vibe Code Platform

A modern, high-taste inspiration gallery and vibe coding platform that pairs cutting-edge website design showcases with copy-ready vibe code prompts, direct GitHub open-source repositories, and 3D WebGL assets.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Based on your answers during Phase 1, we are completely removing the complex telemetry workspace sidebar and transforming the application into a curated, visual-first inspiration and vibe coding platform.

- **Confirmed Layout**: Full-width visual feed with high-impact preview cards and dedicated slide-over / expandable **Vibe Code Drawers**.
- **Confirmed Resources Under Each Website**:
  1. **Vibe Code**: Copy-ready generative prompts tailored for Cursor, Lovable, Bolt.new, and v0, plus drop-in React/Tailwind/Three.js code.
  2. **Direct GitHub Repositories**: Real, curated open-source repositories, UI component kits, WebGL shaders, and starter templates.
  3. **3D & Motion Assets**: Interactive 3D WebGL canvas demos, Spline embeds, and motion presets.
- **Confirmed Navigation**: Clean top category bar featuring category pills (`All`, `3D & Motion`, `Landing Pages`, `GitHub Repos`, `Shaders`, `Free Templates`) with search and a "+ Add Inspiration" action—zero clutter, zero fake scoreboards, zero telemetry tickers.

---

## 1. Overview & Core Concept

### What It Does
**VibeInspire** is a creative directory and developer swipe file for designers and engineers building next-generation websites with AI. Instead of reading abstract metrics, users browse high-fidelity website design inspirations (like **MotionSites AI** and **SceneAI Art**), inspect their live motion and 3D aesthetics, copy their exact **Vibe Prompts & Code**, and jump directly into **GitHub open-source templates and 3D asset libraries** to build them.

### Target Audience
- Frontend developers and creative technologists building with Cursor, Lovable, Bolt.new, v0, and Claude.
- Indie founders, design engineers, and agency developers looking for proven hero layouts, 3D canvases, and open-source GitHub starter code.

### Key Value
- **Zero Friction**: 1-click "Copy Vibe Code" to immediately paste into an AI coding assistant.
- **Curated Open Source**: Direct links to vetted GitHub repositories and Three.js/WebGL packages that power those exact visual aesthetics.
- **Real Visuals**: High-resolution previews, interactive 3D canvas viewers, and clean typography with zero pseudo-technical clutter.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Inspiration Exploration**:
   - The user arrives at a clean, full-width masonry gallery.
   - Top category bar allows instant 1-click filtering: `All`, `3D & Motion`, `Landing Pages`, `GitHub Repos`, `Shaders & WebGL`, `Free Prompts`.
   - Real-time search by keyword, framework (React, Three.js, Tailwind), or visual style (e.g. *Aurora Glow*, *Matte Obsidian*, *Kinetic Typography*).

2. **Inspiration Card & Resources Inspection**:
   - Each card showcases a high-impact website visual with hover motion.
   - Below the preview image, the card presents:
     - **Website Identity & URL**: Clean title and live external site link.
     - **Vibe Code Trigger**: Prominent button opening the full vibe prompt and component code drawer.
     - **Direct GitHub Repositories**: Clean clickable badges leading to real open-source GitHub repositories (e.g., Three.js starters, Tailwind UI templates, shader sandboxes).
     - **3D / Motion Indicator**: Tags indicating WebGL, Three.js canvas, Framer Motion, or GLSL shaders.

3. **Vibe Code Drawer (Slide-Over)**:
   - Clicking "Inspect Vibe Code" smoothly opens a sleek slide-over drawer containing:
     - **System Prompt for AI Coding**: Copy-ready prompt formatted specifically for Cursor, Lovable, or Bolt.
     - **React + Tailwind + Three.js Source Code**: Syntax-highlighted code snippet with 1-click copy.
     - **Curated GitHub Links**: Complete repo details with GitHub stars count, author, and description.
     - **Interactive 3D / Shader Sandbox**: Live interactive WebGL canvas allowing mouse-rotation and lighting interaction right in the browser!

4. **Adding New Website Inspirations**:
   - Clean "+ Submit Link" modal with backend AI analysis that automatically extracts design tokens, synthesizes the vibe code, and suggests matching GitHub repositories.

### Visual Identity & Theme
- **Aesthetic Direction**: Minimalist Creative Studio / Dark Matte Obsidian with high-contrast typography, inspired by Godly, SceneAI, and MotionSites.
- **Color Palette**:
  - Background Canvas: Deep Matte Obsidian (`#090A0F`)
  - Elevated Card Surfaces: Sleek Charcoal (`#12131A` / `#161722`) with hairline borders (`rgba(255, 255, 255, 0.08)`)
  - Accent Color: Electric Violet (`#8B5CF6`) and Cyan Glow (`#06B6D4`)
  - Text: Pure White (`#FFFFFF`) headings and Muted Gray (`#94A3B8` / `#A1A1AA`) body
- **Typography Pairing**:
  - Display & Headings: `Plus Jakarta Sans` with tight tracking (`tracking-tight`)
  - Body & UI: `Inter`
  - Code & Repos: `JetBrains Mono` with `tabular-nums`
- **Anti-Slop Discipline**:
  - Complete removal of fake telemetry bars, internal scoring dials, and code-comment slashes (`//`).
  - No static pill badge clutter; clean typographic tags and unboxed metadata separated by subtle dots (`·`).

---

## 3. Key Product Decisions & Trade-Offs

| Decision | Chosen Approach | Rationale | Alternatives Considered |
| :--- | :--- | :--- | :--- |
| **Navigation Architecture** | Clean top category bar with horizontal pills and search | Maximizes screen real estate for the visual feed; eliminates the cramped, confusing sidebar shown in user's screenshot. | Retaining left sidebar (rejected per user request). |
| **Resource Integration** | Integrated GitHub repos and 3D assets directly below each card and inside the Vibe Drawer | Gives immediate access to real code and repos without navigating away from the inspiration. | Keeping separate views for repositories and cards. |
| **Vibe Code Presentation** | Dedicated slide-over code drawer with 1-click copy | Keeps browsing uninterrupted while allowing deep code inspection and prompt copying. | Expanding cards inline (pushes other cards down awkwardly). |
| **Interactive 3D Preview** | Live Three.js WebGL canvas demo built right into the drawer | Gives users an immediate tactile feel for the 3D vibe rather than just static screenshots. | Static image-only previews. |

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Top Navigation Bar                            │
│  [Logo: VibeInspire]  ──  [Categories & Search]  ──  [+ Add Link CTA]  │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Inspiration Feed Grid                           │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌────────────┐  │
│  │ MotionSites AI Card   │  │ SceneAI Art Card      │  │ Next Site  │  │
│  │ - 16:9 Motion Preview │  │ - 16:9 Curated Hero   │  │            │  │
│  │ - Vibe Code Button    │  │ - Vibe Code Button    │  │            │  │
│  │ - GitHub Repos List   │  │ - GitHub Repos List   │  │            │  │
│  │ - 3D / WebGL Badges   │  │ - Free Landing Badges │  │            │  │
│  └───────────┬───────────┘  └───────────┬───────────┘  └────────────┘  │
└──────────────┼──────────────────────────┼──────────────────────────────┘
               │                          │
               └────────────┬─────────────┘
                            │ (Click "Inspect Vibe Code")
                            ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    Slide-Over Vibe Code Drawer                         │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │ Interactive 3D Canvas   │  │ Copyable Vibe Prompt (Cursor/Bolt)  │  │
│  │ Real WebGL Scene        │  │ Drop-in React/Tailwind Source Code  │  │
│  └─────────────────────────┘  │ Curated GitHub Repositories         │  │
│                               └─────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model (`InspirationItem`)

```typescript
export interface GitHubRepo {
  name: string;
  url: string;
  stars: string;
  description: string;
  techStack: string[];
}

export interface VibePrompt {
  promptText: string;
  recommendedTools: ('Cursor' | 'Lovable' | 'Bolt.new' | 'v0' | 'Claude')[];
  componentSnippet: string;
}

export interface InspirationItem {
  id: string;
  title: string;
  domain: string;
  sourceUrl: string;
  previewImage: string;
  category: '3d-motion' | 'landing-page' | 'shaders' | 'prompt-library';
  tags: string[];
  has3D: boolean;
  vibePrompt: VibePrompt;
  githubRepos: GitHubRepo[];
  threeJsSceneType?: 'particles' | 'mesh-gradient' | 'floating-geometry';
  createdAt: string;
}
```

### Curated Seed Datasets
1. **MotionSites AI (`https://motionsites.ai/`)**:
   - Preview: 3D kinetic canvas & aurora mesh cards.
   - Vibe Code: High-impact 3D prompt for Cursor & Lovable creating WebGL particle floating scenes with Tailwind styling.
   - GitHub Repos:
     - `pmndrs/react-three-fiber`: Declarative 3D scenes for React.
     - `shuding/nextra` & `motion-canvas`: WebGL kinetic typography and motion tools.
     - `threejs-interactive-particles`: Open source WebGL particle cloud starter.
2. **SceneAI Art (`https://sceneai.art/landing-pages?sort=recent&type=free`)**:
   - Preview: Minimalist dark matte landing page directory with clamp typography.
   - Vibe Code: Copy-ready landing page hero prompt with responsive clamp typography and fluid newsletter capture.
   - GitHub Repos:
     - `shadcn-ui/ui`: Clean Tailwind CSS components for modern landing pages.
     - `magicuidesign/magicui`: 50+ animated landing page components with Framer Motion.
     - `ibelick/background-snippets`: Modern animated background gradients & grid patterns.
