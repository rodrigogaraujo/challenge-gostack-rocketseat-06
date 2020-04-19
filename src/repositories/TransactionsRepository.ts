import { EntityRepository, Repository } from "typeorm";

import Transaction from "../models/Transaction";

interface Balance {
    income: number;
    outcome: number;
    total: number;
}

interface ListDTO {
    transactions: Transaction[];
    balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
    public async getBalance(): Promise<Balance> {
        const listIncome = await this.find({
            where: { type: "income" },
        });
        let income = 0;
        listIncome.forEach(element => {
            income = element.value + income;
        });

        const listOutcome = await this.find({
            where: { type: "outcome" },
        });
        let outcome = 0;
        listOutcome.forEach(element => {
            outcome = element.value + outcome;
        });

        const total = income - outcome;

        return { income, outcome, total };
    }

    public async getAll(): Promise<ListDTO | null> {
        const list = await this.find({
            select: ["id", "title", "value", "type", "category"],
            relations: ["category"],
        });
        const balance = await this.getBalance();
        return { transactions: list, balance };
    }
}

export default TransactionsRepository;
