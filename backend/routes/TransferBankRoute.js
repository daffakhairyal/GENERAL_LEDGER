import express from 'express';
import {
    getAllTransferBank,
    getTransferBankById,
    createTransferBank,
    updateTransferBank,
    deleteTransferBank
} from '../controllers/TransferBankController.js';

const router = express.Router();

router.get('/transfer_bank', getAllTransferBank);
router.get('/transfer_bank/:id', getTransferBankById);
router.post('/transfer_bank', createTransferBank);
router.patch('/transfer_bank/:id', updateTransferBank);
router.delete('/transfer_bank/:id', deleteTransferBank);

export default router;
