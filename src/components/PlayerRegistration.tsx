import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Swords, Shield, Heart, Users, User, Globe } from 'lucide-react';

export default function PlayerRegistration() {
  const [formData, setFormData] = useState({
    nickname: '',
    player_id: '',
    platform: '',
    primary_weapon: '',
    secondary_weapon: '',
    build_type: '',
    favorite_weapon: '',
    level: 1,
    combat_power: 0,
    professions: [] as string[],
    faction_reputation: '',
    started_playing: '',
    weekly_hours: 0,
    mmorpg_experience: '',
    availability_days: [] as string[],
    availability_time: '',
    guild_role: '',
    content_interest: [] as string[],
    has_microphone: false,
    discord_required: false,
    desired_rank: '',
    age: 0,
    country: '',
    city: '',
    discord_id: '',
    game_platform_id: '',
    streaming_link: '',
    character_image: '',
    build_image: '',
    guild_motivation: '',
    how_found_us: '',
    expectations: '',
    bio: '',
    gamer_personality: [] as string[],
  });

  const [submitted, setSubmitted] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const cleanData = {
        ...formData,
        started_playing: formData.started_playing || null,
        age: formData.age || null,
        weekly_hours: formData.weekly_hours || null,
      };

      const { data, error } = await supabase
        .from('players')
        .insert([cleanData])
        .select()
        .single();

      if (error) throw error;

      setPlayerId(data.id);
      setSubmitted(true);
      localStorage.setItem('playerId', data.id);
    } catch (error) {
      console.error('Error registering player:', error);
      alert('Erro ao registrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(v => v !== value)
    }));
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="bg-gradient-to-br from-red-900/30 to-amber-900/30 border-2 border-amber-600/50 rounded-lg p-12 backdrop-blur-sm">
          <Swords className="w-20 h-20 mx-auto mb-6 text-amber-400" />
          <h2 className="text-3xl font-bold text-amber-100 mb-4">
            注册成功！
          </h2>
          <p className="text-amber-200/80 mb-6">
            Seu registro foi concluído com sucesso. Guarde este ID para editar seu perfil no futuro:
          </p>
          <div className="bg-black/40 p-4 rounded border border-amber-600/30 mb-6">
            <code className="text-amber-400 text-lg break-all">{playerId}</code>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-red-800 to-amber-800 hover:from-red-700 hover:to-amber-700 text-amber-100 rounded-lg transition-all"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-amber-400 mb-4">
          Registro de Jogadores
        </h1>
      </div>

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
              value={formData.nickname}
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="Seu nome no jogo"
            />
          </div>
          <div>
            <label className="block text-amber-200 mb-2 text-sm font-medium">Plataforma</label>
            <select
              value={formData.platform}
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
              value={formData.player_id}
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
              value={formData.primary_weapon}
              onChange={(e) => setFormData({...formData, primary_weapon: e.target.value})}
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
              value={formData.secondary_weapon}
              onChange={(e) => setFormData({...formData, secondary_weapon: e.target.value})}
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
              value={formData.build_type}
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
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: parseInt(e.target.value) || 1})}
                className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
                placeholder="1-60"
              />
            </div>
            <div>
              <label className="block text-amber-200 mb-2 text-sm font-medium">Poder de Combate</label>
              <input
                type="number"
                value={formData.combat_power}
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
                    checked={formData.professions.includes(prof)}
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
                    checked={formData.availability_days.includes(day)}
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
                value={formData.availability_time}
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
                value={formData.guild_role}
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
                    checked={formData.content_interest.includes(content)}
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
                checked={formData.has_microphone}
                onChange={(e) => setFormData({...formData, has_microphone: e.target.checked})}
                className="w-4 h-4 accent-amber-600 cursor-pointer"
              />
              <span>Tem Microfone</span>
            </label>
            <label className="flex items-center gap-2 text-amber-200 cursor-pointer hover:text-amber-100 transition-colors">
              <input
                type="checkbox"
                checked={formData.discord_required}
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
              value={formData.discord_id}
              onChange={(e) => setFormData({...formData, discord_id: e.target.value})}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none transition-colors"
              placeholder="usuario#1234"
            />
          </div>
          <div>
            <label className="block text-amber-200 mb-2 text-sm font-medium">Steam/Epic/NetEase ID</label>
            <input
              type="text"
              value={formData.game_platform_id}
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
                    checked={formData.gamer_personality.includes(personality)}
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
              value={formData.guild_motivation}
              onChange={(e) => setFormData({...formData, guild_motivation: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none resize-none transition-colors"
              placeholder="Conte-nos por que você quer fazer parte da guilda..."
            />
          </div>
          <div>
            <label className="block text-amber-200 mb-2 text-sm font-medium">Bio Pessoal</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none resize-none transition-colors"
              placeholder="Conte um pouco sobre você e sua experiência no jogo..."
            />
          </div>
        </div>
      </section>

      <div className="text-center">
        <button
          type="submit"
          disabled={loading}
          className="px-12 py-4 bg-gradient-to-r from-red-800 to-amber-800 hover:from-red-700 hover:to-amber-700 text-amber-100 text-xl font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-900/50"
        >
          {loading ? 'Carregando...' : 'Registrar'}
        </button>
      </div>
    </form>
  );
}
