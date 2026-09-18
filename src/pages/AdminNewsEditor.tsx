import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Image as ImageIcon, Save, Loader2, AlertCircle } from 'lucide-react';
import { getNewsRecordById, saveNewsArticle, uploadArticleImage } from '../services/newsService';
import { NewsArticleRecord } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const AdminNewsEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { showToast } = useCart();

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Protocol',
    excerpt: '',
    content: '',
    image_url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200',
    reading_time_minutes: 5,
    featured: false,
    tags: 'Protocol, Solana, Cinema',
    author_name: profile?.full_name || 'Intyfe Editorial',
    author_role: 'Lead Protocol Dispatcher',
  });

  useEffect(() => {
    if (!isEditMode || !id) return;

    const loadArticle = async () => {
      setLoading(true);
      try {
        const record = await getNewsRecordById(id);
        if (record) {
          setFormData({
            title: record.title,
            slug: record.slug,
            category: record.category,
            excerpt: record.excerpt,
            content: record.content,
            image_url: record.image_url,
            reading_time_minutes: record.reading_time_minutes || 5,
            featured: record.featured || false,
            tags: (record.tags || []).join(', '),
            author_name: record.author_name || 'Intyfe Editorial',
            author_role: record.author_role || 'Staff Dispatch',
          });
        } else {
          setErrorMsg('Article not found.');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load article';
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id, isEditMode]);

  const handleTitleChange = (newTitle: string) => {
    setFormData((prev) => {
      const shouldAutoSlug = !isEditMode || prev.slug === '';
      const autoSlug = shouldAutoSlug
        ? newTitle
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : prev.slug;
      return { ...prev, title: newTitle, slug: autoSlug };
    });
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg(null);
    try {
      const { url, error } = await uploadArticleImage(file);
      if (error || !url) {
        throw error || new Error('Upload failed');
      }
      setFormData((prev) => ({ ...prev, image_url: url }));
      showToast('Image successfully uploaded to Supabase Storage!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error uploading image';
      setErrorMsg(`Storage upload notice: ${msg}. You can also paste an image URL directly.`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSaving(true);

    const tagList = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Partial<NewsArticleRecord> = {
      title: formData.title,
      slug: formData.slug || `dispatch-${Date.now()}`,
      category: formData.category,
      excerpt: formData.excerpt,
      content: formData.content,
      image_url: formData.image_url,
      reading_time_minutes: Number(formData.reading_time_minutes) || 5,
      featured: formData.featured,
      tags: tagList,
      author_id: user?.id || null,
      author_name: formData.author_name || 'Intyfe Editorial',
      author_avatar: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      author_role: formData.author_role || 'Staff Dispatch',
      published_at: new Date().toISOString(),
    };

    try {
      const { error, warning } = await saveNewsArticle(payload, id);
      if (error) {
        setErrorMsg(error.message);
        setSaving(false);
        return;
      }

      if (warning) {
        showToast(warning);
      } else {
        showToast(isEditMode ? 'Article successfully updated!' : 'New article published!');
      }
      navigate('/admin/news');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save article';
      setErrorMsg(msg);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-3">
        <Loader2 className="w-8 h-8 text-[#d81395] animate-spin mx-auto" />
        <p className="text-xs text-neutral-400">Loading article editor...</p>
      </div>
    );
  }

  return (
    <div className="pt-6 sm:pt-8 pb-20 sm:pb-24 container mx-auto px-4 max-w-[900px]">
      {/* Top Breadcrumb & Back */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate('/admin/news')}
          className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to News CMS Dashboard</span>
        </button>
      </div>

      <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isEditMode ? 'Edit Dispatch' : 'Compose New Dispatch'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Store content in Supabase <code className="text-[#f4bb28]">news_articles</code> with Row-Level Security
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Intyfe Protocol V2 Live On Solana Devnet"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="intyfe-protocol-v2-live-on-solana"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-[#f4bb28] focus:outline-none focus:border-[#d81395]"
              />
            </div>
          </div>

          {/* Category & Reading Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
              >
                <option value="Protocol">Protocol</option>
                <option value="Governance">Governance</option>
                <option value="Cinema">Cinema</option>
                <option value="Production">Production</option>
                <option value="Screenplay">Screenplay</option>
                <option value="Treasury">Treasury</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Est. Reading Time (min)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.reading_time_minutes}
                onChange={(e) => setFormData({ ...formData, reading_time_minutes: Number(e.target.value) })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 text-xs font-semibold text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#d81395]"
                />
                <span>Pin as Featured Dispatch</span>
              </label>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Excerpt / Brief Summary *
            </label>
            <textarea
              required
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A concise summary displayed on cards and search results..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
            />
          </div>

          {/* Cover Image with Supabase Storage Upload & Preview */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-neutral-300">
              Cover Image (Supabase Storage: <code className="text-[#d81395]">article-images</code>)
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors">
                {uploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#d81395]" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-[#f4bb28]" />
                    <span>Upload Image File</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                  className="hidden"
                />
              </label>

              <div className="flex-1 w-full">
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="Or paste external / Supabase storage image URL"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
                />
              </div>
            </div>

            {formData.image_url && (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video max-h-56 bg-neutral-900">
                <img
                  src={formData.image_url}
                  alt="Article Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/70 px-2 py-1 rounded text-white flex items-center gap-1 font-mono">
                  <ImageIcon className="w-3 h-3 text-[#f4bb28]" /> Image Preview
                </span>
              </div>
            )}
          </div>

          {/* Full Article Content */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Article Content (Markdown supported) *
            </label>
            <textarea
              required
              rows={10}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write the full dispatch article here. You can use markdown headers (### Header), lists (* item), and paragraphs..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-[#d81395] leading-relaxed"
            />
          </div>

          {/* Author Details & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Author Display Name
              </label>
              <input
                type="text"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Author Role
              </label>
              <input
                type="text"
                value={formData.author_role}
                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Solana, Script, Mint"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#d81395]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate('/admin/news')}
              className="px-5 py-2.5 rounded-full border border-white/15 hover:bg-white/5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#d81395] hover:bg-[#9a106a] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(216,19,149,0.35)] transition-all cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Article...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEditMode ? 'Update Dispatch' : 'Publish Dispatch'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
