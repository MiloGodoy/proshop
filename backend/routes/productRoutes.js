import express from "express";
const router = express.Router();
import { getProductById, getProducts } from "../controllers/productController.js";

// Devuelve un array de productos
router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

export default router;