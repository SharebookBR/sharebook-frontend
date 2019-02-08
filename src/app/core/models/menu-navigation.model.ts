export class MenuNavigation {
  constructor(
    private text: string,
    private route: string,
    private alt?: string,
    private dropdown?: MenuNavigation[]
  ) {
  }
}
