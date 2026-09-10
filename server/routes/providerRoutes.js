const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const {
  getProfile,
  updateProfile,
  uploadFiles,
  submitApplication,
} = require("../controllers/providerController");

const {
  protect,
  providerOnly,
} = require("../middleware/authMiddleware");

// =========================
// MULTER STORAGE
// =========================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// =========================
// MULTER CONFIG
// =========================

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: function (req, file, cb) {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and PDF files are allowed"
        )
      );
    }
  },
});

// =========================
// PROFILE
// =========================

router.get(
  "/profile",
  protect,
  providerOnly,
  getProfile
);

router.put(
  "/profile",
  protect,
  providerOnly,
  updateProfile
);

// =========================
// FILE UPLOAD
// =========================

router.post(
  "/upload",
  protect,
  providerOnly,
  upload.fields([
    {
      name: "profilePhoto",
      maxCount: 1,
    },
    {
      name: "documents",
      maxCount: 5,
    },
  ]),
  uploadFiles
);

// =========================
// SUBMIT APPLICATION
// =========================

router.post(
  "/submit",
  protect,
  providerOnly,
  submitApplication
);

module.exports = router;