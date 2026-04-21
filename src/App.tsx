import { useState, useEffect } from 'react';
import { Settings2, Twitch, Youtube, LayoutGrid, Maximize2, Monitor, Smartphone, ExternalLink, Info, Activity, Zap, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { extractYoutubeId, extractTwitchChannel } from '@/src/lib/url-utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [twitchChannel, setTwitchChannel] = useState(() => localStorage.getItem('twitchChannel') || '');
  const [youtubeVideoId, setYoutubeVideoId] = useState(() => localStorage.getItem('youtubeVideoId') || '');
  const [isConfiguring, setIsConfiguring] = useState(!twitchChannel && !youtubeVideoId);
  const [hostname, setHostname] = useState('');
  const [latency, setLatency] = useState(42);

  useEffect(() => {
    setHostname(window.location.hostname);
    localStorage.setItem('twitchChannel', twitchChannel);
    localStorage.setItem('youtubeVideoId', youtubeVideoId);
    
    const interval = setInterval(() => {
      setLatency(prev => Math.max(30, Math.min(60, prev + (Math.random() * 10 - 5))));
    }, 3000);
    return () => clearInterval(interval);
  }, [twitchChannel, youtubeVideoId]);

  const twitchChannelClean = extractTwitchChannel(twitchChannel);
  const youtubeIdClean = extractYoutubeId(youtubeVideoId);
  
  // Try to include potential parents for AI Studio environments
  const twitchSrc = twitchChannelClean 
    ? `https://www.twitch.tv/embed/${twitchChannelClean}/chat?parent=${hostname}&parent=ai.studio&parent=googleusercontent.com&parent=cloudshell.dev&parent=localhost&darkpopout`
    : '';
    
  const youtubeSrc = youtubeIdClean
    ? `https://www.youtube.com/live_chat?v=${youtubeIdClean}&embed_domain=${hostname}`
    : '';

  const renderChat = (type: 'twitch' | 'youtube') => {
    const isTwitch = type === 'twitch';
    const channelId = isTwitch ? twitchChannelClean : youtubeIdClean;
    const src = isTwitch ? twitchSrc : youtubeSrc;
    const externalUrl = isTwitch 
      ? `https://www.twitch.tv/popout/${channelId}/chat` 
      : `https://youtube.com/live_chat?v=${channelId}`;

    if (channelId) {
      return (
        <div className={`flex-1 flex flex-col border-r border-[#27272A] last:border-r-0 h-full overflow-hidden`}>
          <div className="h-8 flex items-center px-4 bg-[#18181B] border-b border-[#27272A] justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest text-zinc-500`}>
                Stream de Dados: {isTwitch ? 'Twitch' : 'YouTube'}
              </span>
              <span className={`px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold text-white uppercase ${isTwitch ? 'bg-[#9146FF]' : 'bg-[#FF0000]'}`}>
                {isTwitch ? 'TW' : 'YT'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href={externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                title="Abrir em nova aba caso o chat não carregue"
              >
                <ExternalLink size={10} />
                <span>POPOUT</span>
              </a>
              <span className="flex items-center gap-1.5 border-l border-[#27272A] pl-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-mono text-green-500">LIVE</span>
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden relative bg-black">
            <iframe
              src={src}
              className="w-full h-full"
              frameBorder="0"
              title={`${type}-chat`}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center border-r border-[#27272A] last:border-r-0 bg-[#0A0A0B] text-zinc-600">
        <Info size={32} className="mb-2 opacity-20" />
        <p className="text-[10px] font-bold uppercase tracking-widest">Aguardando Conexão</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0A0A0B] text-[#E4E4E7] overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* High Density Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-[#27272A] bg-[#121214] shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center font-bold text-white italic shadow-lg shadow-indigo-600/20">
            DS
          </div>
          <h1 className="text-lg font-bold tracking-tight uppercase">
            DUAL<span className="text-indigo-500">STREAM</span> <span className="font-light text-zinc-500">CHAT</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline"
            className="hidden sm:flex border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 h-8 px-3 text-[10px] font-bold tracking-widest gap-2"
            onClick={() => window.open(window.location.href, '_blank')}
          >
            <ExternalLink size={12} />
            ABRIR EM NOVA ABA
          </Button>

          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-md border border-[#27272A] transition-all focus-within:border-indigo-500/50">
            <span className="px-1 py-0.5 rounded-[2px] text-[9px] font-bold bg-[#9146FF] text-white uppercase tracking-tighter">Twitch</span>
            <input 
              type="text" 
              placeholder="Username" 
              value={twitchChannel}
              onChange={(e) => setTwitchChannel(e.target.value)}
              className="bg-transparent border-none text-xs focus:ring-0 w-28 text-zinc-300 placeholder:text-zinc-600 h-4"
            />
          </div>

          <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-md border border-[#27272A] transition-all focus-within:border-indigo-500/50">
            <span className="px-1 py-0.5 rounded-[2px] text-[9px] font-bold bg-[#FF0000] text-white uppercase tracking-tighter">YouTube</span>
            <input 
              type="text" 
              placeholder="Video Link/ID" 
              value={youtubeVideoId}
              onChange={(e) => setYoutubeVideoId(e.target.value)}
              className="bg-transparent border-none text-xs focus:ring-0 w-28 text-zinc-300 placeholder:text-zinc-600 h-4"
            />
          </div>

          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 h-8 px-4 rounded-[4px] text-[10px] font-bold tracking-widest transition-all shadow-lg shadow-indigo-600/10 active:scale-95"
            onClick={() => setIsConfiguring(false)}
          >
            CONECTAR
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex flex-1 overflow-hidden">
        {renderChat('twitch')}
        {renderChat('youtube')}
      </main>

      {/* High Density Footer */}
      <footer className="h-10 bg-[#0F0F12] border-t border-[#27272A] flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity size={12} className="text-indigo-500" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
              Active Streams: {(twitchChannel ? 1 : 0) + (youtubeVideoId ? 1 : 0)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={12} className="text-zinc-700" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
              Latency: <span className="font-mono text-zinc-400">{latency.toFixed(0)}ms</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi size={12} className="text-green-500/50" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter">
              Status: <span className="text-green-500 font-mono italic">OPERATIONAL</span>
            </span>
          </div>
        </div>
        
        <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest flex items-center gap-2">
          <span className="opacity-50">V.1.0.4-STABLE // SYSTEM READY</span>
          <div className="w-1 h-1 rounded-full bg-zinc-800" />
          <div className="flex gap-1">
             <div className="w-4 h-1 bg-indigo-500/20" />
             <div className="w-4 h-1 bg-indigo-500/40" />
             <div className="w-4 h-1 bg-indigo-500/60" />
          </div>
        </div>
      </footer>

      {/* Mobile Overlay Hint */}
      <div className="md:hidden fixed bottom-14 right-4 z-50">
        <div className="bg-indigo-600 p-2 rounded-full shadow-2xl animate-bounce">
          <Smartphone size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}


