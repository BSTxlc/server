import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'checklist' })
export default class CheckList {
    @PrimaryGeneratedColumn()
    check_id: number;

    @Column()
    user_id: number;

    @Column({ type: 'tinyint', default: 0 })
    check_flag: boolean;

    @Column()
    level: number;

    @Column({ length: 255 })
    reason: string;

    @Column('text', { nullable: true })
    content: string;

    @Column({ length: 255, nullable: true })
    img: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    start_time: Date;

    @Column()
    end_time: Date;

    @Column({ nullable: true })
    expire_date: Date;

    @Column({ length: 100, nullable: true })
    create_by: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    creation_date: Date;

    @Column({ length: 100, nullable: true })
    last_update_by: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    last_update_date: Date;
}