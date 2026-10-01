export enum BookRequestStatus {
  DONATED = 'Donated',
  REFUSED = 'Denied',
  AWAITING_ACTION = 'WaitingAction',
  CANCELED = 'Canceled'
}

export function getStatusDescription(RequestStatus): string {
  switch (RequestStatus) {
    case BookRequestStatus.DONATED:
      return 'Doado';
    case BookRequestStatus.REFUSED:
      return 'Não foi dessa vez';
    case BookRequestStatus.AWAITING_ACTION:
      return 'Aguardando decisão da pessoa doadora';
    case BookRequestStatus.CANCELED:
      return 'Cancelado';
    default:
      return '???';
  }
}
