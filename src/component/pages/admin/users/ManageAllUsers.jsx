import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  UserCheck,
  UserX,
  ExternalLink,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import ButtonComponent from "../../../ui/ButtonComponent";
import TableComponent from "../../../ui/TableComponent";
import InputComponent from "../../../ui/InputComponent";
import { getAllUsers, toggleUsersStatus, accessUser } from "../../../../api/admin/users.api";
import { useSnackbar } from "../../../../context/SnackBarContext";
import { adminRoutes, userRoutes } from "../../../../constants/router";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getToken, getRole } from "../../../../utils/authStorage";

const StatusPill = ({ blocked, onClick }) => (
  <ButtonComponent
    onClick={onClick}
    variant="text"
    sx={{
      minWidth: "auto",
      borderRadius: "9999px",
      padding: "4px 10px",
      height: "22px",
      fontSize: "11px",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      backgroundColor: !blocked ? "#D1FAE5" : "#FEE2E2",
      color: !blocked ? "#065F46" : "#991B1B",
      "&:hover": {
        opacity: 0.8,
        backgroundColor: !blocked ? "#D1FAE5" : "#FEE2E2",
      },
    }}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        !blocked ? "bg-[#059669]" : "bg-[#DC2626]"
      }`}
    />
    {!blocked ? "Active" : "Blocked"}
  </ButtonComponent>
);

const VerifiedBadge = ({ isVerified }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[12.5px] font-medium ${
        isVerified ? "text-[var(--whiold-600)]" : "text-[#C0392B]"
      }`}
    >
      {isVerified ? (
        <><ShieldCheck size={14}/> Verified</>
      ) : (
        <><ShieldAlert size={14}/> Unverified</>
      )}
    </span>
  );
};

const RowActions = ({ onAccess, onToggle, blocked }) => (
  <div className="flex items-center gap-2">
    <ButtonComponent
      type="button"
      variant="outlined"
      onClick={onAccess}
      startIcon={<ExternalLink size={14} />}
      sx={{
        color: "var(--whiold-text-body)",
        fontSize: "12px",
        fontWeight: 500,
        height: "32px",
        minWidth: "110px",
        borderRadius: "8px",
        borderColor: "var(--whiold-border)",
        "&:hover": {
          backgroundColor: "var(--whiold-bg-soft)",
          color: "var(--whiold-primary)",
          borderColor: "var(--whiold-border)",
        },
      }}
    >
      Access
    </ButtonComponent>
    <ButtonComponent
      type="button"
      variant="outlined"
      onClick={onToggle}
      startIcon={blocked ? <UserCheck size={14} /> : <UserX size={14} />}
      sx={{
        fontSize: "12px",
        fontWeight: 500,
        height: "32px",
        minWidth: "120px",
        borderRadius: "8px",
        borderColor: "var(--whiold-border)",
        color: blocked ? "#065F46" : "#991B1B",
        "&:hover": {
          backgroundColor: blocked ? "#D1FAE5" : "#FEE2E2",
          borderColor: "var(--whiold-border)",
        },
      }}
    >
      {blocked ? "Unblock" : "Block"}
    </ButtonComponent>
  </div>
);

