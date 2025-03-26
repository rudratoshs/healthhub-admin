import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Gym } from "@/types/gym";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";

const gymSchema = z.object({
  name: z.string().min(1, "Gym name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export type GymFormValues = z.infer<typeof gymSchema>;

interface GymFormProps {
  defaultValues?: Partial<GymFormValues>;
  isSubmitting?: boolean;
  onSubmit: (data: GymFormValues) => void;
  submitButtonText?: string;
}

const GymForm: React.FC<GymFormProps> = ({
  defaultValues,
  isSubmitting = false,
  onSubmit,
  submitButtonText = "Submit",
}) => {
  const form = useForm<GymFormValues>({
    resolver: zodResolver(gymSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: "",
        address: "",
        phone: "",
        ...defaultValues,
      });
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gym Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter gym name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter gym address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter phone number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader size="sm" className="mr-2" />
              Processing...
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </form>
    </Form>
  );
};

export default GymForm;
