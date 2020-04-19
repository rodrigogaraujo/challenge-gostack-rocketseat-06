import { getRepository, getCustomRepository } from "typeorm";

import AppError from "../errors/AppError";

import TransactionsRepository from "../repositories/TransactionsRepository";
import Transaction from "../models/Transaction";
import Category from "../models/Category";

interface Request {
    title: string;
    value: number;
    type: "income" | "outcome";
    category: string;
}

interface CategoryDTO {
    title: string;
}

class CreateTransactionService {
    public async execute({
        title,
        value,
        type,
        category,
    }: Request): Promise<Transaction> {
        const transactionsRepository = getCustomRepository(
            TransactionsRepository,
        );
        const categoriesRepository = getRepository(Category);

        const { total } = await transactionsRepository.getBalance();

        if (type === "outcome" && value > total) {
            throw new AppError("Seu saldo é insuficiente", 400);
        }

        const findCategory = await categoriesRepository.findOne({
            where: { title: category },
        });

        let category_id;

        if (findCategory) {
            category_id = findCategory.id;
        } else {
            const newCategory: CategoryDTO = {
                title: category,
            };
            category_id = (await categoriesRepository.save(newCategory)).id;
        }

        const transaction = transactionsRepository.create({
            title,
            value,
            type,
            category_id,
        });

        await transactionsRepository.save(transaction);

        return transaction;
    }
}

export default CreateTransactionService;
