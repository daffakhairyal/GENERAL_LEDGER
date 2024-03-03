import {Sequelize} from "sequelize";

const db = new Sequelize('general_ledger','root','',{
    host:"localhost",
    dialect:"mysql"
});

export default db