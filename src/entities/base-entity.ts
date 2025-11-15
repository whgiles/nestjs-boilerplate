import { CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@Entity()
export class BaseEntity {
  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  createdAt: Date;
}
