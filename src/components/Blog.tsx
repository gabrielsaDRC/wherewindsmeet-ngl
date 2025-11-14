import { useEffect, useState } from 'react';
import { supabase, BlogPost } from '../lib/supabase';
import { Scroll, Calendar } from 'lucide-react';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

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
          <Scroll className="w-12 h-12 text-amber-400" />
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-amber-400">
            江湖志
          </h1>
        </div>
        <p className="text-xl text-amber-200/70">Notícias e Novidades</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-amber-300/60">
          Nenhum post publicado ainda.
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-gradient-to-br from-red-950/60 to-amber-950/60 border-2 border-amber-700/40 rounded-lg overflow-hidden backdrop-blur-sm hover:border-amber-500/60 transition-all"
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
                <div className="flex items-center gap-2 text-amber-300/60 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.created_at).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>

                <h2 className="text-3xl font-bold text-amber-100 mb-4">{post.title}</h2>

                <div className="text-amber-200/90 leading-relaxed whitespace-pre-wrap mb-6">
                  {post.content}
                </div>

                {post.youtube_url && getYouTubeEmbedUrl(post.youtube_url) && (
                  <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-amber-700/30">
                    <iframe
                      width="100%"
                      height="100%"
                      src={getYouTubeEmbedUrl(post.youtube_url) || ''}
                      title={post.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
