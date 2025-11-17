import { useState } from 'react';
import { Home, UserPlus, Users, FileText, Edit, Shield, Map } from 'lucide-react';
import PlayerRegistration from './components/PlayerRegistration';
import PlayerList from './components/PlayerList';
import PlayerEdit from './components/PlayerEdit';
import Blog from './components/Blog';
import InteractiveMap from './components/InteractiveMap';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

type Page = 'home' | 'register' | 'list' | 'edit' | 'blog' | 'map' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    sessionStorage.getItem('adminAuth') === 'true'
  );

  const renderPage = () => {
    if (currentPage === 'admin') {
      if (isAdminAuthenticated) {
        return <AdminDashboard onLogout={() => {
          setIsAdminAuthenticated(false);
          setCurrentPage('home');
        }} />;
      }
      return <AdminLogin onLogin={() => setIsAdminAuthenticated(true)} />;
    }

    switch (currentPage) {
      case 'register':
        return <PlayerRegistration />;
      case 'list':
        return <PlayerList />;
      case 'edit':
        return <PlayerEdit />;
      case 'blog':
        return <Blog />;
      case 'map':
        return <InteractiveMap />;
      default:
        return <HomePage setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen">
      {currentPage !== 'admin' && (
        <nav className="bg-black/30 border-b border-amber-700/30 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-3"
              >
                <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400 hover:from-red-300 hover:to-amber-300 transition-all">
                  Not Gonna Lie
                </span>
              </button>
              <div className="flex gap-4">
                <NavButton
                  icon={<Home className="w-4 h-4" />}
                  label="Início"
                  active={currentPage === 'home'}
                  onClick={() => setCurrentPage('home')}
                />
                <NavButton
                  icon={<FileText className="w-4 h-4" />}
                  label="Blog"
                  active={currentPage === 'blog'}
                  onClick={() => setCurrentPage('blog')}
                />
                <NavButton
                  icon={<Map className="w-4 h-4" />}
                  label="Mapa"
                  active={currentPage === 'map'}
                  onClick={() => setCurrentPage('map')}
                />
                <NavButton
                  icon={<Users className="w-4 h-4" />}
                  label="Jogadores"
                  active={currentPage === 'list'}
                  onClick={() => setCurrentPage('list')}
                />
                <NavButton
                  icon={<UserPlus className="w-4 h-4" />}
                  label="Registrar"
                  active={currentPage === 'register'}
                  onClick={() => setCurrentPage('register')}
                />
                <NavButton
                  icon={<Edit className="w-4 h-4" />}
                  label="Editar"
                  active={currentPage === 'edit'}
                  onClick={() => setCurrentPage('edit')}
                />
              </div>
            </div>
          </div>
        </nav>
      )}

      <main>
        {renderPage()}
      </main>

      <button
        onClick={() => setCurrentPage('admin')}
        className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-red-900/80 to-amber-900/80 hover:from-red-800 hover:to-amber-800 border border-amber-700/30 rounded-full shadow-lg backdrop-blur-sm transition-all opacity-30 hover:opacity-100"
        title="Admin"
      >
        <Shield className="w-5 h-5 text-amber-200" />
      </button>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
        active
          ? 'bg-gradient-to-r from-red-800 to-amber-800 text-amber-100 shadow-lg'
          : 'bg-black/20 text-amber-200/70 hover:bg-black/40 hover:text-amber-100'
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function HomePage({ setPage }: { setPage: (page: Page) => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-red-400 to-amber-400 mb-3 text-shadow-glow">
            逐风行者
          </h1>
          <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400 mb-6 text-shadow-glow">
            NGL
          </p>
          <p className="text-3xl text-amber-200/70 mb-4">Where Winds Meet</p>
          <p className="text-xl text-amber-300/60">Sistema de Cadastro de Jogadores</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActionCard
            icon={<UserPlus className="w-12 h-12" />}
            title="Registrar-se"
            description="Cadastre seu personagem e junte-se à nossa comunidade"
            onClick={() => setPage('register')}
            gradient="from-red-900/60 to-amber-900/60"
          />
          <ActionCard
            icon={<Users className="w-12 h-12" />}
            title="Ver Jogadores"
            description="Confira todos os guerreiros registrados"
            onClick={() => setPage('list')}
            gradient="from-amber-900/60 to-red-900/60"
          />
          <ActionCard
            icon={<FileText className="w-12 h-12" />}
            title="Blog"
            description="Últimas notícias e atualizações"
            onClick={() => setPage('blog')}
            gradient="from-red-900/60 to-slate-900/60"
          />
          <ActionCard
            icon={<Map className="w-12 h-12" />}
            title="Mapa Interativo"
            description="Explore o mundo de Where Winds Meet"
            onClick={() => setPage('map')}
            gradient="from-slate-900/60 to-red-900/60"
          />
          <ActionCard
            icon={<Edit className="w-12 h-12" />}
            title="Editar Perfil"
            description="Atualize suas informações"
            onClick={() => setPage('edit')}
            gradient="from-amber-900/60 to-slate-900/60"
          />
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-amber-100 mb-4">Bem-vindo à NGL</h2>
            <p className="text-amber-200/80 leading-relaxed max-w-2xl">
              Aqui você pode registrar seu personagem, compartilhar seu progresso,
              encontrar companheiros de jornada e participar de eventos épicos.
              Una-se a nós nesta aventura pelo mundo místico de Where Winds Meet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  onClick,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} border-2 border-amber-700/40 rounded-lg p-8 backdrop-blur-sm hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-900/30 transition-all transform hover:scale-105 text-left group`}
    >
      <div className="text-amber-400 mb-4 group-hover:text-amber-300 transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-amber-100 mb-2 group-hover:text-amber-50 transition-colors">
        {title}
      </h3>
      <p className="text-amber-200/70 group-hover:text-amber-200/90 transition-colors">
        {description}
      </p>
    </button>
  );
}

export default App;
