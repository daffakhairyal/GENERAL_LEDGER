import express from 'express';
import {
    getAllJournalEntries,
    getJournalEntryById,
    createJournalEntry,
    updateJournalEntry,
    deleteJournalEntry
} from '../controllers/GeneralLedger.js';

const router = express.Router();

router.get('/journal_entries', getAllJournalEntries);
router.get('/journal_entries/:id', getJournalEntryById);
router.post('/journal_entries', createJournalEntry);
router.patch('/journal_entries/:id', updateJournalEntry);
router.delete('/journal_entries/:id', deleteJournalEntry);

export default router;
