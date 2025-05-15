import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card as CardType } from "@/types/card";

interface CardProps extends CardType {
  hideRevealButton?: boolean;
  className?: string;
  onDelete?: (id: string) => void;
  isRevealed: boolean;
}

const Card: React.FC<CardProps> = ({
  id,
  spanish_text,
  english_text,
  russian_text,
  category,
  className,
  onDelete,
  hideRevealButton,
  isRevealed,
}) => {
  const [localRevealed, setLocalRevealed] = useState<boolean>(isRevealed);
  useEffect(() => {
    setLocalRevealed(isRevealed);
  }, [isRevealed]);

  const toggleReveal = () => {
    setLocalRevealed((prev) => !prev);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div
      className={cn(
        "relative bg-white rounded-lg shadow-md p-6 overflow-hidden transition-all duration-300 hover:shadow-lg border flex flex-col justify-between",
        className
      )}
    >
      <div>
        {category != "indefinida" ? (
          <span className="inline-block px-3 py-1 text-xs font-semibold text-cardBlue-700 bg-cardBlue-100 rounded-full mb-3">
            {category}
          </span>
        ) : (
          <span className="inline-block px-3 py-1 text-xs font-semibold text-red-500 bg-red-200 rounded-full mb-3">
            indefinida
          </span>
        )}
        <h3
          className={cn(
            "text-xl font-semibold mb-4 transition-all duration-300",
            !localRevealed && "blurred",
            localRevealed && "animate-card-reveal"
          )}
        >
          {spanish_text}
        </h3>
        {english_text && (
          <div
            className={cn(
              "text-gray-600  transition-all duration-300",
              !localRevealed && "blurred",
              localRevealed && "animate-card-reveal"
            )}
          >
            {english_text}
          </div>
        )}
        {russian_text && (
          <div
            className={cn(
              "text-gray-600 mb-4 transition-all duration-300",
              !localRevealed && "blurred",
              localRevealed && "animate-card-reveal"
            )}
          >
            {russian_text}
          </div>
        )}
      </div>

      <div className="flex flex-row-reverse justify-between mt-2">
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        )}
        {!hideRevealButton && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={toggleReveal}
          >
            {isRevealed ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" /> Hide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" /> Reveal
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Card;
