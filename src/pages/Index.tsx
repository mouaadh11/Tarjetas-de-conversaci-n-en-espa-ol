import React, { useEffect, useState } from "react";

import Header from "@/components/Header";
import CardGrid from "@/components/CardGrid";
import RandomCard from "@/components/RandomCard";
import { fetchCards, deleteCard } from "@/services/cardService";
import { Card } from "@/types/card";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowDownWideNarrow, Eye, EyeOff, Menu, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { CardProvider } from "@/context/CardContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const isMobile = useIsMobile();

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
  const toggleShowCheckbox = () => {
    setShowCheckbox(!showCheckbox);
    !isRevealed && toggleReveal();
  };
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleCardSelection = (id: string, checked: boolean) => {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((cardId) => cardId !== id)
    );
  };
  const deleteCardsByIds = async (selectedIds) => {
    if (selectedIds.length !== 0) {
      try {
        // Wait for all deletions to complete
        await Promise.all(selectedIds.map((cardId) => deleteCard(cardId)));

        // Remove all deleted cards from the state in one go
        setCards((prevCards) =>
          prevCards.filter((card) => !selectedIds.includes(card.id))
        );

        toast({
          title: "Success",
          description: "Selected cards deleted successfully",
        });
      } catch (error) {
        console.error("Error deleting cards:", error);
        toast({
          title: "Error",
          description: "Failed to delete one or more cards",
          variant: "destructive",
        });
      }
      // loadCards(); // or refetch cards
    } else {
      toast({
        title: "No card selected",
        variant: "destructive",
      });
    }
    toggleReveal();
  };
  const handleMultiDelete = async () => {
    await deleteCardsByIds(selectedIds);
    console.log(selectedIds);
    setSelectedIds([]);
    toggleShowCheckbox();
  };

  return (
    <CardProvider loadCards={loadCards}>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Header />

          <RandomCard onDeleteCard={handleDeleteCard} />

          <div className="my-12">
            <div className="flex flex-row justify-between">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <span className="bg-cardBlue-700 w-1.5 h-6 rounded mr-2 inline-block"></span>
                Todas las tarjetas
              </h2>
              <div className="flex flex-row-reverse gap-1 md:gap-3">
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={toggleReveal}
                      >
                        {isRevealed ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" /> {"Hide Todas"}
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" /> {"Reveal Todas"}
                          </>
                        )}
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Button
                        variant="outline"
                        className="border-red-400 w-[100%]"
                        onClick={toggleShowCheckbox}
                      >
                        <Trash2 className="text-red-400 !w-4 !h-4" />
                        {"Delete"}
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="items-center gap-1 hidden md:flex"
                  onClick={toggleReveal}
                >
                  {isRevealed ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" /> {"Hide Todas"}
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" /> {"Reveal Todas"}
                    </>
                  )}
                </Button>

                {showCheckbox ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={selectedIds.length === 0 && handleMultiDelete}
                      >
                        <Trash2 />
                        {!isMobile && "Delete Selected" + selectedIds.length}
                      </Button>
                    </AlertDialogTrigger>
                    {selectedIds.length !== 0 && (
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the card and remove it form your card list.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              variant="destructive"
                              className="bg-red-400 hover:bg-red-500"
                              onClick={
                                !showCheckbox
                                  ? toggleShowCheckbox
                                  : handleMultiDelete
                              }
                            >
                              <Trash2 />
                              Delete Selected ({selectedIds.length})
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    )}
                  </AlertDialog>
                ) : (
                  <Button
                    variant="outline"
                    className="border-red-400 hidden md:flex"
                    onClick={toggleShowCheckbox}
                  >
                    <Trash2 className="text-red-400 !w-4 !h-4" />
                    {!isMobile && "Delete"}
                  </Button>
                )}

                {showCheckbox && (
                  <Button
                    onClick={(checked) => {
                      selectedIds.length !== cards.length
                        ? setSelectedIds(checked ? cards.map((c) => c.id) : [])
                        : setSelectedIds([]);
                    }}
                    disabled={cards.length === 0}
                  >
                    <ArrowDownWideNarrow />
                  </Button>
                )}
              </div>
              
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
                handleCardSelection={handleCardSelection}
                selectedIds={selectedIds}
                showCheckbox={showCheckbox}
              />
            )}
          </div>
        </div>
      </div>
    </CardProvider>
  );
};

export default Index;
