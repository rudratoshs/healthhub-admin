
import React from "react";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import AuthLayout from "@/components/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { LoginRequest } from "@/types/auth";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const LoginIllustration = () => (
  <div className="p-8 text-white">
    <div className="mx-auto max-w-md">
      <img 
        src="/illustrations/healthy-food.svg" 
        alt="Healthy Food Illustration" 
        className="mx-auto mb-8 w-64 animate-scale-in opacity-90"
      />
      <h2 className="mb-4 text-2xl font-bold">Transform Your Diet Planning Experience</h2>
      <p className="mb-6 text-white/80">
        Log in to access your personalized dashboard and start creating amazing meal plans for your clients.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-accent"></span>
          <span>Personalized Meal Plans</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-accent"></span>
          <span>Nutrition Analytics</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-accent"></span>
          <span>Client Progress Tracking</span>
        </div>
      </div>
    </div>
  </div>
);

const Login: React.FC = () => {
  const { login } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Explicitly cast the values to LoginRequest to ensure all required fields are present
    const loginData: LoginRequest = {
      email: values.email,
      password: values.password,
    };
    
    await login(loginData);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      illustration={<LoginIllustration />}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
