import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Division from "./DivisionModel.js";

const {DataTypes}= Sequelize;

const Users = db.define('users',{
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len:[1,20]
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
        validate: {
            notEmpty: true,
            isEmail:true
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
           
        }
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
           
        }
    },
    division: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
           
        }
    }
}, {
    freezeTableName:true
});



export default Users;