
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getRoles } from "@/lib/users";
import { User } from "@/types/user";

// Define props with conditional required fields for create vs edit
interface UserFormProps {
  user?: User;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, isSubmitting }) => {
  const navigate = useNavigate();
  const isEditMode = !!user;

  // Fetch roles for dropdown
  const { data: roles = [] } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles
  });

  // Define different schemas for create and edit
  const createSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    whatsapp_phone: z.string().optional(),
    status: z.enum(["active", "inactive", "pending"]),
    role: z.string().min(1, "Please select a role"),
  });
  
  const editSchema = createSchema.omit({ password: true, email: true }).extend({
    email: z.string().email("Please enter a valid email").optional(),
    password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  });

  const formSchema = isEditMode ? editSchema : createSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      phone: user?.phone || "",
      whatsapp_phone: user?.whatsapp_phone || "",
      status: user?.status || "active",
      role: user?.role || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    // Filter out empty strings for optional fields
    const data = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== "")
    );
    
    await onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {isEditMode ? "Edit User" : "Add New User"}
        </h2>
        <p className="text-muted-foreground">
          {isEditMode 
            ? "Update user information in the system" 
            : "Fill in the details to create a new user account"
          }
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="user@example.com" 
                      type="email" 
                      {...field} 
                      disabled={isEditMode}
                    />
                  </FormControl>
                  {isEditMode && (
                    <FormDescription>
                      Email cannot be changed after a user is created
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isEditMode ? "New Password" : "Password"}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={isEditMode ? "Leave blank to keep current password" : "••••••••"} 
                      type="password" 
                      {...field} 
                    />
                  </FormControl>
                  {isEditMode && (
                    <FormDescription>
                      Leave empty to keep the current password
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="whatsapp_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/users")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEditMode ? "Updating..." : "Creating...") 
                : (isEditMode ? "Update User" : "Create User")
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserForm;
