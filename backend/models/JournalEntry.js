import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const JournalEntry = db.define('journal_entry', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    debit: {
        type: DataTypes.DECIMAL(10, 2), // Menyesuaikan dengan kebutuhan Anda
        allowNull: false
    },
    credit: {
        type: DataTypes.DECIMAL(10, 2), // Menyesuaikan dengan kebutuhan Anda
        allowNull: false
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status : {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: 0
    }
    // Tambahkan kolom tambahan sesuai kebutuhan
}, {
    freezeTableName: true
});

export default JournalEntry;
