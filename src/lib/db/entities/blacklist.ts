import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export default class BlackList {
    @PrimaryColumn()
    id: number;

    @Column()
    user_id: string;

    @Column()
    check_id: string;

    @Column()
    level: string;

    @Column()
    reason: string;

    @Column()
    content: string;

    @Column({ type: "timestamp" })
    start_date: Date;

    @Column({ type: "timestamp" })
    end_date: Date;

    @Column()
    create_by: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    creation_date: Date;

    @Column()
    last_update_by: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
    last_update_date: Date;

    @Column()
    image: string;
}