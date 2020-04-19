import csv from "csv-parse";
import fs from "fs";

import CreateTransactionService from "./CreateTransactionService";
import Transaction from "../models/Transaction";

interface Request {
    filepath: string;
}

interface TransactionDTO {
    title: string;
    value: number;
    type: "income" | "outcome";
    category: string;
}

class ImportTransactionsService {
    async execute({ filepath }: Request): Promise<Transaction[]> {
        const listCsv = await this.listTransactionsCsv({ filepath });
        const transactions = this.sendToDatabaseCsv(listCsv);
        return transactions;
    }

    private async sendToDatabaseCsv(
        transactionsDTO: TransactionDTO[],
    ): Promise<Transaction[]> {
        const createTransaction = new CreateTransactionService();
        const transactions = [] as Transaction[];
        // eslint-disable-next-line no-restricted-syntax
        for (const transactionCsv of transactionsDTO) {
            // eslint-disable-next-line no-await-in-loop
            const transaction = await createTransaction.execute(transactionCsv);
            transactions.push(transaction);
        }
        return transactions;
    }

    private async listTransactionsCsv({
        filepath,
    }: Request): Promise<TransactionDTO[]> {
        return new Promise<TransactionDTO[]>((resolve, reject) => {
            const transactions = [] as TransactionDTO[];
            const stream = fs
                .createReadStream(filepath)
                .pipe(csv({ columns: true, from_line: 1, trim: true }))
                .on("data", (row: TransactionDTO) => {
                    try {
                        stream.pause();
                        transactions.push(row);
                    } finally {
                        stream.resume();
                    }
                })
                .on("end", () => {
                    resolve(transactions);
                    fs.promises.unlink(filepath);
                });
        });
    }
}

export default ImportTransactionsService;
