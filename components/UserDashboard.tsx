import React, { useState, useEffect } from 'react';
import { Participant, Cota, Payment, PaymentStatus } from '../types';
import { DataService } from '../services/dataService';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Upload, CheckCircle, Clock, FileText, Camera } from 'lucide-react';

interface UserDashboardProps {
  user: Participant;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [cotas, setCotas] = useState<Cota[]>([]);
  const [selectedCota, setSelectedCota] = useState<Cota | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    const userCotas = DataService.getCotasByParticipant(user.id);
    setCotas(userCotas);
    if (userCotas.length > 0) setSelectedCota(userCotas[0]);
  }, [user.id]);

  useEffect(() => {
    if (selectedCota) {
        setPayments(DataService.getPaymentsByCota(selectedCota.id));
    }
  }, [selectedCota]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, paymentId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingId(paymentId);
    await DataService.submitProof(paymentId, file);
    
    // Refresh payments
    if (selectedCota) {
        setPayments(DataService.getPaymentsByCota(selectedCota.id));
    }
    setUploadingId(null);
  };

  const progressPercentage = selectedCota 
    ? Math.round((payments.filter(p => p.status === PaymentStatus.PAID).length / payments.length) * 100) 
    : 0;

  if (!selectedCota) return <div className="p-8 text-center text-gray-500">Carregando cotas...</div>;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-ink-900 to-ink-800 p-6 rounded-2xl border border-ink-700 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-gold-500 p-1">
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold text-white">Olá, {user.name.split(' ')[0]}</h2>
                    <p className="text-gold-500 font-medium">Cota #{selectedCota.number}</p>
                </div>
            </div>
            
            <div className="text-right">
                {selectedCota.contemplated ? (
                    <div className="bg-green-900/40 px-4 py-2 rounded-lg border border-green-800">
                        <p className="text-green-400 font-bold uppercase text-sm tracking-wider">Contemplado</p>
                        <p className="text-white font-bold text-lg">{selectedCota.contemplationMonth}</p>
                    </div>
                ) : (
                    <div className="bg-ink-950/50 px-4 py-2 rounded-lg border border-ink-700">
                        <p className="text-gray-400 text-xs uppercase">Próximo Sorteio</p>
                        <p className="text-white font-bold">25 de {new Date().toLocaleString('pt-BR', { month: 'long' })}</p>
                    </div>
                )}
            </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
            <div className="flex justify-between text-xs mb-2 text-gray-400">
                <span>Progresso da Tattoo</span>
                <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-ink-950 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-gold-600 to-gold-400 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
            </div>
        </div>
      </div>

      {/* Payment List */}
      <div className="bg-ink-800 rounded-xl border border-ink-700 overflow-hidden shadow-lg">
        <div className="p-4 border-b border-ink-700 flex justify-between items-center bg-ink-800/80 backdrop-blur">
            <h3 className="font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold-500" />
                Minhas Parcelas
            </h3>
            {/* If user had multiple cotas, selector would go here */}
        </div>
        
        <div className="divide-y divide-ink-700">
            {payments.map((payment) => (
                <div key={payment.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-ink-700/30 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                            ${payment.status === PaymentStatus.PAID ? 'bg-green-900 text-green-400' : 'bg-ink-900 text-gray-400 border border-ink-700'}
                        `}>
                            {payment.installmentNumber}
                        </div>
                        <div>
                            <p className="text-white font-medium">Parcela {payment.installmentNumber}</p>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Vence em {new Date(payment.dueDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm font-bold text-gold-500 md:hidden mt-1">
                                {payment.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 justify-between md:justify-end">
                        <p className="hidden md:block font-bold text-white mr-4">
                            {payment.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        
                        <div className="min-w-[120px] text-right">
                            {payment.status === PaymentStatus.PAID ? (
                                <div className="flex items-center justify-end gap-1 text-green-500 text-sm font-bold">
                                    <CheckCircle className="w-4 h-4" /> Pago
                                </div>
                            ) : payment.status === PaymentStatus.VALIDATING ? (
                                <Badge status="Validando" />
                            ) : (
                                <label className="cursor-pointer group">
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, payment.id)}
                                        disabled={!!uploadingId}
                                    />
                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all
                                        ${payment.status === PaymentStatus.LATE ? 'bg-red-900/20 text-red-400 border border-red-800' : 'bg-ink-900 text-gray-300 border border-ink-600 hover:border-gold-500 hover:text-white'}
                                    `}>
                                        {uploadingId === payment.id ? (
                                            <span className="animate-pulse">Enviando...</span>
                                        ) : (
                                            <>
                                                <Camera className="w-4 h-4" />
                                                {payment.status === PaymentStatus.LATE ? 'Regularizar' : 'Pagar'}
                                            </>
                                        )}
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};