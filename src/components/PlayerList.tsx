import { useEffect, useState } from 'react';
import { supabase, Player } from '../lib/supabase';
import { Users, Search } from 'lucide-react';

export default function PlayerList() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWeapon, setFilterWeapon] = useState('');
  const [filterBuildType, setFilterBuildType] = useState('');

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    filterPlayersList();
  }, [searchTerm, filterWeapon, filterBuildType, players]);

  const loadPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlayersList = () => {
    let filtered = players;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.discord_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterWeapon) {
      filtered = filtered.filter(p => (p as any).primary_weapon === filterWeapon || (p as any).secondary_weapon === filterWeapon);
    }

    if (filterBuildType) {
      filtered = filtered.filter(p => p.build_type === filterBuildType);
    }

    setFilteredPlayers(filtered);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-amber-400 text-2xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-amber-400">
            Lista de Guerreiros
          </h1>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-6 mb-6 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-amber-200 mb-2">
              <Search className="inline w-4 h-4 mr-2" />
              Buscar Jogador
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nome ou Discord..."
              className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-amber-200 mb-2">Arma</label>
            <select
              value={filterWeapon}
              onChange={(e) => setFilterWeapon(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="">Todas</option>
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
            <label className="block text-amber-200 mb-2">Tipo de Build</label>
            <select
              value={filterBuildType}
              onChange={(e) => setFilterBuildType(e.target.value)}
              className="w-full px-4 py-2 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
            >
              <option value="">Todas</option>
              <option value="DPS">DPS</option>
              <option value="Tank">Tank</option>
              <option value="Support">Support</option>
              <option value="CC">CC</option>
            </select>
          </div>
        </div>
      </div>

      <div className="text-amber-200/60 mb-4">
        Total: {filteredPlayers.length} jogadores
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            className="bg-gradient-to-br from-red-950/60 to-amber-950/60 border-2 border-amber-700/40 rounded-lg p-6 backdrop-blur-sm hover:border-amber-500/60 transition-all hover:shadow-lg hover:shadow-amber-900/30"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-amber-100">{player.nickname}</h3>
              </div>
              {player.level && (
                <div className="bg-red-900/50 px-3 py-1 rounded-full border border-amber-600/30">
                  <span className="text-amber-400 font-bold">Lv {player.level}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              {(player as any).primary_weapon && (
                <div className="flex justify-between">
                  <span className="text-amber-300/60">Arma Primária:</span>
                  <span className="text-amber-200">{(player as any).primary_weapon}</span>
                </div>
              )}
              {(player as any).secondary_weapon && (
                <div className="flex justify-between">
                  <span className="text-amber-300/60">Arma Secundária:</span>
                  <span className="text-amber-200">{(player as any).secondary_weapon}</span>
                </div>
              )}
              {player.build_type && (
                <div className="flex justify-between">
                  <span className="text-amber-300/60">Build:</span>
                  <span className="text-amber-200">{player.build_type}</span>
                </div>
              )}
              {player.combat_power > 0 && (
                <div className="flex justify-between">
                  <span className="text-amber-300/60">Poder:</span>
                  <span className="text-amber-200">{player.combat_power}</span>
                </div>
              )}
              {player.discord_id && (
                <div className="flex justify-between">
                  <span className="text-amber-300/60">Discord:</span>
                  <span className="text-amber-200 truncate ml-2">{player.discord_id}</span>
                </div>
              )}
              {player.guild_role && (
                <div className="flex justify-between">
                  <span className="text-amber-300/60">Função:</span>
                  <span className="text-amber-200">{player.guild_role}</span>
                </div>
              )}
            </div>

            {player.gamer_personality && player.gamer_personality.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {player.gamer_personality.slice(0, 3).map((trait) => (
                  <span
                    key={trait}
                    className="px-2 py-1 bg-amber-900/30 border border-amber-700/30 rounded text-xs text-amber-300"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-12 text-amber-300/60">
          Nenhum jogador encontrado com esses filtros.
        </div>
      )}
    </div>
  );
}
