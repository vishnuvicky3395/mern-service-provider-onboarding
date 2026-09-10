const User = require("../models/User");
const ProviderProfile = require("../models/ProviderProfile");

// GET ALL PROVIDERS
const getAllProviders = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      page = 1,
      limit = 10,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Find all provider users
    const users = await User.find({
      role: "provider",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("-password");

    const userIds = users.map((user) => user._id);

    // Find provider profiles
    const filter = {
      user: { $in: userIds },
    };

    if (status) {
      filter.status = status;
    }

    const total = await ProviderProfile.countDocuments(filter);

    const profiles = await ProviderProfile.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      providers: profiles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get providers error:", error);

    res.status(500).json({
      message: "Failed to get providers",
      error: error.message,
    });
  }
};

// GET SINGLE PROVIDER
const getProviderById = async (req, res) => {
  try {
    const profile = await ProviderProfile.findById(req.params.id)
      .populate("user", "name email");

    if (!profile) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get provider",
      error: error.message,
    });
  }
};

// APPROVE PROVIDER
const approveProvider = async (req, res) => {
  try {
    const profile = await ProviderProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    profile.status = "approved";
    profile.rejectionRemark = "";

    await profile.save();

    res.status(200).json({
      message: "Provider approved successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to approve provider",
      error: error.message,
    });
  }
};

// REJECT PROVIDER
const rejectProvider = async (req, res) => {
  try {
    const { rejectionRemark } = req.body;

    if (!rejectionRemark) {
      return res.status(400).json({
        message: "Rejection remark is required",
      });
    }

    const profile = await ProviderProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    profile.status = "rejected";
    profile.rejectionRemark = rejectionRemark;

    await profile.save();

    res.status(200).json({
      message: "Provider rejected successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to reject provider",
      error: error.message,
    });
  }
};

// DASHBOARD STATISTICS
const getDashboardStats = async (req, res) => {
  try {
    const totalProviders = await ProviderProfile.countDocuments();

    const pendingProviders = await ProviderProfile.countDocuments({
      status: "pending",
    });

    const approvedProviders = await ProviderProfile.countDocuments({
      status: "approved",
    });

    const rejectedProviders = await ProviderProfile.countDocuments({
      status: "rejected",
    });

    const draftProviders = await ProviderProfile.countDocuments({
      status: "draft",
    });

    res.status(200).json({
      totalProviders,
      pendingProviders,
      approvedProviders,
      rejectedProviders,
      draftProviders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get dashboard statistics",
      error: error.message,
    });
  }
};

// EXPORT CONTROLLERS
module.exports = {
  getAllProviders,
  getProviderById,
  approveProvider,
  rejectProvider,
  getDashboardStats,
};