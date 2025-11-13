import 'dotenv/config';
import { join } from 'path';
import { rawConfigGetter } from 'src/config/database.config';
import { DataSource } from 'typeorm';

const migrationsGlob = join(__dirname, 'db/migrations/*{.ts,.js}');

export default new DataSource({
  ...rawConfigGetter(),
  migrations: [migrationsGlob],
});
