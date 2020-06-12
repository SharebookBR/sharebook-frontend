export enum BookRequestStatus {
  DONATED = 'Donated',
  REFUSED = 'Denied',
  AWAITING_ACTION = 'WaitingAction',
}

export function getStatusDescription(RequestStatus) {
  switch (RequestStatus) {
    case BookRequestStatus.DONATED:
      return 'Doado';
    case BookRequestStatus.REFUSED:
      return 'Não foi dessa vez';
    case BookRequestStatus.AWAITING_ACTION:
      return 'Aguardando decisão do doador';
  }
}
