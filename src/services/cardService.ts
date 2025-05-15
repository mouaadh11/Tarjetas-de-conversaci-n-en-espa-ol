import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/types/card";

export const fetchRandomCardByCategory = async (
  category: string
): Promise<Card | null> => {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("category", category)
    .order("created_at", { ascending: false }); // optional ordering

  if (error) {
    console.error("Error fetching cards by category:", error);
    return null;
  }

  if (!data || data.length === 0) return null;

  // Select a random card from the results
  const randomIndex = Math.floor(Math.random() * data.length);
  return data[randomIndex];
};

export const fetchCategories = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("cards")
    .select("category", { count: "exact", head: false })
    .neq("category", null)
    .order("category", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  // Get unique category names
  const uniqueCategories = [...new Set(data.map((item) => item.category))];

  return uniqueCategories;
};

export const fetchCards = async (): Promise<Card[]> => {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cards:", error);
    throw error;
  }

  return data || [];
};

export const fetchRandomCard = async (): Promise<Card | null> => {
  const { data, error } = await supabase.rpc("get_random_card");

  if (error) {
    console.error("Error fetching random card:", error);
    return null;
  }

  return data;
};

export const addCard = async (
  card: Omit<Card, "id" | "created_at">
): Promise<Card | null> => {
  const { data, error } = await supabase
    .from("cards")
    .insert([card])
    .select()
    .single();

  if (error) {
    console.error("Error adding card:", error);
    throw error;
  }

  return data;
};

export const deleteCard = async (id: string): Promise<void> => {
  const { error } = await supabase.from("cards").delete().eq("id", id);

  if (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
};

export const addCardsFromCSV = async (
  cards: Omit<Card, "id" | "created_at">[]
): Promise<Card[]> => {
  if (cards.length === 0) return [];

  const { data, error } = await supabase.from("cards").insert(cards).select();

  if (error) {
    console.error("Error adding cards from CSV:", error);
    throw error;
  }

  return data || [];
};
