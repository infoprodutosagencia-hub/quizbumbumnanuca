/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, ChevronRight, Clock, Calendar as CalendarIcon, Utensils, Zap, Users, Trophy, Star, Shield, AlertTriangle, ShieldCheck } from 'lucide-react';

// --- Types ---
type Screen = 
  | 'LANDING' 
  | 'AUTHORITY' 
  | 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'Q5' 
  | 'SOCIAL_PROOF_INTER' 
  | 'Q6' | 'Q7' | 'Q8' | 'Q9' 
  | 'BUMBUM_TIMIDO' 
  | 'ANALYSIS' 
  | 'Q12' | 'Q13' | 'Q14' | 'Q15' 
  | 'EVOLUTION_GRAPH' 
  | 'OFFER';

interface QuizState {
  screen: Screen;
  idade: number | null;
  objetivo: string | null;
  totalCM: number;
  respostas: Record<string, any>;
  marcosAtingidos: number[];
}

// --- Components ---

interface PlaceholderProps {
  text: string;
  width?: string;
  height?: string;
  className?: string;
  src?: string;
  objectPosition?: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ text, width = '100%', height = '200px', className = '', src, objectPosition = 'center' }) => (
  <div 
    className={`glass rounded-3xl flex flex-col items-center justify-center p-6 text-center relative overflow-hidden group ${className}`}
    style={{ width, height }}
  >
    {src ? (
      <>
        <img 
          src={src} 
          alt={text} 
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          style={{ 
            imageRendering: 'auto',
            filter: 'contrast(1.1) brightness(1.05) saturate(1.15) blur(0.3px) drop-shadow(0 0 15px rgba(0,0,0,0.4))',
            objectPosition: objectPosition,
            transform: 'scale(1.02)' // Slightly overscale to hide edge artifacts
          }}
          referrerPolicy="no-referrer"
        />
        {/* HD Enhancement Overlays */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
        <div className="absolute inset-0 border-[0.5px] border-white/10 rounded-3xl pointer-events-none" />
      </>
    ) : (
      <>
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
        <Camera className="text-white/20 mb-3 group-hover:scale-110 transition-transform duration-500" size={40} strokeWidth={1} />
        <span className="text-white/40 text-[0.65rem] uppercase font-medium tracking-[0.2em] leading-tight max-w-[140px]">{text}</span>
      </>
    )}
  </div>
);

const Meter = ({ cm, show }: { cm: number, show: boolean }) => {
  const [displayCm, setDisplayCm] = useState(0);
  const progress = Math.min((cm / 15) * 100, 100);

  useEffect(() => {
    let start = displayCm;
    const end = cm;
    const duration = 800;
    const startTime = performance.now();

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = start + (end - start) * progress;
      setDisplayCm(current);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [cm]);

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-md mx-auto glass rounded-full p-1.5 px-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm">🍑</span>
          </div>
          <span className="text-[0.6rem] font-black uppercase tracking-[0.15em] text-white/60">Potencial</span>
        </div>
        
        <div className="flex-1 mx-6 h-1 bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-primary shadow-[0_0_10px_rgba(233,84,162,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 30, damping: 15 }}
          />
        </div>

        <div className="flex items-baseline gap-1 min-w-[50px] justify-end">
          <span className="text-primary font-black text-sm">+{displayCm.toFixed(1)}</span>
          <span className="text-primary font-black text-[0.6rem]">CM</span>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [state, setState] = useState<QuizState>({
    screen: 'LANDING',
    idade: null,
    objetivo: null,
    totalCM: 0,
    respostas: {},
    marcosAtingidos: [],
  });

  const [floatingText, setFloatingText] = useState<string | null>(null);
  const [flash, setFlash] = useState(false);

  const playClickSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const addCM = (amount: number) => {
    const newTotal = state.totalCM + amount;
    const newMarcos = [...state.marcosAtingidos];
    const marcos = [2, 4, 6, 8, 10];
    
    let triggered = false;
    marcos.forEach(m => {
      if (newTotal >= m && !newMarcos.includes(m)) {
        newMarcos.push(m);
        triggered = true;
      }
    });

    if (triggered) {
      setFloatingText(`🔥 +${amount} CM DESBLOQUEADO!`);
      setFlash(true);
      setTimeout(() => {
        setFloatingText(null);
        setFlash(false);
      }, 1500);
    }

    setState(prev => ({ ...prev, totalCM: newTotal, marcosAtingidos: newMarcos }));
  };

  const nextScreen = (next: Screen, cmToAdd: number = 0) => {
    playClickSound();
    if (cmToAdd > 0) addCM(cmToAdd);
    setTimeout(() => {
      setState(prev => ({ ...prev, screen: next }));
      window.scrollTo(0, 0);
    }, 400);
  };

  // --- Screens ---

  const Landing = () => {
    const [liveCount, setLiveCount] = useState(2847);
    useEffect(() => {
      const interval = setInterval(() => {
        setLiveCount(prev => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3 + 1));
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center p-6 pt-16 text-center min-h-screen bg-black"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <div className="space-y-6 mb-12">
            <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              Aumenta e levanta seu <span className="highlight-pink">bumbum</span> em apenas <span className="highlight-pink">28 dias</span>
            </h1>
            <p className="text-white/40 uppercase tracking-[0.3em] text-[0.65rem] font-bold">Com apenas 8 minutos por dia</p>
          </div>

          <div className="p-1.5 border border-white/10 rounded-[2.5rem] mb-12 shadow-[0_0_60px_rgba(233,84,162,0.1)]">
            <Placeholder 
              text="EDITORIAL — COACH NUNZI" 
              height="520px" 
              className="rounded-[2.2rem]" 
              src="https://i.postimg.cc/rdyDLRP6/Captura-de-Tela-2026-03-31-a-s-14-47-28.png"
            />
          </div>
          
          <div className="divider" />

          <p className="text-lg font-light text-white/80 mb-12 max-w-xs mx-auto leading-relaxed">
            O método definitivo para quem busca <span className="text-white font-bold">firmeza e volume</span> sem precisar de academia.
          </p>
          
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-white/60">
                {liveCount.toLocaleString()} MULHERES ONLINE
              </span>
            </div>
          </div>

          <button 
            onClick={() => nextScreen('AUTHORITY')}
            className="w-full max-w-xs bg-white text-black font-black py-6 rounded-full text-lg relative overflow-hidden active:scale-95 transition-all duration-300 hover:bg-primary hover:text-white group"
          >
            <span className="relative z-10">INICIAR DIAGNÓSTICO</span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </motion.div>
      </motion.div>
    );
  };

  const Authority = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 pt-16 min-h-screen bg-black"
      >
        <div className="max-w-md mx-auto">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-serif italic text-4xl text-center mb-12"
          >
            Coach Nunzi
          </motion.h2>

          <div className="p-1.5 border border-white/10 rounded-[2.5rem] mb-12 shadow-[0_0_60px_rgba(233,84,162,0.1)]">
            <Placeholder 
              text="EDITORIAL — COACH NUNZI" 
              height="520px" 
              className="rounded-[2.2rem]" 
              src="https://i.postimg.cc/w378G599/images-1-1.png"
              objectPosition="center"
            />
          </div>
          
          <div className="space-y-4 mb-12">
            {[
              { icon: <Trophy size={20} />, text: "12 anos como educador físico" },
              { icon: <Users size={20} />, text: "+4.000.000 de seguidores" },
              { icon: <Check size={20} />, text: "50.000+ mulheres transformadas" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-5 glass p-6 rounded-3xl"
              >
                <div className="text-primary">{item.icon}</div>
                <span className="font-medium text-[0.85rem] tracking-tight text-white/80">{item.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="divider" />

          <p className="text-white/40 text-sm font-light leading-relaxed mb-12 text-center px-4 italic">
            Reconhecido como uma das maiores autoridades em treino feminino focado em glúteos, especializado em ativação, firmeza e projeção do bumbum sem academia.
          </p>

          <button 
            onClick={() => nextScreen('Q1')}
            className="w-full bg-white text-black font-black py-6 rounded-full text-lg relative overflow-hidden active:scale-95 transition-all duration-300 hover:bg-primary hover:text-white group"
          >
            <span className="relative z-10">CONTINUAR</span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </motion.div>
    );
  };

  const Question = ({ title, question, options, next, cmMap, icons }: { title?: string, question: React.ReactNode, options: string[], next: Screen, cmMap: number[], icons?: React.ReactNode[] }) => {
    const [selected, setSelected] = useState<number | null>(null);

    const handleSelect = (idx: number) => {
      setSelected(idx);
      nextScreen(next, cmMap[idx]);
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="p-6 pt-32 min-h-screen bg-black"
      >
        <div className="max-w-md mx-auto">
          {title && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary font-black text-[0.6rem] uppercase tracking-[0.3em] text-center mb-6"
            >
              {title}
            </motion.p>
          )}
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif italic text-3xl sm:text-4xl text-center mb-12 leading-tight"
          >
            {question}
          </motion.h2>

          <div className="space-y-4">
            {options.map((opt, i) => {
              const isEmoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(opt) || /\p{Emoji}/u.test(opt);
              const emoji = isEmoji ? opt.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji}/u)?.[0] : null;
              const text = emoji ? opt.replace(emoji, '').trim() : opt;

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  onClick={() => handleSelect(i)}
                  className={`w-full p-6 rounded-3xl text-left transition-all duration-500 glass group relative overflow-hidden ${
                    selected === i ? 'bg-primary border-primary' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                      {icons && icons[i] && (
                        <div className={`p-2 rounded-xl transition-colors ${selected === i ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                          {icons[i]}
                        </div>
                      )}
                      <span className={`text-[0.9rem] font-medium tracking-tight ${selected === i ? 'text-white' : 'text-white/80'}`}>
                        {text}
                      </span>
                    </div>
                    {selected === i ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check size={20} className="text-white" />
                      </motion.div>
                    ) : emoji ? (
                      <span className="text-xl grayscale group-hover:grayscale-0 transition-all duration-300">{emoji}</span>
                    ) : (
                      <ChevronRight size={18} className="text-white/20 group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          <p className="text-center text-white/20 text-[0.6rem] font-bold uppercase tracking-[0.3em] mt-12">
            Escolha com atenção
          </p>
        </div>
      </motion.div>
    );
  };

  const SocialProofInter = () => {
    const results = [
      { name: 'Roberta', location: 'São Paulo - SP', src: 'https://i.postimg.cc/NK01601r/roberta.png' },
      { name: 'Gabriela', location: 'Rio de Janeiro - RJ', src: 'https://i.postimg.cc/YvS16S1L/gabriela.png' }
    ];

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 pt-24 min-h-screen bg-black"
      >
        <div className="max-w-md mx-auto">
          <h2 className="font-serif italic text-3xl text-center mb-12 leading-tight">
            Resultados de quem seguiu o <span className="highlight-pink">método</span>
          </h2>
          
          <div className="flex flex-col gap-12 mb-12">
            {results.map((res, i) => (
              <div key={i} className="w-full glass rounded-[2.5rem] overflow-hidden relative p-2 border border-white/10 shadow-[0_0_40px_rgba(233,84,162,0.1)]">
                <div className="aspect-square w-full relative rounded-[2.2rem] overflow-hidden bg-white/5">
                  <img 
                    src={res.src} 
                    alt={`Resultado ${res.name}`}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-6 left-6 flex gap-2">
                    <span className="bg-white/10 backdrop-blur-md text-[0.6rem] px-4 py-1.5 rounded-full font-black text-white/60 uppercase tracking-[0.2em]">ANTES</span>
                    <span className="bg-primary/20 backdrop-blur-md text-[0.6rem] px-4 py-1.5 rounded-full font-black text-primary uppercase tracking-[0.2em]">DEPOIS</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-serif italic text-2xl">{res.name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-primary text-primary" />)}
                    </div>
                  </div>
                  <span className="text-white/40 text-sm font-black uppercase tracking-widest">{res.location}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="divider" />

          <p className="text-center font-serif italic text-2xl mb-12 text-white/80">
            Está pronta para turbinar o seu <span className="highlight-pink">bumbum</span> também?
          </p>
          
          <button 
            onClick={() => nextScreen('Q6')}
            className="w-full bg-white text-black font-black py-6 rounded-full text-lg relative overflow-hidden active:scale-95 transition-all duration-300 hover:bg-primary hover:text-white group"
          >
            <span className="relative z-10">ESTOU PRONTA! 🔥</span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </motion.div>
    );
  };

  const AgeQuestion = () => {
    const [age, setAge] = useState('');
    const [error, setError] = useState('');

    const handleConfirm = () => {
      const val = parseInt(age);
      if (isNaN(val) || val < 18 || val > 70) {
        setError('Por favor, insira uma idade válida (18–70)');
        return;
      }
      setState(prev => ({ ...prev, idade: val }));
      nextScreen('BUMBUM_TIMIDO', 1.0);
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 pt-32 text-center min-h-screen bg-black"
      >
        <div className="max-w-md mx-auto">
          <h2 className="font-serif italic text-4xl mb-6 leading-tight">Qual a sua idade?</h2>
          <p className="text-white/20 text-[0.65rem] font-bold uppercase mb-12 tracking-[0.3em]">Sua idade define seu perfil metabólico</p>

          <div className="relative mb-12">
            <input 
              type="number"
              inputMode="numeric"
              placeholder="00"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-transparent border-b-2 border-white/10 py-8 text-center text-6xl font-black focus:outline-none focus:border-primary transition-colors text-white placeholder:text-white/5"
            />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 focus-within:opacity-100 transition-opacity" />
          </div>

          {error && <p className="text-primary font-bold text-sm mb-8">{error}</p>}

          <button 
            onClick={handleConfirm}
            className="w-full bg-white text-black font-black py-6 rounded-full text-lg relative overflow-hidden active:scale-95 transition-all duration-300 hover:bg-primary hover:text-white group"
          >
            <span className="relative z-10">CONTINUAR →</span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </motion.div>
    );
  };

  const BumbumTimido = () => {
    const [step, setStep] = useState(0);
    const blocks = [
      "Essa informação explica por que tantas mulheres treinam, suam... e mesmo assim não veem o bumbum reagir.",
      { text: "95% das mulheres acima dos 30 anos desenvolvem o chamado 'bumbum tímido'.", color: 'highlight-pink' },
      "Isso acontece porque, com o passar do tempo, o corpo passa a desativar o centro do glúteo e transferir o esforço para lombar, coxa ou quadril.",
      "O resultado é um treino que cansa — mas não empina, não projeta e não dá forma.",
      { text: "A boa notícia é que você está numa idade em que a ativação do glúteo ainda pode ser completamente reprogramada.", color: 'highlight-green' },
      "Existe um protocolo específico que força o glúteo a voltar ao estado de resposta máxima, mesmo sem academia e sem carga pesada.",
      { text: "✨ Eu chamo de \"Truque do bumbum sexy\" ✨", color: 'highlight-pink font-serif italic text-3xl' }
    ];

    useEffect(() => {
      if (step < blocks.length) {
        const timer = setTimeout(() => setStep(s => s + 1), 1200);
        return () => clearTimeout(timer);
      }
    }, [step]);

    if (step < blocks.length) {
      return (
        <div className="p-8 pt-32 min-h-screen bg-black text-white">
          <div className="max-w-md mx-auto">
            <h2 className="font-serif italic text-3xl text-center mb-16 leading-tight opacity-50">
              O que acontece após os 30?
            </h2>
            <div className="space-y-10">
              {blocks.slice(0, step + 1).map((b, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`text-[1.05rem] font-light leading-relaxed ${typeof b === 'string' ? 'text-white/70' : b.color}`}
                >
                  {typeof b === 'string' ? b : b.text}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Question 
        question={<>Você já havia ouvido falar sobre o <span className="highlight-pink">'bumbum tímido'</span>?</>}
        options={["✅ Já conhecia essa informação", "😮 Primeira vez que ouço sobre isso"]}
        cmMap={[0.5, 1.0]}
        next="ANALYSIS"
      />
    );
  };

  const Analysis = () => {
    const [phase, setPhase] = useState(0);
    const [text, setText] = useState('');
    const loadingTexts = [
      "Analisando suas respostas...",
      "Calculando potencial genético...",
      "Mapeando seu perfil de ativação...",
      "✓ Análise concluída com sucesso!"
    ];

    useEffect(() => {
      if (phase < loadingTexts.length) {
        let currentText = '';
        let charIndex = 0;
        const targetText = loadingTexts[phase];
        
        const type = () => {
          if (charIndex < targetText.length) {
            currentText += targetText[charIndex];
            setText(currentText);
            charIndex++;
            setTimeout(type, 40);
          } else {
            setTimeout(() => {
              setPhase(p => p + 1);
              setText('');
            }, 1000);
          }
        };
        type();
      }
    }, [phase]);

    if (phase < loadingTexts.length) {
      return (
        <div className="p-8 pt-32 flex flex-col items-center justify-center min-h-screen text-center bg-black text-white">
          <div className="relative w-32 h-32 mb-16">
            <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
            <motion.div 
              className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-serif italic text-2xl text-primary animate-pulse">
                {Math.round((phase / loadingTexts.length) * 100)}%
              </span>
            </div>
          </div>
          <p className="font-serif italic text-2xl min-h-[3rem] tracking-tight text-white/80">{text}</p>
        </div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 pt-24 min-h-screen bg-black"
      >
        <div className="max-w-md mx-auto">
          <h2 className="font-serif italic text-4xl text-center mb-4 leading-tight">Análise <span className="highlight-pink">Concluída</span></h2>
          <p className="text-center text-sm font-light mb-12 text-white/40 leading-relaxed italic">
            Mulheres na faixa dos <span className="text-white font-bold">{state.idade}</span> anos apresentam uma predisposição genética favorável para o aumento acelerado do bumbum!
          </p>

          <div className="space-y-10 mb-12">
            {[
              { label: "7 DIAS — FIRMEZA INICIAL", color: "#E954A2", p: 20 },
              { label: "21 DIAS — REDUÇÃO DE CELULITE", color: "#E954A2", p: 50 },
              { label: "30 DIAS — VOLUME E PROJEÇÃO", color: "#E954A2", p: 96 }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-[0.6rem] font-black mb-3 uppercase tracking-[0.2em] text-white/60">
                  <span>{item.label}</span>
                  <span className="text-primary">{item.p}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.p}%` }}
                    transition={{ delay: i * 0.4, duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-primary shadow-[0_0_15px_rgba(233,84,162,0.5)]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-12">
            {[
              { name: 'Roberta', src: 'https://i.postimg.cc/NK01601r/roberta.png' },
              { name: 'Gabriela', src: 'https://i.postimg.cc/YvS16S1L/gabriela.png' },
              { name: 'Mirela', src: 'https://i.postimg.cc/yDNFmNFD/mirela.png' },
              { name: 'Maria', src: 'https://i.postimg.cc/JshbNhby/maria.png' }
            ].map((aluna, i) => (
              <div key={i} className="aspect-square glass rounded-3xl overflow-hidden relative border border-white/5">
                <img 
                  src={aluna.src} 
                  alt={`Aluna ${aluna.name}`}
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="glass px-2 py-1 rounded-lg text-[0.5rem] font-black text-white/60 uppercase tracking-widest text-center">
                    {aluna.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass p-8 rounded-[2.5rem] text-center mb-12 border border-white/5">
            <p className="font-serif italic text-2xl text-white/90">
              Você acumulou <span className="highlight-pink">+{state.totalCM.toFixed(1)} CM</span> de potencial genético!
            </p>
          </div>

          <button 
            onClick={() => nextScreen('Q12')}
            className="w-full bg-white text-black font-black py-6 rounded-full text-lg relative overflow-hidden active:scale-95 transition-all duration-300 hover:bg-primary hover:text-white group"
          >
            <span className="relative z-10">VER MEU PLANO 👇</span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </motion.div>
    );
  };

  const EvolutionGraph = () => {
    const [drawn, setDrawn] = useState(false);
    useEffect(() => {
      setTimeout(() => setDrawn(true), 500);
    }, []);

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 pt-24 min-h-screen bg-black"
      >
        <div className="max-w-md mx-auto">
          <h2 className="font-serif italic text-3xl text-center mb-4 leading-tight text-white/90">Análise do Perfil</h2>
          <p className="text-white/20 text-[0.6rem] font-bold uppercase text-center mb-12 tracking-[0.3em]">Projeção de Evolução — 28 Dias</p>

          <div className="relative h-[300px] w-full mb-12 glass rounded-[2.5rem] p-8 overflow-hidden border border-white/5">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#E954A2', stopOpacity: 0.2 }} />
                  <stop offset="100%" style={{ stopColor: '#E954A2', stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              <motion.path
                d="M 0 95 L 10 90 L 30 75 L 50 50 L 75 25 L 100 0"
                fill="none"
                stroke="#E954A2"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: drawn ? 1 : 0 }}
                transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.path
                d="M 0 95 L 10 90 L 30 75 L 50 50 L 75 25 L 100 0 L 100 100 L 0 100 Z"
                fill="url(#grad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: drawn ? 1 : 0 }}
                transition={{ delay: 1.5, duration: 1.5 }}
              />
            </svg>
            <div className="absolute bottom-8 left-0 right-0 flex justify-between px-8 text-[0.55rem] font-black text-white/20 uppercase tracking-[0.2em]">
              <span>INÍCIO</span>
              <span>DIA 14</span>
              <span>DIA 28</span>
            </div>
            <div className="absolute top-8 right-8 text-primary font-black text-[0.6rem] animate-pulse uppercase tracking-[0.2em]">PROJEÇÃO MÁXIMA 🔥</div>
          </div>

          <div className="divider" />

          <button 
            onClick={() => nextScreen('OFFER')}
            className="w-full bg-white text-black font-black py-6 rounded-full text-lg relative overflow-hidden active:scale-95 transition-all duration-300 hover:bg-primary hover:text-white group"
          >
            <span className="relative z-10">ACESSAR MEU PLANO! 🍑</span>
            <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </motion.div>
    );
  };

  const Offer = () => {
    const [timeLeft, setTimeLeft] = useState(579); // 09:39 in seconds

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(prev => (prev <= 0 ? 579 : prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }, []);

    const formatTime = (s: number) => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 pt-16 bg-black text-white min-h-screen"
      >
        <div className="max-w-md mx-auto">
          <h2 className="font-serif italic text-3xl text-center mb-4 leading-tight text-primary">Acesso Liberado ao<br/>APP DESAFIO BUMBUM SEXY! 😍</h2>
          <div className="text-center mb-12">
            <p className="text-primary font-black text-sm mb-2 tracking-widest">PARABÉNS!</p>
            <p className="font-light text-[0.9rem] text-white/60 leading-relaxed italic">
              Você acaba de desbloquear sua vaga exclusiva para o Método Ativação Glútea 28D — o aplicativo com aulas gravadas que já transformou mais de 50.000 bumbuns no Brasil.
            </p>
          </div>
          
          <div className="glass p-8 rounded-[2.5rem] text-center mb-8 relative overflow-hidden border border-primary/20 shadow-[0_0_50px_rgba(233,84,162,0.15)]">
            <h3 className="text-white/40 font-black text-[0.6rem] mb-4 uppercase tracking-[0.3em]">POTENCIAL CALCULADO</h3>
            <p className="text-4xl font-serif italic text-white mb-2">+{state.totalCM.toFixed(1)} CM</p>
            <p className="text-[0.65rem] text-primary font-black uppercase tracking-[0.2em]">DE GLÚTEO EM 28 DIAS</p>
          </div>

          <div className="glass p-6 rounded-3xl border border-white/5 mb-12">
            <h4 className="font-bold text-white/90 mb-4 flex items-center gap-2">
              <span>📱</span> O que você vai acessar agora mesmo:
            </h4>
            <p className="text-sm text-white/60 font-light leading-relaxed mb-6">
              Assim que confirmar sua vaga, você recebe acesso imediato ao App Desafio Bumbum Sexy — disponível no seu celular, 24h por dia, sem precisar de academia, equipamento ou experiência prévia.
            </p>
            <div className="space-y-4 text-left">
              {[
                { icon: "🎥", t: "28 aulas gravadas em vídeo — uma por dia" },
                { icon: "⏱", t: "Treinos de 8 minutos — feitos para encaixar em qualquer rotina, mesmo a mais corrida" },
                { icon: "🎯", t: "Plano personalizado com base nas suas respostas do quiz" },
                { icon: "📊", t: "Acompanhamento de progresso dia a dia dentro do app" },
                { icon: "🔔", t: "Lembretes diários para você não perder nenhum treino" },
                { icon: "🔒", t: "Acesso vitalício — entra quando quiser, quantas vezes quiser" }
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  <span className="text-[0.8rem] text-white/70 font-light leading-tight">{item.t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 mb-12">
            <h4 className="font-serif italic text-2xl text-white/90 border-b border-white/5 pb-4">Benefícios do Método Ativação Glútea 28D</h4>
            {[
              "Glúteos maiores e definidos — Ganhe volume e forma em tempo recorde com ativação muscular direcionada",
              "Firmeza e tonificação profunda — Bumbum durinho e levantado sem precisar de academia",
              "Redução visível de celulite — O protocolo atua diretamente nas células responsáveis pela textura da pele",
              "Resultados em até 28 dias — Transformações visíveis já na primeira semana",
              "Treinos de 8 min no app — Aulas em vídeo com o Coach Nunzi, disponíveis 24h no seu celular",
              "Melhora da autoestima — Vista o que quiser e se sinta confiante em qualquer roupa"
            ].map((b, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="mt-1 bg-green-500/20 p-1 rounded-full">
                  <Check className="text-green-500" size={14} />
                </div>
                <span className="text-white/60 font-light text-sm leading-relaxed">{b}</span>
              </div>
            ))}
          </div>

          <div className="glass p-10 rounded-[3rem] border border-white/5 text-center mb-12 shadow-2xl relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[0.6rem] font-black px-6 py-2 rounded-full tracking-[0.2em] uppercase">OFERTA EXCLUSIVA</div>
            
            <p className="text-[0.6rem] uppercase font-black text-white/20 mb-6 tracking-[0.3em]">INVESTIMENTO ÚNICO</p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-xl text-white/20 line-through font-light">R$ 297</span>
              <span className="text-2xl text-white/40">➡️</span>
              <span className="text-6xl font-serif italic text-white">R$ 27,<span className="text-3xl">90</span></span>
            </div>
            
            <p className="text-[0.85rem] font-light text-white/40 mb-10 italic">Menos de R$ 0,97 por dia para transformar seu corpo.</p>
            
            <div className="flex items-center justify-center gap-3 text-primary font-black text-[0.65rem] mb-10 bg-primary/5 py-4 rounded-full tracking-[0.1em] uppercase">
              <Clock size={16} />
              <span>PROPOSTA VÁLIDA POR: {formatTime(timeLeft)}</span>
            </div>

            <button 
              onClick={playClickSound}
              className="w-full bg-white text-black font-black py-7 rounded-full text-lg relative overflow-hidden active:scale-95 transition-all duration-300 hover:bg-primary hover:text-white group shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
              <span className="relative z-10">GARANTIR MINHA VAGA 🔥</span>
              <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>

          <div className="space-y-8 mb-16">
            <div className="text-center">
              <h4 className="font-serif italic text-2xl text-primary mb-2">Bônus Exclusivos</h4>
              <p className="text-[0.65rem] text-white/30 uppercase tracking-widest font-black">(ao adquirir hoje)</p>
            </div>
            
            {[
              { 
                icon: "🍑", 
                t: "O Truque Bumbum Granada", 
                sub: "O bônus mais explosivo do programa.",
                desc: "Aula bônus gravada com o protocolo de ativação profunda que faz o glúteo subir, firmar e mudar de forma em poucas semanas — especialmente desenvolvido para quem tem \"glúteo tímido\".",
                p: "R$ 85,00" 
              },
              { 
                icon: "🚫", 
                t: "Lista Negra dos Alimentos Sabotadores", 
                sub: "Os inimigos não estão só na balança… estão no seu prato.",
                desc: "PDF exclusivo com os alimentos que fingem ser saudáveis mas bloqueiam seu metabolismo e travam os resultados. Elimine esses sabotadores e veja seu corpo reagir em dias.",
                p: "R$ 67,00" 
              },
              { 
                icon: "✨", 
                t: "Pele Lisinha e Sem Bolinhas", 
                sub: "As bolinhas não estão só na pele… estão nos hábitos.",
                desc: "Protocolo em vídeo que revela o que inflama os poros do bumbum e trava a aparência lisinha. Aplique e veja a pele reagir como se você \"destravasse\" a textura do bumbum.",
                p: "R$ 37,00" 
              },
              { 
                icon: "💬", 
                t: "Suporte Direto por 28 dias", 
                sub: "Você não estará sozinha nessa missão.",
                desc: "Acesso direto ao Coach Nunzi e sua equipe pelo WhatsApp durante os 28 dias do desafio. Suporte real, humano e personalizado para garantir que os resultados apareçam no espelho.",
                p: "R$ 215,00" 
              }
            ].map((b, i) => (
              <div key={i} className="glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4 items-center">
                    <span className="text-3xl">{b.icon}</span>
                    <div>
                      <h5 className="font-bold text-white/90 text-sm leading-tight">{b.t}</h5>
                      <p className="text-[0.65rem] text-primary font-medium italic">{b.sub}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/50 font-light leading-relaxed mb-6 italic">{b.desc}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                  <span className="text-[0.65rem] text-white/20 line-through uppercase tracking-widest">{b.p}</span>
                  <span className="text-primary font-black text-[0.7rem] uppercase tracking-widest">GRÁTIS</span>
                </div>
              </div>
            ))}

            <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl text-center">
              <p className="text-primary font-black text-[0.7rem] uppercase tracking-widest flex items-center justify-center gap-2">
                <AlertTriangle size={14} />
                Apenas 5 vagas restantes com acesso aos bônus!
              </p>
            </div>
          </div>

          {/* Segundo Bloco CTA */}
          <div className="glass p-10 rounded-[3rem] border border-primary/20 text-center mb-16 shadow-2xl bg-primary/5">
            <h4 className="font-serif italic text-2xl text-white mb-6 uppercase">APP DESAFIO BUMBUM SEXY</h4>
            <p className="text-white/40 line-through text-sm mb-2">De R$ 297,00</p>
            <p className="text-white font-serif italic text-4xl mb-2">Por apenas <span className="text-primary">R$ 27,90</span></p>
            <p className="text-white/40 text-xs mb-10 italic">Menos de R$ 0,97 por dia</p>
            
            <button 
              onClick={playClickSound}
              className="w-full bg-primary text-white font-black py-7 rounded-full text-sm relative overflow-hidden active:scale-95 transition-all duration-300 group shadow-[0_20px_40px_rgba(233,84,162,0.3)] mb-8 uppercase tracking-tighter"
            >
              <span className="relative z-10">QUERO GARANTIR MINHA VAGA COM DESCONTO 🔥</span>
            </button>

            <p className="text-primary font-black text-[0.65rem] uppercase tracking-widest mb-8 flex items-center justify-center gap-2">
              <AlertTriangle size={14} />
              Últimas Vagas com Desconto!
              <AlertTriangle size={14} />
            </p>

            <div className="space-y-4 text-left max-w-[280px] mx-auto">
              {[
                "Pagamento único — Sem mensalidades.",
                "Acesso imediato — Aulas liberadas no app após o pagamento.",
                "Acesso vitalício — Entre quando quiser, para sempre."
              ].map((text, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Check className="text-primary shrink-0" size={16} />
                  <span className="text-[0.75rem] text-white/70 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Garantia */}
          <div className="glass p-10 rounded-[3rem] border border-white/10 text-center mb-16 relative overflow-hidden">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-primary" size={40} />
            </div>
            <h5 className="font-serif italic text-2xl text-white/90 mb-4">🛡️ Garantia de 45 dias — Risco Zero</h5>
            <p className="text-sm text-white/50 font-light leading-relaxed italic">
              Acreditamos tanto no Método Ativação Glútea 28D que oferecemos garantia total. Se você seguir o plano dentro do app e não ver resultados visíveis, devolvemos 100% do seu dinheiro. Sem burocracia, sem questionamentos.
            </p>
          </div>

          <div className="text-center pb-12">
            <p className="text-[0.6rem] text-white/20 uppercase font-black tracking-[0.3em] flex items-center justify-center gap-2">
              <Shield size={12} />
              PAGAMENTO 100% SEGURO
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = (next: Screen, cmToAdd: number) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // Swipe left = advance (equivalent to choosing first option for demo or just advancing)
      // For a real quiz, swipe might not be the best for "choosing", but the prompt says:
      // "Swipe para esquerda = avança (equivale a escolher e confirmar)"
      // I'll make it pick the first option if no option is selected, or just advance if possible.
      nextScreen(next, cmToAdd);
    } else if (isRightSwipe) {
      // Swipe right = blocked effect
      setFlash(true);
      setTimeout(() => setFlash(false), 200);
    }
  };

  // --- Render Logic ---

  const renderScreen = () => {
    const swipeHandlers = (next: Screen, cm: number) => ({
      onTouchStart,
      onTouchMove,
      onTouchEnd: () => onTouchEnd(next, cm)
    });

    switch (state.screen) {
      case 'LANDING': return <Landing />;
      case 'AUTHORITY': return <Authority />;
      case 'Q1': return (
        <div {...swipeHandlers('Q2', 0.8)}>
          <Question 
            title="Vamos começar! Responda atentamente!"
            question={<>Atualmente você está satisfeita com o <span className="highlight-pink">tamanho e formato</span> do seu bumbum?</>}
            options={["☹️ Estou Insatisfeita", "😀 Estou satisfeita, mas quero melhorar"]}
            cmMap={[0.8, 0.5]}
            next="Q2"
          />
        </div>
      );
      case 'Q2': return (
        <div {...swipeHandlers('Q3', 1.0)}>
          <Question 
            question={<>O que mais te <span className="highlight-pink">incomoda</span> ao olhar no espelho?</>}
            options={["😩 Meu bumbum pequeno ou sem volume", "😢 A falta de firmeza ou definição", "😁 Tudo está bem, só quero melhorar ainda mais"]}
            cmMap={[1.0, 0.8, 0.5]}
            next="Q3"
          />
        </div>
      );
      case 'Q3': return (
        <div {...swipeHandlers('Q4', 1.2)}>
          <Question 
            question={<>Você já <span className="highlight-pink">desistiu de usar roupas</span> como vestidos justos ou biquínis por não se sentir confiante?</>}
            options={["🤯 Sim, várias vezes", "🥹 Algumas vezes, mas tento contornar", "😁 Não, isso não é um problema para mim"]}
            cmMap={[1.2, 0.8, 0.5]}
            next="Q4"
          />
        </div>
      );
      case 'Q4': return (
        <div {...swipeHandlers('Q5', 1.5)}>
          <Question 
            question={<>Você acredita que é possível transformar seu bumbum com <span className="highlight-pink">treinos rápidos e direcionados</span>, feitos em casa?</>}
            options={["💪 Sim, acredito que é possível", "🤔 Talvez, mas nunca vi algo funcionar para mim", "✨ Me sentir mais saudável e com mais energia", "🙏 Não tenho certeza, mas estou disposta a tentar"]}
            cmMap={[1.5, 0.8, 0.6, 1.0]}
            next="Q5"
          />
        </div>
      );
      case 'Q5': return (
        <div {...swipeHandlers('SOCIAL_PROOF_INTER', 1.5)}>
          <Question 
            question={<>Se existisse um <span className="highlight-pink">método testado e aprovado</span> que combinasse treinos curtos com um plano alimentar simples, você toparia experimentar?</>}
            options={["😁 Sim, com certeza", "🤨 Dependeria dos resultados prometidos", "😏 Talvez, se for algo acessível e fácil de fazer"]}
            cmMap={[1.5, 0.8, 1.0]}
            next="SOCIAL_PROOF_INTER"
          />
        </div>
      );
      case 'SOCIAL_PROOF_INTER': return <SocialProofInter />;
      case 'Q6': return (
        <div {...swipeHandlers('Q7', 1.0)}>
          <Question 
            question="Quantos minutos por dia você consegue dedicar ao seu treino?"
            options={["🕰 Menos de 10 minutos", "🕰 Entre 10 e 20 minutos", "🕰 Mais de 20 minutos"]}
            cmMap={[0.8, 1.0, 1.2]}
            next="Q7"
          />
        </div>
      );
      case 'Q7': return (
        <div {...swipeHandlers('Q8', 1.0)}>
          <Question 
            question="Com que frequência você conseguiria treinar por semana?"
            options={["📅 3 vezes", "📅 4 a 5 vezes", "📅 Todos os dias"]}
            cmMap={[0.8, 1.0, 1.5]}
            next="Q8"
          />
        </div>
      );
      case 'Q8': return (
        <div {...swipeHandlers('Q9', 1.0)}>
          <Question 
            title="⚡ Esta é a chave do seu metabolismo! Nunzi descobriu que 90% das pessoas fazem isso errado e por isso não conseguem empinar o bumbum."
            question="Quantas refeições você faz por dia normalmente?"
            options={["🍽 1 a 2 refeições", "🍽🍽 3 refeições básicas ao dia", "🍽🍽🍽 4 a 5 refeições", "🔄 Como várias vezes ao dia"]}
            cmMap={[0.5, 0.8, 1.2, 1.0]}
            next="Q9"
          />
        </div>
      );
      case 'Q9': return <AgeQuestion />;
      case 'BUMBUM_TIMIDO': return <BumbumTimido />;
      case 'ANALYSIS': return <Analysis />;
      case 'Q12': return (
        <div {...swipeHandlers('Q13', 1.5)}>
          <Question 
            question={<>Você acredita que está pronta para <span className="highlight-pink">transformar seu corpo e sua autoestima</span> de uma vez por todas?</>}
            options={["💪 Sim, estou pronta", "🥹 Estou quase lá, só preciso de um empurrão", "🔥 Preciso de mais motivação para começar"]}
            cmMap={[1.5, 1.0, 0.8]}
            next="Q13"
          />
        </div>
      );
      case 'Q13': return (
        <div {...swipeHandlers('Q14', 1.5)}>
          <Question 
            title="Escolha seu objetivo ideal — usaremos essa informação para criar um plano que funcione especialmente para você."
            question={<>Qual destes bumbuns você <span className="highlight-pink">sonha em conseguir</span>? 👇</>}
            options={["Levantado", "Esculpido", "Musculoso", "Redondinho"]}
            icons={[<Zap size={20} />, <Trophy size={20} />, <Star size={20} />, <Check size={20} />]}
            cmMap={[1.5, 1.5, 1.5, 1.5]}
            next="Q14"
          />
        </div>
      );
      case 'Q14': return (
        <div {...swipeHandlers('Q15', 0.5)}>
          <Question 
            title="Conhecer seu sabotador interno é fundamental. Coach Nunzi criou estratégias específicas para vencer cada um desses obstáculos."
            question={<>Qual seu maior <span className="highlight-pink">sabotador interno</span> atual?</>}
            options={["😴 Falta de motivação constante", "🍫 Ansiedade e compulsão alimentar", "⏰ Rotina corrida sem tempo", "🤷 Não sei por onde começar", "💔 Baixa autoestima me sabota"]}
            cmMap={[0.5, 0.5, 0.5, 0.5, 0.5]}
            next="Q15"
          />
        </div>
      );
      case 'Q15': return (
        <div {...swipeHandlers('EVOLUTION_GRAPH', 2.0)}>
          <Question 
            question={<>Está pronta para <span className="highlight-pink">empinar seu bumbum em até 28 dias</span>? 🔥</>}
            options={["✅ SIM, ESTOU 100% COMPROMETIDA", "🚀 ABSOLUTAMENTE, VOU DAR O MEU MÁXIMO", "💪 COM CERTEZA, QUERO COMEÇAR HOJE", "🤔 AINDA ESTOU PENSANDO"]}
            cmMap={[2.0, 2.0, 2.0, 0.5]}
            next="EVOLUTION_GRAPH"
          />
        </div>
      );
      case 'EVOLUTION_GRAPH': return <EvolutionGraph />;
      case 'OFFER': return <Offer />;
      default: return <Landing />;
    }
  };

  const showMeter = !['LANDING', 'AUTHORITY', 'OFFER'].includes(state.screen);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[480px] mx-auto relative min-h-screen overflow-x-hidden shadow-2xl bg-black">
        <Meter cm={state.totalCM} show={showMeter} />
        
        <AnimatePresence mode="wait">
          <div key={state.screen}>
            {renderScreen()}
          </div>
        </AnimatePresence>

        {flash && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-white pointer-events-none z-[100]" />}
        
        {floatingText && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[110]">
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1.2, y: -50 }}
              exit={{ opacity: 0, scale: 0.8, y: -100 }}
              className="bg-primary text-white font-black px-6 py-3 rounded-full shadow-2xl text-lg"
            >
              {floatingText}
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
