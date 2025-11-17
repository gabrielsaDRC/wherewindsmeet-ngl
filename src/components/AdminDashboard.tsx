import { useEffect, useState } from 'react';
import { supabase, Player, BlogPost } from '../lib/supabase';
import { Users, FileText, Trash2, LogOut, Plus, Edit, Eye, EyeOff, Download, Info, X } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'players' | 'blog'>('players');
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    category: 'Guide',
    image_url: '',
    youtube_url: '',
    published: false,
    content_json: [] as any[],
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = players.filter(p =>
        p.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.discord_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p as any).primary_weapon?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.build_type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlayers(filtered);
    } else {
      setFilteredPlayers(players);
    }
  }, [searchTerm, players]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'players') {
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPlayers(data || []);
        setFilteredPlayers(data || []);
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlogPosts(data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePlayer = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este jogador?')) return;

    try {
      const adminId = sessionStorage.getItem('adminId');

      const { error: deleteError } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      await supabase.from('audit_log').insert([{
        admin_id: adminId,
        action: 'delete_player',
        target_type: 'player',
        target_id: id,
        details: { timestamp: new Date().toISOString() }
      }]);

      loadData();
      alert('Jogador excluído com sucesso');
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Erro ao excluir jogador');
    }
  };

  const savePost = async () => {
    try {
      const adminId = sessionStorage.getItem('adminId');

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update({ ...postForm, updated_at: new Date().toISOString() })
          .eq('id', editingPost.id);

        if (error) throw error;

        await supabase.from('audit_log').insert([{
          admin_id: adminId,
          action: 'update_blog_post',
          target_type: 'blog',
          target_id: editingPost.id,
          details: { title: postForm.title }
        }]);

        alert('Post atualizado com sucesso');
      } else {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postForm])
          .select()
          .single();

        if (error) throw error;

        await supabase.from('audit_log').insert([{
          admin_id: adminId,
          action: 'create_blog_post',
          target_type: 'blog',
          target_id: data.id,
          details: { title: postForm.title }
        }]);

        alert('Post criado com sucesso');
      }

      setEditingPost(null);
      setShowNewPost(false);
      setPostForm({ title: '', content: '', category: 'Guide', image_url: '', youtube_url: '', published: false, content_json: [] });
      loadData();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Erro ao salvar post');
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const adminId = sessionStorage.getItem('adminId');

      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await supabase.from('audit_log').insert([{
        admin_id: adminId,
        action: 'delete_blog_post',
        target_type: 'blog',
        target_id: id,
        details: { timestamp: new Date().toISOString() }
      }]);

      loadData();
      alert('Post excluído com sucesso');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Erro ao excluir post');
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !post.published, updated_at: new Date().toISOString() })
        .eq('id', post.id);

      if (error) throw error;
      loadData();
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert('Erro ao alterar status');
    }
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      content: post.content,
      category: post.category || 'Guide',
      image_url: post.image_url || '',
      youtube_url: post.youtube_url || '',
      published: post.published,
      content_json: post.content_json || [],
    });
  };

  const exportToExcel = () => {
    const headers = [
      'Nickname', 'ID do Jogador', 'Plataforma',
      'Arma Primária', 'Arma Secundária', 'Build', 'Level', 'Poder de Combate',
      'Profissões', 'Função na Guilda', 'Dias Disponíveis', 'Horário',
      'Interesse em Conteúdos', 'Microfone', 'Discord Obrigatório',
      'Idade', 'Discord ID', 'Steam/Epic/NetEase ID',
      'Personalidade Gamer', 'Motivação para Guilda', 'Bio',
      'Data de Registro'
    ];

    const rows = players.map(p => [
      p.nickname || '',
      p.player_id || '',
      p.platform || '',
      (p as any).primary_weapon || '',
      (p as any).secondary_weapon || '',
      p.build_type || '',
      p.level || '',
      p.combat_power || '',
      p.professions?.join(', ') || '',
      p.guild_role || '',
      p.availability_days?.join(', ') || '',
      p.availability_time || '',
      p.content_interest?.join(', ') || '',
      p.has_microphone ? 'Sim' : 'Não',
      p.discord_required ? 'Sim' : 'Não',
      p.age || '',
      p.discord_id || '',
      p.game_platform_id || '',
      p.gamer_personality?.join(', ') || '',
      p.guild_motivation || '',
      p.bio || '',
      p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : ''
    ]);

    let tableHTML = '<table border="1" style="border-collapse: collapse;">';
    tableHTML += '<thead><tr>';
    headers.forEach(header => {
      tableHTML += `<th style="padding: 8px; background-color: #f0f0f0;">${header}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    rows.forEach(row => {
      tableHTML += '<tr>';
      row.forEach(cell => {
        tableHTML += `<td style="padding: 8px;">${cell}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';

    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `jogadores_${new Date().toISOString().split('T')[0]}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminId');
    onLogout();
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-amber-400">
            Painel Administrativo
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-900/50 border border-red-700/50 text-amber-200 rounded-lg hover:bg-red-900/70 transition-all flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('players')}
            className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'players'
                ? 'bg-gradient-to-r from-red-800 to-amber-800 text-amber-100'
                : 'bg-black/40 border border-amber-700/30 text-amber-200'
            }`}
          >
            <Users className="w-5 h-5" />
            Jogadores ({players.length})
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'blog'
                ? 'bg-gradient-to-r from-red-800 to-amber-800 text-amber-100'
                : 'bg-black/40 border border-amber-700/30 text-amber-200'
            }`}
          >
            <FileText className="w-5 h-5" />
            Blog ({blogPosts.length})
          </button>
        </div>

        {activeTab === 'players' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
              <input
                type="text"
                placeholder="Buscar por nickname, discord, arma ou build..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 max-w-md px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 placeholder-amber-300/40 focus:border-amber-500 focus:outline-none"
              />
              <button
                onClick={exportToExcel}
                className="px-6 py-3 bg-gradient-to-r from-green-800 to-emerald-800 hover:from-green-700 hover:to-emerald-700 text-amber-100 rounded-lg transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Exportar para Excel
              </button>
            </div>
            <div className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black/40">
                  <tr>
                    <th className="px-6 py-4 text-left text-amber-200">Nickname</th>
                    <th className="px-6 py-4 text-left text-amber-200">Arma Principal</th>
                    <th className="px-6 py-4 text-left text-amber-200">Build</th>
                    <th className="px-6 py-4 text-left text-amber-200">Discord</th>
                    <th className="px-6 py-4 text-left text-amber-200">Level</th>
                    <th className="px-6 py-4 text-left text-amber-200">Data</th>
                    <th className="px-6 py-4 text-center text-amber-200">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-700/20">
                  {filteredPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-black/20 transition-colors">
                      <td className="px-6 py-4 text-amber-100">{player.nickname}</td>
                      <td className="px-6 py-4 text-amber-200/80">{(player as any).primary_weapon || '-'}</td>
                      <td className="px-6 py-4 text-amber-200/80">{player.build_type || '-'}</td>
                      <td className="px-6 py-4 text-amber-200/80">{player.discord_id || '-'}</td>
                      <td className="px-6 py-4 text-amber-200/80">{player.level || '-'}</td>
                      <td className="px-6 py-4 text-amber-200/80">
                        {player.created_at ? new Date(player.created_at).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => setSelectedPlayer(player)}
                            className="p-2 bg-blue-900/50 hover:bg-blue-900/70 text-blue-200 rounded transition-all"
                            title="Ver detalhes"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePlayer(player.id)}
                            className="p-2 bg-red-900/50 hover:bg-red-900/70 text-red-200 rounded transition-all"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="space-y-6">
            {!showNewPost && !editingPost && (
              <button
                onClick={() => setShowNewPost(true)}
                className="px-6 py-3 bg-gradient-to-r from-red-800 to-amber-800 hover:from-red-700 hover:to-amber-700 text-amber-100 rounded-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Novo Post
              </button>
            )}

            {(showNewPost || editingPost) && (
              <div className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-6 backdrop-blur-sm">
                <h3 className="text-2xl font-bold text-amber-100 mb-4">
                  {editingPost ? 'Editar Post' : 'Novo Post'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-amber-200 mb-2">Título</label>
                    <input
                      type="text"
                      value={postForm.title}
                      onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                      className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-200 mb-2">Categoria</label>
                    <select
                      value={postForm.category}
                      onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                      className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Build">Build</option>
                      <option value="Leveling">Leveling</option>
                      <option value="PvP">PvP</option>
                      <option value="PvE">PvE</option>
                      <option value="Guide">Guide</option>
                      <option value="News">News</option>
                      <option value="Event">Event</option>
                      <option value="Discussion">Discussion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-amber-200 mb-2">Conteúdo Simples (Resumo)</label>
                    <textarea
                      value={postForm.content}
                      onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                      rows={4}
                      placeholder="Resumo do post (mostrado na lista)"
                      className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-200 mb-3">Conteúdo Rico (Editor Avançado)</label>
                    <RichTextEditor
                      value={postForm.content_json}
                      onChange={(blocks) => setPostForm({...postForm, content_json: blocks})}
                    />
                  </div>
                  <div>
                    <label className="block text-amber-200 mb-2">URL da Imagem</label>
                    <input
                      type="text"
                      value={postForm.image_url}
                      onChange={(e) => setPostForm({...postForm, image_url: e.target.value})}
                      placeholder="https://..."
                      className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-200 mb-2">URL do YouTube</label>
                    <input
                      type="text"
                      value={postForm.youtube_url}
                      onChange={(e) => setPostForm({...postForm, youtube_url: e.target.value})}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-amber-200">
                      <input
                        type="checkbox"
                        checked={postForm.published}
                        onChange={(e) => setPostForm({...postForm, published: e.target.checked})}
                        className="accent-amber-600"
                      />
                      Publicar imediatamente
                    </label>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={savePost}
                      className="px-6 py-3 bg-gradient-to-r from-red-800 to-amber-800 hover:from-red-700 hover:to-amber-700 text-amber-100 rounded-lg transition-all"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => {
                        setShowNewPost(false);
                        setEditingPost(null);
                        setPostForm({ title: '', content: '', category: 'Guide', image_url: '', youtube_url: '', published: false, content_json: [] });
                      }}
                      className="px-6 py-3 bg-black/40 border border-amber-700/30 text-amber-200 rounded-lg hover:bg-black/60 transition-all"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-6 backdrop-blur-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-amber-100 mb-2">{post.title}</h3>
                      <p className="text-amber-300/60 text-sm">
                        {new Date(post.created_at).toLocaleDateString('pt-BR')} - {post.published ? 'Publicado' : 'Rascunho'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => togglePublish(post)}
                        className="p-2 bg-amber-900/50 hover:bg-amber-900/70 text-amber-200 rounded transition-all"
                        title={post.published ? 'Despublicar' : 'Publicar'}
                      >
                        {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => startEdit(post)}
                        className="p-2 bg-blue-900/50 hover:bg-blue-900/70 text-blue-200 rounded transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="p-2 bg-red-900/50 hover:bg-red-900/70 text-red-200 rounded transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-amber-200/80 line-clamp-3">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setSelectedPlayer(null)}>
          <div className="bg-gradient-to-br from-red-950/95 to-amber-950/95 border-2 border-amber-700/60 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-red-900/90 to-amber-900/90 backdrop-blur-sm px-6 py-4 flex justify-between items-center border-b border-amber-700/40">
              <h2 className="text-2xl font-bold text-amber-100">Perfil do Jogador</h2>
              <button
                onClick={() => setSelectedPlayer(null)}
                className="p-2 hover:bg-black/30 rounded transition-all"
              >
                <X className="w-6 h-6 text-amber-200" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/30 rounded-lg p-4 border border-amber-700/20">
                  <h3 className="text-lg font-bold text-amber-300 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Informações Básicas
                  </h3>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="ID" value={selectedPlayer.id} mono />
                    <InfoRow label="Nickname" value={selectedPlayer.nickname} />
                    <InfoRow label="ID do Jogador" value={selectedPlayer.player_id} />
                    <InfoRow label="Plataforma" value={selectedPlayer.platform} />
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-amber-700/20">
                  <h3 className="text-lg font-bold text-amber-300 mb-3">Combate & Estilo</h3>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Arma Primária" value={(selectedPlayer as any).primary_weapon} />
                    <InfoRow label="Arma Secundária" value={(selectedPlayer as any).secondary_weapon} />
                    <InfoRow label="Tipo de Build" value={selectedPlayer.build_type} />
                    <InfoRow label="Arma Favorita" value={selectedPlayer.favorite_weapon} />
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-amber-700/20">
                  <h3 className="text-lg font-bold text-amber-300 mb-3">Progressão</h3>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Level" value={selectedPlayer.level} />
                    <InfoRow label="Poder de Combate" value={selectedPlayer.combat_power} />
                    <InfoRow label="Profissões" value={selectedPlayer.professions?.join(', ')} />
                    <InfoRow label="Reputação de Facção" value={selectedPlayer.faction_reputation} />
                    <InfoRow label="Começou a Jogar" value={selectedPlayer.started_playing ? new Date(selectedPlayer.started_playing).toLocaleDateString('pt-BR') : null} />
                    <InfoRow label="Horas Semanais" value={selectedPlayer.weekly_hours} />
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-amber-700/20">
                  <h3 className="text-lg font-bold text-amber-300 mb-3">Informações de Guilda</h3>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Função" value={selectedPlayer.guild_role} />
                    <InfoRow label="Dias Disponíveis" value={selectedPlayer.availability_days?.join(', ')} />
                    <InfoRow label="Horário" value={selectedPlayer.availability_time} />
                    <InfoRow label="Interesses" value={selectedPlayer.content_interest?.join(', ')} />
                    <InfoRow label="Microfone" value={selectedPlayer.has_microphone ? 'Sim' : 'Não'} />
                    <InfoRow label="Discord Obrigatório" value={selectedPlayer.discord_required ? 'Sim' : 'Não'} />
                    <InfoRow label="Cargo Desejado" value={selectedPlayer.desired_rank} />
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-amber-700/20">
                  <h3 className="text-lg font-bold text-amber-300 mb-3">Perfil Social</h3>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Idade" value={selectedPlayer.age} />
                    <InfoRow label="Cidade" value={selectedPlayer.city} />
                    <InfoRow label="Discord" value={selectedPlayer.discord_id} />
                    <InfoRow label="ID da Plataforma" value={selectedPlayer.game_platform_id} />
                    <InfoRow label="Link de Stream" value={selectedPlayer.streaming_link} link />
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-4 border border-amber-700/20">
                  <h3 className="text-lg font-bold text-amber-300 mb-3">Personalidade & Outros</h3>
                  <div className="space-y-2 text-sm">
                    <InfoRow label="Personalidade" value={selectedPlayer.gamer_personality?.join(', ')} />
                    <InfoRow label="Experiência MMORPG" value={selectedPlayer.mmorpg_experience} />
                    <InfoRow label="Cadastrado em" value={selectedPlayer.created_at ? new Date(selectedPlayer.created_at).toLocaleDateString('pt-BR') : null} />
                  </div>
                </div>
              </div>

              {selectedPlayer.guild_motivation && (
                <div className="bg-black/30 rounded-lg p-4 border border-amber-700/20">
                  <h3 className="text-lg font-bold text-amber-300 mb-3">Motivação para Guilda</h3>
                  <p className="text-amber-200/80 text-sm whitespace-pre-wrap">{selectedPlayer.guild_motivation}</p>
                </div>
              )}

              {selectedPlayer.expectations && (
                <div className="bg-black/30 rounded-lg p-4 border border-amber-700/20">
                  <h3 className="text-lg font-bold text-amber-300 mb-3">Expectativas</h3>
                  <p className="text-amber-200/80 text-sm whitespace-pre-wrap">{selectedPlayer.expectations}</p>
                </div>
              )}

              {selectedPlayer.bio && (
                <div className="bg-black/30 rounded-lg p-4 border border-amber-700/20">
                  <h3 className="text-lg font-bold text-amber-300 mb-3">Bio</h3>
                  <p className="text-amber-200/80 text-sm whitespace-pre-wrap">{selectedPlayer.bio}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value, mono = false, link = false }: { label: string; value: any; mono?: boolean; link?: boolean }) {
  if (!value) return null;

  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-amber-300/60 font-medium">{label}:</span>
      {link && value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-amber-200 hover:text-amber-100 underline text-right break-all">
          {value}
        </a>
      ) : (
        <span className={`text-amber-200 text-right ${mono ? 'font-mono text-xs' : ''} break-all`}>
          {value}
        </span>
      )}
    </div>
  );
}
