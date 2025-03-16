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
import { LockKeyhole, Mail } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const LoginIllustration = () => (
  <div className="relative p-8 text-white overflow-hidden">
    {/* Background patterns */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full -mr-32 -mt-16 blur-2xl"></div>
    <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/20 rounded-full -ml-32 -mb-16 blur-2xl"></div>
    
    <div className="relative mx-auto max-w-md">
      <img 
        src="/illustrations/healthy-food.svg" 
        alt="Healthy Food Illustration" 
        className="mx-auto mb-8 w-72 floating"
      />
      
      <h2 className="mb-4 text-3xl font-bold animate-slide-in-left">Transform Your Diet Planning</h2>
      
      <p className="mb-8 text-white/90 text-lg animate-fade-in">
        Create personalized meal plans and track client progress with our powerful platform.
      </p>
      
      <div className="flex flex-wrap justify-center gap-3">
        <div className="stagger-item flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm backdrop-blur-sm border border-white/10 shadow-lg hover:bg-white/20 transition-all duration-300">
          <span className="h-2 w-2 rounded-full bg-accent pulse"></span>
          <span>Meal Plans</span>
        </div>
        <div className="stagger-item flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm backdrop-blur-sm border border-white/10 shadow-lg hover:bg-white/20 transition-all duration-300">
          <span className="h-2 w-2 rounded-full bg-accent pulse"></span>
          <span>Nutrition Analytics</span>
        </div>
        <div className="stagger-item flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 text-sm backdrop-blur-sm border border-white/10 shadow-lg hover:bg-white/20 transition-all duration-300">
          <span className="h-2 w-2 rounded-full bg-accent pulse"></span>
          <span>Progress Tracking</span>
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
      <div className="animate-scale-in">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        placeholder="you@example.com" 
                        className="pl-10 bg-muted/50 border border-input/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300" 
                        {...field} 
                      />
                    </div>
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
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium">Password</FormLabel>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        className="pl-10 bg-muted/50 border border-input/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full gradient-btn text-white font-medium py-2.5"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </Form>
        
        <div className="mt-8 text-center">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-border flex-grow"></div>
            <span className="mx-4 text-xs text-muted-foreground">OR CONTINUE WITH</span>
            <div className="border-t border-border flex-grow"></div>
          </div>
          
          <div className="mt-4 flex gap-4 justify-center">
            <Button variant="outline" className="w-full card-hover" type="button">
              <img src="/icons/google.svg" alt="Google" className="h-5 w-5 mr-2" /> Google
            </Button>
          </div>
          
          <div className="mt-8 text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline highlight-text">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;