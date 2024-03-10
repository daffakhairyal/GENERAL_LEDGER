import express from "express"
import { getUsers, getUserById, createUser, updateUser, deleteUser} from "../controllers/User.js"
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id',verifyUser,adminOnly, deleteUser);

export default router;