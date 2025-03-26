import express from 'express';
const router = express.Router()
import verifyToken from '../middlewares/authMiddleware.js';
import {register, login, QRLogin, logout, refreshToken, getUser} from "../controllers/authController.js"

router.post("/login", login)
// router.post("/register", register)
router.get("/user", verifyToken, getUser)

router.post("/qr/login", QRLogin)
router.post("/qr/refresh-token", refreshToken)
router.post("/qr/logout", logout)


export default router