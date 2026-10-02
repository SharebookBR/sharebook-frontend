export interface TagVM {
  id: string;
  name: string;
  family: string;
  aliases?: string[];
  description?: string | null;
  usageNotes?: string | null;
  status?: string;
  isPublic?: boolean;
}
