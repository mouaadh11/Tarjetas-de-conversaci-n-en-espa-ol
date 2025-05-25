import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/types/card";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { UUID } from "crypto";
import OpenAI from "openai";
import { env } from "process";

// const token = import.meta.env.VITE_GITHUB_TOKEN;
// const endpoint = "https://models.github.ai/inference";
// const model = "deepseek/DeepSeek-V3-0324";

//   const response = await client.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content: `You are a helpful and so creative assistant and every time you generate a new ideas and questions more fun even if it is the same prompt, Each response must be different from any previous example. Avoid repeating previous categories or sentence structures. Be surprising! generate ONLY JSON output. The format should always be:

//   {
//     "spanish_text": "...",
//     "english_text": "...",
//     "russian_text": "...",
//     "category": "..."
//   }

//   Do not include any explanation or extra text. Return ONLY the JSON object.`,
//       },
//       {
//         role: "user",
//         content: `- Request ID: ${noise}, Generate a different simple conversational Spanish learning question for level ${level} (e.g., A1). Theme: ${category}.

// If the theme is "Random", choose a random topic appropriate for the level.

//   - If the theme is "Random", change the "category" field to a real category.
//   - Translate the question into English and Russian.
//   - Output ONLY the JSON object.`,
//       },
//     ],
//     temperature: 1,
//     top_p: 1,
//     model: model,
//   });

const token = import.meta.env.VITE_GITHUB_TOKEN;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";
export const generatecardByAi = async (level: string, category: string) => {
  const noise = Math.random().toString(36).substring(2, 7);
  const client = ModelClient(endpoint, new AzureKeyCredential(token));

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        {
          role: "system",
          content: `You are a helpful and so creative assistant and every time you generate a new ideas and questions more fun even if it is the same prompt, Each response must be different from any previous example. Avoid repeating previous categories or sentence structures. Be surprising! generate ONLY JSON output. The format should always be:
  
  {
    "spanish_text": "...",
    "english_text": "...",
    "russian_text": "...",
    "category": "..."
  }
  
  Do not include any explanation or extra text. Return ONLY the JSON object.`,
        },
        {
          role: "user",
          content: `- Request ID: ${noise}, Generate a different simple conversational Spanish learning question for level ${level} (e.g., A1). Theme: ${category}.
  
If the theme is "Random", choose a random topic appropriate for the level.

  - if the question is short ask about why or the motivations
  - If the theme is "Random", change the "category" field to a real category. 
  - Translate the question into English and Russian.
  - Output ONLY the JSON object.`,
        },
      ],
      temperature: 1,
      top_p: 1,
      model: model,
    },
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  console.log(response.body.choices[0].message.content);
  return response.body.choices[0].message.content;

  //   const client = ModelClient(endpoint, new AzureKeyCredential(token));
  //   console.log(category, level);
  //   const noise = Math.random().toString(36).substring(2, 7);
  //   const response = await client.path("/chat/completions").post({
  //     body: {
  //       messages: [
  //         {
  //           role: "system",
  //           content: `You are a helpful and so creative assistant and every time you generate a new ideas and questions more fun even if it is the same prompt, Each response must be different from any previous example. Avoid repeating previous categories or sentence structures. Be surprising! generate ONLY JSON output. The format should always be:

  //   {
  //     "spanish_text": "...",
  //     "english_text": "...",
  //     "russian_text": "...",
  //     "category": "..."
  //   }

  //   Do not include any explanation or extra text. Return ONLY the JSON object.`,
  //         },
  //         {
  //           role: "user",
  //           content: `- Request ID: ${noise}, Generate a different simple conversational Spanish learning question for level ${level} (e.g., A1). Theme: ${category}.

  // If the theme is "Random", choose a random topic appropriate for the level.

  //   - If the theme is "Random", change the "category" field to a real category.
  //   - Translate the question into English and Russian.
  //   - Output ONLY the JSON object.`,
  //         },
  //       ],
  //       temperature: 1.0, // more creativity
  //       top_p: 1,
  //       max_tokens: 2048,
  //       model: model,
  //     },
  //   });

  //   if (isUnexpected(response)) {
  //     throw response.body.error;
  //   }

  //   console.log(response.body.choices[0].message.content, noise);
  //   const generatedCard = response.body.choices[0].message.content;
  //   return generatedCard.replace(/```json|```/g, "").trim();
};

export const fetchRandomCardByCategory = async (
  category: string,
  userId: string
): Promise<Card | null> => {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", userId)
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

export const fetchCategories = async (userId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from("cards")
    .select("category", { count: "exact", head: false })
    .eq("user_id", userId) // filter by logged-in user
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

export const fetchCards = async (userId: string): Promise<Card[]> => {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", userId) // filter by logged-in user
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
  card: Omit<Card, "id" | "created_at">,
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
export const updateCard = async (
  userId: string,
  id: string,
  updatedFields: Partial<Omit<Card, "id" | "created_at">>
): Promise<Card | null> => {
  console.log(id, updatedFields);
  const { data, error } = await supabase
    .from("cards")
    .update(updatedFields)
    .eq("user_id", userId)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating card:", error);
    throw error;
  }

  return data;
};

export const deleteCard = async (id: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("user_id", userId) // filter by logged-in user
    .eq("id", id);

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
