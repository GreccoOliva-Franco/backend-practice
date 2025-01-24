import * as path from 'path';
import { ConfigModuleOptions } from '@nestjs/config';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: path.resolve(__dirname, '../../../.env'),
};
