export interface Card {
  id: number;
  recto: string;
  verso: string;
  next_review_at: Date | null;
  box: number;
}
