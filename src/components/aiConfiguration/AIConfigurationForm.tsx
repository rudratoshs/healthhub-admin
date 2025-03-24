
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  CreateAIConfigurationRequest, 
  UpdateAIConfigurationRequest, 
  AIConfiguration 
} from "@/types/aiConfiguration";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  provider: z.enum(["openai", "anthropic", "google", "cohere", "other"]),
  model: z.string().min(1, "Model name is required"),
  api_key: z.string().min(1, "API key is required"),
  settings: z.object({
    temperature: z.number().min(0).max(1).optional(),
    max_tokens: z.number().min(1).max(32000).optional(),
    top_p: z.number().min(0).max(1).optional(),
    frequency_penalty: z.number().min(-2).max(2).optional(),
    presence_penalty: z.number().min(-2).max(2).optional(),
  }),
  is_default: z.boolean().default(false),
  status: z.enum(["active", "inactive"]).default("active"),
});

interface AIConfigurationFormProps {
  gymId: number;
  initialData?: AIConfiguration;
  onSubmit: (data: CreateAIConfigurationRequest | UpdateAIConfigurationRequest) => void;
  isSubmitting: boolean;
}

const providerModels = {
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
  anthropic: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
  google: ["gemini-pro", "gemini-ultra"],
  cohere: ["command", "command-light", "command-nightly", "command-light-nightly"],
  other: ["custom-model"],
};

const AIConfigurationForm: React.FC<AIConfigurationFormProps> = ({ 
  gymId, 
  initialData, 
  onSubmit, 
  isSubmitting 
}) => {
  const isEditing = !!initialData;
  
  // Set default form values
  const defaultValues = {
    name: initialData?.name || "",
    provider: initialData?.provider || "openai",
    model: initialData?.model || "",
    api_key: "", // Don't prefill the API key for security
    settings: {
      temperature: initialData?.settings?.temperature ?? 0.7,
      max_tokens: initialData?.settings?.max_tokens ?? 4000,
      top_p: initialData?.settings?.top_p ?? 1.0,
      frequency_penalty: initialData?.settings?.frequency_penalty ?? 0,
      presence_penalty: initialData?.settings?.presence_penalty ?? 0,
    },
    is_default: initialData?.is_default ?? false,
    status: initialData?.status || "active",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const watchProvider = form.watch("provider");
  const [currentModels, setCurrentModels] = React.useState<string[]>(
    providerModels[watchProvider as keyof typeof providerModels] || []
  );

  React.useEffect(() => {
    const newModels = providerModels[watchProvider as keyof typeof providerModels] || [];
    setCurrentModels(newModels);
    
    // Reset model if current one is not in the new list
    const currentModel = form.getValues("model");
    if (!newModels.includes(currentModel) && newModels.length > 0) {
      form.setValue("model", newModels[0]);
    }
  }, [watchProvider, form]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Configuration Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., OpenAI Production" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Provider</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="anthropic">Anthropic</SelectItem>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="cohere">Cohere</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currentModels.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                      {watchProvider === "other" && (
                        <SelectItem value="custom">Custom Model</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {watchProvider === "other" && field.value === "custom" && (
                    <Input
                      className="mt-2"
                      placeholder="Enter custom model name"
                      onChange={(e) => form.setValue("model", e.target.value)}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="api_key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={isEditing ? "Leave blank to keep current key" : "Enter API key"}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {isEditing ? "Leave blank to keep the current API key." : "This will be stored securely."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Card>
            <CardContent className="pt-6 space-y-6">
              <h3 className="text-lg font-medium">Model Settings</h3>
              
              <FormField
                control={form.control}
                name="settings.temperature"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Temperature</FormLabel>
                      <span className="text-sm text-muted-foreground">
                        {field.value}
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={[field.value ?? 0.7]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Controls randomness: Lower values are more deterministic, higher values more creative.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="settings.max_tokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Tokens</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={32000}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1000)}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum length of the generated response.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="settings.top_p"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Top P</FormLabel>
                      <span className="text-sm text-muted-foreground">
                        {field.value}
                      </span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={[field.value ?? 1.0]}
                        onValueChange={(values) => field.onChange(values[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Controls diversity via nucleus sampling.
                    </FormDescription>
                  </FormItem>
                )}
              />

              <div className="flex justify-between gap-4">
                <FormField
                  control={form.control}
                  name="is_default"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                      <div className="space-y-0.5">
                        <FormLabel>Default Configuration</FormLabel>
                        <FormDescription>
                          Use this as the default AI configuration.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm w-full">
                      <div className="space-y-0.5">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Enable or disable this configuration.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === "active"}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "active" : "inactive")
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Update Configuration" : "Create Configuration"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AIConfigurationForm;
