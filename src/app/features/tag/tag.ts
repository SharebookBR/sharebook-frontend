export interface TagVM {
  id: string;
  name: string;
  family: string;
  totalBooks?: number | null;
  aliases?: string[];
  description?: string | null;
  usageNotes?: string | null;
  status?: string;
  isPublic?: boolean;
}
