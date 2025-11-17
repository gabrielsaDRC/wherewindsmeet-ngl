import { useState } from 'react';
import { Type, Image, Heading, Plus, Trash2 } from 'lucide-react';

interface ContentBlock {
  type: 'text' | 'image' | 'heading';
  content: string;
  fontSize?: string;
  color?: string;
  url?: string;
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addBlock = (type: 'text' | 'image' | 'heading') => {
    const newBlock: ContentBlock = {
      type,
      content: '',
      fontSize: type === 'text' ? '16px' : undefined,
      color: type === 'text' || type === 'heading' ? '#fef3c7' : undefined,
      url: type === 'image' ? '' : undefined,
    };
    onChange([...value, newBlock]);
    setEditingIndex(value.length);
  };

  const updateBlock = (index: number, updates: Partial<ContentBlock>) => {
    const newBlocks = [...value];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    onChange(newBlocks);
  };

  const removeBlock = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === value.length - 1) return;

    const newBlocks = [...value];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    onChange(newBlocks);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => addBlock('text')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all"
        >
          <Type className="w-4 h-4" />
          Adicionar Texto
        </button>
        <button
          type="button"
          onClick={() => addBlock('heading')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-800 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all"
        >
          <Heading className="w-4 h-4" />
          Adicionar Título
        </button>
        <button
          type="button"
          onClick={() => addBlock('image')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-800 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all"
        >
          <Image className="w-4 h-4" />
          Adicionar Imagem
        </button>
      </div>

      <div className="space-y-3">
        {value.map((block, index) => (
          <div
            key={index}
            className="bg-black/30 border border-amber-700/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-200/70 text-sm font-semibold">
                {block.type === 'text' && 'Texto'}
                {block.type === 'heading' && 'Título'}
                {block.type === 'image' && 'Imagem'}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => moveBlock(index, 'up')}
                  disabled={index === 0}
                  className="px-2 py-1 bg-black/40 text-amber-200/70 rounded hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(index, 'down')}
                  disabled={index === value.length - 1}
                  className="px-2 py-1 bg-black/40 text-amber-200/70 rounded hover:bg-black/60 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className="px-2 py-1 bg-red-800/50 text-red-200 rounded hover:bg-red-800 text-xs"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {block.type === 'image' ? (
              <div>
                <label className="block text-amber-200/70 text-sm mb-2">
                  URL da Imagem
                </label>
                <input
                  type="text"
                  value={block.url || ''}
                  onChange={(e) => updateBlock(index, { url: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full px-4 py-2 bg-black/30 border border-amber-700/30 rounded-lg text-amber-100 placeholder-amber-200/30 focus:border-amber-500/50 focus:outline-none"
                />
                {block.url && (
                  <img
                    src={block.url}
                    alt="Preview"
                    className="mt-3 rounded-lg max-h-48 object-cover"
                  />
                )}
              </div>
            ) : (
              <>
                <textarea
                  value={block.content}
                  onChange={(e) => updateBlock(index, { content: e.target.value })}
                  placeholder={
                    block.type === 'heading' ? 'Digite o título...' : 'Digite o texto...'
                  }
                  rows={block.type === 'heading' ? 2 : 4}
                  className="w-full px-4 py-2 bg-black/30 border border-amber-700/30 rounded-lg text-amber-100 placeholder-amber-200/30 focus:border-amber-500/50 focus:outline-none mb-3"
                />

                <div className="grid grid-cols-2 gap-3">
                  {block.type === 'text' && (
                    <div>
                      <label className="block text-amber-200/70 text-sm mb-1">
                        Tamanho da Fonte
                      </label>
                      <select
                        value={block.fontSize || '16px'}
                        onChange={(e) => updateBlock(index, { fontSize: e.target.value })}
                        className="w-full px-3 py-2 bg-black/30 border border-amber-700/30 rounded-lg text-amber-100 focus:border-amber-500/50 focus:outline-none"
                      >
                        <option value="12px">Pequeno (12px)</option>
                        <option value="14px">Pequeno-Médio (14px)</option>
                        <option value="16px">Médio (16px)</option>
                        <option value="18px">Grande (18px)</option>
                        <option value="20px">Muito Grande (20px)</option>
                        <option value="24px">Extra Grande (24px)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-amber-200/70 text-sm mb-1">
                      Cor do Texto
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={block.color || '#fef3c7'}
                        onChange={(e) => updateBlock(index, { color: e.target.value })}
                        className="h-10 w-20 bg-black/30 border border-amber-700/30 rounded-lg cursor-pointer"
                      />
                      <input
                        type="text"
                        value={block.color || '#fef3c7'}
                        onChange={(e) => updateBlock(index, { color: e.target.value })}
                        className="flex-1 px-3 py-2 bg-black/30 border border-amber-700/30 rounded-lg text-amber-100 focus:border-amber-500/50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <div className="text-center py-12 text-amber-200/50">
          Adicione blocos de conteúdo usando os botões acima
        </div>
      )}
    </div>
  );
}
