import React, { useEffect, useState } from "react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/types/card";
import CsvForm from "@/components/Csvform";
import {
  Upload,
  FileUp,
  Check,
  X,
  FileWarning,
  ChevronsUpDown,
} from "lucide-react";
import Papa from "papaparse";
import {
  addCard,
  addCardsFromCSV,
  fetchCategories,
  generatecardByAi,
} from "@/services/cardService";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  spanish_text: z.string().min(1, "Spanish text is required"),
  english_text: z.string().optional(),
  russian_text: z.string().optional(),
  category: z.string().optional(),
});

const aiFormSchema = z.object({
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]).optional(),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type AiFormValues = z.infer<typeof aiFormSchema>;
import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { session } from "@/services/userService";

const AddCard: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [csvPreview, setCsvPreview] = useState<
    Omit<Card, "id" | "created_at">[]
  >([]);
  const [aiFormIsOpen, setAiFormIsOpen] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionData = await session();
        const categories = await fetchCategories(sessionData.id);
        setCategories(categories);
      } catch (e) {
        console.error("Error fetching categories", e);
      }
    };

    fetchData();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      spanish_text: "",
      english_text: "",
      russian_text: "",
      category: "",
    },
  });
  const formAi = useForm<AiFormValues>({
    resolver: zodResolver(aiFormSchema),
    defaultValues: {
      level: "A1",
      category: "",
    },
  });
  const targetRef = useRef<HTMLDivElement>(null);

  const handleRedirect = () => {
    targetRef.current?.scrollIntoView({ behavior: "smooth" });
    setAiFormIsOpen(false);
  };

  const onSubmitAi = async (values: z.infer<typeof aiFormSchema>) => {
    setIsSubmitting(true);

    try {
      const category = values.category === "" ? "Random" : values.category;
      const level = values.level;

      console.log("Generating card for:", level, category);

      const generatedCard = await generatecardByAi(level, category);

      // Attempt to parse the generated JSON
      const data = JSON.parse(generatedCard);

      // Set form values
      form.setValue("spanish_text", data.spanish_text);
      form.setValue("english_text", data.english_text);
      form.setValue("russian_text", data.russian_text);
      form.setValue("category", data.category);

      toast({
        title: "Generated",
        description: "Generated succesfully",
      });
      handleRedirect();
    } catch (error) {
      console.error("Failed to generate or parse card:", error);
      toast({
        title: "Error",
        description: "Failed to generate card",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const onSubmit = async (values: FormValues) => {
    const sessionData = await session();
    setIsSubmitting(true);
    try {
      await addCard({
        user_id: sessionData.id,
        spanish_text: values.spanish_text,
        english_text: values.english_text || undefined,
        russian_text: values.russian_text || undefined,
        category: values.category.toLowerCase() || "indefinida",
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
            {/* Add a card by form */}
            <div ref={targetRef}>
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
                  {/* <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => {
                      const [open, setOpen] = useState(false);
                      const [inputValue, setInputValue] = useState(
                        field.value || ""
                      );

                      // Filter suggestions based on typed input
                      const filteredCategories = categories.filter((cat) => {
                        const result =
                          cat
                            .toLowerCase()
                            .includes(inputValue.toLowerCase()) &&
                          cat.toLowerCase() !== inputValue.toLowerCase();
                        console.log(result);
                        return result;
                      });

                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>Categoría (opcional)</FormLabel>

                          <div className="relative">
                            <Input
                              value={inputValue}
                              onChange={(e) => {
                                const value = e.target.value;
                                setInputValue(value);
                                field.onChange(value);
                                setOpen(true);
                              }}
                              onFocus={() => {
                                console.log(filteredCategories.length)
                                if (filteredCategories.length > 0)
                                  setOpen(true);
                              }}
                              placeholder="Introductions"
                            />

                            {(open && filteredCategories.length > 0) && (
                              <Popover open={open} onOpenChange={setOpen}>
                                
                                <PopoverContent className="w-full mt-1 p-0">
                                  <Command>
                                    <CommandList>
                                      {filteredCategories.map((cat) => (
                                        <CommandItem
                                          key={cat}
                                          onSelect={() => {
                                            setInputValue(cat);
                                            field.onChange(cat);
                                            setOpen(false);
                                          }}
                                        >
                                          {cat}
                                        </CommandItem>
                                      ))}
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  /> */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => {
                      const [inputValue, setInputValue] = useState(
                        field.value || ""
                      );
                      const [open, setOpen] = useState(false);

                      const filteredCategories = categories.filter((cat) => {
                        return (
                          cat
                            .toLowerCase()
                            .includes(inputValue.toLowerCase()) &&
                          cat.toLowerCase() !== inputValue.toLowerCase()
                        );
                      });

                      return (
                        <FormItem className="flex flex-col relative">
                          <FormLabel>Categoría (opcional)</FormLabel>

                          <Input
                            value={inputValue}
                            onChange={(e) => {
                              const value = e.target.value;
                              setInputValue(value);
                              field.onChange(value);
                              setOpen(true);
                            }}
                            onFocus={() => {
                              if (filteredCategories.length > 0) setOpen(true);
                            }}
                            onBlur={() => {
                              // Delay closing to allow click on item
                              setTimeout(() => setOpen(false), 150);
                            }}
                            placeholder="Introductions"
                          />

                          {open && filteredCategories.length > 0 && (
                            <div className="absolute z-10 top-full mt-1 w-full rounded-md border bg-white shadow-md">
                              {filteredCategories.map((cat) => (
                                <div
                                  key={cat}
                                  onMouseDown={() => {
                                    // onMouseDown to avoid blur before selection
                                    setInputValue(cat);
                                    field.onChange(cat);
                                    setOpen(false);
                                  }}
                                  className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                >
                                  {cat}
                                </div>
                              ))}
                            </div>
                          )}

                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  {/* <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => {
                      const [open, setOpen] = useState(false);

                      return (
                        <FormItem className="flex flex-col">
                          <FormLabel>Categoría (opcional)</FormLabel>
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ||
                                  "Selecciona o escribe una categoría"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                              <Command>
                                <CommandInput placeholder="Buscar categoría..." />
                                <CommandList>
                                  {categories.map((category) => (
                                    <CommandItem
                                      key={category}
                                      value={category}
                                      onSelect={(value) => {
                                        field.onChange(value);
                                        setOpen(false);
                                      }}
                                    >
                                      {category}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  /> */}
                  {/* <FormField
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
                  /> */}

                  <div className="flex flex-row-reverse justify-between items-center">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className=" bg-cardBlue-700 hover:bg-cardBlue-200 hover:text-black"
                    >
                      Agregar tarjeta
                    </Button>
                    <div className="flex flex-row gap-3">
                      {isSubmitting && <Spinner />}
                      {/* unexpected behaviour working to fix */}
                      <Dialog>
                        <DialogTrigger asChild disabled>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <Button
                                    variant="default"
                                    className="flex flex-row items-center bg-black hover:bg-cardBlue-700 text-white"
                                    disabled
                                  >
                                    Generate by AI
                                    <Sparkles className="ml-auto text-cardBlue-200" />
                                  </Button>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>coming soon...</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                              Make changes to your profile here. Click save when
                              you're done.
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...formAi}>
                            <form
                              onSubmit={formAi.handleSubmit(onSubmitAi)}
                              className="space-y-8"
                            >
                              <FormField
                                control={formAi.control}
                                name="category"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="eg. Ropa"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={formAi.control}
                                name="level"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a level" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="A1">A1</SelectItem>
                                        <SelectItem value="A2">A2</SelectItem>
                                        <SelectItem value="B1">B1</SelectItem>
                                        <SelectItem value="B2">B2</SelectItem>
                                        <SelectItem value="C1">C1</SelectItem>
                                        <SelectItem value="C2">C2</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-cardBlue-200 text-cardBlue-700 hover:bg-cardBlue-500"
                                  >
                                    Submit
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </form>
              </Form>
            </div>

            {/* Generate it by AI */}
            {/* <div className="mt-12">
              <Collapsible open={aiFormIsOpen} onOpenChange={setAiFormIsOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex flex-row items-center mb-4 "
                  >
                    <h3 className="text-xl font-semibold">Generate it by AI</h3>
                    <ChevronsUpDown className="ml-auto" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Form {...formAi}>
                    <form
                      onSubmit={formAi.handleSubmit(onSubmitAi)}
                      className="space-y-8"
                    >
                      <FormField
                        control={formAi.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <FormControl>
                              <Input placeholder="eg. Ropa" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formAi.control}
                        name="level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="A1">A1</SelectItem>
                                <SelectItem value="A2">A2</SelectItem>
                                <SelectItem value="B1">B1</SelectItem>
                                <SelectItem value="B2">B2</SelectItem>
                                <SelectItem value="C1">C1</SelectItem>
                                <SelectItem value="C2">C2</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-row gap-2">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-cardBlue-200 text-cardBlue-700 hover:bg-cardBlue-500"
                        >
                          Submit
                        </Button>
                        {isSubmitting && <Spinner />}
                      </div>
                    </form>
                  </Form>
                </CollapsibleContent>
              </Collapsible>
            </div> */}

            {/* upload CSV */}
            {/* <div className="mt-12">
              <Collapsible>
                <CollapsibleTrigger>
                  <Button
                    variant="ghost"
                    className="flex flex-row items-center mb-4 "
                  >
                    <h3 className="text-xl font-semibold">
                      O cargar archivo CSV
                    </h3>
                    <ChevronsUpDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
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
                        <p className="mt-2">
                          Drag and drop your CSV file here, or
                        </p>
                        <label
                          htmlFor="csv-upload"
                          className="mt-2 inline-block"
                        >
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
                                <th className="px-4 py-2 text-left">
                                  Category
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {csvPreview.slice(0, 5).map((card, index) => (
                                <tr key={index} className="border-t">
                                  <td className="px-4 py-2">
                                    {card.spanish_text}
                                  </td>
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
                </CollapsibleContent>
              </Collapsible>
            </div> */}
            <CsvForm
              setIsSubmitting={setIsSubmitting}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCard;
