import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User
{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uid: string; // 原来的 uid 改为 openid

  @Column()
  avatar: string;

  @Column()
  nickname: string;

  @Column()
  role: string; // role 存储字符串，避免类型冲突

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  create_by: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  creation_date: Date;

  @Column()
  last_update_by: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  last_update_date: Date;

}