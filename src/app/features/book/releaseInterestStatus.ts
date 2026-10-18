export interface ReleaseInterestStatus {
  /** Quantas pessoas pediram para ser avisadas sobre o livro. */
  total: number;
  /** Se a pessoa logada já pediu o aviso. Sempre false para visitante. */
  subscribed: boolean;
}
