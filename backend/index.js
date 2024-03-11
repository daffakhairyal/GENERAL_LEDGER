import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from 'dotenv';
import SequelizeStore from "connect-session-sequelize"
import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import DivisionRoute from "./routes/DivisionRoute.js"
import TransferBankRoute from "./routes/TransferBankRoute.js"
import COARoute from "./routes/COARoute.js"
import PettyCashRoute from "./routes/PettyCashRoute.js"

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db:db
})

async function startServer() {
    try {
        await db.sync();
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    }}

app.use(session({
    secret: process.env.SESS_SECRET,
    resave:false,
    saveUninitialized:true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}))

const PORT = process.env.APP_PORT || 5000;


app.use(cors({
    credentials:true,
    origin: 'http://localhost:5173'
}));

app.use(express.json({ limit: '10mb' }));
app.use(UserRoute);
app.use(AuthRoute);
app.use(DivisionRoute);
app.use(COARoute);
app.use(PettyCashRoute);
app.use(TransferBankRoute)

store.sync();
app.listen(PORT,()=> {
    console.log(`Server berjalan dalam port ${PORT}`)
});
startServer();