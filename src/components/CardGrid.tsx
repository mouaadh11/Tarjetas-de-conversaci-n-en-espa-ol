import React from "react";
import Card from "./Card";
import { Card as CardType } from "@/types/card";

interface CardGridProps {
  cards: CardType[];
  onDeleteCard?: (id: string) => void;
  isRevealed: boolean;
  handleCardSelection?(id: string, checked: boolean);
  selectedIds?: string[];
  showCheckbox?: boolean;
}

const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onDeleteCard,
  isRevealed,
  handleCardSelection,
  selectedIds,
  showCheckbox,
}) => {
  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          No cards found. Add some cards to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card
          key={card.id}
          {...card}
          onDelete={onDeleteCard}
          isRevealed={isRevealed}
          handleCardSelection={handleCardSelection}
          selectedIds={selectedIds}
          showCheckbox={showCheckbox}
        />
      ))}
    </div>
  );
};

export default CardGrid;
