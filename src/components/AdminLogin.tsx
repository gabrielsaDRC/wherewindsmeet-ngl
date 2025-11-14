import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Shield, Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('admin_account')
        .select('*')
        .eq('username', username)
        .maybeSingle();

      if (error) throw error;

      if (data && data.password_hash === password) {
        sessionStorage.setItem('adminAuth', 'true');
        sessionStorage.setItem('adminId', data.id);
        onLogin();
      } else {
        alert('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-red-950/60 to-amber-950/60 border-2 border-amber-700/40 rounded-lg p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <Shield className="w-16 h-16 mx-auto mb-4 text-amber-400" />
            <h2 className="text-3xl font-bold text-amber-100 mb-2">Painel Administrativo</h2>
            <p className="text-amber-200/70">Acesso restrito</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-amber-200 mb-2">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-amber-200 mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/40 border border-amber-700/30 rounded text-amber-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-800 to-amber-800 hover:from-red-700 hover:to-amber-700 text-amber-100 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-5 h-5" />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
