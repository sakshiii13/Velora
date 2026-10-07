import React, { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import {
  createTicketApi,
  getUserTicketsApi,
} from "../../../api/user/support.api";
import { useAuth } from "../../../context/AuthContext";
import TableComponent from "../../ui/TableComponent";
import ButtonComponent from "../../ui/ButtonComponent";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Headphones,
  HelpCircle,
  PlusCircle,
  Search,
  CheckCircle2,
  Clock,
  User,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Users,
  CreditCard,
  Wrench,
} from "lucide-react";

if (typeof document !== "undefined" && !document.getElementById("swal-zindex-fix")) {
  const style = document.createElement("style");
  style.id = "swal-zindex-fix";
  style.innerHTML = `.swal2-container { z-index: 2000 !important; }`;
  document.head.appendChild(style);
}

// connected HTML5 canvas constellation particle backdrop, using whiold brand colors
const BrandParticles = ({ count = 40 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeObserver = new ResizeObserver(() => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Whiold brand terracotta colors
    const colors = ["#BA704F", "#C57A58", "#D59E86"];
    const particles = Array.from({ length: count }, () => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * (canvas.width || 800),
        y: Math.random() * (canvas.height || 600),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2 + 1,
        color: color,
        opacity: Math.random() * 0.3 + 0.1,
        pulseSpeed: Math.random() * 0.015 + 0.005,
        pulseDir: 1,
      };
    });

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.05;
            ctx.strokeStyle = particles[i].color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.opacity += p.pulseSpeed * p.pulseDir;
        if (p.opacity > 0.5) p.pulseDir = -1;
        if (p.opacity < 0.1) p.pulseDir = 1;

        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 2;
        ctx.shadowColor = p.color;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full z-0 opacity-40"
      style={{ willChange: "transform" }}
    />
  );
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const categoryIcons = {
  User,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  Users,
  CreditCard,
  Wrench,
  HelpCircle,
};

