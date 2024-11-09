import express from "express";
import {
    getAllTours,
    getToursByLocation,
    getFavoriteTours,
    getPurchases,
    addToPurchases,
    addToFavorites,
    removeFromFavorites,
} from "../controllers/tourController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import toursAuthMiddleware from "../middleware/toursAuthMiddleware.js";

const router = express.Router();

router.get("/allTours", toursAuthMiddleware, getAllTours);
router.post("/toursByLocation", getToursByLocation);
router.get("/individualTours", authMiddleware, getAllTours);
router.get("/favoriteTours", authMiddleware, getFavoriteTours);
router.get("/purchases", authMiddleware, getPurchases);
router.post("/addToPurchases", authMiddleware, addToPurchases);
router.post("/addToFavorites", authMiddleware, addToFavorites);
router.post("/removeFromFavorites", authMiddleware, removeFromFavorites);

export default router;
