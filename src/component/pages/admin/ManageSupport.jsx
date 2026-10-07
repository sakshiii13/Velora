import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import {
  getAllTicketsApi,
  updateTicketStatusApi,
} from "../../../api/admin/support.api";
import { useAuth } from "../../../context/AuthContext";
import TableComponent from "../../ui/TableComponent";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Headphones, Search, CheckCircle2, Clock } from "lucide-react";
import ButtonComponent from "../../ui/ButtonComponent";

const ManageSupport = () => {
  const { showLoader, hideLoader } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalStatus, setModalStatus] = useState("pending");
  const [modalMessage, setModalMessage] = useState("");

  const fetchAllTickets = async () => {
    showLoader();
    try {
      const res = await getAllTicketsApi();
      if (res?.success) {
        setTickets(res?.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      setModalStatus(selectedTicket.status || "pending");
      setModalMessage("");
    }
  }, [selectedTicket]);

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t._id?.toLowerCase().includes(search.toLowerCase()) ||
        t.subject?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All Status" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  const handleChangeStatus = async (status, message) => {
    showLoader();
    try {
      const res = await updateTicketStatusApi(
        selectedTicket._id,
        status,
        message,
      );
      if (res?.success) {
        fetchAllTickets();
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.message || `Status updated to ${status}!`,
        });
        setModalMessage("");
        setOpenDetailModal(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res?.message || "Failed to update status",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status",
      });
    } finally {
      hideLoader();
    }
  };

  const stats = useMemo(() => {
    let pendingCount = 0;
    let resolvedCount = 0;
    tickets.forEach((t) => {
      if (t.status === "pending" || t.status === "Pending") pendingCount++;
      else if (t.status === "resolved" || t.status === "Resolved")
        resolvedCount++;
    });
    return {
      pending: pendingCount,
      resolved: resolvedCount,
      total: tickets.length,
    };
  }, [tickets]);

  const columns = [
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      renderCell: (params) => (
        <span className="text-[var(--whiold-text-body)] font-medium">
          {params.row.category}
        </span>
      ),
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1.5,
      renderCell: (params) => (
        <span className="text-[var(--whiold-text-heading)] font-semibold">
          {params.row.subject}
        </span>
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
      renderCell: (params) => {
        const priorityColors = {
          Standard: "bg-blue-50 text-blue-600 border-blue-200",
          High: "bg-orange-50 text-orange-700 border-orange-200",
          Urgent: "bg-red-50 text-red-700 border-red-200",
        };

        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              priorityColors[params.row.priority] || priorityColors.Standard
            }`}
          >
            {params.row.priority}
          </span>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const displayStatus =
          params.row.status === "pending" || params.row.status === "Pending"
            ? "Pending"
            : params.row.status === "resolved"
              ? "Resolved"
              : params.row.status;

        const statusColors = {
          Pending: "bg-amber-50 text-amber-700 border border-amber-200",
          Resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        };

        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              statusColors[displayStatus]
            }`}
          >
            {displayStatus}
          </span>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 140,
      renderCell: (params) => (
        <span className="text-xs text-[var(--whiold-text-muted)]">
          {new Date(params.row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      minWidth: 190,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <ButtonComponent
          variant="contained"
          color="primary"
          size="small"
          onClick={() => {
            setSelectedTicket(params.row);
            setOpenDetailModal(true);
          }}
          className="px-3 py-1 bg-[var(--whiold-primary)] text-white text-xs rounded shadow-sm hover:bg-[var(--whiold-primary-hover)] transition-colors"
        >
          View / Manage
        </ButtonComponent>
      ),
    },
  ];

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden px-3 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--whiold-text-heading)] tracking-tight">
          Manage Support Tickets
        </h1>
        <p className="text-xs sm:text-sm text-[var(--whiold-text-body)] mt-1">
          Review, update, and resolve user support inquiries
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
        {[
          {
            label: "Pending Tickets",
            val: stats.pending,
            color: "#F59E0B",
            icon: Clock,
          },
          {
            label: "Resolved",
            val: stats.resolved,
            color: "#10B981",
            icon: CheckCircle2,
          },
          {
            label: "Total Received",
            val: stats.total,
            color: "#BA704F",
            icon: Headphones,
          },
        ].map((item, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl h-24 p-4 border border-[var(--whiold-border)] bg-[var(--whiold-bg)] shadow-sm"
          >
            <div
              className="absolute right-3 top-3 opacity-[0.3]"
              style={{ color: item.color }}
            >
              <item.icon size={44} className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>
            <div className="flex flex-col justify-between h-full relative z-10">
              <span className="text-[11px] font-bold text-[var(--whiold-text-muted)] uppercase tracking-wider">
                {item.label}
              </span>
              <span className="text-xl sm:text-2xl font-black text-[var(--whiold-text-heading)]">
                {item.val}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* <h3 className="text-base sm:text-lg font-bold text-[var(--whiold-text-heading)] tracking-wide">
            All User Tickets
          </h3> */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            {/* <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--whiold-text-muted)]" />
              <input
                type="text"
                placeholder="Search ticket..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-[var(--whiold-bg-input)] border border-[var(--whiold-border)] text-[var(--whiold-text-heading)] text-xs focus:border-[var(--whiold-primary)] outline-none"
              />
            </div> */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-40 h-10 px-3 rounded-xl bg-[var(--whiold-bg-input)] border border-[var(--whiold-border)] text-[var(--whiold-text-heading)] text-xs font-semibold focus:border-[var(--whiold-primary)] outline-none"
            >
              <option value="All Status">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {filteredTickets.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[720px]">
              <TableComponent
                title="All User Tickets"
                rows={filteredTickets}
                columns={columns}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-[var(--whiold-bg-soft)] flex items-center justify-center text-[var(--whiold-primary)] mb-4">
              <Headphones size={28} />
            </div>
            <h4 className="text-base font-bold text-[var(--whiold-text-heading)] mb-1">
              No Tickets Found
            </h4>
            <p className="text-xs text-[var(--whiold-text-muted)] max-w-xs">
              There are no user support tickets matching the filter criteria.
            </p>
          </div>
        )}
      </div>

      {openDetailModal &&
        selectedTicket &&
        createPortal(
          <div className="fixed inset-0 z-[1550] flex items-center justify-center p-3 sm:p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpenDetailModal(false)}
            />
            <div className="relative bg-[var(--whiold-bg)] rounded-2xl shadow-xl w-full max-w-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-4 sm:p-5 border-b border-[var(--whiold-border)] flex items-center justify-between gap-2">
                <h2 className="text-sm sm:text-base font-bold text-[var(--whiold-text-heading)] truncate">
                  {selectedTicket.subject}
                </h2>
                <IconButton
                  onClick={() => setOpenDetailModal(false)}
                  className="shrink-0"
                >
                  <CloseIcon />
                </IconButton>
              </div>
              <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 overflow-y-auto">
                <div className="p-4 bg-[var(--whiold-bg-soft)] rounded-xl flex flex-wrap sm:flex-nowrap flex-col sm:flex-row gap-4 sm:gap-6">
                  <div>
                    <span className="text-[10px] text-[var(--whiold-text-muted)] uppercase font-bold tracking-wider">
                      Category
                    </span>
                    <span className="font-bold text-[var(--whiold-text-heading)] block">
                      {selectedTicket.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--whiold-text-muted)] uppercase font-bold tracking-wider">
                      Priority
                    </span>
                    <span className="font-bold text-[var(--whiold-text-heading)] block">
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--whiold-text-muted)] uppercase font-bold tracking-wider">
                      Status
                    </span>
                    <span className="font-bold text-[var(--whiold-primary)] block">
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[var(--whiold-border)]">
                  <div className="text-[10px] text-[var(--whiold-text-muted)] mb-2 font-semibold uppercase tracking-wider">
                    Description
                  </div>
                  <p className="text-[var(--whiold-text-heading)] text-sm font-medium whitespace-pre-wrap break-words">
                    {selectedTicket.message}
                  </p>
                </div>

                {selectedTicket?.status === "pending" ||
                selectedTicket?.status === "Pending" ? (
                  <div className="p-4 bg-[var(--whiold-bg-soft)] rounded-xl space-y-4 border border-[var(--whiold-border)]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-[11px] font-bold text-[var(--whiold-text-muted)] uppercase tracking-wider">
                        Update Inquiry Status
                      </span>
                      <select
                        value={modalStatus}
                        onChange={(e) => setModalStatus(e.target.value)}
                        className="w-full sm:w-auto h-9 px-3 rounded-lg bg-[var(--whiold-bg-input)] border border-[var(--whiold-border)] text-[var(--whiold-text-heading)] text-xs focus:border-[var(--whiold-primary)] outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-[var(--whiold-text-muted)] font-bold uppercase tracking-wider block">
                        Response Message (Sent to user)
                      </span>
                      <textarea
                        rows={3}
                        value={modalMessage}
                        onChange={(e) => setModalMessage(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[var(--whiold-bg-input)] border border-[var(--whiold-border)] text-[var(--whiold-text-heading)] text-xs focus:border-[var(--whiold-primary)] outline-none resize-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <ButtonComponent
                        onClick={() =>
                          handleChangeStatus(modalStatus, modalMessage)
                        }
                        disabled={!modalMessage.trim()}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[var(--whiold-primary)] text-white text-xs font-bold shadow-[var(--whiold-shadow-btn)] hover:bg-[var(--whiold-primary-hover)] disabled:opacity-50"
                      >
                        Submit Status & Message
                      </ButtonComponent>
                    </div>
                  </div>
                ) : (
                  selectedTicket.response && (
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="text-[10px] text-emerald-700 mb-2 font-bold uppercase tracking-wider">
                        🛡️ Support Response
                      </div>
                      <p className="text-emerald-900 text-sm font-semibold whitespace-pre-wrap break-words">
                        {selectedTicket.response}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default ManageSupport;