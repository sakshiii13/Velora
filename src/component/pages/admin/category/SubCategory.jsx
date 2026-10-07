import React, { useMemo, useState, useEffect } from "react";
import {
  Box,Stack,Typography,Chip,Avatar,Dialog,DialogContent,DialogTitle,IconButton,Divider,Slide,Fade,Grow,
} from "@mui/material";
import {
  Layers,Plus,Pencil,Trash2,X,ChevronRight,FolderTree,CircleCheck,CircleSlash,
} from "lucide-react";

import TableComponent from "../../../ui/TableComponent";
import ButtonComponent from "../../../ui/ButtonComponent";
import InputComponent from "../../../ui/InputComponent";
import ImageUploadComponent from "../../../../ui/ImageUploadComponent";
import { createSubCategory, editSubCategory, getAllSubCategories, getAllCategories } from "../../../../api/admin/category.api";
import { useAuth } from "../../../../context/AuthContext";
import { useSnackbar } from "../../../../context/SnackBarContext";

const SlideUp = Slide;
const slideProps = { direction: "up" };

const catColor = (name) => {
  if (!name) return "#BA704F";
  const palette = ["#BA704F", "#3B82F6", "#0F9D58", "#9333EA", "#F59E0B", "#F43F5E", "#06B6D4"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % palette.length;
  return palette[idx];
};

const StatusChip = ({ status }) => {
  const isActive = status === true;
  return (
    <Chip
      size="small"
      icon={isActive ? <CircleCheck size={14} /> : <CircleSlash size={14} />}
      label={isActive ? "Active" : "Inactive"}
      sx={{
        height: 26,
        fontWeight: 600,
        fontSize: "12px",
        borderRadius: "8px",
        color: isActive ? "#0F9D58" : "#ff0000",
        backgroundColor: isActive ? "rgba(15,157,88,0.1)" : "rgb(255 162 162 / 63%)",
        "& .MuiChip-icon": { color: "inherit", marginLeft: "8px" },
      }}
    />
  );
};

const StatCard = ({ icon, label, value, accent, delay }) => (
  <Grow in timeout={400 + delay}>
    <Box
      className="flex flex-1 items-center gap-3 rounded-2xl border p-4"
      sx={{ borderColor: "var(--whiold-border)", background: "var(--whiold-bg)", boxShadow: "var(--whiold-shadow-card)", minWidth: 200 }}
    >
      <Box className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl" sx={{ background: accent.soft, color: accent.solid }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: 20, fontWeight: 700, color: "var(--whiold-text-heading)", lineHeight: 1.1 }}>{value}</Typography>
        <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-muted)", mt: 0.3 }}>{label}</Typography>
      </Box>
    </Box>
  </Grow>
);

const emptyForm = { name: "", category: "", slug: "", image: "", status: true };

const Subcategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { showLoader, hideLoader } = useAuth();
  const { showSnackbar } = useSnackbar();

  const stats = useMemo(() => {
    const active = subcategories.filter((s) => s.isActive).length;
    // Assuming backend populates category object, we get the unique parent category IDs
    const parentsUsed = new Set(subcategories.map((s) => s.category?._id || s.category)).size;
    return { total: subcategories.length, active, parentsUsed };
  }, [subcategories]);

  const fetchData = async () => {
    try {
      showLoader();
      const [subRes, catRes] = await Promise.all([
        getAllSubCategories(),
        getAllCategories()
      ]);
      
      if (subRes?.success) {
        setSubcategories(subRes?.data || []);
      }
      
      if (catRes?.success) {
        setParentCategories(catRes?.data || []);
      }
    } catch (error) {
      showSnackbar("Error fetching data", "error");
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEditModal = (row) => {
    setEditingId(row._id);
    // Determine the category ID from the populated object or direct ID
    const catId = typeof row.category === "object" ? row.category?._id : row.category;
    
    setForm({ 
      name: row.name, 
      category: catId || "", 
      slug: row.slug || "", 
      image: row.image || "",
      status: row.isActive 
    });
    setOpen(true);
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm((f) => ({ ...f, name, slug: editingId ? f.slug : name.toLowerCase().trim().replace(/\s+/g, "-") }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.category) {
      showSnackbar("Please fill all required fields", "warning");
      return;
    }
    
    showLoader();
    try {
      let res;
      const payload = {
        name: form.name,
        category: form.category,
        image: form.image,
        isActive: form.status,
      };

      if (editingId) {
        res = await editSubCategory({ id: editingId, categoryId: payload?.category, ...payload });
      } else {
        res = await createSubCategory(payload);
      }

      if (res?.success) {
        showSnackbar(res?.message || `Subcategory ${editingId ? "updated" : "created"} successfully`);
        setOpen(false);
        fetchData(); // Refresh the table
      } else {
        showSnackbar(res?.message || "Something went wrong!", "error");
      }
    } catch (error) {
      showSnackbar(error?.message || "Internal server error!", "error");
    } finally {
      hideLoader();
    }
  };

  const handleDelete = (id) => {
    // Implement real delete API later, optimistic UI for now
    setSubcategories((prev) => prev.filter((s) => s._id !== id));
    setConfirmDeleteId(null);
  };

  const columns = [
    {
      field: "name",
      headerName: "Subcategory",
      flex: 1.6,
      minWidth: 260,
      renderCell: (params) => {
        // If populated, use name, otherwise use the ID
        const catName = typeof params.row.category === "object" 
          ? params.row.category?.name 
          : parentCategories.find(c => c._id === params.row.category)?.name || "Unknown";
          
        return (
          <Box className="flex h-full items-center gap-2.5">
            <Avatar
              src={params?.row?.image?.imageUrl || undefined}
              variant="rounded"
              sx={{
                width: 34,
                height: 34,
                borderRadius: "9px",
                fontSize: 13,
                fontWeight: 700,
                background: "var(--whiold-gradient-brand)",
                color: "#fff",
              }}
            >
              {params?.row?.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "var(--whiold-text-heading)" }}>{params.row.name}</Typography>
              <Box className="flex items-center gap-1 mt-0.5">
                <Chip
                  size="small"
                  label={catName}
                  sx={{
                    height: 18,
                    fontSize: 10,
                    fontWeight: 700,
                    borderRadius: "5px",
                    color: catColor(catName),
                    backgroundColor: `${catColor(catName)}1A`,
                  }}
                />
              </Box>
            </Box>
          </Box>
        );
      },
    },
    // {
    //   field: "products",
    //   headerName: "Products",
    //   flex: 0.7,
    //   minWidth: 110,
    //   renderCell: (params) => (
    //     <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-body)" }}>{params.value || 0}</Typography>
    //   ),
    // },
    { 
      field: "isActive", 
      headerName: "Status", 
      flex: 0.8, 
      minWidth: 120, 
      renderCell: (params) => <StatusChip status={params.row.isActive} /> 
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 0.8,
      minWidth: 120,
      renderCell: (params) =>
        params.row.createdAt ? new Date(params.row.createdAt).toLocaleString("en-IN") : "-",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      minWidth: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => openEditModal(params.row)}
            sx={{ color: "var(--whiold-text-muted)", "&:hover": { color: "var(--whiold-primary)", background: "var(--whiold-primary-soft)" } }}
          >
            <Pencil size={16} />
          </IconButton>
          {/* <IconButton
            size="small"
            onClick={() => setConfirmDeleteId(params.row._id)}
            sx={{ color: "var(--whiold-text-muted)", "&:hover": { color: "#F43F5E", background: "rgba(244,63,94,0.08)" } }}
          >
            <Trash2 size={16} />
          </IconButton> */}
        </Stack>
      ),
    },
  ];

  return (
    <Box className="flex flex-col gap-5">
      <Fade in timeout={350}>
        <Stack direction={{ xs: "column", sm: "row" }} sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" } }} spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box className="flex h-11 w-11 items-center justify-center rounded-2xl" sx={{ background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}>
              <Layers size={20} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: "var(--whiold-text-heading)" }}>Subcategories</Typography>
              <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-muted)" }}>
                Nest finer groupings under each parent category
              </Typography>
            </Box>
          </Stack>
          <ButtonComponent color="primary" variant="contained" startIcon={<Plus size={17} />} onClick={openAddModal}>
            Add Subcategory
          </ButtonComponent>
        </Stack>
      </Fade>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <StatCard icon={<FolderTree size={20} />} label="Total subcategories" value={stats.total} accent={{ soft: "var(--whiold-primary-soft)", solid: "var(--whiold-primary)" }} delay={0} />
        <StatCard icon={<CircleCheck size={20} />} label="Active" value={stats.active} accent={{ soft: "rgba(15,157,88,0.1)", solid: "#0F9D58" }} delay={120} />
        <StatCard icon={<Layers size={20} />} label="Parent categories used" value={stats.parentsUsed} accent={{ soft: "rgba(147,51,234,0.1)", solid: "#9333EA" }} delay={240} />
      </Stack>

      <TableComponent title="All Subcategories" rows={subcategories} columns={columns} />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth TransitionComponent={SlideUp} TransitionProps={slideProps} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: "var(--whiold-text-heading)" }}>
            {editingId ? "Edit Subcategory" : "New Subcategory"}
          </Typography>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: "var(--whiold-border)" }} />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.2}>
            <ImageUploadComponent
              label={form.image ? "Change image" : "Upload subcategory image"}
              subLabel="PNG or JPG, square works best"
              multiple={false}
              images={form.image ? [{ imageUrl: form?.image?.imageUrl }] : []}
              setImages={(imgs) => setForm(f => ({ ...f, image: {imageUrl: imgs[0]?.imageUrl, imageId: imgs[0]?.imageId} || "" }))}
              setUploading={setIsUploading}
            />
            <InputComponent
              label="Parent category"
              type="select"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              options={parentCategories.map((c) => ({ value: c._id, label: c.name }))}
              fullWidth
              required
            />
            <InputComponent label="Subcategory name" value={form.name} onChange={handleNameChange} required fullWidth />
            {/* <InputComponent label="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} helperText="Used in the product URL" fullWidth /> */}
            <InputComponent
              label="Status"
              type="select"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              options={[
                { value: true, label: "Active" },
                { value: false, label: "Inactive" },
              ]}
              fullWidth
            />
            <Stack direction="row" spacing={1.5} justifyContent="flex-end" pt={1}>
              <ButtonComponent variant="outlined" color="inherit" onClick={() => setOpen(false)}>
                Cancel
              </ButtonComponent>
              <ButtonComponent color="primary" variant="contained" onClick={handleSave} disabled={isUploading}>
                {editingId ? "Save changes" : "Create subcategory"}
              </ButtonComponent>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* Delete Modal Hidden for now as requested */}
    </Box>
  );
};

export default Subcategory;