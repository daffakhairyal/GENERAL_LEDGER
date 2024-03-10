import JournalEntry from "../models/JournalEntry.js";

export const getAllJournalEntries = async (req, res) => {
    try {
        const journalEntries = await JournalEntry.findAll();
        res.status(200).json(journalEntries);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getJournalEntryById = async (req, res) => {
    try {
        const journalEntry = await JournalEntry.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!journalEntry) {
            return res.status(404).json({ msg: 'Entri jurnal tidak ditemukan' });
        }
        res.status(200).json(journalEntry);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createJournalEntry = async (req, res) => {
    try {
        const newJournalEntry = await JournalEntry.create(req.body);
        res.status(201).json({ msg: 'Entri jurnal berhasil ditambahkan', data: newJournalEntry });
    } catch (error) {
        res.status(400).json({ msg: error.message }); // Menampilkan pesan error yang diterima dari Sequelize
    }
};

export const updateJournalEntry = async (req, res) => {
    try {
        const journalEntry = await JournalEntry.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!journalEntry) {
            return res.status(404).json({ msg: 'Entri jurnal tidak ditemukan' });
        }
        await journalEntry.update(req.body);
        res.status(200).json({ msg: 'Entri jurnal berhasil diupdate' });
    } catch (error) {
        res.status(400).json({ msg: error.message }); // Menampilkan pesan error yang diterima dari Sequelize
    }
};


export const deleteJournalEntry = async (req, res) => {
    try {
        const journalEntry = await JournalEntry.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!journalEntry) {
            return res.status(404).json({ msg: 'Entri jurnal tidak ditemukan' });
        }
        await journalEntry.destroy();
        res.status(200).json({ msg: 'Entri jurnal berhasil dihapus' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