const ManageAllUsers = () => {
  const { showSnackbar } = useSnackbar();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(Array.isArray(res?.data) ? res.data : res?.data?.data || []);
    } catch (error) {
      showSnackbar("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    try {
      const res = await toggleUsersStatus(user._id);

      if (res?.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === user._id ? { ...u, blocked: !u.blocked } : u
          )
        );
        showSnackbar("User status updated", "success");
      } else {
        showSnackbar(res?.message || "Status update failed", "error");
      }
    } catch {
      showSnackbar("Failed to update user status", "error");
    }
  };

  const handleAccessUser = async (userId) => {
    if (!userId) {
      showSnackbar("User not found", "error");
      return;
    }
    // debugger
    try {
      const res = await accessUser(userId);

      if (res?.success) {
        showSnackbar(res?.message || "Access granted", "success");
        
        sessionStorage.setItem("adminToken", getToken());
        sessionStorage.setItem("adminRole", getRole());
        
        const token = res?.data?.token || res?.token;
        const userData = res?.data?.user || res?.user || res?.data;
        
        login(token, userData);
        sessionStorage.setItem("isImpersonating", true);
        navigate(userRoutes.DASHBOARD);
      } else {
        showSnackbar(res?.message || "Access failed", "error");
      }
    } catch (error) {
      showSnackbar(error?.message || "Failed to access user", "error");
    }
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search.trim() ||
        u.name?.toLowerCase().includes(searchLower) ||
        u.email?.toLowerCase().includes(searchLower) ||
        u.userId?.toLowerCase().includes(searchLower) ||
        u.mobile?.toLowerCase().includes(searchLower);
      
      return matchesSearch;
    });
  }, [users, search]);

  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "User",
        flex: 1.2,
        minWidth: 220,
        renderCell: (params) => (
          <div className="flex flex-col py-1 justify-center">
            <p className="text-[13.5px] font-semibold text-[var(--whiold-text-heading)] leading-snug">
              {params.row.name || "-"}
            </p>
            <p className="font-mono text-[11px] text-[var(--whiold-text-muted)] mt-0.5">
              ID: {params.row.userId || "-"}
            </p>
          </div>
        ),
      },
      {
        field: "email",
        headerName: "Contact",
        flex: 1.2,
        minWidth: 240,
        renderCell: (params) => (
          <div className="flex flex-col py-1 justify-center">
            <p className="text-[13px] text-[var(--whiold-text-body)] leading-snug break-all">{params.row.email || "-"}</p>
            <p className="text-[12px] text-[var(--whiold-text-muted)] mt-0.5">{params.row.mobile || "-"}</p>
          </div>
        ),
      },
      {
        field: "wallet",
        headerName: "Wallet",
        flex: 0.7,
        minWidth: 120,
        valueGetter: (params, row) => Number(row?.wallets?.fundWallet ?? 0),
        renderCell: (params) => (
          <span className="text-[13.5px] font-semibold text-[var(--whiold-text-heading)]">
            ₹{Number(params.row?.wallets?.fundWallet ?? 0).toLocaleString("en-IN")}
          </span>
        ),
      },
      {
        field: "isVerified",
        headerName: "Verified",
        flex: 0.7,
        minWidth: 140,
        renderCell: (params) => <VerifiedBadge isVerified={params.row.isVerified} />,
      },
      {
        field: "blocked",
        headerName: "Status",
        flex: 0.7,
        minWidth: 140,
        renderCell: (params) => (
          <StatusPill blocked={params.row.blocked} onClick={() => handleToggleStatus(params.row)} />
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        minWidth: 260,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <RowActions
            onAccess={() => handleAccessUser(params.row._id)}
            onToggle={() => handleToggleStatus(params.row)}
            blocked={params.row.blocked}
          />
        ),
      },
    ],
    []
  );

  return (
    <div className="mx-auto">
      {/* ── Header ── */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--whiold-text-heading)]">Manage All Users</h1>
          <p className="text-[13.5px] text-[var(--whiold-text-body)]">
            {filtered.length} user{filtered.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="flex gap-3">
          <ButtonComponent variant="outlined" onClick={fetchUsers} sx={{ alignSelf: "flex-start", height: "40px" }}>
            Refresh
          </ButtonComponent>
        </div>
      </div>

      {/* ── Filters ── */}
      {/* <div className="mb-5 grid grid-cols-1 gap-3 rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-4 sm:grid-cols-[minmax(0,1fr)]">
        <InputComponent
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name, email, mobile or ID"
          startIcon={<Search size={16} className="text-[var(--whiold-text-muted)]" />}
          fullWidth
          sx={{
            maxWidth: "448px",
            "& .MuiOutlinedInput-root": {
              height: "44px",
              borderRadius: "var(--whiold-radius-sm)",
            },
          }}
        />
      </div> */}

      {/* ── Table (via shared TableComponent) ── */}
      <TableComponent
        title="Users"
        rows={filtered}
        columns={columns}
        loading={loading}
      />
    </div>
  );
};

export default ManageAllUsers;