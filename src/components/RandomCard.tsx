import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dices, SquareX } from "lucide-react";
import Card from "./Card";
import { Spinner } from "@/components/ui/spinner";
import { Card as CardType } from "@/types/card";
import {
  fetchCategories,
  fetchRandomCard,
  fetchRandomCardByCategory,
} from "@/services/cardService";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";


interface RandomCardProps {
  onDeleteCard?: (id: string) => void;
}

const RandomCard: React.FC<RandomCardProps> = ({ onDeleteCard }) => {
  const [randomCard, setRandomCard] = useState<CardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState("all");
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const categoriesFectched = await fetchCategories();
      setCategories(categoriesFectched);
      // console.log(categoriesFectched);
    } catch (error) {
      console.error("Error getting categories:", error);
      toast({
        title: "Error",
        description: "Failed to get categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const closeRendomCard = () => {
    setRandomCard(null);
  };

  const getRandomCard = async () => {
    setIsLoading(true);
    try {
      let fetchedCard = null;
      let atempts = 5;
      do {
        fetchedCard =
          position === "all"
            ? await fetchRandomCard()
            : await fetchRandomCardByCategory(position);
        console.log(fetchedCard);
        atempts--;
        console.log(atempts);
      } while (
        randomCard !== null &&
        fetchedCard?.id === randomCard?.id &&
        atempts > 0
      );
      if (atempts <= 0) {
        toast({
          title: "No cards found",
          description: "There is no more cards in this categery",
          variant: "destructive",
        });
      }
      else if (fetchedCard) {
        const card = fetchedCard;
        setRandomCard(card);
        toast({
          title: "Random card selected!",
          description: "Showing a new conversation prompt",
        });
      } else {
        toast({
          title: "No cards found",
          description: "Try adding some cards first",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error getting random card:", error);
      toast({
        title: "Error",
        description: "Failed to get a random card",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-10">
      {randomCard && (
        <div className="animate-fade-in">
          <div className="relative max-w-2xl mx-auto mb-8">
            <Card
              {...randomCard}
              className="p-8 bg-gradient-to-br from-cardBlue-100 to-white"
              hideRevealButton={true}
              isRevealed={true}
              onDelete={(id) => {
                onDeleteCard?.(id); // call parent if needed
                closeRendomCard(); // close the random card
              }}
            />
          </div>
        </div>
      )}
      <div className="flex justify-center mb-6">
        {randomCard && (
          <Button
            onClick={closeRendomCard}
            className="text-lg mr-2 py-6 px-2 bg-red-500 hover:bg-red-700 gap-2"
            disabled={isLoading}
          >
            <SquareX className="!w-6 !h-6" />
          </Button>
        )}
        <Button
          onClick={getRandomCard}
          className="text-lg mr-2 py-6 px-8 text-cardBlue-700 bg-cardBlue-200 hover:bg-cardBlue-700 hover:text-cardBlue-100 gap-2"
          disabled={isLoading}
        >
          <Dices className="!h-6 !w-6 mr-1" /> Obtener tarjeta aleatoria
        </Button>

        {!isLoading ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus:ring-0">
              <ChevronDown className="!w-7 !h-7" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="max-h-60 overflow-y-auto scroll-smooth">
              <DropdownMenuLabel>Categorías</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuRadioItem value="all">todo</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="indefinida">
                  indefinida
                </DropdownMenuRadioItem>
                <DropdownMenuSeparator />

                {categories.map((category) => {
                  return (
                    category !== "indefinida" && (
                      <DropdownMenuRadioItem key={category} value={category}>
                        {category}
                      </DropdownMenuRadioItem>
                    )
                  );
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
};

export default RandomCard;
