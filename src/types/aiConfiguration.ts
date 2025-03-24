
export interface AIConfiguration {
  id: number;
  gym_id: number;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'cohere' | 'other';
  model: string;
  api_key?: string; // Not returned in API responses for security
  settings: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    [key: string]: any;
  };
  is_default: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface CreateAIConfigurationRequest {
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'cohere' | 'other';
  model: string;
  api_key: string;
  settings: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    [key: string]: any;
  };
  is_default: boolean;
  status: 'active' | 'inactive';
}

export interface UpdateAIConfigurationRequest {
  name?: string;
  provider?: 'openai' | 'anthropic' | 'google' | 'cohere' | 'other';
  model?: string;
  api_key?: string;
  settings?: {
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    [key: string]: any;
  };
  is_default?: boolean;
  status?: 'active' | 'inactive';
}

export interface TestAIConfigurationRequest {
  prompt: string;
}

export interface TestAIConfigurationResponse {
  result: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  metadata?: any;
}
