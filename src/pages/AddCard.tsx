import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card } from "@/types/card";
import { Upload, FileUp, Check, X, FileWarning } from "lucide-react";
import Papa from "papaparse";
import { addCard, addCardsFromCSV } from "@/services/cardService";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";

const formSchema = z.object({
  spanish_text: z.string().min(1, "Spanish text is required"),
  english_text: z.string().optional(),
  russian_text: z.string().optional(),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddCard: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [csvPreview, setCsvPreview] = useState<
    Omit<Card, "id" | "created_at">[]
  >([]);
  const [csvError, setCsvError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      spanish_text: "",
      english_text: "",
      russian_text: "",
      category: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await addCard({
        spanish_text: values.spanish_text,
        english_text: values.english_text || undefined,
        russian_text: values.russian_text || undefined,
        category: values.category || "indefinida",
      });

      toast({
        title: "Card added",
        description: "Your card has been added successfully",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add card",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processCSV(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    processCSV(file);
  };

  const processCSV = (file: File) => {
    // Check if it's a CSV file
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setCsvError("Please upload a CSV file");
      return;
    }

    // Check file size (1MB limit)
    if (file.size > 1024 * 1024) {
      setCsvError("File size exceeds 1MB limit");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setCsvError(`CSV parsing error: ${results.errors[0].message}`);
          return;
        }

        const cards = results.data.map((row: any) => ({
          spanish_text: row["Spanish Text"] || row["spanish_text"] || "",
          english_text:
            row["English Translation"] || row["english_text"] || undefined,
          category: row["Category"] || row["category"] || undefined,
        }));

        // Validate each card has spanish_text
        const invalidCards = cards.filter((card) => !card.spanish_text);
        if (invalidCards.length > 0) {
          setCsvError(`${invalidCards.length} cards are missing Spanish text`);
          return;
        }

        setCsvPreview(cards);
        setCsvError(null);
      },
      error: (error) => {
        setCsvError(`CSV parsing error: ${error.message}`);
      },
    });
  };

  const uploadCsvCards = async () => {
    if (csvPreview.length === 0) return;

    setIsSubmitting(true);
    try {
      const result = await addCardsFromCSV(csvPreview);

      toast({
        title: "Cards uploaded",
        description: `Successfully added ${result.length} cards`,
      });

      setCsvPreview([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload cards from CSV",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelCsvUpload = () => {
    setCsvPreview([]);
    setCsvError(null);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Header />

        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6">
              Agregar nueva tarjeta
            </h2>

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
                      <FormLabel>Texto en español (requerido)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="¿Cómo te llamas?" {...field} />
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
                      <FormLabel>Traducción al inglés (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="What is your name?" {...field} />
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
                      <FormLabel>Traducción al ruso (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Как вас зовут?" {...field} />
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

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-cardBlue-200 text-cardBlue-700 hover:bg-cardBlue-500"
                >
                  Agregar tarjeta
                </Button>
              </form>
            </Form>

            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">
                O cargar archivo CSV
              </h3>

              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  isDragging
                    ? "border-cardBlue-500 bg-cardBlue-50"
                    : "border-gray-300"
                } ${csvError ? "border-red-300 bg-red-50" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {csvPreview.length === 0 && !csvError && (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">Drag and drop your CSV file here, or</p>
                    <label htmlFor="csv-upload" className="mt-2 inline-block">
                      <span className="text-cardBlue-600 hover:text-cardBlue-700 cursor-pointer">
                        haga clic para navegar
                      </span>
                      <input
                        id="csv-upload"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Formato: Texto en español, Traducción al inglés,
                      Traducción al ruso, Categoría
                    </p>
                    <p className="text-xs text-gray-500">
                      Tamaño máximo de archivo: 1 MB
                    </p>
                  </>
                )}

                {csvError && (
                  <div className="text-red-600">
                    <FileWarning className="mx-auto h-12 w-12 text-red-400" />
                    <p className="mt-2 font-medium">{csvError}</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={cancelCsvUpload}
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {csvPreview.length > 0 && !csvError && (
                  <div>
                    <Check className="mx-auto h-12 w-12 text-green-500" />
                    <p className="mt-2 font-medium text-green-600">
                      {csvPreview.length} cards ready to upload
                    </p>

                    <div className="mt-4 max-h-60 overflow-y-auto border rounded-md">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left">
                              Spanish Text
                            </th>
                            <th className="px-4 py-2 text-left">
                              English Translation
                            </th>
                            <th className="px-4 py-2 text-left">Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.slice(0, 5).map((card, index) => (
                            <tr key={index} className="border-t">
                              <td className="px-4 py-2">{card.spanish_text}</td>
                              <td className="px-4 py-2">
                                {card.english_text || "-"}
                              </td>
                              <td className="px-4 py-2">
                                {card.category || "-"}
                              </td>
                            </tr>
                          ))}
                          {csvPreview.length > 5 && (
                            <tr>
                              <td
                                colSpan={3}
                                className="px-4 py-2 text-gray-500 text-center"
                              >
                                ...and {csvPreview.length - 5} more cards
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex space-x-4 justify-center">
                      <Button
                        onClick={uploadCsvCards}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isSubmitting}
                      >
                        <FileUp className="mr-2 h-4 w-4" /> Upload{" "}
                        {csvPreview.length} Cards
                      </Button>
                      <Button variant="outline" onClick={cancelCsvUpload}>
                        <X className="mr-2 h-4 w-4" /> Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCard;
