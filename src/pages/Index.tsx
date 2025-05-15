import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import CardGrid from "@/components/CardGrid";
import RandomCard from "@/components/RandomCard";
import { fetchCards, deleteCard } from "@/services/cardService";
import { Card } from "@/types/card";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2 } from "lucide-react";

const Index = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setIsLoading(true);
      const fetchedCards = await fetchCards();
      setCards(fetchedCards);
    } catch (error) {
      console.error("Error loading cards:", error);
      toast({
        title: "Error",
        description: "Failed to load cards",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteCard(id);
      setCards(cards.filter((card) => card.id !== id));
      toast({
        title: "Success",
        description: "Card deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting card:", error);
      toast({
        title: "Error",
        description: "Failed to delete card",
        variant: "destructive",
      });
    }
  };

  const toggleReveal = () => {
    setIsRevealed(!isRevealed);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <RandomCard onDeleteCard={handleDeleteCard} />

        <div className="my-12">
          <div className="flex flex-row justify-between">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="bg-gradient-to-r from-cardBlue-700 to-cardBlue-500 w-1.5 h-6 rounded mr-2 inline-block"></span>
              Todas las tarjetas
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={toggleReveal}
            >
              {isRevealed ? (
                <>
                  <EyeOff className="h-4 w-4 mr-1" /> Hide Todas
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-1" /> Reveal Todas
                </>
              )}
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading cards...</p>
            </div>
          ) : (
            <CardGrid
              cards={cards}
              onDeleteCard={handleDeleteCard}
              isRevealed={isRevealed}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
