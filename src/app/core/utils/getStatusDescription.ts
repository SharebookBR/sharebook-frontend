import { BookDonationStatus } from '../models/BookDonationStatus';

export function getStatusDescription(status) {
  switch (status) {
    case BookDonationStatus.WAITING_APPROVAL:
      return 'Aguardando aprovação';
    case BookDonationStatus.WAITING_DECISION:
      return 'Aguardando decisão do doador';
    case BookDonationStatus.WAITING_SEND:
      return 'Aguardando envio';
    case BookDonationStatus.SENT:
      return 'Enviado';
    case BookDonationStatus.AVAILABLE:
      return 'Disponível';
    case BookDonationStatus.RECEIVED:
      return 'Recebido';
    case BookDonationStatus.CANCELED:
      return 'Cancelado';
    default:
      return '???';
  }
}
