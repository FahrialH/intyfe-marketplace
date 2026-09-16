import { supabase, isSupabaseConfigured, NewsArticleRecord } from '../lib/supabase';
import { NewsArticle } from '../types';
import { mockNews } from '../data/mockData';

export const mapRecordToArticle = (rec: NewsArticleRecord): NewsArticle => {
  return {
    id: rec.id,
    slug: rec.slug,
    title: rec.title,
    excerpt: rec.excerpt,
    content: rec.content,
    image: rec.image_url,
    category: rec.category,
    publishedAt: new Date(rec.published_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    readingTimeMinutes: rec.reading_time_minutes || 5,
    author: {
      name: rec.author_name || 'Intyfe Editorial',
      avatar: rec.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      role: rec.author_role || 'Staff Dispatch',
    },
    tags: rec.tags || [],
    featured: rec.featured || false,
  };
};

export const getNewsArticles = async (): Promise<NewsArticle[]> => {
  if (!isSupabaseConfigured()) {
    return mockNews;
  }

  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) {
      console.warn('Supabase news fetch error, using mock data:', error.message);
      return mockNews;
    }

    if (!data || data.length === 0) {
      // If table is empty, return mock data for initial catalog
      return mockNews;
    }

    return (data as NewsArticleRecord[]).map(mapRecordToArticle);
  } catch (err) {
    console.error('Error in getNewsArticles:', err);
    return mockNews;
  }
};

export const getNewsArticleBySlug = async (slug: string): Promise<NewsArticle | null> => {
  if (!isSupabaseConfigured()) {
    const found = mockNews.find((n) => n.slug === slug);
    return found || null;
  }

  try {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const found = mockNews.find((n) => n.slug === slug);
      return found || null;
    }

    return mapRecordToArticle(data as NewsArticleRecord);
  } catch {
    const found = mockNews.find((n) => n.slug === slug);
    return found || null;
  }
};

export const getAllNewsRecords = async (): Promise<NewsArticleRecord[]> => {
  if (!isSupabaseConfigured()) {
    // Return mock mapped to records
    return mockNews.map((n) => ({
      id: n.id,
      slug: n.slug,
      title: n.title,
      excerpt: n.excerpt,
      content: n.content,
      image_url: n.image,
      category: n.category,
      author_id: null,
      author_name: n.author.name,
      author_avatar: n.author.avatar,
      author_role: n.author.role,
      published_at: new Date().toISOString(),
      featured: n.featured || false,
      reading_time_minutes: n.readingTimeMinutes,
      tags: n.tags || [],
      created_at: new Date().toISOString(),
    }));
  }

  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return (data || []) as NewsArticleRecord[];
};

export const getNewsRecordById = async (id: string): Promise<NewsArticleRecord | null> => {
  if (!isSupabaseConfigured()) {
    const found = mockNews.find((n) => n.id === id);
    if (!found) return null;
    return {
      id: found.id,
      slug: found.slug,
      title: found.title,
      excerpt: found.excerpt,
      content: found.content,
      image_url: found.image,
      category: found.category,
      author_id: null,
      author_name: found.author.name,
      author_avatar: found.author.avatar,
      author_role: found.author.role,
      published_at: new Date().toISOString(),
      featured: found.featured || false,
      reading_time_minutes: found.readingTimeMinutes,
      tags: found.tags || [],
      created_at: new Date().toISOString(),
    };
  }

  const { data, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as NewsArticleRecord;
};

export const saveNewsArticle = async (
  article: Partial<NewsArticleRecord>,
  existingId?: string
): Promise<{ data: NewsArticleRecord | null; error: Error | null }> => {
  if (!isSupabaseConfigured()) {
    // Mock save in demo mode
    const record: NewsArticleRecord = {
      id: existingId || 'mock-' + Date.now(),
      slug: article.slug || 'dispatch-' + Date.now(),
      title: article.title || 'Untitled Article',
      excerpt: article.excerpt || '',
      content: article.content || '',
      image_url: article.image_url || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200',
      category: article.category || 'Protocol',
      author_id: article.author_id || null,
      author_name: article.author_name || 'Intyfe Admin',
      author_avatar: article.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      author_role: article.author_role || 'Editor-in-Chief',
      published_at: article.published_at || new Date().toISOString(),
      featured: Boolean(article.featured),
      reading_time_minutes: article.reading_time_minutes || 5,
      tags: article.tags || [],
      created_at: new Date().toISOString(),
    };
    return { data: record, error: null };
  }

  try {
    if (existingId) {
      const { data, error } = await supabase
        .from('news_articles')
        .update(article)
        .eq('id', existingId)
        .select()
        .single();

      if (error) return { data: null, error: new Error(error.message) };
      return { data: data as NewsArticleRecord, error: null };
    } else {
      const { data, error } = await supabase
        .from('news_articles')
        .insert(article)
        .select()
        .single();

      if (error) return { data: null, error: new Error(error.message) };
      return { data: data as NewsArticleRecord, error: null };
    }
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Failed to save article');
    return { data: null, error };
  }
};

export const deleteNewsArticle = async (id: string): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to delete article';
    return { success: false, error: msg };
  }
};

export const uploadArticleImage = async (file: File): Promise<{ url: string | null; error: Error | null }> => {
  if (!isSupabaseConfigured()) {
    // Return object URL or placeholder in demo mode
    return { url: URL.createObjectURL(file), error: null };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `news/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('article-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      return { url: null, error: new Error(uploadError.message) };
    }

    const { data } = supabase.storage
      .from('article-images')
      .getPublicUrl(filePath);

    return { url: data.publicUrl, error: null };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Storage upload failed');
    return { url: null, error };
  }
};
