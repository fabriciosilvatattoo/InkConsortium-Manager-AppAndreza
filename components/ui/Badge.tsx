import React from 'react';
import { CotaStatus, PaymentStatus, EditionStatus } from '../../types';

interface BadgeProps {
  status: string;
}

export const Badge: React.FC<BadgeProps> = ({ status }) => {
  let colorClass = 'bg-gray-800 text-gray-300';

  switch (status) {
    case PaymentStatus.PAID:
    case CotaStatus.QUITADA:
    case 'Contemplada':
      colorClass = 'bg-green-900/50 text-green-400 border border-green-800';
      break;
    case PaymentStatus.PENDING:
    case EditionStatus.ACTIVE:
    case CotaStatus.ACTIVE:
      colorClass = 'bg-blue-900/50 text-blue-400 border border-blue-800';
      break;
    case PaymentStatus.LATE:
    case CotaStatus.INACTIVE:
    case PaymentStatus.VALIDATING:
      colorClass = 'bg-red-900/50 text-red-400 border border-red-800';
      if (status === PaymentStatus.VALIDATING) {
        colorClass = 'bg-yellow-900/50 text-yellow-400 border border-yellow-800';
      }
      break;
  }

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${colorClass}`}>
      {status}
    </span>
  );
};