import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Cota, Edition } from '../types';
import { Button } from './ui/Button';
import { Trophy, Shuffle, AlertCircle, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DrawMachineProps {
  edition: Edition;
  onClose: () => void;
}

export const DrawMachine: React.FC<DrawMachineProps> = ({ edition, onClose }) => {
  const [step, setStep] = useState<'PREPARE' | 'SPINNING' | 'RESULT'>('PREPARE');
  const [eligible, setEligible] = useState<Cota[]>([]);
  const [ineligible, setIneligible] = useState<Cota[]>([]);
  const [winners, setWinners] = useState<Cota[]>([]);
  const [winnersCount, setWinnersCount] = useState(1);
  const [displayNumber, setDisplayNumber] = useState("00");

  useEffect(() => {
    const { eligible, ineligible } = DataService.getEligibleCotasForDraw(edition.id);
    setEligible(eligible);
    setIneligible(ineligible);
  }, [edition.id]);

  const handleStartDraw = async () => {
    if (eligible.length === 0) return;
    
    setStep('SPINNING');
    
    // Animation loop for numbers
    const interval = setInterval(() => {
        const randomCota = eligible[Math.floor(Math.random() * eligible.length)];
        setDisplayNumber(randomCota.number.toString().padStart(2, '0'));
    }, 50);

    // Perform actual draw logic
    try {
        const results = await DataService.performDraw(edition.id, winnersCount);
        
        // Wait for visual effect (3 seconds)
        setTimeout(() => {
            clearInterval(interval);
            setWinners(results);
            setStep('RESULT');
            fireConfetti();
        }, 3000);
    } catch (e) {
        clearInterval(interval);
        setStep('PREPARE');
        alert("Erro ao realizar sorteio.");
    }
  };

  const fireConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fbbf24', '#ffffff'] 
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fbbf24', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-ink-900 border border-ink-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-gold-500/10">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-ink-900 to-ink-800 p-6 border-b border-ink-700 flex justify-between items-center">
            <h2 className="text-xl font-display font-bold text-gold-500 flex items-center gap-2">
                <Trophy className="w-6 h-6" />
                Urna Digital
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            
            {step === 'PREPARE' && (
                <div className="w-full space-y-6">
                    <div className="bg-ink-800/50 p-4 rounded-lg border border-ink-700 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-900/30 p-2 rounded-full">
                                <Users className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Aptos</p>
                                <p className="text-xl font-bold text-white">{eligible.length} Cotas</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-sm text-gray-400">Inaptos</p>
                             <p className="text-xl font-bold text-red-400">{ineligible.length}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400 font-medium">Contemplados nesta rodada</label>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(num => (
                                <button 
                                    key={num}
                                    onClick={() => setWinnersCount(num)}
                                    className={`flex-1 py-3 rounded-lg border ${winnersCount === num ? 'bg-gold-500 text-black border-gold-500 font-bold' : 'bg-transparent border-ink-600 text-gray-400 hover:border-gold-500/50'}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {eligible.length > 0 ? (
                        <Button onClick={handleStartDraw} className="w-full py-4 text-lg">
                            <Shuffle className="w-5 h-5" />
                            Iniciar Sorteio
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-4 rounded-lg">
                            <AlertCircle className="w-5 h-5" />
                            Nenhuma cota elegível.
                        </div>
                    )}
                </div>
            )}

            {step === 'SPINNING' && (
                <div className="flex flex-col items-center animate-pulse">
                    <div className="text-8xl font-display font-bold text-gold-500 tabular-nums tracking-widest drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                        {displayNumber}
                    </div>
                    <p className="mt-8 text-gray-400 tracking-widest uppercase text-sm">Sorteando...</p>
                </div>
            )}

            {step === 'RESULT' && (
                <div className="w-full text-center space-y-6">
                    <h3 className="text-gray-400 uppercase tracking-widest text-sm">Parabéns aos ganhadores</h3>
                    <div className="space-y-3">
                        {winners.map((winner, idx) => (
                            <div key={idx} className="bg-gradient-to-r from-gold-600 to-gold-400 p-1 rounded-xl shadow-lg transform scale-100 animate-[bounce_1s_ease-in-out]">
                                <div className="bg-ink-900 p-4 rounded-lg flex items-center justify-between">
                                    <div className="flex flex-col items-start">
                                        <span className="text-xs text-gold-500 font-bold uppercase">Cota #{winner.number}</span>
                                        <span className="text-lg font-bold text-white">
                                            {DataService.getParticipantById(winner.participantId)?.name}
                                        </span>
                                    </div>
                                    <Trophy className="w-8 h-8 text-gold-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="secondary" onClick={onClose} className="mt-4 w-full">
                        Fechar
                    </Button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};