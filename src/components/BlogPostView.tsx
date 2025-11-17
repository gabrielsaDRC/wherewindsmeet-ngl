import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  content_json: any;
  category: string;
  image_url?: string;
  youtube_url?: string;
  created_at: string;
}

interface ContentBlock {
  type: 'text' | 'image' | 'heading';
  content: string;
  fontSize?: string;
  color?: string;
  url?: string;
}

export default function BlogPostView({ postId, onBack }: { postId: string; onBack: () => void }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error loading post:', error);
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

  const renderContent = () => {
    if (post?.content_json) {
      const blocks: ContentBlock[] = post.content_json;
      return blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={index}
                className="text-3xl font-bold text-amber-100 mb-4 mt-8"
                style={{ color: block.color }}
              >
                {block.content}
              </h2>
            );
          case 'image':
            return (
              <div key={index} className="my-6">
                <img
                  src={block.url}
                  alt=""
                  className="rounded-lg w-full max-w-3xl mx-auto shadow-lg"
                />
              </div>
            );
          case 'text':
          default:
            return (
              <p
                key={index}
                className="mb-4 leading-relaxed"
                style={{
                  fontSize: block.fontSize || '1rem',
                  color: block.color || '#fef3c7',
                }}
              >
                {block.content}
              </p>
            );
        }
      });
    }

    return (
      <div className="prose prose-invert max-w-none">
        <p className="text-amber-100/90 leading-relaxed whitespace-pre-wrap">
          {post?.content}
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-amber-200/70">Carregando...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-200/70 mb-4">Post não encontrado</p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gradient-to-r from-red-800 to-amber-800 text-amber-100 rounded-lg hover:from-red-700 hover:to-amber-700 transition-all"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-black/30 border border-amber-700/30 rounded-lg text-amber-200/70 hover:bg-black/50 hover:text-amber-100 transition-all mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>

        <article className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg overflow-hidden backdrop-blur-sm">
          {post.image_url && (
            <div className="w-full h-96 overflow-hidden">
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
                className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getCategoryColor(
                  post.category
                )} rounded-full text-white text-sm font-semibold shadow-lg`}
              >
                <Tag className="w-4 h-4" />
                {post.category}
              </span>
              <span className="flex items-center gap-2 text-amber-200/60 text-sm">
                <Calendar className="w-4 h-4" />
                {new Date(post.created_at).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-amber-400 mb-8">
              {post.title}
            </h1>

            {post.youtube_url && (
              <div className="mb-8">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={post.youtube_url.replace('watch?v=', 'embed/')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <div className="text-amber-100/90">{renderContent()}</div>
          </div>
        </article>
      </div>
    </div>
  );
}
