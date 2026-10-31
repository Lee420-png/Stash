export type CategoryType =
  | 'All Links'
  | 'Website Inspiration'
  | 'GitHub'
  | 'Vibe Coding'
  | 'AI Tools'
  | 'UI Components'
  | '3D & Motion'
  | 'Prompts';

export interface LinkItem {
  id: string;
  url: string;
  domain: string;
  title: string;
  description: string;
  previewImage: string;
  favicon: string;
  category: CategoryType | string;
  tags: string[];
  collections: string[];
  isFavorite: boolean;
  isArchived: boolean;
  notes: string;
  githubUrl?: string;
  vibeCodePrompt?: string;
  codeSnippet?: string;
  createdAt: string;
  updatedAt: string;
  isDemo?: boolean;
}

export interface CollectionItem {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'alphabetical'
  | 'updated'
  | 'favorites';

export type ViewMode = 'grid' | 'list';

export interface AiSearchResult {
  matchedLinkIds: string[];
  relevanceReasons: Record<string, string>;
  summary: string;
  suggestedTags?: string[];
  suggestedQueries?: string[];
  source?: 'gemini' | 'heuristic';
}

