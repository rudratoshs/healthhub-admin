import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Save,
  Calculator,
  Utensils,
} from "lucide-react";
import {
  DietPlan,
  CreateDietPlanRequest,
  UpdateDietPlanRequest,
} from "@/types/dietPlan";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

// Schema for the form validation
const dietPlanSchema = z
  .object({
    client_id: z.coerce.number().min(1, "Client ID is required"),
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    daily_calories: z.coerce
      .number()
      .min(500, "Calories must be at least 500")
      .max(10000, "Calories must be at most 10000"),
    protein_grams: z.coerce
      .number()
      .min(10, "Protein must be at least 10g")
      .max(500, "Protein must be at most 500g"),
    carbs_grams: z.coerce
      .number()
      .min(10, "Carbs must be at least 10g")
      .max(1000, "Carbs must be at most 1000g"),
    fats_grams: z.coerce
      .number()
      .min(5, "Fats must be at least 5g")
      .max(500, "Fats must be at most 500g"),
    status: z.enum(["active", "inactive", "completed"]),
    start_date: z.date({
      required_error: "Start date is required",
    }),
    end_date: z.date({
      required_error: "End date is required",
    }),
  })
  .refine((data) => data.end_date > data.start_date, {
    message: "End date must be after start date",
    path: ["end_date"],
  });

interface DietPlanFormProps {
  initialValues?: Partial<DietPlan>;
  onSubmit: (data: CreateDietPlanRequest | UpdateDietPlanRequest) => void;
  isSubmitting: boolean;
  clientId?: number;
  clients?: { id: number; name: string }[];
}

const DietPlanForm: React.FC<DietPlanFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
  clientId,
  clients = [],
}) => {
  // Default form values
  const defaultValues = {
    client_id: clientId || (initialValues?.client_id ?? 0),
    title: initialValues?.title ?? "",
    description: initialValues?.description ?? "",
    daily_calories: initialValues?.daily_calories ?? 2000,
    protein_grams: initialValues?.protein_grams ?? 150,
    carbs_grams: initialValues?.carbs_grams ?? 225,
    fats_grams: initialValues?.fats_grams ?? 55,
    status: initialValues?.status ?? "active",
    start_date: initialValues?.start_date
      ? new Date(initialValues.start_date)
      : new Date(),
    end_date: initialValues?.end_date
      ? new Date(initialValues.end_date)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };

  const form = useForm<z.infer<typeof dietPlanSchema>>({
    resolver: zodResolver(dietPlanSchema),
    defaultValues,
  });

  // Calculate macronutrient percentages as user inputs values
  const watchProtein = form.watch("protein_grams");
  const watchCarbs = form.watch("carbs_grams");
  const watchFats = form.watch("fats_grams");
  const totalGrams =
    Number(watchProtein) + Number(watchCarbs) + Number(watchFats);

  const proteinPercentage =
    totalGrams > 0 ? Math.round((Number(watchProtein) / totalGrams) * 100) : 0;
  const carbsPercentage =
    totalGrams > 0 ? Math.round((Number(watchCarbs) / totalGrams) * 100) : 0;
  const fatsPercentage =
    totalGrams > 0 ? Math.round((Number(watchFats) / totalGrams) * 100) : 0;

  // Calculate calorie totals
  const proteinCalories = Number(watchProtein) * 4; // 4 calories per gram
  const carbsCalories = Number(watchCarbs) * 4; // 4 calories per gram
  const fatsCalories = Number(watchFats) * 9; // 9 calories per gram
  const totalCalories = proteinCalories + carbsCalories + fatsCalories;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 animate-fade-in"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Utensils className="h-5 w-5 mr-2 text-primary-600" /> Diet Plan
                Information
              </h3>

              {/* Client ID */}
              <FormField
                control={form.control}
                name="client_id"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Client</FormLabel>
                    {clients.length > 0 ? (
                      <Select
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        defaultValue={field.value.toString()}
                        disabled={!!clientId}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem
                              key={client.id}
                              value={client.id.toString()}
                            >
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={!!clientId}
                          placeholder="Enter client ID"
                          className="bg-white"
                        />
                      </FormControl>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Weight Loss & Detox Plan"
                        className="bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the diet plan..."
                        className="resize-none bg-white"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-primary-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-primary-600" />{" "}
                Duration
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full bg-white flex justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* End Date */}
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full bg-white flex justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => date < form.watch("start_date")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-4 rounded-md">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary-600" />{" "}
                Nutrition Targets
              </h3>

              {/* Daily Calories */}
              <FormField
                control={form.control}
                name="daily_calories"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Daily Calories (kcal)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Protein */}
              <FormField
                control={form.control}
                name="protein_grams"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Protein (grams)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Carbs */}
              <FormField
                control={form.control}
                name="carbs_grams"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Carbohydrates (grams)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fats */}
              <FormField
                control={form.control}
                name="fats_grams"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Fats (grams)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Macronutrient Ratio Visual */}
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">
                  Macronutrient Ratio
                </h4>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{ width: `${proteinPercentage}%` }}
                    title={`Protein: ${proteinPercentage}%`}
                  ></div>
                  <div
                    className="bg-green-500 h-full transition-all duration-300"
                    style={{ width: `${carbsPercentage}%` }}
                    title={`Carbs: ${carbsPercentage}%`}
                  ></div>
                  <div
                    className="bg-yellow-500 h-full transition-all duration-300"
                    style={{ width: `${fatsPercentage}%` }}
                    title={`Fats: ${fatsPercentage}%`}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-blue-700">
                    Protein: {proteinPercentage}%
                  </span>
                  <span className="text-green-700">
                    Carbs: {carbsPercentage}%
                  </span>
                  <span className="text-yellow-700">
                    Fats: {fatsPercentage}%
                  </span>
                </div>

                <div className="mt-6 p-3 bg-white rounded-md border">
                  <h4 className="text-sm font-medium mb-2">
                    Calculated Nutritional Values
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        Protein calories:
                      </span>
                      <span className="font-medium ml-2 text-blue-700">
                        {proteinCalories} kcal
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Carbs calories:
                      </span>
                      <span className="font-medium ml-2 text-green-700">
                        {carbsCalories} kcal
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Fats calories:
                      </span>
                      <span className="font-medium ml-2 text-yellow-700">
                        {fatsCalories} kcal
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Total calories:
                      </span>
                      <span className="font-medium ml-2">
                        {totalCalories} kcal
                      </span>
                    </div>
                  </div>

                  {Math.abs(totalCalories - form.watch("daily_calories")) >
                    50 && (
                    <p className="text-amber-600 text-xs mt-2">
                      Note: Your macronutrient calories ({totalCalories} kcal)
                      don't match your daily calorie target (
                      {form.watch("daily_calories")} kcal).
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-600 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save Diet Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DietPlanForm;
