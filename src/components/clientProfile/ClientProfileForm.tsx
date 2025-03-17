import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ClientProfile,
  CreateClientProfileRequest,
  getProfileValue,
} from "@/types/clientProfile";
import clientProfileMapping from "@/constant/clientProfileMapping.json";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Activity,
  Heart,
  Apple,
  Coffee,
  Target,
  FileText,
  Clock,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Build a dynamic zod schema based on the mapping
const buildFormSchema = () => {
  const schemaObj: Record<string, any> = {};

  // Go through each category in the mapping
  Object.entries(clientProfileMapping).forEach(([categoryKey, category]) => {
    if (category.fields) {
      // Go through each field in the category
      Object.entries(category.fields).forEach(([fieldKey, fieldInfo]) => {
        // Skip display fields and other special fields
        if (fieldKey.endsWith("_display")) return;

        // Create appropriate validation based on field type
        switch (fieldInfo.type) {
          case "number":
            schemaObj[fieldKey] = z
              .number()
              .optional()
              .nullable()
              .transform((val) => (val === null ? undefined : val));
            break;
          case "string":
            schemaObj[fieldKey] = z
              .string()
              .optional()
              .nullable()
              .transform((val) => (val === null ? undefined : val));
            break;
          case "array":
            schemaObj[fieldKey] = z
              .array(z.string())
              .default([])
              .nullable()
              .transform((val) => (val === null ? [] : val));
            break;
          default:
            schemaObj[fieldKey] = z
              .any()
              .optional()
              .nullable()
              .transform((val) => (val === null ? undefined : val));
        }
      });
    }
  });

  // Add some specific validations with better error messages
  if (schemaObj.age) {
    schemaObj.age = z
      .number({
        required_error: "Age is required",
        invalid_type_error: "Please enter a valid age",
      })
      .min(12, "Age must be at least 12")
      .max(120, "Age must be at most 120")
      .optional()
      .nullable()
      .transform((val) => (val === null ? undefined : val));
  }

  if (schemaObj.height) {
    schemaObj.height = z
      .number({
        required_error: "Height is required",
        invalid_type_error: "Please enter a valid height",
      })
      .min(50, "Height must be at least 50 cm")
      .max(300, "Height must be at most 300 cm")
      .optional()
      .nullable()
      .transform((val) => (val === null ? undefined : val));
  }

  if (schemaObj.current_weight) {
    schemaObj.current_weight = z
      .number({
        required_error: "Current weight is required",
        invalid_type_error: "Please enter a valid weight",
      })
      .min(20, "Weight must be at least 20 kg")
      .max(300, "Weight must be at most 300 kg")
      .optional()
      .nullable()
      .transform((val) => (val === null ? undefined : val));
  }

  if (schemaObj.target_weight) {
    schemaObj.target_weight = z
      .number({
        required_error: "Target weight is required",
        invalid_type_error: "Please enter a valid weight",
      })
      .min(20, "Weight must be at least 20 kg")
      .max(300, "Weight must be at most 300 kg")
      .optional()
      .nullable()
      .transform((val) => (val === null ? undefined : val));
  }

  return z.object(schemaObj);
};

const formSchema = buildFormSchema();

export type ClientProfileFormValues = z.infer<typeof formSchema>;

interface ClientProfileFormProps {
  initialValues?: Partial<ClientProfile>;
  onSubmit: (data: CreateClientProfileRequest) => void;
  isSubmitting: boolean;
  userId?: number;
}

// Helper to get icons for categories
const CategoryIcons: Record<string, React.ReactNode> = {
  basic_information: <User size={20} />,
  region: <MapPin size={20} />,
  activity: <Activity size={20} />,
  health: <Heart size={20} />,
  diet: <Apple size={20} />,
  allergies: <Heart size={20} className="text-red-500" />,
  goals: <Target size={20} />,
  recovery_needs: <Activity size={20} className="text-blue-500" />,
  meal_preferences: <Coffee size={20} className="text-green-500" />,
  plan: <FileText size={20} />,
  meal_timing: <Clock size={20} />,
};

