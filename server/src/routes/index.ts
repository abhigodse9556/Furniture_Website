import { Router } from "express";
import multer from "multer";

import * as bannerController from "../controllers/bannerController";
import * as productController from "../controllers/productController";
import * as siteController from "../controllers/siteController";
import * as uploadController from "../controllers/uploadController";
import { requireAdmin } from "../middleware/requireAdmin";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

const router = Router();

router.get("/site", siteController.getSite);
router.get("/banners", bannerController.getPublicBanners);
router.get("/products", productController.getProducts);
router.get("/products/:slug", productController.getProductBySlug);

router.put("/admin/site", requireAdmin, siteController.updateSite);

router.get("/admin/banners", requireAdmin, bannerController.getAdminBanners);
router.post("/admin/banners", requireAdmin, bannerController.createBanner);
router.put("/admin/banners/:id", requireAdmin, bannerController.updateBanner);
router.delete(
  "/admin/banners/:id",
  requireAdmin,
  bannerController.deleteBanner,
);

router.get("/admin/products", requireAdmin, productController.getProducts);
router.post("/admin/products", requireAdmin, productController.createProduct);
router.put(
  "/admin/products/:id",
  requireAdmin,
  productController.updateProduct,
);
router.delete(
  "/admin/products/:id",
  requireAdmin,
  productController.deleteProduct,
);

router.post(
  "/admin/upload",
  requireAdmin,
  upload.single("file"),
  uploadController.upload,
);

export default router;
