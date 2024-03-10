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


    },
    level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        }
    },
    account: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    induk: {
        type: DataTypes.STRING,


    },
    klasifikasi: {
        type: DataTypes.STRING,
        allowNull: false,

    },
    defSaldo: {
        type: DataTypes.INTEGER,
        allowNull: true, // atau sesuai kebutuhan Anda

    },
    type: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
    },
    
}, {
    freezeTableName: true
});

export default ChartOfAccount;
