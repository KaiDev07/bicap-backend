import express from "express";
import {
    getAllTours,
    getToursByLocation,
    getFavoriteTours,
    getPurchases,
    addToPurchases,
    addToFavorites,
} from "../controllers/tourController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/allTours", getAllTours);
router.post("/toursByLocation", getToursByLocation);
router.get("/individualTours", authMiddleware, getAllTours);
router.get("/favoriteTours", authMiddleware, getFavoriteTours);
router.get("/purchases", authMiddleware, getPurchases);
router.post("/addToPurchases", authMiddleware, addToPurchases);
router.post("/addToFavorites", authMiddleware, addToFavorites);

export default router;
