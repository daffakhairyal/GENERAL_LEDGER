import express from 'express';
import {
    getAllPettyCash,
    getPettyCashById,
    createPettyCash,
    updatePettyCash,
    deletePettyCash
} from '../controllers/PettyCashController.js';

const router = express.Router();

router.get('/petty_cash', getAllPettyCash);
router.get('/petty_cash/:id', getPettyCashById);
router.post('/petty_cash', createPettyCash);
router.patch('/petty_cash/:id', updatePettyCash);
router.delete('/petty_cash/:id', deletePettyCash);

export default router;
