import PettyCash from "../models/PettyCash.js";

export const getAllPettyCash = async (req, res) => {
    try {
        const pettyCash = await PettyCash.findAll();
        res.status(200).json(pettyCash);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getPettyCashById = async (req, res) => {
    try {
        const pettyCash = await PettyCash.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!pettyCash) {
            return res.status(404).json({ msg: 'Petty cash tidak ditemukan' });
        }
        res.status(200).json(pettyCash);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createPettyCash = async (req, res) => {
    try {
        const newPettyCash = await PettyCash.create(req.body);
        res.status(201).json({ msg: 'Petty cash berhasil ditambahkan', data: newPettyCash });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const updatePettyCash = async (req, res) => {
    try {
        const pettyCash = await PettyCash.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!pettyCash) {
            return res.status(404).json({ msg: 'Petty cash tidak ditemukan' });
        }
        await pettyCash.update(req.body);
        res.status(200).json({ msg: 'Petty cash berhasil diupdate' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deletePettyCash = async (req, res) => {
    try {
        const pettyCash = await PettyCash.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!pettyCash) {
            return res.status(404).json({ msg: 'Petty cash tidak ditemukan' });
        }
        await pettyCash.destroy();
        res.status(200).json({ msg: 'Petty cash berhasil dihapus' });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
