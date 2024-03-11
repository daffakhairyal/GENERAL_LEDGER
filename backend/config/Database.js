import {Sequelize} from "sequelize";

const db = new Sequelize('general_ledger','daffa','Dd@14170077',{
    host:"localhost",
    dialect:"mysql"
});

export default db