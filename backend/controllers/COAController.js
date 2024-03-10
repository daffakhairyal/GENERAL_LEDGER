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
    const chartOfAccounts = req.body; // Menerima array objek data
    try {
        await Promise.all(chartOfAccounts.map(async chart => {
            const { name, level, account, type,induk, klasifikasi, defSaldo } = chart;
            await ChartOfAccount.create({
                name: name,
                level: level,
                account: account,
                induk:induk,
                type: type,
                klasifikasi:klasifikasi,
                defSaldo: defSaldo
            });
        }));

        res.status(201).json({ msg: "Chart of Account berhasil ditambahkan!" });
    } catch (error) {
        console.error(error); // Cetak kesalahan untuk debugging
        if (error.errors && error.errors.length > 0) {
            // Jika terdapat kesalahan yang terkait dengan validasi, kirim pesan kesalahan yang lebih spesifik
            const validationErrors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));
            res.status(400).json({ msg: "Validation error", errors: validationErrors });
        } else {
            // Jika kesalahan bukan terkait dengan validasi, kirim pesan kesalahan yang umum
            res.status(400).json({ msg: "Validation error", error: error.message });
        }
    }
};




export const updateChartOfAccount = async (req, res) => {
    const { name, level, account, type, klasifikasi, defSaldo } = req.body;
    try {
        await ChartOfAccount.update({
            name: name,
            level: level,
            account: account,
            type: type,
            klasifikasi:klasifikasi,
            defSaldo: defSaldo
        }, {
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json({ msg: "Chart of Account berhasil diubah!" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}

export const deleteChartOfAccount = async (req, res) => {
    try {
        const rowsDeleted = await ChartOfAccount.destroy({
            where: {
                uuid: req.params.id
            }
        });
        if (rowsDeleted === 0) {
            return res.status(404).json({ msg: "Chart of Account tidak ditemukan!" });
        }
        res.status(200).json({ msg: "Chart of Account berhasil dihapus!" })
    } catch (error) {
        res.status(400).json({ msg: error.message })
    }
}
