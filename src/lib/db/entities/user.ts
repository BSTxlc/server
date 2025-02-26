import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class User
{
  @PrimaryColumn()
  id: number;

  @Column()
  openid: string;

  @Column()
  avatar: string;

  @Column()
  nickname: string;

  @Column()
  role: string;// 权限
}