import { useState, useEffect } from 'react';
import { supabase, Player } from '../lib/supabase';
import { Edit, Save, User, Swords, Shield, Users, Globe, Heart } from 'lucide-react';

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
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-8 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-4xl font-bold text-amber-100 mb-2">{player.nickname}</h2>
              <p className="text-amber-300/60 text-sm">ID: {player.id}</p>
              {player.player_id && <p className="text-amber-300/60 text-sm">ID do Jogador: {player.player_id}</p>}
            </div>
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-gradient-to-r from-red-800 to-amber-800 hover:from-red-700 hover:to-amber-700 text-amber-100 rounded-lg transition-all flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              Editar Perfil
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/20 rounded-lg p-6 border border-amber-700/20">
              <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Básicas
              </h3>
              <div className="space-y-3">
                {player.platform && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Plataforma</p>
                    <p className="text-amber-100">{player.platform}</p>
                  </div>
                )}
                {player.age && player.age > 0 && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Idade</p>
                    <p className="text-amber-100">{player.age} anos</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-6 border border-amber-700/20">
              <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                <Swords className="w-5 h-5" />
                Combate
              </h3>
              <div className="space-y-3">
                {(player as any).primary_weapon && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Arma Primária</p>
                    <p className="text-amber-100">{(player as any).primary_weapon}</p>
                  </div>
                )}
                {(player as any).secondary_weapon && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Arma Secundária</p>
                    <p className="text-amber-100">{(player as any).secondary_weapon}</p>
                  </div>
                )}
                {player.build_type && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Build</p>
                    <p className="text-amber-100">{player.build_type}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-6 border border-amber-700/20">
              <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Progressão
              </h3>
              <div className="space-y-3">
                {player.level && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Level</p>
                    <p className="text-amber-100 text-xl font-bold">{player.level}</p>
                  </div>
                )}
                {player.combat_power > 0 && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Poder de Combate</p>
                    <p className="text-amber-100 text-xl font-bold">{player.combat_power.toLocaleString()}</p>
                  </div>
                )}
                {player.professions && player.professions.length > 0 && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Profissões</p>
                    <div className="flex flex-wrap gap-2">
                      {player.professions.map(prof => (
                        <span key={prof} className="px-2 py-1 bg-amber-900/30 text-amber-200 text-xs rounded">{prof}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-6 border border-amber-700/20">
              <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Guilda
              </h3>
              <div className="space-y-3">
                {player.guild_role && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Função</p>
                    <p className="text-amber-100">{player.guild_role}</p>
                  </div>
                )}
                {player.availability_time && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Horário</p>
                    <p className="text-amber-100">{player.availability_time}</p>
                  </div>
                )}
                {player.availability_days && player.availability_days.length > 0 && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Dias Disponíveis</p>
                    <div className="flex flex-wrap gap-1">
                      {player.availability_days.map(day => (
                        <span key={day} className="px-2 py-1 bg-amber-900/30 text-amber-200 text-xs rounded">{day}</span>
                      ))}
                    </div>
                  </div>
                )}
                {player.content_interest && player.content_interest.length > 0 && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Interesses</p>
                    <div className="flex flex-wrap gap-1">
                      {player.content_interest.map(content => (
                        <span key={content} className="px-2 py-1 bg-amber-900/30 text-amber-200 text-xs rounded">{content}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-black/20 rounded-lg p-6 border border-amber-700/20">
              <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Social
              </h3>
              <div className="space-y-3">
                {player.discord_id && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Discord</p>
                    <p className="text-amber-100">{player.discord_id}</p>
                  </div>
                )}
                {player.game_platform_id && (
                  <div>
                    <p className="text-amber-300/60 text-xs uppercase mb-1">Steam/Epic/NetEase</p>
                    <p className="text-amber-100 text-sm break-all">{player.game_platform_id}</p>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  {player.has_microphone && (
                    <span className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded">Microfone</span>
                  )}
                  {player.discord_required && (
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded">Discord Obrigatório</span>
                  )}
                </div>
              </div>
            </div>

            {player.gamer_personality && player.gamer_personality.length > 0 && (
              <div className="bg-black/20 rounded-lg p-6 border border-amber-700/20">
                <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Personalidade
                </h3>
                <div className="flex flex-wrap gap-2">
                  {player.gamer_personality.map(personality => (
                    <span key={personality} className="px-3 py-1 bg-amber-900/30 text-amber-200 text-sm rounded">{personality}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(player.guild_motivation || player.bio) && (
            <div className="space-y-6">
              {player.guild_motivation && (
                <div className="bg-black/20 rounded-lg p-6 border border-amber-700/20">
                  <h3 className="text-lg font-bold text-amber-300 mb-3">Motivação para a Guilda</h3>
                  <p className="text-amber-200/80 leading-relaxed">{player.guild_motivation}</p>
                </div>
              )}
              {player.bio && (
                <div className="bg-black/20 rounded-lg p-6 border border-amber-700/20">
                  <h3 className="text-lg font-bold text-amber-300 mb-3">Bio Pessoal</h3>
                  <p className="text-amber-200/80 leading-relaxed">{player.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="max-w-5xl mx-auto p-6 space-y-8">
      <section className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
          <User className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-amber-100">Informações Básicas</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-amber-200 mb-2 text-sm font-medium">Nickname *</label>
            <input
              type="text"
              required
              value={formData.nickname || ''}
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="Seu nome no jogo"
            />
          </div>
          <div>
            <label className="block text-amber-200 mb-2 text-sm font-medium">Plataforma</label>
            <select
              value={formData.platform || ''}
              onChange={(e) => setFormData({...formData, platform: e.target.value})}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
            >
              <option value="">Selecione</option>
              <option value="PC">PC</option>
              <option value="Console">Console</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-amber-200 mb-2 text-sm font-medium">ID do Jogador</label>
            <input
              type="text"
              value={formData.player_id || ''}
              onChange={(e) => setFormData({...formData, player_id: e.target.value})}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="Seu ID único no jogo"
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
          <Swords className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-amber-100">Estilo de Combate</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-amber-200 mb-2 text-sm font-medium">Arma Primária</label>
            <select
              value={(formData as any).primary_weapon || ''}
              onChange={(e) => setFormData({...formData, primary_weapon: e.target.value} as any)}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
            >
              <option value="">Selecione</option>
              <option value="Sword">Sword</option>
              <option value="Spear">Spear</option>
              <option value="Fan">Fan</option>
              <option value="Mo Blade">Mo Blade</option>
              <option value="Dual Blades">Dual Blades</option>
              <option value="Umbrella">Umbrella</option>
              <option value="Rope Dart">Rope Dart</option>
            </select>
          </div>
          <div>
            <label className="block text-amber-200 mb-2 text-sm font-medium">Arma Secundária</label>
            <select
              value={(formData as any).secondary_weapon || ''}
              onChange={(e) => setFormData({...formData, secondary_weapon: e.target.value} as any)}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
            >
              <option value="">Selecione</option>
              <option value="Sword">Sword</option>
              <option value="Spear">Spear</option>
              <option value="Fan">Fan</option>
              <option value="Mo Blade">Mo Blade</option>
              <option value="Dual Blades">Dual Blades</option>
              <option value="Umbrella">Umbrella</option>
              <option value="Rope Dart">Rope Dart</option>
            </select>
          </div>
          <div>
            <label className="block text-amber-200 mb-2 text-sm font-medium">Tipo de Build</label>
            <select
              value={formData.build_type || ''}
              onChange={(e) => setFormData({...formData, build_type: e.target.value})}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
            >
              <option value="">Selecione</option>
              <option value="DPS">DPS</option>
              <option value="Tank">Tank</option>
              <option value="Support">Support/Healer</option>
              <option value="CC">Controle/CC</option>
            </select>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-amber-100">Progressão</h2>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-amber-200 mb-2 text-sm font-medium">Level</label>
              <input
                type="number"
                value={formData.level || 1}
                onChange={(e) => setFormData({...formData, level: parseInt(e.target.value) || 1})}
                className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
                placeholder="1-60"
              />
            </div>
            <div>
              <label className="block text-amber-200 mb-2 text-sm font-medium">Poder de Combate</label>
              <input
                type="number"
                value={formData.combat_power || 0}
                onChange={(e) => setFormData({...formData, combat_power: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
                placeholder="Seu poder atual"
              />
            </div>
          </div>
          <div>
            <label className="block text-amber-200 mb-3 text-sm font-medium">Profissões</label>
            <div className="flex flex-wrap gap-4">
              {['Médico', 'Eremita'].map(prof => (
                <label key={prof} className="flex items-center gap-2 text-amber-200 cursor-pointer hover:text-amber-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={(formData.professions || []).includes(prof)}
                    onChange={(e) => handleArrayChange('professions', prof, e.target.checked)}
                    className="w-4 h-4 accent-amber-600 cursor-pointer"
                  />
                  <span>{prof}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-amber-100">Informações de Guilda</h2>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-amber-200 mb-3 text-sm font-medium">Dias Disponíveis</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(day => (
                <label key={day} className="flex items-center gap-2 text-amber-200 cursor-pointer hover:text-amber-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={(formData.availability_days || []).includes(day)}
                    onChange={(e) => handleArrayChange('availability_days', day, e.target.checked)}
                    className="w-4 h-4 accent-amber-600 cursor-pointer"
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-amber-200 mb-2 text-sm font-medium">Horário</label>
              <select
                value={formData.availability_time || ''}
                onChange={(e) => setFormData({...formData, availability_time: e.target.value})}
                className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
              >
                <option value="">Selecione</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
                <option value="Madrugada">Madrugada</option>
              </select>
            </div>
            <div>
              <label className="block text-amber-200 mb-2 text-sm font-medium">Função na Guilda</label>
              <select
                value={formData.guild_role || ''}
                onChange={(e) => setFormData({...formData, guild_role: e.target.value})}
                className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
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
          <div>
            <label className="block text-amber-200 mb-3 text-sm font-medium">Interesse em Conteúdos</label>
            <div className="flex flex-wrap gap-4">
              {['PvP', 'PvE', 'World Bosses', 'Eventos', 'Roleplay'].map(content => (
                <label key={content} className="flex items-center gap-2 text-amber-200 cursor-pointer hover:text-amber-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={(formData.content_interest || []).includes(content)}
                    onChange={(e) => handleArrayChange('content_interest', content, e.target.checked)}
                    className="w-4 h-4 accent-amber-600 cursor-pointer"
                  />
                  <span>{content}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-amber-200 cursor-pointer hover:text-amber-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.has_microphone || false}
                onChange={(e) => setFormData({...formData, has_microphone: e.target.checked})}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
              <span>Tem Microfone</span>
            </label>
            <label className="flex items-center gap-2 text-amber-200 cursor-pointer hover:text-amber-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.discord_required || false}
                onChange={(e) => setFormData({...formData, discord_required: e.target.checked})}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
              <span>Discord Obrigatório</span>
            </label>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
          <Globe className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-amber-100">Perfil Social</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-amber-200 mb-2 text-sm font-medium">Idade</label>
            <input
              type="number"
              value={formData.age || ''}
              onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="18+"
            />
          </div>
          <div>
            <label className="block text-amber-200 mb-2 text-sm font-medium">Discord ID</label>
            <input
              type="text"
              value={formData.discord_id || ''}
              onChange={(e) => setFormData({...formData, discord_id: e.target.value})}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="usuario#1234"
            />
          </div>
          <div>
            <label className="block text-amber-200 mb-2 text-sm font-medium">Steam/Epic/NetEase ID</label>
            <input
              type="text"
              value={formData.game_platform_id || ''}
              onChange={(e) => setFormData({...formData, game_platform_id: e.target.value})}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="Seu ID da plataforma"
            />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-8 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-6 h-6 text-amber-400" />
          <h2 className="text-2xl font-bold text-amber-100">Informações Adicionais</h2>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-amber-200 mb-3 text-sm font-medium">Personalidade Gamer</label>
            <div className="flex flex-wrap gap-4">
              {['Competitivo', 'Casual', 'Tryhard', 'Farmer', 'Social', 'Colecionador', 'Explorador'].map(personality => (
                <label key={personality} className="flex items-center gap-2 text-amber-200 cursor-pointer hover:text-amber-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={(formData.gamer_personality || []).includes(personality)}
                    onChange={(e) => handleArrayChange('gamer_personality', personality, e.target.checked)}
                    className="w-4 h-4 accent-amber-600 cursor-pointer"
                  />
                  <span>{personality}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-amber-200 mb-2 text-sm font-medium">Motivação para Entrar na Guilda</label>
            <textarea
              value={formData.guild_motivation || ''}
              onChange={(e) => setFormData({...formData, guild_motivation: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none resize-none transition-colors"
              placeholder="Conte-nos por que você quer fazer parte da guilda..."
            />
          </div>

          <div>
            <label className="block text-amber-200 mb-2 text-sm font-medium">Bio Pessoal</label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none resize-none transition-colors"
              placeholder="Conte um pouco sobre você e sua experiência no jogo..."
            />
          </div>
        </div>
      </section>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-800 to-amber-800 hover:from-red-700 hover:to-amber-700 text-amber-100 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          Salvar Alterações
        </button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="px-6 py-3 bg-black/40 border border-amber-700/30 text-amber-200 rounded-lg hover:bg-black/60 transition-all"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
