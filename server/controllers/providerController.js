const ProviderProfile = require("../models/ProviderProfile");

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    let profile = await ProviderProfile.findOne({
      user: req.user.userId,
    }).populate("user", "name email");

    if (!profile) {
      profile = await ProviderProfile.create({
        user: req.user.userId,
      });

      profile = await profile.populate("user", "name email");
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const {
      phone,
      address,
      city,
      state,
      pincode,
      serviceCategories,
      skills,
      experience,
      bio,
    } = req.body;

    const profile = await ProviderProfile.findOneAndUpdate(
      { user: req.user.userId },
      {
        phone,
        address,
        city,
        state,
        pincode,
        serviceCategories,
        skills,
        experience,
        bio,
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.json({
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// UPLOAD FILES
const uploadFiles = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({
      user: req.user.userId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    // Profile photo
    if (req.files?.profilePhoto?.[0]) {
      profile.profilePhoto =
        "/uploads/" + req.files.profilePhoto[0].filename;
    }

    // Verification documents
    if (req.files?.documents) {
      profile.verificationDocuments = req.files.documents.map(
        (file) => ({
          name: file.originalname,
          path: "/uploads/" + file.filename,
        })
      );
    }

    await profile.save();

    res.json({
      message: "Files uploaded successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "File upload failed",
      error: error.message,
    });
  }
};

// SUBMIT APPLICATION
const submitApplication = async (req, res) => {
  try {
    const profile = await ProviderProfile.findOne({
      user: req.user.userId,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    profile.status = "pending";
    await profile.save();

    res.json({
      message: "Application submitted successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit application",
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadFiles,
  submitApplication,
};