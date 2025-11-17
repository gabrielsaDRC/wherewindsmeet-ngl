import { Map } from 'lucide-react';

export default function InteractiveMap() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-red-950/40 to-amber-950/40 border-2 border-amber-700/40 rounded-lg overflow-hidden backdrop-blur-sm">
          <div className="p-8 border-b border-amber-700/30">
            <div className="flex items-center gap-3 mb-4">
              <Map className="w-8 h-8 text-amber-400" />
              <h1 className="text-4xl font-bold text-amber-100">Mapa Interativo</h1>
            </div>
            <p className="text-amber-200/70">
              Explore o mundo de Where Winds Meet com nosso mapa interativo completo.
              Encontre localizações importantes, recursos, NPCs e muito mais.
            </p>
          </div>

          <div className="relative w-full bg-black/20">
            <iframe
              src="https://mapgenie.io/where-winds-meet/maps/world?embed=light"
              className="w-full"
              style={{ height: 'calc(100vh - 300px)', minHeight: '500px', border: 'none' }}
              title="Where Winds Meet Interactive Map"
              loading="lazy"
            />
          </div>

          <div className="p-6 bg-black/20 border-t border-amber-700/30">
            <p className="text-amber-300/60 text-sm text-center">
              Mapa fornecido por{' '}
              <a
                href="https://mapgenie.io/where-winds-meet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 transition-colors underline"
              >
                MapGenie.io
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
