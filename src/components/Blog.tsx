import { useEffect, useState } from 'react';
import { supabase, BlogPost } from '../lib/supabase';
import { Scroll, Calendar, Tag, Filter } from 'lucide-react';
import BlogPostView from './BlogPostView';

const CATEGORIES = [
  'Todos',
  'Build',
  'Leveling',
  'PvP',
  'PvE',
  'Guide',
  'News',
  'Event',
  'Discussion',
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, [selectedCategory]);

  const loadPosts = async () => {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true);

      if (selectedCategory !== 'Todos') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Build: 'from-amber-600 to-orange-600',
      Leveling: 'from-green-600 to-emerald-600',
      PvP: 'from-red-600 to-rose-600',
      PvE: 'from-blue-600 to-cyan-600',
      Guide: 'from-purple-600 to-violet-600',
      News: 'from-yellow-600 to-amber-600',
      Event: 'from-pink-600 to-fuchsia-600',
      Discussion: 'from-slate-600 to-gray-600',
    };
    return colors[category] || 'from-amber-600 to-red-600';
  };

  if (selectedPostId) {
    return <BlogPostView postId={selectedPostId} onBack={() => setSelectedPostId(null)} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-amber-400 text-2xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-amber-400">
            Notícias e Novidades
          </h1>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-amber-400" />
          <span className="text-amber-200/70 font-semibold">Filtrar por Categoria:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all font-semibold ${
                selectedCategory === category
                  ? `bg-gradient-to-r ${getCategoryColor(category)} text-white shadow-lg scale-105`
                  : 'bg-black/30 border border-amber-700/30 text-amber-200/70 hover:bg-black/50 hover:text-amber-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-amber-300/60">
          Nenhum post publicado nesta categoria.
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-gradient-to-br from-red-950/60 to-amber-950/60 border-2 border-amber-700/40 rounded-lg overflow-hidden backdrop-blur-sm hover:border-amber-500/60 transition-all cursor-pointer"
              onClick={() => setSelectedPostId(post.id)}
            >
              {post.image_url && (
                <div className="w-full h-64 overflow-hidden">
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${getCategoryColor(
                      post.category || 'Guide'
                    )} rounded-full text-white text-sm font-semibold shadow-lg`}
                  >
                    <Tag className="w-3 h-3" />
                    {post.category || 'Guide'}
                  </span>
                  <span className="flex items-center gap-2 text-amber-300/60 text-sm">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.created_at).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h2 className="text-3xl font-bold text-amber-100 mb-4 hover:text-amber-50 transition-colors">
                  {post.title}
                </h2>

                <div className="text-amber-200/90 leading-relaxed line-clamp-3">
                  {post.content}
                </div>

                <button className="mt-4 text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-2">
                  Ler mais →
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
