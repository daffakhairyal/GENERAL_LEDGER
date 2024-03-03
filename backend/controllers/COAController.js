import ChartOfAccount from "../models/COAModel.js";

export const getChartOfAccounts = async (req, res) => {
    try {
        const response = await ChartOfAccount.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getChartOfAccountById = async (req, res) => {
    try {
        const response = await ChartOfAccount.findOne({
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createChartOfAccount = async (req, res) => {
    const { name, level, account } = req.body;
    try {
        await ChartOfAccount.create({
            name: name,
            level: level,
            account: account
        })
        res.status(201).json({ msg: "Chart of Account berhasil ditambahkan!" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const updateChartOfAccount = async (req, res) => {
    const chartOfAccount = await ChartOfAccount.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if (!chartOfAccount) return res.status(404).json({ msg: "Chart of Account tidak ditemukan!" })
    const { name, level, account } = req.body;
    try {
        await ChartOfAccount.update({
            name: name,
            level: level,
            account: account
        }, {
            where: {
                id: chartOfAccount.id
            }
        });
        res.status(200).json({ msg: "Chart of Account berhasil diubah!" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const deleteChartOfAccount = async (req, res) => {
    const chartOfAccount = await ChartOfAccount.findOne({
        where: {
            uuid: req.params.id
        }
    })
    if (!chartOfAccount) return res.status(404).json({ msg: "Chart of Account tidak ditemukan!" })
    try {
        await ChartOfAccount.destroy({
            where: {
                id: chartOfAccount.id
            }
        });
        res.status(200).json({ msg: "Chart of Account berhasil dihapus!" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}
