import { Router } from "express";
import { getCustomRepository } from "typeorm";
import multer from "multer";

import TransactionsRepository from "../repositories/TransactionsRepository";
import CreateTransactionService from "../services/CreateTransactionService";
import DeleteTransactionService from "../services/DeleteTransactionService";
import ImportTransactionsService from "../services/ImportTransactionsService";
import uploadConfig from "../config/upload";

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get("/", async (request, response) => {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const list = await transactionsRepository.getAll();
    return response.json(list);
});

transactionsRouter.post("/", async (request, response) => {
    const { title, value, type, category } = request.body;
    const createTransaction = new CreateTransactionService();
    const transaction = await createTransaction.execute({
        title,
        value,
        type,
        category,
    });
    return response.json(transaction);
});

transactionsRouter.delete("/:id", async (request, response) => {
    const deleteService = new DeleteTransactionService();
    await deleteService.execute({ id: request.params.id });
    return response.status(204).send();
});

transactionsRouter.post(
    "/import",
    upload.single("file"),
    async (request, response) => {
        const filepath = request.file.path;
        const importService = new ImportTransactionsService();
        const transactions = await importService.execute({ filepath });
        return response.status(200).json(transactions);
    },
);

export default transactionsRouter;
