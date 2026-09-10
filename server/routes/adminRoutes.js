const express = require("express");
const router = express.Router();

const { protect, adminOnly } = require("../middleware/authMiddleware");

const {
  getAllProviders,
  getProviderById,
  approveProvider,
  rejectProvider,
  getDashboardStats,
} = require("../controllers/adminController");

router.get("/stats", protect, adminOnly, getDashboardStats);

router.get("/providers", protect, adminOnly, getAllProviders);

router.get("/providers/:id", protect, adminOnly, getProviderById);

router.put(
  "/providers/:id/approve",
  protect,
  adminOnly,
  approveProvider
);

router.put(
  "/providers/:id/reject",
  protect,
  adminOnly,
  rejectProvider
);

module.exports = router;