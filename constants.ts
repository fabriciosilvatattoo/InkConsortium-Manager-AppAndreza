import { Edition, EditionStatus, Participant, UserRole, Cota, CotaStatus, Payment, PaymentStatus, DrawHistory } from './types';

// 1. Editions
export const MOCK_EDITIONS: Edition[] = [
  {
    id: 'ed-001',
    name: '1ª Edição - Julho/2024',
    totalValue: 400.00,
    installmentValue: 33.33,
    totalInstallments: 12,
    dueDay: 25,
    startDate: '2024-07-01',
    status: EditionStatus.ACTIVE
  },
  {
    id: 'ed-002',
    name: '2ª Edição - Janeiro/2025',
    totalValue: 400.00,
    installmentValue: 33.33, // Ajuste conforme necessário
    totalInstallments: 12,
    dueDay: 10, // Exemplo: vencimento dia 10
    startDate: '2025-01-01',
    status: EditionStatus.ACTIVE
  }
];

// 2. Participants
export const MOCK_PARTICIPANTS: Participant[] = [
  // --- ADMIN ---
  { id: 'admin', name: 'Mestre Tatuador', whatsapp: '+5519999999999', role: UserRole.ADMIN, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' },
  
  // --- 1ª EDIÇÃO (16 pessoas) ---
  { id: 'u-carol', name: 'Carol', whatsapp: '+5519988690683', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol' },
  { id: 'u-karina', name: 'Karina', whatsapp: '+5519997159746', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karina' },
  { id: 'u-thais', name: 'Thais', whatsapp: '+5519997137501', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thais' },
  { id: 'u-jean', name: 'Jean', whatsapp: '+5519974149937', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean' },
  { id: 'u-ariane', name: 'Ariane', whatsapp: '+5519971113414', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ariane' },
  { id: 'u-samuel', name: 'Samuel', whatsapp: '+5519994457735', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samuel' },
  { id: 'u-lucas', name: 'Lucas', whatsapp: '+5519993370237', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas' },
  { id: 'u-kethilly', name: 'Kethilly (Kathleen)', whatsapp: '+5519998199053', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kethilly' },
  { id: 'u-larissa', name: 'Larissa', whatsapp: '+5519974210560', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Larissa' },
  { id: 'u-flavio', name: 'Flávio', whatsapp: '+5519974068984', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Flavio' },
  { id: 'u-roberta', name: 'Roberta', whatsapp: '+5519998742841', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberta' },
  { id: 'u-aline', name: 'Aline', whatsapp: '+5519983463318', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aline' },
  { id: 'u-julia', name: 'Julia', whatsapp: '+5519997791255', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julia' },
  { id: 'u-wenyuli', name: 'Wenyuli', whatsapp: '+5519995810047', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wenyuli' },
  { id: 'u-felipe', name: 'Felipe', whatsapp: '+5519999375045', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felipe' },
  { id: 'u-jonas', name: 'Jonas', whatsapp: '+5519984207381', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jonas' },

  // Desistentes (Ed 1)
  { id: 'u-andre', name: 'André', whatsapp: '', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andre' },
  { id: 'u-cassia', name: 'Cássia', whatsapp: '', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cassia' },
  { id: 'u-paloma', name: 'Paloma', whatsapp: '', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Paloma' },
  { id: 'u-soelma', name: 'Soelma', whatsapp: '', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Soelma' },

  // --- 2ª EDIÇÃO (15 pessoas) ---
  { id: 'u2-denise', name: 'Denise', whatsapp: '+5519984200575', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Denise' },
  { id: 'u2-fernanda', name: 'Fernanda Antunes', whatsapp: '+5519997588758', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda' },
  { id: 'u2-gabriely', name: 'Gabriely Vieira', whatsapp: '+5519997755994', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gabriely' },
  { id: 'u2-ianca', name: 'Ianca', whatsapp: '+5519987485009', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ianca' },
  { id: 'u2-isabele', name: 'Isabele', whatsapp: '+5519982465870', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabele' },
  { id: 'u2-jessica', name: 'Jéssica Spigolon', whatsapp: '+5519997131501', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica' },
  { id: 'u2-joice', name: 'Joice Cristina', whatsapp: '+5519977900660', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joice' },
  { id: 'u2-leticia', name: 'Leticia Hortolan', whatsapp: '+5519983701919', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leticia' },
  { id: 'u2-meire', name: 'Meire', whatsapp: '+5519996735031', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meire' },
  { id: 'u2-monise', name: 'Monise Proença', whatsapp: '+5519999187396', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Monise' },
  { id: 'u2-raquel', name: 'Raquel Erika', whatsapp: '+5519999711844', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raquel' },
  { id: 'u2-sabrina', name: 'Sabrina Curila', whatsapp: '+5519991541510', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sabrina' },
  { id: 'u2-telma', name: 'Telma', whatsapp: '+5519992560337', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Telma' },
  { id: 'u2-viviane', name: 'Viviane', whatsapp: '+5519998617413', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viviane' },
  { id: 'u2-yasmin', name: 'Yasmin', whatsapp: '+5519981113328', role: UserRole.PARTICIPANT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmin' },
];

// 3. Cotas
export const MOCK_COTAS: Cota[] = [
  // --- 1ª EDIÇÃO ---
  { id: 'c-carol', participantId: 'u-carol', editionId: 'ed-001', contemplated: true, contemplationMonth: 'Janeiro/2025', status: CotaStatus.ACTIVE, number: 1 },
  { id: 'c-karina', participantId: 'u-karina', editionId: 'ed-001', contemplated: true, contemplationMonth: 'Dezembro/2024', status: CotaStatus.ACTIVE, number: 2 },
  { id: 'c-thais', participantId: 'u-thais', editionId: 'ed-001', contemplated: true, contemplationMonth: 'Agosto/2024', status: CotaStatus.ACTIVE, number: 3 },
  { id: 'c-jean', participantId: 'u-jean', editionId: 'ed-001', contemplated: false, status: CotaStatus.ACTIVE, number: 4 },
  { id: 'c-ariane', participantId: 'u-ariane', editionId: 'ed-001', contemplated: false, status: CotaStatus.ACTIVE, number: 5 },
  { id: 'c-samuel', participantId: 'u-samuel', editionId: 'ed-001', contemplated: false, status: CotaStatus.ACTIVE, number: 6 },
  { id: 'c-lucas', participantId: 'u-lucas', editionId: 'ed-001', contemplated: true, contemplationMonth: 'Outubro/2024', status: CotaStatus.ACTIVE, number: 7 },
  { id: 'c-kethilly', participantId: 'u-kethilly', editionId: 'ed-001', contemplated: true, contemplationMonth: 'Setembro/2024', status: CotaStatus.ACTIVE, number: 8 },
  { id: 'c-larissa', participantId: 'u-larissa', editionId: 'ed-001', contemplated: false, status: CotaStatus.ACTIVE, number: 9 },
  { id: 'c-flavio', participantId: 'u-flavio', editionId: 'ed-001', contemplated: false, status: CotaStatus.ACTIVE, number: 10 },
  { id: 'c-roberta', participantId: 'u-roberta', editionId: 'ed-001', contemplated: true, contemplationMonth: 'Janeiro/2025', status: CotaStatus.ACTIVE, number: 11 },
  { id: 'c-aline', participantId: 'u-aline', editionId: 'ed-001', contemplated: true, contemplationMonth: 'Novembro/2024', status: CotaStatus.ACTIVE, number: 12 },
  { id: 'c-julia', participantId: 'u-julia', editionId: 'ed-001', contemplated: false, status: CotaStatus.ACTIVE, number: 13 },
  { id: 'c-wenyuli-1', participantId: 'u-wenyuli', editionId: 'ed-001', contemplated: true, contemplationMonth: 'Setembro/2024', status: CotaStatus.ACTIVE, number: 14 },
  { id: 'c-wenyuli-2', participantId: 'u-wenyuli', editionId: 'ed-001', contemplated: false, status: CotaStatus.ACTIVE, number: 15 },
  { id: 'c-felipe', participantId: 'u-felipe', editionId: 'ed-001', contemplated: true, contemplationMonth: 'Janeiro/2025', status: CotaStatus.ACTIVE, number: 16 },
  { id: 'c-jonas', participantId: 'u-jonas', editionId: 'ed-001', contemplated: true, contemplationMonth: 'Outubro/2024', status: CotaStatus.ACTIVE, number: 17 },
  // Desistentes (Ed 1)
  { id: 'c-andre', participantId: 'u-andre', editionId: 'ed-001', contemplated: false, status: CotaStatus.INACTIVE, number: 18 },
  { id: 'c-cassia', participantId: 'u-cassia', editionId: 'ed-001', contemplated: false, status: CotaStatus.INACTIVE, number: 19 },
  { id: 'c-paloma', participantId: 'u-paloma', editionId: 'ed-001', contemplated: false, status: CotaStatus.INACTIVE, number: 20 },
  { id: 'c-soelma', participantId: 'u-soelma', editionId: 'ed-001', contemplated: false, status: CotaStatus.INACTIVE, number: 21 },

  // --- 2ª EDIÇÃO (Cotas 1 a 15) ---
  { id: 'c2-denise', participantId: 'u2-denise', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 1 },
  { id: 'c2-fernanda', participantId: 'u2-fernanda', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 2 },
  { id: 'c2-gabriely', participantId: 'u2-gabriely', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 3 },
  { id: 'c2-ianca', participantId: 'u2-ianca', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 4 },
  { id: 'c2-isabele', participantId: 'u2-isabele', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 5 },
  { id: 'c2-jessica', participantId: 'u2-jessica', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 6 },
  { id: 'c2-joice', participantId: 'u2-joice', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 7 },
  { id: 'c2-leticia', participantId: 'u2-leticia', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 8 },
  { id: 'c2-meire', participantId: 'u2-meire', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 9 },
  { id: 'c2-monise', participantId: 'u2-monise', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 10 },
  { id: 'c2-raquel', participantId: 'u2-raquel', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 11 },
  { id: 'c2-sabrina', participantId: 'u2-sabrina', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 12 },
  { id: 'c2-telma', participantId: 'u2-telma', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 13 },
  { id: 'c2-viviane', participantId: 'u2-viviane', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 14 },
  { id: 'c2-yasmin', participantId: 'u2-yasmin', editionId: 'ed-002', contemplated: false, status: CotaStatus.ACTIVE, number: 15 },
];

// 4. Payments
const generatePaymentsForCota = (cota: Cota, edition: Edition): Payment[] => {
  const payments: Payment[] = [];
  const start = new Date(edition.startDate + 'T12:00:00');
  
  // Calculate how many months have passed since start date to determine current installment
  // Mocking "Now" as roughly mid-February 2025
  const mockToday = new Date('2025-02-15T12:00:00');
  
  // Diff in months from start
  const diffMonths = (mockToday.getFullYear() - start.getFullYear()) * 12 + (mockToday.getMonth() - start.getMonth());
  // If start is July 2024 and Now is Feb 2025: 2025-2024=1(12) + (1-6) = 12 + (-5) = 7 (Installment 8 is current)
  // If start is Jan 2025 and Now is Feb 2025: 2025-2025=0 + (1-0) = 1 (Installment 2 is current)
  
  const currentInstallmentIndex = diffMonths + 1;

  for (let i = 1; i <= edition.totalInstallments; i++) {
    const dueDate = new Date(start);
    dueDate.setMonth(start.getMonth() + (i - 1));
    dueDate.setDate(edition.dueDay);

    let status = PaymentStatus.PENDING;

    // Past Installments
    if (i < currentInstallmentIndex) {
         if (cota.status === CotaStatus.ACTIVE) {
             status = PaymentStatus.PAID;
             
             // --- 2ª Edição Lógica de "Pagar junto" ---
             // Simular que alguns da Ed 2 não pagaram Janeiro (Mês 1) ainda
             if (edition.id === 'ed-002' && i === 1) {
                // Randomly mark some as LATE/PENDING for Jan to simulate "paying together with Feb"
                const shouldBePending = ['c2-ianca', 'c2-meire', 'c2-telma'].includes(cota.id);
                if (shouldBePending) status = PaymentStatus.LATE;
             }
         } else {
             // Dropouts (Ed 1 specific)
             status = i <= 2 ? PaymentStatus.PAID : PaymentStatus.LATE;
         }
    } 
    // Current Installment
    else if (i === currentInstallmentIndex) {
        status = PaymentStatus.PENDING;
        // Simular validação em andamento
        if (cota.id === 'c-julia' || cota.id === 'c2-denise') {
            status = PaymentStatus.VALIDATING;
        }
    }

    payments.push({
      id: `pay-${cota.id}-${i}`,
      cotaId: cota.id,
      installmentNumber: i,
      value: edition.installmentValue,
      dueDate: dueDate.toISOString(),
      status: status,
      paidDate: status === PaymentStatus.PAID ? dueDate.toISOString() : undefined,
      proofUrl: status === PaymentStatus.VALIDATING ? 'https://picsum.photos/400/600' : undefined
    });
  }
  return payments;
};

// Generate payments for all defined cotas
export const MOCK_PAYMENTS: Payment[] = MOCK_COTAS.flatMap(cota => {
    const edition = MOCK_EDITIONS.find(e => e.id === cota.editionId);
    if (!edition) return [];
    return generatePaymentsForCota(cota, edition);
});

// 5. Draw History
export const MOCK_DRAWS: DrawHistory[] = [
    // --- 1ª EDIÇÃO HISTÓRICO ---
    { id: 'd-ago', editionId: 'ed-001', cotaId: 'c-thais', drawDate: '2024-08-25T19:00:00', monthRef: 'Agosto/2024' },
    { id: 'd-set-1', editionId: 'ed-001', cotaId: 'c-kethilly', drawDate: '2024-09-25T19:00:00', monthRef: 'Setembro/2024' },
    { id: 'd-set-2', editionId: 'ed-001', cotaId: 'c-wenyuli-1', drawDate: '2024-09-25T19:00:00', monthRef: 'Setembro/2024' },
    { id: 'd-out-1', editionId: 'ed-001', cotaId: 'c-lucas', drawDate: '2024-10-25T19:00:00', monthRef: 'Outubro/2024' },
    { id: 'd-out-2', editionId: 'ed-001', cotaId: 'c-jonas', drawDate: '2024-10-25T19:00:00', monthRef: 'Outubro/2024' },
    { id: 'd-nov', editionId: 'ed-001', cotaId: 'c-aline', drawDate: '2024-11-25T19:00:00', monthRef: 'Novembro/2024' },
    { id: 'd-dez', editionId: 'ed-001', cotaId: 'c-karina', drawDate: '2024-12-25T19:00:00', monthRef: 'Dezembro/2024' },
    { id: 'd-jan-1', editionId: 'ed-001', cotaId: 'c-roberta', drawDate: '2025-01-25T19:00:00', monthRef: 'Janeiro/2025' },
    { id: 'd-jan-2', editionId: 'ed-001', cotaId: 'c-carol', drawDate: '2025-01-25T19:00:00', monthRef: 'Janeiro/2025' },
    { id: 'd-jan-3', editionId: 'ed-001', cotaId: 'c-felipe', drawDate: '2025-01-25T19:00:00', monthRef: 'Janeiro/2025' },
    
    // --- 2ª EDIÇÃO (Sem sorteios ainda, começa em Fevereiro) ---
];