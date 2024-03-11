import TransferBank from "../models/TransferBank.js";

export const getAllTransferBank = async (req, res) => {
    try {
        const transferBank = await TransferBank.findAll();
        res.status(200).json(transferBank);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getTransferBankById = async (req, res) => {
    try {
        const transferBank = await TransferBank.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!transferBank) {
            return res.status(404).json({ msg: 'Transfer bank tidak ditemukan' });
        }
        res.status(200).json(transferBank);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createTransferBank = async (req, res) => {
    try {
        const newTransferBank = await TransferBank.create(req.body);
        res.status(201).json({ msg: 'Transfer bank berhasil ditambahkan', data: newTransferBank });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const updateTransferBank = async (req, res) => {
    try {
        const transferBank = await TransferBank.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!transferBank) {
            return res.status(404).json({ msg: 'Transfer bank tidak ditemukan' });
        }
        await transferBank.update(req.body);
        res.status(200).json({ msg: 'Transfer bank berhasil diupdate' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteTransferBank = async (req, res) => {
    try {
        const transferBank = await TransferBank.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!transferBank) {
            return res.status(404).json({ msg: 'Transfer bank tidak ditemukan' });
        }
        await transferBank.destroy();
        res.status(200).json({ msg: 'Transfer bank berhasil dihapus' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
