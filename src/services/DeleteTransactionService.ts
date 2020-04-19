import { getCustomRepository } from "typeorm";

import TransactionsRepository from "../repositories/TransactionsRepository";
import AppError from "../errors/AppError";

interface Request {
    id: string;
}

class DeleteTransactionService {
    public async execute({ id }: Request): Promise<void> {
        const transactionsRepository = getCustomRepository(
            TransactionsRepository,
        );
        const transactionDelete = await transactionsRepository.find({
            where: { id },
        });
        if (!transactionDelete.length) {
            throw new AppError("ID não encontrado", 400);
        }
        await transactionsRepository.delete([id]);
    }
}

export default DeleteTransactionService;
