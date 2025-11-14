import { useState, useEffect } from 'react';
import { supabase, Player } from '../lib/supabase';
import { Edit, Save } from 'lucide-react';

export default function PlayerEdit() {
  const [playerId, setPlayerId] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Player>>({});

  useEffect(() => {
    const storedId = localStorage.getItem('playerId');
    if (storedId) {
      setPlayerId(storedId);
      loadPlayer(storedId);
    }
  }, []);

  const loadPlayer = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setPlayer(data);
        setFormData(data);
      } else {
        alert('Jogador não encontrado');
      }
    } catch (error) {
      console.error('Error loading player:', error);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (playerId.trim()) {
      localStorage.setItem('playerId', playerId);
      loadPlayer(playerId);
    }
  };

  const handleUpdate = async () => {
    if (!player) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('players')
        .update({ ...formData, updated_at: new Date().toISOString() })
        .eq('id', player.id);

      if (error) throw error;

      alert('Perfil atualizado com sucesso!');
      setEditing(false);
      loadPlayer(player.id);
    } catch (error) {
      console.error('Error updating player:', error);
      alert('Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...((prev[field as keyof typeof prev] as string[]) || []), value]
        : ((prev[field as keyof typeof prev] as string[]) || []).filter(v => v !== value)
    }));
  };

  if (!player && !loading) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-8 backdrop-blur-sm">
          <div className="text-center mb-6">
            <Edit className="w-16 h-16 mx-auto mb-4 text-amber-400" />
            <h2 className="text-3xl font-bold text-amber-100 mb-2">Editar Perfil</h2>
            <p className="text-amber-200/70">Insira seu ID de jogador para continuar</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
              placeholder="Cole seu ID aqui..."
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-800 to-amber-800 hover:from-red-700 hover:to-amber-700 text-amber-100 rounded-lg transition-all"
            >
              Buscar Perfil
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-amber-400 text-2xl">加载中...</div>
      </div>
    );
  }

  if (!player) return null;

  if (!editing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-8 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-4xl font-bold text-amber-100 mb-2">{player.nickname}</h2>
              <p className="text-amber-300/60">ID: {player.id}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-gradient-to-r from-red-800 to-amber-800 hover:from-red-700 hover:to-amber-700 text-amber-100 rounded-lg transition-all flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-amber-300 mb-3">Informações Básicas</h3>
              <div className="space-y-2 text-sm">
                {player.server && <p><span className="text-amber-300/60">Servidor:</span> <span className="text-amber-200">{player.server}</span></p>}
                {player.region && <p><span className="text-amber-300/60">Região:</span> <span className="text-amber-200">{player.region}</span></p>}
                {player.platform && <p><span className="text-amber-300/60">Plataforma:</span> <span className="text-amber-200">{player.platform}</span></p>}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-amber-300 mb-3">Combate</h3>
              <div className="space-y-2 text-sm">
                {player.main_style && <p><span className="text-amber-300/60">Estilo:</span> <span className="text-amber-200">{player.main_style}</span></p>}
                {player.build_type && <p><span className="text-amber-300/60">Build:</span> <span className="text-amber-200">{player.build_type}</span></p>}
                {player.level && <p><span className="text-amber-300/60">Level:</span> <span className="text-amber-200">{player.level}</span></p>}
                {player.combat_power > 0 && <p><span className="text-amber-300/60">Poder:</span> <span className="text-amber-200">{player.combat_power}</span></p>}
              </div>
            </div>

            {player.discord_id && (
              <div>
                <h3 className="text-xl font-bold text-amber-300 mb-3">Social</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-amber-300/60">Discord:</span> <span className="text-amber-200">{player.discord_id}</span></p>
                  {player.country && <p><span className="text-amber-300/60">País:</span> <span className="text-amber-200">{player.country}</span></p>}
                </div>
              </div>
            )}

            {player.guild_role && (
              <div>
                <h3 className="text-xl font-bold text-amber-300 mb-3">Guilda</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-amber-300/60">Função:</span> <span className="text-amber-200">{player.guild_role}</span></p>
                  {player.availability_time && <p><span className="text-amber-300/60">Horário:</span> <span className="text-amber-200">{player.availability_time}</span></p>}
                </div>
              </div>
            )}
          </div>

          {player.bio && (
            <div className="mt-6 pt-6 border-t border-amber-700/30">
              <h3 className="text-xl font-bold text-amber-300 mb-3">Bio</h3>
              <p className="text-amber-200/80">{player.bio}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-6 backdrop-blur-sm mb-6">
        <h2 className="text-3xl font-bold text-amber-100 mb-6">Editar Perfil</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-amber-200 mb-2">Nickname</label>
            <input
              type="text"
              value={formData.nickname || ''}
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
              className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-amber-200 mb-2">Servidor</label>
            <input
              type="text"
              value={formData.server || ''}
              onChange={(e) => setFormData({...formData, server: e.target.value})}
              className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-amber-200 mb-2">Estilo Principal</label>
            <select
              value={formData.main_style || ''}
              onChange={(e) => setFormData({...formData, main_style: e.target.value})}
              className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="">Selecione</option>
              <option value="Espadachim">Espadachim</option>
              <option value="Lancista">Lancista</option>
              <option value="Punhos">Punhos</option>
              <option value="Arco">Arco</option>
              <option value="Wuxia Balanced">Wuxia Balanced</option>
            </select>
          </div>
          <div>
            <label className="block text-amber-200 mb-2">Build</label>
            <select
              value={formData.build_type || ''}
              onChange={(e) => setFormData({...formData, build_type: e.target.value})}
              className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="">Selecione</option>
              <option value="DPS">DPS</option>
              <option value="Tank">Tank</option>
              <option value="Support">Support</option>
              <option value="CC">CC</option>
            </select>
          </div>
          <div>
            <label className="block text-amber-200 mb-2">Level</label>
            <input
              type="number"
              value={formData.level || 1}
              onChange={(e) => setFormData({...formData, level: parseInt(e.target.value) || 1})}
              className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-amber-200 mb-2">Poder de Combate</label>
            <input
              type="number"
              value={formData.combat_power || 0}
              onChange={(e) => setFormData({...formData, combat_power: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-amber-200 mb-2">Discord ID</label>
            <input
              type="text"
              value={formData.discord_id || ''}
              onChange={(e) => setFormData({...formData, discord_id: e.target.value})}
              className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-amber-200 mb-2">Função na Guilda</label>
            <select
              value={formData.guild_role || ''}
              onChange={(e) => setFormData({...formData, guild_role: e.target.value})}
              className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="">Selecione</option>
              <option value="Combatente">Combatente</option>
              <option value="Gatherer">Gatherer/Farming</option>
              <option value="Crafter">Crafter</option>
              <option value="PVP">PVP Squad</option>
              <option value="PVE">PVE Progress</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-amber-200 mb-2">Personalidade Gamer</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['Competitivo', 'Casual', 'Tryhard', 'Farmer', 'Social', 'Colecionador', 'Explorador'].map(personality => (
              <label key={personality} className="flex items-center gap-2 text-amber-200">
                <input
                  type="checkbox"
                  checked={(formData.gamer_personality || []).includes(personality)}
                  onChange={(e) => handleArrayChange('gamer_personality', personality, e.target.checked)}
                  className="accent-amber-600"
                />
                {personality}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-amber-200 mb-2">Bio</label>
          <textarea
            value={formData.bio || ''}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            rows={4}
            className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-800 to-amber-800 hover:from-red-700 hover:to-amber-700 text-amber-100 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            Salvar Alterações
          </button>
          <button
            onClick={() => setEditing(false)}
            className="px-6 py-3 bg-black/40 border border-amber-700/30 text-amber-200 rounded-lg hover:bg-black/60 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
