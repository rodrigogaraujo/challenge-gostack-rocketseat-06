import {
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
    Entity,
} from "typeorm";

@Entity("categories")
class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Category;
