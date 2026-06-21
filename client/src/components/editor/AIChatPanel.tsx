import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Wand2, Loader2 } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { formatRelative } from '@/lib/utils';

const QUICK_PROMPTS = [
  'Agrandis le salon de 2m²',
  'Ajoute un dressing à la chambre principale',
  'Déplace la cuisine vers le nord',
  'Ajoute une terrasse couverte',
  'Optimise la circulation intérieure',
  'Ajoute un WC séparé',
];

export default function AIChatPanel() {
  const { aiMessages, sendAIMessage, modifyPlan, activePlan, isGenerating } = useProjectStore();
  const [message, setMessage] = useState('');
  const [isModify, setIsModify] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    const msg = message;
    setMessage('');

    if (isModify && activePlan) {
      await modifyPlan(msg);
    } else {
      await sendAIMessage(msg);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {aiMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-500/10 flex items-center justify-center mb-3">
              <Bot size={24} className="text-brand-400" />
            </div>
            <h3 className="text-sm font-semibold mb-1">Assistant IA</h3>
            <p className="text-xs text-dark-300 mb-6">
              Posez des questions ou demandez des modifications à votre plan
            </p>

            <div className="space-y-2">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button key={i} onClick={() => setMessage(prompt)}
                  className="block w-full text-left px-3 py-2 rounded-xl bg-dark-700 text-xs text-dark-200
                    hover:bg-dark-600 hover:text-white transition-all">
                  <Wand2 size={10} className="inline mr-2 text-brand-400" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          aiMessages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center
                ${msg.role === 'USER' ? 'bg-dark-500' : 'bg-brand-500/20'}`}>
                {msg.role === 'USER' ? <User size={12} /> : <Bot size={12} className="text-brand-400" />}
              </div>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm
                ${msg.role === 'USER'
                  ? 'bg-brand-500 text-white rounded-tr-md'
                  : 'bg-dark-700 text-dark-100 rounded-tl-md'}`}>
                <p className="whitespace-pre-wrap text-[13px]">{msg.content}</p>
                <p className="text-[9px] mt-1 opacity-50">{formatRelative(msg.createdAt)}</p>
              </div>
            </motion.div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Mode toggle */}
      <div className="px-4 py-2 flex gap-1 bg-dark-700/30">
        <button onClick={() => setIsModify(false)}
          className={`px-3 py-1 rounded-lg text-[11px] font-medium ${!isModify ? 'bg-dark-500 text-white' : 'text-dark-300'}`}>
          💬 Chat
        </button>
        <button onClick={() => setIsModify(true)}
          className={`px-3 py-1 rounded-lg text-[11px] font-medium ${isModify ? 'bg-brand-500/20 text-brand-400' : 'text-dark-300'}`}>
          ✨ Modifier le plan
        </button>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-dark-500/30">
        <div className="flex gap-2">
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className="input py-2 text-sm"
            placeholder={isModify ? 'Décrivez la modification...' : 'Posez une question...'}
            disabled={isGenerating}
          />
          <button onClick={handleSend} disabled={isGenerating || !message.trim()}
            className="p-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 transition-all">
            {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
