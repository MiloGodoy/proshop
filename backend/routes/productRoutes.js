import express from "express";
const router = express.Router();
import { 
    createProduct, 
    deleteProduct, 
    getProductById, 
    getProducts, 
    updateProduct,
    createProductReview,
    getTopProducts 
} from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js'
import checkObjectId from "../middleware/checkObjectId.js";

// Devuelve un array de productos
router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router
.route("/:id")
.get(checkObjectId, getProductById)
.put(protect, admin, checkObjectId, updateProduct)
.delete(protect, admin, checkObjectId, deleteProduct);
router.route('/:id/reviews').post(protect, checkObjectId, createProductReview);

export default router;