import { MODEL_PROVIDER_ICON, MODEL_NAME_ICON } from './const';
import { PresetModelIcon } from '@/components/model-info/type';

export function getModelProviderIcon(
  providerName: string,
): [string, PresetModelIcon['icon']] | undefined {
  for (const [name, preset] of Object.entries(MODEL_PROVIDER_ICON)) {
    if (preset.regex.test(providerName)) {
      return [name, preset.icon];
    }
  }
}

export function getModelNameIcon(
  modelName: string,
): PresetModelIcon['icon'] | undefined {
  for (const preset of Object.values(MODEL_NAME_ICON)) {
    if (preset.regex.test(modelName)) {
      return preset.icon;
    }
  }
}
