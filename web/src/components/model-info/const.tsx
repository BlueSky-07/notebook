import {
  AlibabaCloud,
  ChatGLM,
  DeepSeek,
  Doubao,
  Gemini,
  Gemma,
  Google,
  Grok,
  Hunyuan,
  OpenAI,
  OpenRouter,
  Qwen,
  TencentCloud,
  Volcengine,
  XAI,
  Zhipu,
} from '@lobehub/icons';
import { PresetModelIcon } from './type';
import { ReactNode } from 'react';
import {
  IconImage,
  IconItalic,
  IconPalette,
  IconBulb,
} from '@arco-design/web-react/icon';

export const MODEL_PROVIDER_ICON: Record<string, PresetModelIcon> = {
  AlibabaCloud: {
    regex: /alibaba|aliyun|ali/i,
    icon: AlibabaCloud.Color,
  },
  DeepSeek: {
    regex: /deepseek/i,
    icon: DeepSeek.Color,
  },
  Google: {
    regex: /google/i,
    icon: Google.Color,
  },
  OpenAI: {
    regex: /openai/i,
    icon: OpenAI,
  },
  OpenRouter: {
    regex: /openrouter/i,
    icon: OpenRouter,
  },
  TencentCloud: {
    regex: /tencent|tencentcloud|tc/i,
    icon: TencentCloud.Color,
  },
  Volcengine: {
    regex: /volcengine|volc/i,
    icon: Volcengine.Color,
  },
  XAI: {
    regex: /xai/i,
    icon: XAI,
  },
  Zhipu: {
    regex: /zhipu/i,
    icon: Zhipu.Color,
  },
};

export const MODEL_NAME_ICON: Record<string, PresetModelIcon> = {
  ChatGLM: {
    regex: /chatglm|glm/i,
    icon: ChatGLM.Color,
  },
  DeepSeek: {
    regex: /deepseek/i,
    icon: DeepSeek.Color,
  },
  Doubao: {
    regex: /doubao/i,
    icon: Doubao.Color,
  },
  Gemini: {
    regex: /gemini/i,
    icon: Gemini.Color,
  },
  Gemma: {
    regex: /gemma/i,
    icon: Gemma.Color,
  },
  Grok: {
    regex: /grok/i,
    icon: Grok,
  },
  Hunyuan: {
    regex: /hunyuan/i,
    icon: Hunyuan.Color,
  },
  ChatGPT: {
    regex: /chatgpt|gpt|openai/i,
    icon: OpenAI,
  },
  Qwen: {
    regex: /qwen|qwq/i,
    icon: Qwen.Color,
  },
};

export const MODEL_FEATURES: Record<
  string,
  {
    label: string;
    icon: ReactNode;
  }
> = {
  'text-generation': {
    label: 'Text Generation',
    icon: <IconItalic />,
  },
  reasoning: {
    label: 'Reasoning',
    icon: <IconBulb />,
  },
  vision: {
    label: 'Vision',
    icon: <IconImage />,
  },
  'image-generation': {
    label: 'Image Generation',
    icon: <IconPalette />,
  },
};
