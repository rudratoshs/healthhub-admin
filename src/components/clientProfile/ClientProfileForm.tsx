
import React, { useState, useEffect } from "react";
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

  const activityOptions = [
    { value: "sedentary", label: clientProfileMapping.sedentary },
    { value: "light_active", label: clientProfileMapping.light_active },
    { value: "mod_active", label: clientProfileMapping.mod_active },
    { value: "very_active", label: clientProfileMapping.very_active },
    { value: "extreme_active", label: clientProfileMapping.extreme_active },
  ];

  const dietTypeOptions = [
    { value: "omnivore", label: clientProfileMapping.omnivore },
    { value: "vegetarian", label: clientProfileMapping.vegetarian },
    { value: "eggetarian", label: clientProfileMapping.eggetarian },
    { value: "vegan", label: clientProfileMapping.vegan },
    { value: "pescatarian", label: clientProfileMapping.pescatarian },
    { value: "keto", label: clientProfileMapping.keto },
    { value: "mediterranean", label: clientProfileMapping.mediterranean },
    { value: "fodmap", label: clientProfileMapping.fodmap },
    { value: "other_diet", label: clientProfileMapping.other_diet },
  ];

  const healthConditionOptions = [
    { value: "diabetes", label: clientProfileMapping.diabetes },
    { value: "hypertension", label: clientProfileMapping.hypertension },
    { value: "heart", label: clientProfileMapping.heart },
    { value: "kidney", label: clientProfileMapping.kidney },
    { value: "liver", label: clientProfileMapping.liver },
    { value: "digestive", label: clientProfileMapping.digestive },
    { value: "thyroid", label: clientProfileMapping.thyroid },
    { value: "none_health", label: clientProfileMapping.none_health },
  ];

  const allergyOptions = [
    { value: "dairy", label: clientProfileMapping.dairy },
    { value: "gluten", label: clientProfileMapping.gluten },
    { value: "nuts", label: clientProfileMapping.nuts },
    { value: "seafood", label: clientProfileMapping.seafood },
    { value: "eggs", label: clientProfileMapping.eggs },
    { value: "soy", label: clientProfileMapping.soy },
    { value: "tree_nuts", label: clientProfileMapping.tree_nuts },
    { value: "peanuts", label: clientProfileMapping.peanuts },
    { value: "corn", label: clientProfileMapping.corn },
    { value: "fruits", label: clientProfileMapping.fruits },
    { value: "none_allergy", label: clientProfileMapping.none_allergy },
  ];

  const recoveryNeedsOptions = [
    { value: "weight_loss", label: clientProfileMapping.weight_loss_need },
    { value: "muscle_gain", label: clientProfileMapping.muscle_gain_need },
    { value: "energy", label: clientProfileMapping.energy_improvement },
    { value: "blood_sugar", label: clientProfileMapping.blood_sugar },
    { value: "cholesterol", label: clientProfileMapping.cholesterol },
    { value: "inflammation", label: clientProfileMapping.inflammation },
    { value: "immune_support", label: clientProfileMapping.immune_support },
    { value: "sleep_improvement", label: clientProfileMapping.sleep_improvement },
    { value: "none_specifically", label: clientProfileMapping.none_specifically },
  ];

  const primaryGoalOptions = [
    { value: "weight_loss", label: clientProfileMapping.weight_loss },
    { value: "muscle_gain", label: clientProfileMapping.muscle_gain },
    { value: "maintain", label: clientProfileMapping.maintain },
    { value: "energy", label: clientProfileMapping.energy },
    { value: "health", label: clientProfileMapping.health },
    { value: "digestion", label: clientProfileMapping.digestion },
    { value: "overall_health", label: clientProfileMapping.overall_health },
    { value: "recovery", label: clientProfileMapping.recovery },
    { value: "athletic", label: clientProfileMapping.athletic },
  ];

  const planTypeOptions = [
    { value: "complete", label: clientProfileMapping.complete_plan },
    { value: "basic", label: clientProfileMapping.basic_plan },
    { value: "focus", label: clientProfileMapping.focus_plan },
  ];

  const mealPreferencesOptions = [
    { value: "high_protein", label: clientProfileMapping.high_protein },
    { value: "low_carb", label: clientProfileMapping.low_carb },
    { value: "low_fat", label: clientProfileMapping.low_fat },
    { value: "gluten_free", label: clientProfileMapping.gluten_free },
    { value: "dairy_free", label: clientProfileMapping.dairy_free },
    { value: "sugar_free", label: clientProfileMapping.sugar_free },
    { value: "low_sodium", label: clientProfileMapping.low_sodium },
    { value: "whole_foods", label: clientProfileMapping.whole_foods },
    { value: "plant_based", label: clientProfileMapping.plant_based },
    { value: "balanced_macros", label: clientProfileMapping.balanced_macros },
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
                <FormLabel>{clientProfileMapping.age_prompt}</FormLabel>
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
                <FormLabel>{clientProfileMapping.gender_prompt}</FormLabel>
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
                    <SelectItem value="male">{clientProfileMapping.male}</SelectItem>
                    <SelectItem value="female">{clientProfileMapping.female}</SelectItem>
                    <SelectItem value="other">{clientProfileMapping.other}</SelectItem>
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
                <FormLabel>{clientProfileMapping.height_prompt}</FormLabel>
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
                <FormLabel>{clientProfileMapping.weight_prompt}</FormLabel>
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
                <FormLabel>{clientProfileMapping.target_weight_prompt}</FormLabel>
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
                <FormLabel>{clientProfileMapping.country_prompt}</FormLabel>
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
                <FormLabel>{clientProfileMapping.state_prompt}</FormLabel>
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
                <FormLabel>{clientProfileMapping.city_prompt}</FormLabel>
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
                <FormLabel>{clientProfileMapping.activity_prompt}</FormLabel>
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
                <FormLabel>{clientProfileMapping.diet_prompt}</FormLabel>
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
                <FormLabel>{clientProfileMapping.goal_prompt}</FormLabel>
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
                <FormLabel>{clientProfileMapping.plan_prompt}</FormLabel>
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
          <div className="text-lg font-medium">{clientProfileMapping.health_header}</div>
          <FormField
            control={form.control}
            name="health_conditions"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>{clientProfileMapping.health_prompt}</FormLabel>
                  <FormDescription>{clientProfileMapping.health_body}</FormDescription>
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
          <div className="text-lg font-medium">{clientProfileMapping.allergies_header}</div>
          <FormField
            control={form.control}
            name="allergies"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>{clientProfileMapping.allergies_prompt}</FormLabel>
                  <FormDescription>{clientProfileMapping.allergies_body}</FormDescription>
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
          <div className="text-lg font-medium">{clientProfileMapping.recovery_needs_header}</div>
          <FormField
            control={form.control}
            name="recovery_needs"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>{clientProfileMapping.recovery_needs_prompt}</FormLabel>
                  <FormDescription>{clientProfileMapping.recovery_needs_body}</FormDescription>
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
          <div className="text-lg font-medium">{clientProfileMapping.meal_preferences_header}</div>
          <FormField
            control={form.control}
            name="meal_preferences"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel>{clientProfileMapping.meal_preferences_prompt}</FormLabel>
                  <FormDescription>{clientProfileMapping.meal_preferences_body}</FormDescription>
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
