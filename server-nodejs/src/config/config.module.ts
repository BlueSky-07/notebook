import { ConfigModule } from '@nestjs/config';
import getConfiguration from './config.util';

export const configModule = ConfigModule.forRoot({
  load: [getConfiguration],
});
