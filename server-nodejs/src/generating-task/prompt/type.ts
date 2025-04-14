import { GeneratingTaskInputPromptType } from '../generating-task.entity';

export interface TextPromptPart {
  type: GeneratingTaskInputPromptType.Text;
  text: string;
}

export interface ImagePromptPart {
  type: GeneratingTaskInputPromptType.Image;
  src: string;
}

export type PromptPart = TextPromptPart | ImagePromptPart;
