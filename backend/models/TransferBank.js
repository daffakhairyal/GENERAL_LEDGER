import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const TransferBank = db.define('transfer_bank', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    account: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    noVoucher: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    jenis: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tanggal: {
        type: DataTypes.DATE,
        allowNull: false
    },
    detail: {
        type: DataTypes.STRING,
        allowNull: true
    },
    debit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    credit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    divisi:{
        type: DataTypes.STRING,
        allowNull: false
    },
    karyawan:{
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
}, {
    freezeTableName: true
});

export default TransferBank;
