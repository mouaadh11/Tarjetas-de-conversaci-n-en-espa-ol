import { UUID } from "crypto";

export interface Card {
  id: string;
  user_id: string;
  spanish_text: string;
  english_text?: string;
  russian_text?: string;
  category?: string;
  created_at?: string;
}