const categories = [
  { id: "Account Issues", label: "Account Issues", iconName: "User", color: "#6366F1", bg: "rgba(99, 102, 241, 0.1)", border: "rgba(99, 102, 241, 0.2)" },
  { id: "Deposits", label: "Deposits", iconName: "ArrowDownCircle", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", border: "rgba(16, 185, 129, 0.2)" },
  { id: "Withdrawals", label: "Withdrawals", iconName: "ArrowUpCircle", color: "#06B6D4", bg: "rgba(6, 182, 212, 0.1)", border: "rgba(6, 182, 212, 0.2)" },
  { id: "Orders & Shipping", label: "Orders & Shipping", iconName: "TrendingUp", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", border: "rgba(245, 158, 11, 0.2)" },
  { id: "Product Queries", label: "Product Queries", iconName: "Users", color: "#D946EF", bg: "rgba(217, 70, 239, 0.1)", border: "rgba(217, 70, 239, 0.2)" },
  { id: "Payment Issues", label: "Payment Issues", iconName: "CreditCard", color: "#F43F5E", bg: "rgba(244, 63, 94, 0.1)", border: "rgba(244, 63, 94, 0.2)" },
  { id: "Technical Issues", label: "Technical Issues", iconName: "Wrench", color: "#F97316", bg: "rgba(249, 115, 22, 0.1)", border: "rgba(249, 115, 22, 0.2)" },
  { id: "Other", label: "Other", iconName: "HelpCircle", color: "#64748B", bg: "rgba(100, 116, 139, 0.1)", border: "rgba(100, 116, 139, 0.2)" },
];

const priorityLevels = ["Standard", "High", "Urgent"];

const UserSupport = () => {
  const { showLoader, hideLoader } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredCat, setHoveredCat] = useState(null);

  // Form state
  const [formCategory, setFormCategory] = useState("Account Issues");
  const [formSubject, setFormSubject] = useState("");
  const [formPriority, setFormPriority] = useState("Standard");
  const [formMessage, setFormMessage] = useState("");
  const [formAttachment, setFormAttachment] = useState(null);

  const fetchTickets = async () => {
  showLoader();

  try {
    const res = await getUserTicketsApi();

    console.log("Full Response :", res);
    console.log("Success :", res.success);
    console.log("Data :", res.data);

    if (res?.success) {
      setTickets(res.data || []);
    }
  } catch (err) {
    console.log(err);
  } finally {
    hideLoader();
  }
};
  useEffect(() => {
    fetchTickets();
  }, []);

  const filteredTickets = useMemo(() => {
    
    return tickets.filter((t) => {
      const matchesSearch =
        t._id?.toLowerCase().includes(search.toLowerCase()) ||
        t.subject?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  console.log("Tickets State", tickets);
console.log("Filtered Tickets", filteredTickets);

  const stats = useMemo(() => {
    let openCount = 0;
    let inProgressCount = 0;
    let resolvedCount = 0;
    tickets.forEach((t) => {
      if (t.status === "Open") openCount++;
      else if (t.status === "In Progress" || t.status === "pending" || t.status === "Pending") inProgressCount++;
      else if (t.status === "Resolved" || t.status === "resolved") resolvedCount++;
    });
    return {
      open: openCount,
      inProgress: inProgressCount,
      resolved: resolvedCount,
      total: tickets.length,
    };
  }, [tickets]);

  const triggerCreateModal = (category = "Account Issues") => {
    setFormCategory(category);
    setFormSubject(category);
    setFormPriority("Standard");
    setFormMessage("");
    setFormAttachment(null);
    setOpenCreateModal(true);
  };

  const handleCreateTicket = async () => {
    if (!formSubject.trim()) {
      Swal.fire({ icon: "error", title: "Error", text: "Subject is required" });
      return;
    }
    if (!formMessage.trim()) {
      Swal.fire({ icon: "error", title: "Error", text: "Message details are required" });
      return;
    }

    showLoader();
    try {
      const payload = {
        category: formCategory,
        subject: formSubject,
        priority: formPriority,
        message: formMessage,
        attachment: formAttachment,
      };
      const res = await createTicketApi(payload);
      if (res?.success) {
        Swal.fire({ icon: "success", title: "Success", text: res.message || "Support ticket submitted!" });
        setOpenCreateModal(false);
        fetchTickets();
      } else {
        Swal.fire({ icon: "error", title: "Error", text: res?.message || "Failed to create ticket" });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error", text: err.message || "Failed to create ticket" });
    } finally {
      hideLoader();
    }
  };

  const handleViewTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setOpenDetailModal(true);
  };

  // NOTE: TableComponent renders MUI DataGrid under the hood, so every
  // column here must use the DataGrid shape: field + headerName + renderCell.
  // (The old "header"/"render" entries were a different, unsupported shape —
  // that's why category/subject rendered but priority/status/date/action didn't.)
  // Field names below match the actual API response: category, subject,
  // priority, status, createdAt.
  const columns = [
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <span className="text-[var(--whiold-text-body)] font-medium">{params.row.category}</span>
      ),
    },
    {
      field: "subject",
      headerName: "Subject",
      flex: 1.5,
      minWidth: 180,
      renderCell: (params) => (
        <span className="text-[var(--whiold-text-heading)] font-semibold truncate max-w-[200px] block">
          {params.row.subject}
        </span>
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 120,
      minWidth: 120,
      renderCell: (params) => {
        const priorityColors = {
          Standard: "bg-blue-50 text-blue-600 border border-blue-200",
          High: "bg-orange-50 text-orange-700 border border-orange-200",
          Urgent: "bg-red-50 text-red-700 border border-red-200 animate-pulse",
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
      minWidth: 130,
      renderCell: (params) => {
        const raw = params.row.status;
        const displayStatus =
          raw === "pending" || raw === "Pending" ? "In Progress" : raw === "resolved" ? "Resolved" : raw;
        const statusColors = {
          Open: "bg-[var(--whiold-primary-soft)] text-[var(--whiold-primary)] border-[var(--whiold-primary)]/20",
          "In Progress": "bg-amber-50 text-amber-700 border border-amber-200",
          Resolved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        };
        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
              statusColors[displayStatus] || statusColors.Open
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
      minWidth: 140,
      renderCell: (params) => (
        <span className="text-[var(--whiold-text-muted)] text-xs">
          {params.row.createdAt ? new Date(params.row.createdAt).toLocaleDateString() : ""}
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 110,
      minWidth: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <button
          onClick={() => handleViewTicket(params.row)}
          className="px-3 py-1 bg-[var(--whiold-primary)] text-white text-xs rounded shadow-sm hover:bg-[var(--whiold-primary-hover)] transition-colors"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--whiold-text-heading)] tracking-tight flex items-center gap-3">
            <span>Support Center</span>
          </h1>
          <p className="text-sm text-[var(--whiold-text-body)] mt-1">Get help with your account and orders</p>
        </div>
        <button
          onClick={() => triggerCreateModal()}
          className="h-11 px-5 rounded-xl bg-[var(--whiold-primary)] hover:bg-[var(--whiold-primary-hover)] text-white font-bold text-sm shadow-[var(--whiold-shadow-btn)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-none"
        >
          <PlusCircle size={16} />
          New Ticket
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {[
          { label: "In Progress", val: stats.inProgress, color: "#F59E0B", icon: Clock },
          { label: "Resolved", val: stats.resolved, color: "#10B981", icon: CheckCircle2 },
          { label: "Total Tickets", val: stats.total, color: "#BA704F", icon: Headphones },
        ].map((item, i) => {
          const isHovered = hoveredCard === i;
          const Icon = item.icon;
          return (
            <div
              key={i}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group/stat relative overflow-hidden rounded-2xl h-28 p-4 border border-[var(--whiold-border)] bg-[var(--whiold-bg)] transition-all duration-500 hover:-translate-y-1.5 cursor-default"
              style={{
                borderColor: isHovered ? item.color : "var(--whiold-border)",
                boxShadow: isHovered ? `0 12px 30px -4px ${hexToRgba(item.color, 0.25)}` : "0 4px 15px rgba(0,0,0,0.03)",
              }}
            >
              <BrandParticles count={6} />
              
              <div className="flex justify-between items-start relative z-10">
                <span className="text-[10px] font-bold text-[var(--whiold-text-muted)] group-hover/stat:text-[var(--whiold-text-heading)] uppercase tracking-wider transition-colors duration-300">
                  {item.label}
                </span>
                <div className="w-8 h-8 flex items-center justify-center transition-all duration-500 text-[var(--whiold-text-muted)] group-hover/stat:text-[var(--whiold-primary)]">
                  <Icon size={24} className="transition-transform duration-500 group-hover/stat:scale-110" />
                </div>
              </div>

              <div className="mt-3 relative z-10">
                <span className="text-2xl font-black tracking-tight text-[var(--whiold-text-heading)]">
                  {item.val}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid of Options */}
      <div className="rounded-2xl p-6 border border-[var(--whiold-border)] bg-[var(--whiold-bg)] relative overflow-hidden">
        <BrandParticles count={15} />
        <h3 className="text-sm font-bold text-[var(--whiold-text-heading)] uppercase tracking-wider mb-5 relative z-10">
          What do you need help with?
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 relative z-10">
          {categories.map((cat, i) => {
            const IconComponent = categoryIcons[cat.iconName] || HelpCircle;
            const isHovered = hoveredCat === i;
            return (
              <div
                key={i}
                onClick={() => triggerCreateModal(cat.id)}
                onMouseEnter={() => setHoveredCat(i)}
                onMouseLeave={() => setHoveredCat(null)}
                className="group/cat relative overflow-hidden rounded-xl border p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 h-28 bg-[var(--whiold-bg-soft)]"
                style={{
                  borderColor: isHovered ? cat.color : "var(--whiold-border)",
                  boxShadow: isHovered ? `0 0 15px ${cat.color}15` : "none",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2.5 transition-all duration-300 bg-white"
                  style={{
                    color: isHovered ? cat.color : "var(--whiold-text-muted)",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <IconComponent size={20} />
                </div>
                <span className="text-[11px] font-bold text-[var(--whiold-text-body)] transition-colors duration-300 leading-tight">
                  {cat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tickets Table section */}
      <div className="rounded-2xl border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          {/* <h3 className="text-lg font-bold text-[var(--whiold-text-heading)] tracking-wide">My Tickets</h3> */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--whiold-text-muted)]" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-[var(--whiold-bg-input)] border border-[var(--whiold-border)] text-[var(--whiold-text-heading)] text-xs focus:border-[var(--whiold-primary)] outline-none"
              />
            </div> */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-40 h-10 px-3 rounded-xl bg-[var(--whiold-bg-input)] border border-[var(--whiold-border)] text-[var(--whiold-text-heading)] text-xs font-semibold focus:border-[var(--whiold-primary)] outline-none cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="pending">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        {filteredTickets.length > 0 ? (

          
          <TableComponent
    title="My Tickets"
    rows={filteredTickets}
    columns={columns}
/>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--whiold-bg-soft)] flex items-center justify-center text-[var(--whiold-primary)] mb-4">
              <Headphones size={28} />
            </div>
            <h4 className="text-base font-bold text-[var(--whiold-text-heading)] mb-1">No Tickets Found</h4>
            <p className="text-xs text-[var(--whiold-text-body)] mb-5">You haven't created any support tickets yet.</p>
            <button
              onClick={() => triggerCreateModal()}
              className="h-10 px-5 rounded-lg bg-[var(--whiold-primary)] hover:bg-[var(--whiold-primary-hover)] text-white font-bold text-xs transition-all cursor-pointer border-none shadow-[var(--whiold-shadow-btn)]"
            >
              Create Your First Ticket
            </button>
          </div>
        )}
      </div>

      {/* CREATE MODAL */}
      {openCreateModal && createPortal(
        <div className="fixed inset-0 z-[1550] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpenCreateModal(false)} />
          <div className="relative bg-[var(--whiold-bg)] rounded-2xl shadow-xl w-full max-w-xl z-10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[var(--whiold-border)] flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--whiold-text-heading)]">Create Support Ticket</h2>
              <IconButton onClick={() => setOpenCreateModal(false)}><CloseIcon /></IconButton>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--whiold-text-muted)] uppercase tracking-wider">Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => { setFormCategory(cat.id); setFormSubject(cat.id); }}
                      className={`py-2 px-3 rounded-lg border text-center cursor-pointer text-xs font-semibold ${
                        formCategory === cat.id ? "bg-[var(--whiold-primary-soft)] border-[var(--whiold-primary)] text-[var(--whiold-primary)]" : "bg-[var(--whiold-bg-soft)] border-[var(--whiold-border)] text-[var(--whiold-text-body)]"
                      }`}
                    >
                      {cat.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--whiold-text-muted)] uppercase tracking-wider">Subject *</label>
                <input
                  type="text"
                  placeholder="Brief description"
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-[var(--whiold-bg-input)] border border-[var(--whiold-border)] text-[var(--whiold-text-heading)] text-xs focus:border-[var(--whiold-primary)] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--whiold-text-muted)] uppercase tracking-wider">Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  {priorityLevels.map((p) => (
                    <div
                      key={p}
                      onClick={() => setFormPriority(p)}
                      className={`py-2 rounded-lg border text-center cursor-pointer text-xs font-bold ${
                        formPriority === p ? "bg-[var(--whiold-primary-soft)] border-[var(--whiold-primary)] text-[var(--whiold-primary)]" : "bg-[var(--whiold-bg-soft)] border-[var(--whiold-border)] text-[var(--whiold-text-body)]"
                      }`}
                    >
                      {p}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[var(--whiold-text-muted)] uppercase tracking-wider">Message *</label>
                <textarea
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full p-4 rounded-xl bg-[var(--whiold-bg-input)] border border-[var(--whiold-border)] text-[var(--whiold-text-heading)] text-xs focus:border-[var(--whiold-primary)] outline-none resize-none"
                />
              </div>
              {/* Note: skipping ImageUploadComponent due to complex deps, use generic input if needed, or remove. In the original they used ReusableImageUpload which we saw in whihold-client was ImageUploadComponent.jsx. But since its usage might differ, let's omit the attachment in the frontend for simplicity unless we know the exact props. The user didn't specifically ask for file uploads. Let's just put an input type=file or text. */}
            </div>
            <div className="p-4 border-t border-[var(--whiold-border)] flex items-center justify-between gap-3">
              <button onClick={() => setOpenCreateModal(false)} className="flex-1 h-11 rounded-xl bg-[var(--whiold-bg-soft)] border border-[var(--whiold-border)] text-[var(--whiold-text-body)] font-bold text-sm">Cancel</button>
              <button onClick={handleCreateTicket} className="flex-1 h-11 rounded-xl bg-[var(--whiold-primary)] text-white font-bold text-sm shadow-[var(--whiold-shadow-btn)]">Create Ticket</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* DETAILS MODAL */}
      {openDetailModal && selectedTicket && createPortal(
        <div className="fixed inset-0 z-[1550] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpenDetailModal(false)} />
          <div className="relative bg-[var(--whiold-bg)] rounded-2xl shadow-xl w-full max-w-2xl z-10 overflow-hidden">
            <div className="p-5 border-b border-[var(--whiold-border)] flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--whiold-text-heading)] truncate">{selectedTicket.subject}</h2>
              <IconButton onClick={() => setOpenDetailModal(false)}><CloseIcon /></IconButton>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-3 p-3 bg-[var(--whiold-bg-soft)] rounded-xl text-center text-xs">
                <div><span className="text-[var(--whiold-text-muted)] block text-[10px] uppercase font-bold tracking-wider">Category</span><span className="font-bold text-[var(--whiold-text-heading)] block mt-0.5">{selectedTicket.category}</span></div>
                <div><span className="text-[var(--whiold-text-muted)] block text-[10px] uppercase font-bold tracking-wider">Priority</span><span className="font-bold text-[var(--whiold-text-heading)] block mt-0.5">{selectedTicket.priority}</span></div>
                <div><span className="text-[var(--whiold-text-muted)] block text-[10px] uppercase font-bold tracking-wider">Status</span><span className="font-bold text-[var(--whiold-primary)] block mt-0.5">{selectedTicket.status === "pending" || selectedTicket.status === "Pending" ? "In Progress" : selectedTicket.status === "resolved" ? "Resolved" : selectedTicket.status}</span></div>
              </div>
              <div className="p-4 rounded-xl border border-[var(--whiold-border)]">
                <div className="flex justify-between items-center text-[10px] text-[var(--whiold-text-muted)] mb-2 font-semibold">
                  <span className="uppercase tracking-wider">Description</span>
                  <span>{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-[var(--whiold-text-heading)] text-sm font-medium leading-relaxed whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>
              {selectedTicket.status === "resolved" && selectedTicket.response && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="text-[10px] text-emerald-700 mb-2 font-bold uppercase tracking-wider">🛡️ Support Response</div>
                  <p className="text-emerald-900 text-sm font-semibold leading-relaxed whitespace-pre-wrap">{selectedTicket.response}</p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default UserSupport;