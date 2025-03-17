
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ClientProfile, CreateClientProfileRequest } from "@/types/clientProfile";
import clientProfileMapping from "@/constant/clientProfileMapping.json";

// Schema for form validation
const formSchema = z.object({
  age: z.number().min(12).max(120).optional(),
  gender: z.string().optional(),
  height: z.number().min(50).max(300).optional(),
  current_weight: z.number().min(20).max(300).optional(),
  target_weight: z.number().min(20).max(300).optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  activity_level: z.string().optional(),
  diet_type: z.string().optional(),
  health_conditions: z.array(z.string()).default([]),
  health_details: z.string().optional().nullable(),
  allergies: z.array(z.string()).default([]),
  recovery_needs: z.array(z.string()).default([]),
  primary_goal: z.string().optional(),
  plan_type: z.string().optional(),
  meal_preferences: z.array(z.string()).default([]),
});

export type ClientProfileFormValues = z.infer<typeof formSchema>;

interface ClientProfileFormProps {
  initialValues?: Partial<ClientProfile>;
  onSubmit: (data: CreateClientProfileRequest) => void;
  isSubmitting: boolean;
  userId?: number;
}

const ClientProfileForm: React.FC<ClientProfileFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting,
  userId,
}) => {
  const form = useForm<ClientProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: initialValues?.age || undefined,
      gender: initialValues?.gender || undefined,
      height: initialValues?.height ? parseFloat(initialValues.height) : undefined,
      current_weight: initialValues?.current_weight ? parseFloat(initialValues.current_weight) : undefined,
      target_weight: initialValues?.target_weight ? parseFloat(initialValues.target_weight) : undefined,
      country: initialValues?.country || undefined,
      state: initialValues?.state || undefined,
      city: initialValues?.city || undefined,
      activity_level: initialValues?.activity_level || undefined,
      diet_type: initialValues?.diet_type || undefined,
      health_conditions: initialValues?.health_conditions || [],
      health_details: initialValues?.health_details || undefined,
      allergies: initialValues?.allergies || [],
      recovery_needs: initialValues?.recovery_needs || [],
      primary_goal: initialValues?.primary_goal || undefined,
      plan_type: initialValues?.plan_type || "complete",
      meal_preferences: initialValues?.meal_preferences || [],
    },
  });

  const handleSubmit = (data: ClientProfileFormValues) => {
    onSubmit(data as CreateClientProfileRequest);
  };

  // Map activity level options from the mapping
  const activityOptions = [
    { value: "sedentary", label: clientProfileMapping.activity?.sedentary || "Sedentary" },
    { value: "light_active", label: clientProfileMapping.activity?.light_active || "Lightly active" },
    { value: "mod_active", label: clientProfileMapping.activity?.mod_active || "Moderately active" },
    { value: "very_active", label: clientProfileMapping.activity?.very_active || "Very active" },
    { value: "extreme_active", label: clientProfileMapping.activity?.extreme_active || "Extremely active" },
  ];

  // Map diet type options from the mapping
  const dietTypeOptions = [
    { value: "omnivore", label: clientProfileMapping.diet?.omnivore || "Omnivore" },
    { value: "vegetarian", label: clientProfileMapping.diet?.vegetarian || "Vegetarian" },
    { value: "eggetarian", label: clientProfileMapping.diet?.eggetarian || "Vegetarian + eggs" },
    { value: "vegan", label: clientProfileMapping.diet?.vegan || "Vegan" },
    { value: "pescatarian", label: clientProfileMapping.diet?.pescatarian || "Pescatarian" },
    { value: "keto", label: clientProfileMapping.diet?.keto || "Keto" },
    { value: "mediterranean", label: clientProfileMapping.diet?.mediterranean || "Mediterranean" },
    { value: "fodmap", label: clientProfileMapping.diet?.fodmap || "FODMAP" },
    { value: "other_diet", label: clientProfileMapping.diet?.other_diet || "Other" },
  ];

  // Map health condition options from the mapping
  const healthConditionOptions = [
    { value: "diabetes", label: clientProfileMapping.health?.diabetes || "Diabetes" },
    { value: "hypertension", label: clientProfileMapping.health?.hypertension || "Hypertension" },
    { value: "heart", label: clientProfileMapping.health?.heart || "Heart disease" },
    { value: "kidney", label: clientProfileMapping.health?.kidney || "Kidney issues" },
    { value: "liver", label: clientProfileMapping.health?.liver || "Liver problems" },
    { value: "digestive", label: clientProfileMapping.health?.digestive || "Digestive disorders" },
    { value: "thyroid", label: clientProfileMapping.health?.thyroid || "Thyroid issues" },
    { value: "none_health", label: clientProfileMapping.health?.none_health || "None of these" },
  ];

  // Map allergy options from the mapping
  const allergyOptions = [
    { value: "dairy", label: clientProfileMapping.allergies?.dairy || "Dairy" },
    { value: "gluten", label: clientProfileMapping.allergies?.gluten || "Gluten" },
    { value: "nuts", label: clientProfileMapping.allergies?.nuts || "Nuts" },
    { value: "seafood", label: clientProfileMapping.allergies?.seafood || "Seafood" },
    { value: "eggs", label: clientProfileMapping.allergies?.eggs || "Eggs" },
    { value: "soy", label: clientProfileMapping.allergies?.soy || "Soy" },
    { value: "tree_nuts", label: clientProfileMapping.allergies?.tree_nuts || "Tree nuts" },
    { value: "peanuts", label: clientProfileMapping.allergies?.peanuts || "Peanuts" },
    { value: "corn", label: clientProfileMapping.allergies?.corn || "Corn" },
    { value: "fruits", label: clientProfileMapping.allergies?.fruits || "Fruits" },
    { value: "none_allergy", label: clientProfileMapping.allergies?.none_allergy || "None" },
  ];

  // Map recovery needs options from the mapping
  const recoveryNeedsOptions = [
    { value: "weight_loss", label: clientProfileMapping.recovery_needs?.weight_loss_need || "Weight loss" },
    { value: "muscle_gain", label: clientProfileMapping.recovery_needs?.muscle_gain_need || "Muscle gain" },
    { value: "energy", label: clientProfileMapping.recovery_needs?.energy_improvement || "Energy improvement" },
    { value: "blood_sugar", label: clientProfileMapping.recovery_needs?.blood_sugar || "Blood sugar management" },
    { value: "cholesterol", label: clientProfileMapping.recovery_needs?.cholesterol || "Cholesterol management" },
    { value: "inflammation", label: clientProfileMapping.recovery_needs?.inflammation || "Inflammation reduction" },
    { value: "immune_support", label: clientProfileMapping.recovery_needs?.immune_support || "Immune support" },
    { value: "sleep_improvement", label: clientProfileMapping.recovery_needs?.sleep_improvement || "Sleep improvement" },
    { value: "none_specifically", label: clientProfileMapping.recovery_needs?.none_specifically || "None specifically" },
  ];

  // Map primary goal options from the mapping
  const primaryGoalOptions = [
    { value: "weight_loss", label: clientProfileMapping.goals?.weight_loss || "Weight loss" },
    { value: "muscle_gain", label: clientProfileMapping.goals?.muscle_gain || "Muscle gain" },
    { value: "maintain", label: clientProfileMapping.goals?.maintain || "Maintain weight" },
    { value: "energy", label: clientProfileMapping.goals?.energy || "Better energy" },
    { value: "health", label: clientProfileMapping.goals?.health || "Improve health" },
    { value: "digestion", label: clientProfileMapping.goals?.digestion || "Improved digestion" },
    { value: "overall_health", label: clientProfileMapping.goals?.overall_health || "Improved overall health" },
    { value: "recovery", label: clientProfileMapping.goals?.recovery || "Recovery from condition" },
    { value: "athletic", label: clientProfileMapping.goals?.athletic || "Athletic performance" },
  ];

  // Map plan type options from the mapping
  const planTypeOptions = [
    { value: "complete", label: clientProfileMapping.plan?.complete_plan || "Complete Plan" },
    { value: "basic", label: clientProfileMapping.plan?.basic_plan || "Basic Plan" },
    { value: "focus", label: clientProfileMapping.plan?.focus_plan || "Food Focus" },
  ];

  // Map meal preferences options from the mapping
  const mealPreferencesOptions = [
    { value: "high_protein", label: clientProfileMapping.meal_preferences?.high_protein || "High protein" },
    { value: "low_carb", label: clientProfileMapping.meal_preferences?.low_carb || "Low carb" },
    { value: "low_fat", label: clientProfileMapping.meal_preferences?.low_fat || "Low fat" },
    { value: "gluten_free", label: clientProfileMapping.meal_preferences?.gluten_free || "Gluten-free" },
    { value: "dairy_free", label: clientProfileMapping.meal_preferences?.dairy_free || "Dairy-free" },
    { value: "sugar_free", label: clientProfileMapping.meal_preferences?.sugar_free || "Sugar-free" },
    { value: "low_sodium", label: clientProfileMapping.meal_preferences?.low_sodium || "Low sodium" },
    { value: "whole_foods", label: clientProfileMapping.meal_preferences?.whole_foods || "Whole foods focus" },
    { value: "plant_based", label: clientProfileMapping.meal_preferences?.plant_based || "Plant-based" },
    { value: "balanced_macros", label: clientProfileMapping.meal_preferences?.balanced_macros || "Balanced macros" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientProfileMapping.basic_information?.age_prompt || "Please share your age:"}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="30"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientProfileMapping.basic_information?.gender_prompt || "Please select your gender:"}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">{clientProfileMapping.basic_information?.male || "Male"}</SelectItem>
                    <SelectItem value="female">{clientProfileMapping.basic_information?.female || "Female"}</SelectItem>
                    <SelectItem value="other">{clientProfileMapping.basic_information?.other || "Other"}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientProfileMapping.basic_information?.height_prompt || "Please share your height (in cm):"}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="175"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>Height in centimeters</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientProfileMapping.basic_information?.weight_prompt || "Please share your current weight (in kg):"}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="75"
                    step="0.1"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>Weight in kilograms</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="target_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientProfileMapping.basic_information?.target_weight_prompt || "Please share your target weight (in kg):"}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="70"
                    step="0.1"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormDescription>Target weight in kilograms</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientProfileMapping.region?.country_prompt || "Which country do you live in?"}</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientProfileMapping.region?.state_prompt || "Which state or region do you live in?"}</FormLabel>
                <FormControl>
                  <Input placeholder="State/Province" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientProfileMapping.region?.city_prompt || "Which city do you live in?"}</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="activity_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientProfileMapping.activity?.activity_prompt || "Which describes your activity level?"}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {activityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="diet_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientProfileMapping.diet?.diet_prompt || "What diet do you follow?"}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dietTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primary_goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientProfileMapping.goals?.goal_prompt || "Your primary health goal?"}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary goal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {primaryGoalOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plan_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{clientProfileMapping.plan?.plan_prompt || "Choose your plan type:"}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {planTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="text-lg font-medium">{clientProfileMapping.health?.health_header || "Health Conditions"}</div>
          <FormField
            control={form.control}
            name="health_conditions"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>{clientProfileMapping.health?.health_prompt || "Any health conditions?"}</FormLabel>
                  <FormDescription>{clientProfileMapping.health?.health_body || "Select all that apply"}</FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {healthConditionOptions.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name="health_conditions"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.value])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="text-lg font-medium">{clientProfileMapping.allergies?.allergies_header || "Food Allergies"}</div>
          <FormField
            control={form.control}
            name="allergies"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>{clientProfileMapping.allergies?.allergies_prompt || "Any food allergies?"}</FormLabel>
                  <FormDescription>{clientProfileMapping.allergies?.allergies_body || "Select all that apply"}</FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allergyOptions.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name="allergies"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.value])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="text-lg font-medium">{clientProfileMapping.recovery_needs?.recovery_needs_header || "Health Goals"}</div>
          <FormField
            control={form.control}
            name="recovery_needs"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>{clientProfileMapping.recovery_needs?.recovery_needs_prompt || "Are you looking to address any specific health concerns?"}</FormLabel>
                  <FormDescription>{clientProfileMapping.recovery_needs?.recovery_needs_body || "Select all that apply to you"}</FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {recoveryNeedsOptions.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name="recovery_needs"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.value])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <div className="text-lg font-medium">{clientProfileMapping.meal_preferences?.meal_preferences_header || "Meal Preferences"}</div>
          <FormField
            control={form.control}
            name="meal_preferences"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>{clientProfileMapping.meal_preferences?.meal_preferences_prompt || "Select your meal preferences"}</FormLabel>
                  <FormDescription>{clientProfileMapping.meal_preferences?.meal_preferences_body || "Choose all that apply"}</FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mealPreferencesOptions.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name="meal_preferences"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={item.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, item.value])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {item.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
          {isSubmitting ? "Saving..." : initialValues ? "Update Profile" : "Create Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default ClientProfileForm;
