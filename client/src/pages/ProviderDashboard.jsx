import { useEffect, useState } from "react";
import api from "../api/axios";

function ProviderDashboard() {
  const [profile, setProfile] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    serviceCategories: "",
    skills: "",
    experience: "",
    bio: "",
    status: "draft",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/provider/profile");
      const data = response.data;

      setProfile({
        phone: data.phone || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        serviceCategories: data.serviceCategories?.join(", ") || "",
        skills: data.skills?.join(", ") || "",
        experience: data.experience ?? "",
        bio: data.bio || "",
        status: data.status || "draft",
      });
    } catch (error) {
      console.error("PROFILE ERROR:", error);
      setMessage(
        error.response?.data?.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      await api.put("/provider/profile", {
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,

        serviceCategories: profile.serviceCategories
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        skills: profile.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        experience: Number(profile.experience) || 0,
        bio: profile.bio,
      });

      setMessage("Profile saved successfully");
      loadProfile();
    } catch (error) {
      console.error("SAVE PROFILE ERROR:", error);

      setMessage(
        error.response?.data?.message || "Failed to save profile"
      );
    }
  };

  // =========================
  // UPLOAD FILES
  // =========================
  const uploadFiles = async () => {
    if (!profilePhoto && documents.length === 0) {
      setMessage("Please select a profile photo or document");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();

      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      documents.forEach((file) => {
        formData.append("documents", file);
      });

      console.log("Uploading profile photo:", profilePhoto);
      console.log("Uploading documents:", documents);

      const response = await api.post(
        "/provider/upload",
        formData
      );

      console.log("UPLOAD RESPONSE:", response.data);

      setMessage("Files uploaded successfully");

      setProfilePhoto(null);
      setDocuments([]);

      const photoInput = document.getElementById(
        "profilePhotoInput"
      );

      const documentInput = document.getElementById(
        "documentsInput"
      );

      if (photoInput) {
        photoInput.value = "";
      }

      if (documentInput) {
        documentInput.value = "";
      }

      await loadProfile();
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      if (error.response) {
        console.error(
          "SERVER RESPONSE:",
          error.response.data
        );
        console.error(
          "STATUS:",
          error.response.status
        );

        setMessage(
          error.response.data?.message ||
            `Upload failed (${error.response.status})`
        );
      } else if (error.request) {
        console.error(
          "NO RESPONSE FROM SERVER:",
          error.request
        );

        setMessage(
          "Cannot connect to server. Make sure backend is running on port 5000."
        );
      } else {
        setMessage(
          error.message || "File upload failed"
        );
      }
    } finally {
      setUploading(false);
    }
  };

  // =========================
  // SUBMIT APPLICATION
  // =========================
  const submitApplication = async () => {
    try {
      await api.post("/provider/submit");

      setMessage("Application submitted successfully");

      loadProfile();
    } catch (error) {
      console.error("SUBMIT ERROR:", error);

      setMessage(
        error.response?.data?.message ||
          "Failed to submit application"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <header style={styles.header}>
        <div>
          <h1 style={{ margin: 0 }}>
            Service Provider Portal
          </h1>

          <p style={{ margin: "5px 0" }}>
            Provider Dashboard
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          style={styles.logout}
        >
          Logout
        </button>
      </header>

      {/* MAIN */}
      <main style={styles.container}>

        <div style={styles.card}>

          {/* PROFILE HEADER */}
          <div style={styles.topRow}>
            <div>
              <h2>Your Profile</h2>

              <p>
                Complete your service provider information.
              </p>
            </div>

            <span style={styles.status}>
              Status: {profile.status}
            </span>
          </div>

          {/* MESSAGE */}
          {message && (
            <div style={styles.message}>
              {message}
            </div>
          )}

          {/* PROFILE FORM */}
          <form onSubmit={saveProfile}>

            <h3>
              Personal & Location Details
            </h3>

            <div style={styles.grid}>

              <input
                name="phone"
                placeholder="Phone Number"
                value={profile.phone}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="city"
                placeholder="City"
                value={profile.city}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="state"
                placeholder="State"
                value={profile.state}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="pincode"
                placeholder="Pincode"
                value={profile.pincode}
                onChange={handleChange}
                style={styles.input}
              />

            </div>

            <input
              name="address"
              placeholder="Full Address"
              value={profile.address}
              onChange={handleChange}
              style={styles.fullInput}
            />

            <h3>
              Services & Experience
            </h3>

            <input
              name="serviceCategories"
              placeholder="Service Categories: Electrical, Plumbing"
              value={profile.serviceCategories}
              onChange={handleChange}
              style={styles.fullInput}
            />

            <input
              name="skills"
              placeholder="Skills: Wiring, Repair, Installation"
              value={profile.skills}
              onChange={handleChange}
              style={styles.fullInput}
            />

            <input
              type="number"
              name="experience"
              placeholder="Years of Experience"
              value={profile.experience}
              onChange={handleChange}
              style={styles.fullInput}
            />

            <textarea
              name="bio"
              placeholder="Tell us about your experience"
              value={profile.bio}
              onChange={handleChange}
              rows="5"
              style={styles.fullInput}
            />

            <button
              type="submit"
              style={styles.save}
            >
              Save Profile
            </button>

          </form>

          <hr style={{ margin: "30px 0" }} />

          {/* PROFILE PHOTO */}
          <h3>
            Profile Photo
          </h3>

          <input
            id="profilePhotoInput"
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={(e) => {
              setProfilePhoto(
                e.target.files?.[0] || null
              );
            }}
          />

          {/* DOCUMENTS */}
          <h3 style={{ marginTop: "25px" }}>
            Verification Documents
          </h3>

          <p style={{ color: "#64748b" }}>
            Upload Aadhaar, ID proof, certificates,
            or other verification documents.
          </p>

          <input
            id="documentsInput"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              setDocuments(
                Array.from(e.target.files || [])
              );
            }}
          />

          <br />

          {/* UPLOAD BUTTON */}
          <button
            type="button"
            onClick={uploadFiles}
            disabled={uploading}
            style={{
              ...styles.upload,
              opacity: uploading ? 0.6 : 1,
              cursor: uploading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {uploading
              ? "Uploading..."
              : "Upload Files"}
          </button>

          <hr style={{ margin: "30px 0" }} />

          {/* SUBMIT */}
          <button
            type="button"
            onClick={submitApplication}
            style={styles.submit}
            disabled={profile.status === "approved"}
          >
            {profile.status === "approved"
              ? "Application Approved"
              : "Submit Application"}
          </button>

        </div>

      </main>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    background: "#1e293b",
    color: "white",
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  container: {
    maxWidth: "950px",
    margin: "40px auto",
    padding: "0 20px",
  },

  card: {
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    boxShadow:
      "0 2px 12px rgba(0,0,0,0.08)",
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },

  input: {
    padding: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    marginBottom: "15px",
  },

  fullInput: {
    width: "100%",
    padding: "13px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    marginBottom: "15px",
    boxSizing: "border-box",
  },

  status: {
    background: "#e2e8f0",
    padding: "8px 15px",
    borderRadius: "20px",
    textTransform: "capitalize",
  },

  message: {
    background: "#e0f2fe",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
  },

  save: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  upload: {
    background: "#7c3aed",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "6px",
    marginTop: "20px",
  },

  submit: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "13px 28px",
    borderRadius: "6px",
    fontSize: "16px",
  },

  logout: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default ProviderDashboard;