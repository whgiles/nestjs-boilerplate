import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';

export class Init1700000000001 implements MigrationInterface {
  public async up(qr: QueryRunner): Promise<void> {
    const sql = readFileSync(join(__dirname, '../init.sql'), 'utf8');
    await qr.query(sql);
  }
  public async down(qr: QueryRunner): Promise<void> {
    await qr.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`); // simple reset; adjust if you want granular drops
  }
}
