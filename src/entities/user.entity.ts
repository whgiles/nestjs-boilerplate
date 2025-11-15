import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column({ length: 50, unique: true })
  @ApiProperty()
  username: string;

  @Column({ length: 100 })
  @Exclude()
  password: string;

  @Column({ length: 100, unique: true })
  @ApiProperty()
  email: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: string;

  @DeleteDateColumn()
  @ApiProperty()
  deletedAt: string;
}
