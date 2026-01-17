export class Category {
  id: number;
  name: string;
  slug?: string;

  constructor(id, name, slug?) {
    this.id = id;
    this.name = name;
    this.slug = slug;
  }
}
