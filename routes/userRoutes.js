import express from 'express';
import { register, login, update, logout } from '../controller/userController.js';

const route = express.Router();

route.post("/register", register);
route.post("/login", login);
route.put("/update", update);
route.delete("/logout", logout);

export default route;