const ClientProfileForm: React.FC<ClientProfileFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
  userId,
}) => {
  const { toast } = useToast();

  // Helper function to extract values from categorized profile
  const getValue = <T extends any>(fieldName: string): T | undefined => {
    if (!initialValues) return undefined;

    if (initialValues.categories) {
      // New categorized structure
      return getProfileValue<T>(initialValues as ClientProfile, fieldName);
    } else {
      // Old flat structure - for backward compatibility
      return (initialValues as any)[fieldName] as T;
    }
  };

  // Get all available fields from the mapping
  const getAllFormFields = () => {
    const fields: string[] = [];
    Object.values(clientProfileMapping).forEach((category) => {
      if (category.fields) {
        Object.keys(category.fields).forEach((fieldKey) => {
          if (!fieldKey.endsWith("_display")) {
            fields.push(fieldKey);
          }
        });
      }
    });
    return fields;
  };

  // Get options for a specific field from mapping
  const getOptionsForField = (
    fieldName: string
  ): { value: string; label: string }[] | null => {
    for (const categoryKey in clientProfileMapping) {
      const category = clientProfileMapping[categoryKey];
      if (category.fields && category.fields[fieldName]) {
        const field = category.fields[fieldName];
        if (field.options) {
          return field.options.map((option) => ({
            value: option,
            label: option
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
          }));
        }
      }
    }
    return null;
  };

  // Find which category a field belongs to
  const getCategoryForField = (fieldName: string): string | null => {
    for (const categoryKey in clientProfileMapping) {
      const category = clientProfileMapping[categoryKey];
      if (category.fields && category.fields[fieldName]) {
        return categoryKey;
      }
    }
    return null;
  };

  // Format field name for display
  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Prepare default values for the form
  const prepareDefaultValues = () => {
    const defaultValues: Record<string, any> = {};

    getAllFormFields().forEach((field) => {
      let value = getValue(field);

      // Handle special cases for number fields
      if (
        field === "height" ||
        field === "current_weight" ||
        field === "target_weight"
      ) {
        if (typeof value === "string") {
          value = parseFloat(value);
        }
      }

      defaultValues[field] =
        value !== undefined
          ? value
          : field === "plan_type"
          ? "complete"
          : Array.isArray(
              clientProfileMapping[getCategoryForField(field) || ""]?.fields?.[
                field
              ]?.options
            )
          ? []
          : null;
    });

    return defaultValues;
  };

  // Initialize form with values from either flat or categorized structure
  const form = useForm<ClientProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: prepareDefaultValues(),
  });

  const handleSubmit = (data: ClientProfileFormValues) => {
    try {
      onSubmit(data as CreateClientProfileRequest);
    } catch (error) {
      toast({
        title: "Error Submitting Form",
        description: "Please check all required fields are filled correctly.",
        variant: "destructive",
      });
    }
  };

  const handleFormError = (errors: any) => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.entries(errors)[0];
      const fieldName = firstError[0];
      const errorMessage = firstError[1].message as string;

      toast({
        title: `Error in ${formatFieldName(fieldName)}`,
        description: errorMessage || "Please check this field",
        variant: "destructive",
      });
    }
  };

  // Group fields by category
  const getFieldsByCategory = () => {
    const categories: Record<string, string[]> = {};

    Object.entries(clientProfileMapping).forEach(([categoryKey, category]) => {
      if (category.fields) {
        categories[categoryKey] = Object.keys(category.fields).filter(
          (fieldKey) => !fieldKey.endsWith("_display")
        );
      }
    });

    return categories;
  };

  // Render a field based on its type
  const renderField = (fieldName: string) => {
    // Find the field definition in the mapping
    let fieldType = "string";
    let fieldOptions = null;

    const categoryKey = getCategoryForField(fieldName);
    if (categoryKey && clientProfileMapping[categoryKey]?.fields?.[fieldName]) {
      fieldType = clientProfileMapping[categoryKey].fields[fieldName].type;
      fieldOptions =
        clientProfileMapping[categoryKey].fields[fieldName].options;
    }

    switch (fieldType) {
      case "string":
        // Dropdown field if options are available
        if (fieldOptions && Array.isArray(fieldOptions)) {
          return (
            <FormField
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{formatFieldName(fieldName)}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value?.toString() || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Select ${formatFieldName(fieldName)}`}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fieldOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {formatFieldName(option)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        }

        // Text field
        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formatFieldName(fieldName)}</FormLabel>
                <FormControl>
                  {fieldName.includes("details") ? (
                    <Textarea
                      placeholder={`Enter ${formatFieldName(fieldName)}`}
                      {...field}
                      value={field.value || ""}
                    />
                  ) : (
                    <Input
                      placeholder={`Enter ${formatFieldName(fieldName)}`}
                      {...field}
                      value={field.value || ""}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "number":
        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{formatFieldName(fieldName)}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={`Enter ${formatFieldName(fieldName)}`}
                    step={fieldName.includes("weight") ? "0.1" : "1"}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseFloat(value) : null);
                    }}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "array":
        // Checkbox group
        return (
          <FormField
            control={form.control}
            name={fieldName}
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>{formatFieldName(fieldName)}</FormLabel>
                  <FormDescription>Select all that apply</FormDescription>
                </div>

                {fieldOptions && fieldOptions.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {fieldOptions.map((option) => (
                      <FormField
                        key={option}
                        control={form.control}
                        name={fieldName}
                        render={({ field: checkboxField }) => {
                          return (
                            <FormItem
                              key={option}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={checkboxField.value?.includes(
                                    option
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? checkboxField.onChange([
                                          ...(checkboxField.value || []),
                                          option,
                                        ])
                                      : checkboxField.onChange(
                                          checkboxField.value?.filter(
                                            (value) => value !== option
                                          ) || []
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {formatFieldName(option)}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <FormDescription>No options available</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  const fieldsByCategory = getFieldsByCategory();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, handleFormError)}
        className="space-y-6"
      >
        {/* Render fields grouped by category */}
        {Object.entries(fieldsByCategory).map(([categoryKey, fields]) => (
          <motion.div
            key={categoryKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-primary-100">
                <CardTitle className="flex items-center text-xl font-semibold">
                  {CategoryIcons[categoryKey] || <FileText size={20} />}
                  <span className="ml-2">
                    {clientProfileMapping[categoryKey]?.name ||
                      formatFieldName(categoryKey)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fields.map((fieldName) => (
                    <div key={fieldName}>{renderField(fieldName)}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex justify-end"
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting
              ? "Saving..."
              : initialValues
              ? "Update Profile"
              : "Create Profile"}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
};

export default ClientProfileForm;
