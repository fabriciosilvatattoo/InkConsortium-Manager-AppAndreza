import React, { useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { Edition, Payment, PaymentStatus, Participant, Cota } from '../types';
import { MOCK_EDITIONS } from '../constants';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { DrawMachine } from './DrawMachine';
import { 
  DollarSign, 
  CheckCircle, 
  AlertTriangle, 
  Calendar, 
  ExternalLink,
  Search,
  Check,
  X,
  Users,
  ChevronRight,
  ChevronLeft,
  Filter
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'VALIDATION' | 'PARTICIPANTS' | 'DRAWS'>('OVERVIEW');
  const [stats, setStats] = useState({ totalArrecadado: 0, pendingValidations: 0, defaulters: 0 });
  const [validations, setValidations] = useState<Payment[]>([]);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedEditionForDraw, setSelectedEditionForDraw] = useState<Edition | null>(null);
  
  // Participant Management State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEditionFilter, setSelectedEditionFilter] = useState<string>('all'); // 'all' or editionId
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [participantPayments, setParticipantPayments] = useState<Payment[]>([]);
  const [participantCotas, setParticipantCotas] = useState<Cota[]>([]);

  const loadData = () => {
    setStats(DataService.getFinancialStats());
    
    // Validations (aggregate from all editions)
    const allCotas = DataService.getEditions().flatMap(e => DataService.getCotasByEdition(e.id));
    let allPending: Payment[] = [];
    allCotas.forEach(c => {
        const p = DataService.getPaymentsByCota(c.id).filter(pay => pay.status === PaymentStatus.VALIDATING);
        allPending = [...allPending, ...p];
    });
    setValidations(allPending);
    
    setEditions(DataService.getEditions());
    setParticipants(DataService.getParticipants());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  // Update participant details when selected
  useEffect(() => {
    if (selectedParticipantId) {
        const cotas = DataService.getCotasByParticipant(selectedParticipantId);
        setParticipantCotas(cotas);
        // Flatten payments for all user's cotas
        let payments: Payment[] = [];
        cotas.forEach(c => {
            payments = [...payments, ...DataService.getPaymentsByCota(c.id)];
        });
        setParticipantPayments(payments.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    }
  }, [selectedParticipantId, stats]); // Reload when stats change (implies data update)

  const handleValidation = async (id: string, isValid: boolean) => {
    await DataService.validatePayment(id, isValid);
    loadData();
  };

  const handleManualStatusChange = async (paymentId: string, newStatus: PaymentStatus) => {
    await DataService.manualPaymentUpdate(paymentId, newStatus);
    loadData();
  };

  // Filter Logic
  const filteredParticipants = participants.filter(p => {
    // 1. Text Search
    const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.whatsapp.includes(searchTerm);
    
    // 2. Edition Filter
    if (selectedEditionFilter === 'all') return matchesSearch;
    
    // Find if user has a cota in the selected edition
    const userCotas = DataService.getCotasByParticipant(p.id);
    const isInEdition = userCotas.some(c => c.editionId === selectedEditionFilter);
    
    return matchesSearch && isInEdition;
  });

  const getSelectedParticipant = () => participants.find(p => p.id === selectedParticipantId);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-ink-800 p-6 rounded-xl border border-ink-700 shadow-lg">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gold-500/10 rounded-lg text-gold-500">
                    <DollarSign className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Arrecadado (Total)</p>
                    <p className="text-2xl font-bold text-white">
                        {stats.totalArrecadado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>
            </div>
        </div>
        
        <div className="bg-ink-800 p-6 rounded-xl border border-ink-700 shadow-lg cursor-pointer hover:border-gold-500/50 transition-colors"
             onClick={() => setActiveTab('VALIDATION')}>
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                    <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Pendentes de Validação</p>
                    <p className="text-2xl font-bold text-white">{stats.pendingValidations}</p>
                </div>
            </div>
        </div>

        <div className="bg-ink-800 p-6 rounded-xl border border-ink-700 shadow-lg">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Inadimplentes</p>
                    <p className="text-2xl font-bold text-white">{stats.defaulters}</p>
                </div>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ink-700 overflow-x-auto">
        <button 
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'OVERVIEW' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-400 hover:text-white'}`}
        >
            Visão Geral
        </button>
        <button 
            onClick={() => setActiveTab('VALIDATION')}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'VALIDATION' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-400 hover:text-white'}`}
        >
            Validação {validations.length > 0 && <span className="ml-2 bg-gold-500 text-black px-1.5 py-0.5 rounded-full text-xs">{validations.length}</span>}
        </button>
        <button 
            onClick={() => setActiveTab('PARTICIPANTS')}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'PARTICIPANTS' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-400 hover:text-white'}`}
        >
            Participantes
        </button>
        <button 
            onClick={() => setActiveTab('DRAWS')}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === 'DRAWS' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-400 hover:text-white'}`}
        >
            Sorteios
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-white">Painéis das Edições</h3>
                <div className="grid grid-cols-1 gap-6">
                    {editions.map(edition => {
                        const cotas = DataService.getCotasByEdition(edition.id);
                        const participantsCount = new Set(cotas.map(c => c.participantId)).size;
                        const nextDraw = cotas.some(c => !c.contemplated) ? 'Fevereiro/2025' : 'Finalizada';

                        return (
                            <div key={edition.id} className="bg-ink-800 border border-ink-700 p-6 rounded-xl hover:border-gold-500/30 transition-all">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-2xl font-display font-bold text-gold-500">{edition.name}</h4>
                                            <Badge status={edition.status} />
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                                            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Início: {new Date(edition.startDate).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {participantsCount} Participantes</span>
                                            <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {edition.installmentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 min-w-[180px]">
                                        <Button variant="secondary" onClick={() => { setSelectedEditionForDraw(edition); }}>
                                            Gerenciar Sorteio
                                        </Button>
                                        <p className="text-xs text-center text-gray-500">Próximo Sorteio: {nextDraw}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {activeTab === 'VALIDATION' && (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">Pagamentos para Análise</h3>
                </div>

                {validations.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-ink-800/30 rounded-xl border border-ink-700 border-dashed">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Tudo em dia! Nenhuma validação pendente.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {validations.map(payment => {
                            const cota = DataService.getCotasByEdition(MOCK_EDITIONS[0].id).concat(DataService.getCotasByEdition(MOCK_EDITIONS[1].id)).find(c => c.id === payment.cotaId);
                            const user = cota ? DataService.getParticipantById(cota.participantId) : null;
                            const editionName = editions.find(e => e.id === cota?.editionId)?.name.split(' - ')[0];
                            
                            return (
                                <div key={payment.id} className="bg-ink-800 border border-ink-700 p-4 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden">
                                            {user?.avatarUrl && <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-white">{user?.name || 'Desconhecido'}</p>
                                                <span className="text-xs bg-ink-900 border border-ink-600 px-1.5 rounded text-gray-400">{editionName}</span>
                                            </div>
                                            <p className="text-sm text-gray-400">Parcela {payment.installmentNumber} • {new Date(payment.dueDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        {payment.proofUrl && (
                                            <a href={payment.proofUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gold-500 text-sm hover:underline">
                                                <ExternalLink className="w-4 h-4" />
                                                Ver Comprovante
                                            </a>
                                        )}
                                        <div className="flex gap-2">
                                            <Button variant="danger" className="px-3" onClick={() => handleValidation(payment.id, false)}>
                                                <X className="w-4 h-4" />
                                            </Button>
                                            <Button variant="primary" className="px-3" onClick={() => handleValidation(payment.id, true)}>
                                                <Check className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'PARTICIPANTS' && (
            <div className="space-y-6">
                {!selectedParticipantId ? (
                    <>
                        {/* Filters & Header */}
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-ink-800 p-4 rounded-lg border border-ink-700">
                            <h3 className="text-lg font-bold text-white">Gerenciar Participantes</h3>
                            <div className="flex gap-2 w-full md:w-auto">
                                {/* Edition Filter */}
                                <div className="relative">
                                    <select 
                                        className="appearance-none bg-ink-900 border border-ink-700 text-sm text-white px-4 py-2 pr-8 rounded-lg focus:outline-none focus:border-gold-500"
                                        value={selectedEditionFilter}
                                        onChange={(e) => setSelectedEditionFilter(e.target.value)}
                                    >
                                        <option value="all">Todas Edições</option>
                                        {editions.map(e => (
                                            <option key={e.id} value={e.id}>{e.name.split(' - ')[0]}</option>
                                        ))}
                                    </select>
                                    <Filter className="w-3 h-3 text-gray-500 absolute right-3 top-3 pointer-events-none" />
                                </div>

                                <div className="bg-ink-900 p-2 rounded-lg flex items-center gap-2 border border-ink-700 w-full md:w-64">
                                    <Search className="w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar nome..." 
                                        className="bg-transparent border-none text-sm text-white focus:outline-none w-full" 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredParticipants.map(participant => {
                                const cotas = DataService.getCotasByParticipant(participant.id);
                                const totalCotas = cotas.length;
                                // Determine primary edition for display tag
                                const primaryEditionId = cotas[0]?.editionId;
                                const editionName = editions.find(e => e.id === primaryEditionId)?.name.split(' - ')[0] || 'N/A';
                                
                                return (
                                    <div 
                                        key={participant.id} 
                                        onClick={() => setSelectedParticipantId(participant.id)}
                                        className="bg-ink-800 p-4 rounded-xl border border-ink-700 hover:border-gold-500/50 cursor-pointer transition-all hover:bg-ink-700"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden border border-ink-600">
                                                <img src={participant.avatarUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white">{participant.name}</p>
                                                <p className="text-sm text-gray-400">{participant.whatsapp}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-xs bg-ink-900 px-2 py-0.5 rounded text-gray-400 border border-ink-700">
                                                        {editionName}
                                                    </span>
                                                    <span className="text-xs bg-gold-900/20 px-2 py-0.5 rounded text-gold-500 border border-gold-900/30">
                                                        {totalCotas} Cota(s)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Detail View */}
                        <div className="flex items-center gap-4 mb-4">
                            <Button variant="secondary" onClick={() => setSelectedParticipantId(null)} className="px-3">
                                <ChevronLeft className="w-4 h-4" /> Voltar
                            </Button>
                            <h3 className="text-xl font-bold text-white">Gestão: <span className="text-gold-500">{getSelectedParticipant()?.name}</span></h3>
                        </div>

                        <div className="bg-ink-800 rounded-xl border border-ink-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-400">
                                    <thead className="bg-ink-900 text-gray-200 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-3">Edição</th>
                                            <th className="px-6 py-3">Cota</th>
                                            <th className="px-6 py-3">Parcela</th>
                                            <th className="px-6 py-3">Vencimento</th>
                                            <th className="px-6 py-3">Valor</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-ink-700">
                                        {participantPayments.map(payment => {
                                            const cota = participantCotas.find(c => c.id === payment.cotaId);
                                            const editionName = editions.find(e => e.id === cota?.editionId)?.name.split(' - ')[0];
                                            
                                            return (
                                                <tr key={payment.id} className="hover:bg-ink-700/50">
                                                    <td className="px-6 py-4">{editionName}</td>
                                                    <td className="px-6 py-4 font-bold text-white">#{cota?.number}</td>
                                                    <td className="px-6 py-4">{payment.installmentNumber}ª</td>
                                                    <td className="px-6 py-4">{new Date(payment.dueDate).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">{payment.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                    <td className="px-6 py-4"><Badge status={payment.status} /></td>
                                                    <td className="px-6 py-4">
                                                        {payment.status === PaymentStatus.PAID ? (
                                                            <button 
                                                                onClick={() => handleManualStatusChange(payment.id, PaymentStatus.PENDING)}
                                                                className="text-red-400 hover:text-red-300 text-xs underline"
                                                            >
                                                                Desfazer Baixa
                                                            </button>
                                                        ) : (
                                                            <Button 
                                                                variant="ghost" 
                                                                className="text-green-500 hover:text-green-400 hover:bg-green-900/20 px-3 py-1 text-xs border border-green-900/30"
                                                                onClick={() => handleManualStatusChange(payment.id, PaymentStatus.PAID)}
                                                            >
                                                                <Check className="w-3 h-3" /> Dar Baixa
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        )}

        {activeTab === 'DRAWS' && (
             <div className="space-y-6">
                <h3 className="text-lg font-bold text-white">Histórico de Sorteios</h3>
                {editions.map(edition => {
                    const history = DataService.getDrawHistory(edition.id);
                    return (
                        <div key={edition.id} className="space-y-4">
                            <h4 className="text-gold-500 font-display border-b border-ink-700 pb-2">{edition.name}</h4>
                            {history.length === 0 ? (
                                <p className="text-gray-500 text-sm italic py-4">Ainda não há sorteios para esta edição. (Início dos sorteios: Fevereiro)</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {history.map(draw => {
                                         const winnerCota = DataService.getCotasByEdition(edition.id).find(c => c.id === draw.cotaId);
                                         const winner = DataService.getParticipantById(winnerCota?.participantId || '');
                                         return (
                                            <div key={draw.id} className="bg-ink-800 p-4 rounded-lg border border-ink-700">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-xs text-gray-500">{new Date(draw.drawDate).toLocaleDateString()}</span>
                                                    <Badge status="Contemplada" />
                                                </div>
                                                <p className="font-bold text-white text-lg">{winner?.name}</p>
                                                <p className="text-sm text-gold-500">Mês ref: {draw.monthRef}</p>
                                            </div>
                                         );
                                    })}
                                </div>
                            )}
                            <div className="mt-4">
                                <Button onClick={() => setSelectedEditionForDraw(edition)}>
                                    Realizar Novo Sorteio ({edition.name.split(' - ')[0]})
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {selectedEditionForDraw && (
        <DrawMachine 
            edition={selectedEditionForDraw} 
            onClose={() => setSelectedEditionForDraw(null)} 
        />
      )}
    </div>
  );
};