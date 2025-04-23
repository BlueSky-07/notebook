import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import { defaults } from 'lodash';

const APP_CONFIG = 'app.yaml';
const AKSK_CONFIG = 'aksk.yaml';

export default function getConfiguration() {
  const appConfig = yaml.load(
    readFileSync(path.join(__dirname, APP_CONFIG), 'utf8'),
  ) as Record<string, unknown>;
  let akskConfig: Record<string, unknown>;
  try {
    akskConfig = yaml.load(
      readFileSync(path.join(__dirname, AKSK_CONFIG), 'utf8'),
    ) as Record<string, unknown>;
  } catch (_e) {
    akskConfig = {};
  }
  return defaults({}, akskConfig, appConfig);
}
