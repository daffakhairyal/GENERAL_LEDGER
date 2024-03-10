import express from "express";
import { getChartOfAccounts, getChartOfAccountById, createChartOfAccount, updateChartOfAccount, deleteChartOfAccount } from "../controllers/COAController.js";

const router = express.Router();

router.get('/chart_of_account', getChartOfAccounts);
router.get('/chart_of_account/:id', getChartOfAccountById);
router.post('/chart_of_account', createChartOfAccount);
router.patch('/chart_of_account/:id', updateChartOfAccount);
router.delete('/chart_of_account/:id', deleteChartOfAccount);

export default router;
