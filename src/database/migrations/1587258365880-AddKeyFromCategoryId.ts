import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export default class AddKeyFromCategoryId1587258365880
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createForeignKey(
            "transactions",
            new TableForeignKey({
                name: "categoryKey",
                columnNames: ["category_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "categories",
                onDelete: "SET NULL",
                onUpdate: "CASCADE",
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("transactions", "categoryKey");
    }
}
