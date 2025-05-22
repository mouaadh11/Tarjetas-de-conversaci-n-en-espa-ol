import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Pencil, Sparkles, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card as CardType } from "@/types/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { Textarea } from "./ui/textarea";
import { updateCard } from "@/services/cardService";
import { CardContext } from "@/context/CardContext";
const formSchema = z.object({
  spanish_text: z.string().min(1, "Spanish text is required"),
  english_text: z.string().optional(),
  russian_text: z.string().optional(),
  category: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

interface CardProps extends CardType {
  hideRevealButton?: boolean;
  className?: string;
  onDelete?: (id: string) => void;
  isRevealed: boolean;
  handleCardSelection?(id: string, checked: boolean);
  selectedIds?: string[];
  showCheckbox?: boolean;
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
  handleCardSelection,
  selectedIds,
  showCheckbox,
}) => {
  const { refresh } = useContext(CardContext); // Moved inside the component

  const [localRevealed, setLocalRevealed] = useState<boolean>(isRevealed);
  useEffect(() => {
    setLocalRevealed(isRevealed);
  }, [isRevealed]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleReveal = () => {
    setLocalRevealed((prev) => !prev);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      spanish_text: spanish_text,
      english_text: english_text || "",
      russian_text: russian_text || "",
      category: category === "indefinida" ? "" : category,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const updatePayload: Record<string, string> = {
        spanish_text: values.spanish_text,
      };

      if (values.english_text) {
        updatePayload.english_text = values.english_text;
      }

      if (values.russian_text) {
        updatePayload.russian_text = values.russian_text;
      }

      if (values.category) {
        updatePayload.category = values.category;
      }

      await updateCard(id, updatePayload);

      toast({
        title: "Card Updated",
        description: "Your card has been updated successfully",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update card",
        variant: "destructive",
      });
    } finally {
      refresh(); // Refresh cards from anywhere
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "relative bg-white rounded-lg shadow-md p-6 overflow-hidden transition-all duration-300 hover:shadow-lg border flex flex-col justify-between ",
        className
      )}
    >
      <div>
        <div className="absolute top-2 right-2">
          {showCheckbox && (
            <Checkbox
              checked={selectedIds.includes(id)}
              onCheckedChange={(checked: boolean) =>
                handleCardSelection(id, checked)
              }
            />
          )}
        </div>
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
          className={
            "text-xl font-semibold mb-4 transition-all duration-300"}
        >
          {spanish_text}
        </h3>
        {english_text && (
          <div
            className={cn(
              "text-gray-600  transition-all duration-300 mb-2",
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
        <div className="flex flex-row-reverse">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              {!localRevealed ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        {onDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                          </Button>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Revealed the card first</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                  </Button>
                )
              )}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  card and remove it form your card list.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-400 hover:bg-red-500"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {localRevealed ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost">
                  <Pencil />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto w-[90vw] md:w-full">
                <DialogHeader>
                  <DialogTitle>Edit Card</DialogTitle>
                  <DialogDescription asChild>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="spanish_text"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Texto en español (requerido)
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="¿Cómo te llamas?"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="english_text"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Traducción al inglés (opcional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="What is your name?"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="russian_text"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Traducción al ruso (opcional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Как вас зовут?"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Categoría (opcional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Introductions" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex flex-row-reverse justify-between items-center">
                          <Button
                            type="submit"
                            // disabled={isSubmitting}
                            className=" bg-cardBlue-700 hover:bg-cardBlue-200 hover:text-black"
                          >
                            Agregar tarjeta
                          </Button>
                          <div className="flex flex-row gap-3">
                            {isSubmitting && <Spinner />}
                          </div>
                        </div>
                      </form>
                    </Form>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button variant="ghost" disabled>
                      <Pencil />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Revealed the card first</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {!hideRevealButton && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={toggleReveal}
          >
            {localRevealed ? (
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
