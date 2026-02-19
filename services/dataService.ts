import { MOCK_COTAS, MOCK_DRAWS, MOCK_EDITIONS, MOCK_PARTICIPANTS, MOCK_PAYMENTS } from '../constants';
import { Cota, CotaStatus, DrawHistory, Edition, Participant, Payment, PaymentStatus, UserRole } from '../types';

// In-memory store
let participants = [...MOCK_PARTICIPANTS];
let editions = [...MOCK_EDITIONS];
let cotas = [...MOCK_COTAS];
let payments = [...MOCK_PAYMENTS];
let draws = [...MOCK_DRAWS];

export const DataService = {
  // --- Auth ---
  login: async (emailOrPhone: string): Promise<Participant | null> => {
    // Mock login logic
    await new Promise(r => setTimeout(r, 600)); // Simulate net lag
    
    const term = emailOrPhone.toLowerCase().trim();

    // Check for admin role explicitly
    if (term.includes('admin')) {
        return participants.find(p => p.role === UserRole.ADMIN) || null;
    }

    // Check for user by name
    return participants.find(p => p.name.toLowerCase().includes(term)) || participants[1]; // Fallback to João only if nothing matches reasonably
  },

  // --- Editions ---
  getEditions: () => editions,
  
  // --- Participants ---
  getParticipantById: (id: string) => participants.find(p => p.id === id),
  getParticipants: () => participants.filter(p => p.role !== UserRole.ADMIN),
  
  // --- Cotas ---
  getCotasByParticipant: (participantId: string) => cotas.filter(c => c.participantId === participantId),
  getCotasByEdition: (editionId: string) => cotas.filter(c => c.editionId === editionId),
  
  // --- Payments ---
  getPaymentsByCota: (cotaId: string) => payments.filter(p => p.cotaId === cotaId).sort((a, b) => a.installmentNumber - b.installmentNumber),
  
  submitProof: async (paymentId: string, file: File) => {
    await new Promise(r => setTimeout(r, 1000));
    const paymentIndex = payments.findIndex(p => p.id === paymentId);
    if (paymentIndex > -1) {
        // Create a fake URL for the file
        const fakeUrl = URL.createObjectURL(file);
        payments[paymentIndex] = {
            ...payments[paymentIndex],
            status: PaymentStatus.VALIDATING,
            proofUrl: fakeUrl // In real app: upload to S3 return URL
        };
    }
  },

  validatePayment: async (paymentId: string, isValid: boolean) => {
    const index = payments.findIndex(p => p.id === paymentId);
    if (index > -1) {
        payments[index] = {
            ...payments[index],
            status: isValid ? PaymentStatus.PAID : PaymentStatus.LATE, // Revert to late/pending if rejected
            paidDate: isValid ? new Date().toISOString() : undefined
        };
    }
  },

  // Admin Manual Override (RN04)
  manualPaymentUpdate: async (paymentId: string, status: PaymentStatus) => {
    const index = payments.findIndex(p => p.id === paymentId);
    if (index > -1) {
        payments[index] = {
            ...payments[index],
            status: status,
            paidDate: status === PaymentStatus.PAID ? new Date().toISOString() : undefined,
            // Clear proof if setting back to pending, or keep it for history
            proofUrl: status === PaymentStatus.PENDING ? undefined : payments[index].proofUrl
        };
    }
  },

  // --- Dashboard Logic ---
  getFinancialStats: () => {
    const totalArrecadado = payments
        .filter(p => p.status === PaymentStatus.PAID)
        .reduce((acc, curr) => acc + curr.value, 0);
    
    const pendingValidations = payments.filter(p => p.status === PaymentStatus.VALIDATING).length;
    const defaulters = payments.filter(p => p.status === PaymentStatus.LATE).length;

    return { totalArrecadado, pendingValidations, defaulters };
  },

  // --- Draw Logic (RN01, RN02) ---
  getEligibleCotasForDraw: (editionId: string): { eligible: Cota[], ineligible: Cota[] } => {
    const editionCotas = cotas.filter(c => c.editionId === editionId && c.status === CotaStatus.ACTIVE && !c.contemplated);
    
    const eligible: Cota[] = [];
    const ineligible: Cota[] = [];

    const today = new Date();

    editionCotas.forEach(cota => {
        const cotaPayments = payments.filter(p => p.cotaId === cota.id);
        
        // RN01: Check if any due payment is not paid
        const hasOpenDebt = cotaPayments.some(p => {
            const dueDate = new Date(p.dueDate);
            return dueDate <= today && p.status !== PaymentStatus.PAID;
        });

        if (!hasOpenDebt) {
            eligible.push(cota);
        } else {
            ineligible.push(cota);
        }
    });

    return { eligible, ineligible };
  },

  performDraw: async (editionId: string, winnersCount: number): Promise<Cota[]> => {
    const { eligible } = DataService.getEligibleCotasForDraw(editionId);
    if (eligible.length < 1) throw new Error("No eligible participants.");

    // RN02: Random Selection
    const winners: Cota[] = [];
    const pool = [...eligible];

    for (let i = 0; i < winnersCount; i++) {
        if (pool.length === 0) break;
        const randomIndex = Math.floor(Math.random() * pool.length);
        const winner = pool[randomIndex];
        
        // Update winner status
        const realCotaIndex = cotas.findIndex(c => c.id === winner.id);
        if (realCotaIndex > -1) {
            cotas[realCotaIndex].contemplated = true;
            cotas[realCotaIndex].contemplationMonth = new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
            winners.push(cotas[realCotaIndex]);
            
            // Add to history
            draws.push({
                id: `draw-${Date.now()}`,
                editionId: editionId,
                cotaId: winner.id,
                drawDate: new Date().toISOString(),
                monthRef: cotas[realCotaIndex].contemplationMonth || 'Unknown'
            });
        }
        
        // Remove from pool so they can't win twice in same draw
        pool.splice(randomIndex, 1);
    }
    
    return winners;
  },

  getDrawHistory: (editionId: string) => {
    return draws.filter(d => d.editionId === editionId);
  }
};