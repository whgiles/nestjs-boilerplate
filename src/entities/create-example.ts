import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Example extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  example: string;
}
