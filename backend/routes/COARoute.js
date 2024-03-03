import express from "express";
import { getChartOfAccounts, getChartOfAccountById, createChartOfAccount, updateChartOfAccount, deleteChartOfAccount } from "../controllers/COAController.js";

const router = express.Router();

router.get('/coa', getChartOfAccounts);
router.get('/coa/:id', getChartOfAccountById);
router.post('/coa', createChartOfAccount);
router.patch('/coa/:id', updateChartOfAccount);
router.delete('/coa/:id', deleteChartOfAccount);

export default router;
