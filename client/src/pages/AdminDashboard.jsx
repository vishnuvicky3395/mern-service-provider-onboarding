import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    draft: 0,
  });

  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  const [selectedProvider, setSelectedProvider] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // =========================
  // LOAD DASHBOARD
  // =========================

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const statsResponse = await api.get("/admin/stats");

      console.log("ADMIN STATS FROM BROWSER:", statsResponse.data);

      const providersResponse = await api.get(
        `/admin/providers?search=${encodeURIComponent(
          search
        )}&status=${status}&page=${page}&limit=10`
      );

      console.log("ADMIN PROVIDERS FROM BROWSER:", providersResponse.data);

      const statsData = statsResponse.data || {};

      setStats({
        total: Number(statsData.totalProviders) || 0,
        pending: Number(statsData.pendingProviders) || 0,
        approved: Number(statsData.approvedProviders) || 0,
        rejected: Number(statsData.rejectedProviders) || 0,
        draft: Number(statsData.draftProviders) || 0,
      });

      setProviders(
        providersResponse.data.providers || []
      );

      setPagination(
        providersResponse.data.pagination || {
          total: 0,
          totalPages: 1,
        }
      );
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [search, status, page]);

  // =========================
  // VIEW PROVIDER DETAILS
  // =========================

  const viewProvider = async (id) => {
    try {
      setDetailsLoading(true);

      const response = await api.get(
        `/admin/providers/${id}`
      );

      setSelectedProvider(response.data);
    } catch (error) {
      console.error("VIEW PROVIDER ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to load provider details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // =========================
  // APPROVE PROVIDER
  // =========================

  const approveProvider = async (id) => {
    const confirmApprove = window.confirm(
      "Are you sure you want to approve this provider?"
    );

    if (!confirmApprove) return;

    try {
      await api.put(
        `/admin/providers/${id}/approve`
      );

      alert("Provider approved successfully");

      setSelectedProvider(null);

      loadDashboard();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Approval failed"
      );
    }
  };

  // =========================
  // REJECT PROVIDER
  // =========================

  const rejectProvider = async (id) => {
    const remark = window.prompt(
      "Enter rejection remark:"
    );

    if (!remark || !remark.trim()) {
      return;
    }

    try {
      await api.put(
        `/admin/providers/${id}/reject`,
        {
          rejectionRemark: remark.trim(),
        }
      );

      alert("Provider rejected successfully");

      setSelectedProvider(null);

      loadDashboard();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Rejection failed"
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

  // =========================
  // PAGE CHANGE
  // =========================

  const changePage = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= pagination.totalPages
    ) {
      setPage(newPage);
    }
  };

  // =========================
  // FILE URL HELPER
  // =========================
  const getFileUrl = (filePath) => {
    if (!filePath) return "";
    if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
      return filePath;
    }
    return `http://localhost:5000${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>
            Service Provider Portal
          </h1>

          <p style={styles.subtitle}>
            Admin Dashboard
          </p>
        </div>

        <button
          onClick={logout}
          style={styles.logout}
        >
          Logout
        </button>
      </header>

      {/* MAIN */}
      <main style={styles.container}>

        <h2>Dashboard Statistics</h2>

        {/* STATISTICS */}
        <div style={styles.stats}>

          <div style={styles.card}>
            <span>Total Providers</span>
            <strong style={styles.number}>
              {stats.total}
            </strong>
          </div>

          <div style={styles.card}>
            <span>Pending</span>
            <strong style={styles.number}>
              {stats.pending}
            </strong>
          </div>

          <div style={styles.card}>
            <span>Approved</span>
            <strong style={styles.number}>
              {stats.approved}
            </strong>
          </div>

          <div style={styles.card}>
            <span>Rejected</span>
            <strong style={styles.number}>
              {stats.rejected}
            </strong>
          </div>

        </div>

        {/* PROVIDERS */}
        <section style={styles.section}>

          <h2>Provider Applications</h2>

          {/* FILTERS */}
          <div style={styles.filters}>

            <input
              type="text"
              placeholder="Search provider..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={styles.input}
            />

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              style={styles.input}
            >
              <option value="">
                All Status
              </option>

              <option value="draft">
                Draft
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>

          </div>

          {/* TABLE */}
          {loading ? (
            <p>Loading providers...</p>
          ) : providers.length === 0 ? (
            <div style={styles.empty}>
              No providers found.
            </div>
          ) : (
            <>
              <div style={styles.tableWrapper}>

                <table style={styles.table}>

                  <thead>
                    <tr>
                      <th style={styles.th}>
                        Name
                      </th>

                      <th style={styles.th}>
                        Email
                      </th>

                      <th style={styles.th}>
                        City
                      </th>

                      <th style={styles.th}>
                        Experience
                      </th>

                      <th style={styles.th}>
                        Status
                      </th>

                      <th style={styles.th}>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {providers.map(
                      (provider) => (
                        <tr
                          key={provider._id}
                        >

                          <td style={styles.td}>
                            {provider.user
                              ?.name ||
                              "N/A"}
                          </td>

                          <td style={styles.td}>
                            {provider.user
                              ?.email ||
                              "N/A"}
                          </td>

                          <td style={styles.td}>
                            {provider.city ||
                              "N/A"}
                          </td>

                          <td style={styles.td}>
                            {provider.experience ||
                              0}{" "}
                            years
                          </td>

                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.status,
                                ...(provider.status ===
                                "approved"
                                  ? styles.approvedStatus
                                  : provider.status ===
                                    "pending"
                                  ? styles.pendingStatus
                                  : provider.status ===
                                    "rejected"
                                  ? styles.rejectedStatus
                                  : {}),
                              }}
                            >
                              {provider.status}
                            </span>
                          </td>

                          <td style={styles.td}>

                            <button
                              onClick={() =>
                                viewProvider(
                                  provider._id
                                )
                              }
                              style={
                                styles.view
                              }
                            >
                              View Details
                            </button>

                            {provider.status ===
                              "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    approveProvider(
                                      provider._id
                                    )
                                  }
                                  style={
                                    styles.approve
                                  }
                                >
                                  Approve
                                </button>

                                <button
                                  onClick={() =>
                                    rejectProvider(
                                      provider._id
                                    )
                                  }
                                  style={
                                    styles.reject
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            )}

                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* PAGINATION */}
              <div style={styles.pagination}>

                <button
                  onClick={() =>
                    changePage(page - 1)
                  }
                  disabled={page === 1}
                  style={styles.pageButton}
                >
                  Previous
                </button>

                <span>
                  Page {page} of{" "}
                  {pagination.totalPages ||
                    1}
                </span>

                <button
                  onClick={() =>
                    changePage(page + 1)
                  }
                  disabled={
                    page >=
                    pagination.totalPages
                  }
                  style={styles.pageButton}
                >
                  Next
                </button>

              </div>
            </>
          )}

        </section>

      </main>

      {/* PROVIDER DETAILS MODAL */}
      {selectedProvider && (
        <div style={styles.overlay}>

          <div style={styles.modal}>

            <div style={styles.modalHeader}>

              <h2>
                Provider Details
              </h2>

              <button
                onClick={() =>
                  setSelectedProvider(null)
                }
                style={styles.close}
              >
                ×
              </button>

            </div>

            {detailsLoading ? (
              <p>Loading...</p>
            ) : (
              <>

                {/* BASIC INFO */}
                <div style={styles.detailGrid}>

                  <div>
                    <strong>
                      Name
                    </strong>

                    <p>
                      {selectedProvider.user
                        ?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <strong>
                      Email
                    </strong>

                    <p>
                      {selectedProvider.user
                        ?.email || "N/A"}
                    </p>
                  </div>

                  <div>
                    <strong>
                      Phone
                    </strong>

                    <p>
                      {selectedProvider.phone ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <strong>
                      City
                    </strong>

                    <p>
                      {selectedProvider.city ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <strong>
                      State
                    </strong>

                    <p>
                      {selectedProvider.state ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <strong>
                      Pincode
                    </strong>

                    <p>
                      {selectedProvider.pincode ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <strong>
                      Experience
                    </strong>

                    <p>
                      {selectedProvider.experience ||
                        0}{" "}
                      years
                    </p>
                  </div>

                  <div>
                    <strong>
                      Status
                    </strong>

                    <p>
                      {selectedProvider.status}
                    </p>
                  </div>

                </div>

                {/* ADDRESS */}
                <div style={styles.detailBlock}>

                  <strong>
                    Address
                  </strong>

                  <p>
                    {selectedProvider.address ||
                      "N/A"}
                  </p>

                </div>

                {/* SERVICES */}
                <div style={styles.detailBlock}>

                  <strong>
                    Service Categories
                  </strong>

                  <p>
                    {selectedProvider
                      .serviceCategories
                      ?.join(", ") ||
                      "N/A"}
                  </p>

                </div>

                {/* SKILLS */}
                <div style={styles.detailBlock}>

                  <strong>
                    Skills
                  </strong>

                  <p>
                    {selectedProvider.skills
                      ?.join(", ") ||
                      "N/A"}
                  </p>

                </div>

                {/* BIO */}
                <div style={styles.detailBlock}>

                  <strong>
                    Bio
                  </strong>

                  <p>
                    {selectedProvider.bio ||
                      "N/A"}
                  </p>

                </div>

                {/* PROFILE PHOTO */}
                <div style={styles.detailBlock}>

                  <h3>
                    Profile Photo
                  </h3>

                  {selectedProvider.profilePhoto ? (
                    <img
                      src={getFileUrl(selectedProvider.profilePhoto)}
                      alt="Provider Profile"
                      style={styles.profileImage}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const message = e.currentTarget.nextElementSibling;
                        if (message) message.style.display = "block";
                      }}
                    />
                  ) : null}

                  {selectedProvider.profilePhoto && (
                    <p style={{ display: "none", color: "#dc2626" }}>
                      Profile photo could not be loaded. Please verify the uploaded file exists in the server uploads folder.
                    </p>
                  )}

                  {!selectedProvider.profilePhoto && (
                    <p>No profile photo uploaded.</p>
                  )}

                </div>

                {/* DOCUMENTS */}
                <div style={styles.detailBlock}>

                  <h3>
                    Verification Documents
                  </h3>

                  {selectedProvider
                    .verificationDocuments
                    ?.length > 0 ? (
                    <div>

                      {selectedProvider.verificationDocuments.map(
                        (document, index) => (
                          <div
                            key={index}
                            style={
                              styles.document
                            }
                          >

                            <span>
                              📄{" "}
                              {document.name}
                            </span>

                            <a
                              href={getFileUrl(document.path)}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={
                                styles.documentLink
                              }
                            >
                              View Document
                            </a>

                          </div>
                        )
                      )}

                    </div>
                  ) : (
                    <p>
                      No verification documents
                      uploaded.
                    </p>
                  )}

                </div>

                {/* REJECTION REMARK */}
                {selectedProvider
                  .rejectionRemark && (
                  <div
                    style={
                      styles.remark
                    }
                  >
                    <strong>
                      Rejection Remark:
                    </strong>

                    <p>
                      {
                        selectedProvider.rejectionRemark
                      }
                    </p>
                  </div>
                )}

                {/* ACTIONS */}
                {selectedProvider.status ===
                  "pending" && (
                  <div
                    style={
                      styles.modalActions
                    }
                  >

                    <button
                      onClick={() =>
                        approveProvider(
                          selectedProvider._id
                        )
                      }
                      style={
                        styles.approveLarge
                      }
                    >
                      Approve Provider
                    </button>

                    <button
                      onClick={() =>
                        rejectProvider(
                          selectedProvider._id
                        )
                      }
                      style={
                        styles.rejectLarge
                      }
                    >
                      Reject Provider
                    </button>

                  </div>
                )}

              </>
            )}

          </div>

        </div>
      )}

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

  title: {
    margin: 0,
    fontSize: "26px",
  },

  subtitle: {
    margin: "5px 0 0",
    opacity: 0.8,
  },

  logout: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  container: {
    padding: "30px 40px",
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "35px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  number: {
    fontSize: "28px",
  },

  section: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.05)",
  },

  filters: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
  },

  input: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    minWidth: "220px",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    background: "#f1f5f9",
    padding: "14px",
    textAlign: "left",
  },

  td: {
    padding: "14px",
    borderBottom:
      "1px solid #eee",
  },

  status: {
    background: "#e2e8f0",
    padding: "5px 10px",
    borderRadius: "15px",
    fontSize: "13px",
    textTransform: "capitalize",
  },

  approvedStatus: {
    background: "#dcfce7",
    color: "#166534",
  },

  pendingStatus: {
    background: "#fef3c7",
    color: "#92400e",
  },

  rejectedStatus: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  view: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    marginRight: "6px",
    cursor: "pointer",
  },

  approve: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    marginRight: "6px",
    cursor: "pointer",
  },

  reject: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  empty: {
    padding: "30px",
    textAlign: "center",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "25px",
  },

  pageButton: {
    padding: "8px 15px",
    border: "1px solid #ddd",
    background: "white",
    borderRadius: "5px",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background:
      "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
  },

  modal: {
    background: "white",
    width: "100%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "12px",
    padding: "30px",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom:
      "1px solid #eee",
    marginBottom: "25px",
  },

  close: {
    border: "none",
    background: "transparent",
    fontSize: "30px",
    cursor: "pointer",
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns:
      "1fr 1fr",
    gap: "20px",
  },

  detailBlock: {
    marginTop: "20px",
    paddingTop: "15px",
    borderTop:
      "1px solid #eee",
  },

  profileImage: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
    marginTop: "10px",
  },

  document: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "6px",
    marginBottom: "8px",
  },

  documentLink: {
    color: "#2563eb",
    fontWeight: "bold",
    textDecoration: "none",
  },

  remark: {
    marginTop: "20px",
    padding: "15px",
    background: "#fef2f2",
    borderRadius: "8px",
    color: "#991b1b",
  },

  modalActions: {
    display: "flex",
    gap: "10px",
    marginTop: "25px",
  },

  approveLarge: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  rejectLarge: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AdminDashboard;