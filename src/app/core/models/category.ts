export class Category {
  id: string;
  name: string;
  slug?: string;
  parentCategoryId?: string | null;
  parentCategoryName?: string | null;
  parentCategorySlug?: string | null;
  children?: Category[];
  displayName?: string;

  constructor(init?: Partial<Category>) {
    Object.assign(this, init);
  }
}
