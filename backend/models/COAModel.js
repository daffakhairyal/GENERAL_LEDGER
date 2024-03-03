import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const ChartOfAccount = db.define('chart_of_account', {
    uuid: {
        type: DataTypes.STRING, 
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        }
    },
    account: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    induk: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: true,
        }
    },
    klasifikasi: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    defSaldo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    }
}, {
    freezeTableName: true
});

export default ChartOfAccount;
