import { useMemo, useState, useEffect } from "react";
import {
  Box,Stack,Typography,Chip,Avatar,Dialog,DialogContent,DialogTitle,IconButton,Divider,Slide,Fade,Grow,Tooltip,
} from "@mui/material";
import {
  Award,Plus,Pencil,Trash2,X,ImagePlus,Globe,BadgeCheck,CircleCheck,CircleSlash,
} from "lucide-react";

import TableComponent from "../../../ui/TableComponent";
import ButtonComponent from "../../../ui/ButtonComponent";
import InputComponent from "../../../ui/InputComponent";
import { useSnackbar } from "../../../../context/SnackBarContext";
import { uploadBrandsApi, getAllBrandsApi, deleteBrandsApi, toggleBrandsApi } from "../../../../api/admin/brands.api";
import ImageUploadComponent from "../../../../ui/ImageUploadComponent";

const slideProps = { direction: "up" };

const StatusChip = ({ status }) => {
  const isActive = status === "active";
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
        color: isActive ? "#0F9D58" : "#94A3B8",
        backgroundColor: isActive ? "rgba(15,157,88,0.1)" : "rgba(148,163,184,0.14)",
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

const emptyForm = { name: "", logo: [], website: "", status: "active", featured: false };

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await getAllBrandsApi();
      const list = Array.isArray(res?.data) ? res.data : res?.data?.data ?? [];
      
      const mapped = list.map(b => ({
         id: b._id,
         name: b.title,
         logo: b.image ? [{ imageUrl: b.image.imageUrl, imageId: b.image.imageId }] : [],
         website: b.website || "example.com",
         status: b.isActive ? "active" : "inactive",
         featured: b.featured || false,
         products: b.products?.length || 0,
         original: b
      }));
      setBrands(mapped);
    } catch {
      showSnackbar("Failed to load brands", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const stats = useMemo(() => {
    const active = brands.filter((b) => b.status === "active").length;
    const featured = brands.filter((b) => b.featured).length;
    return { total: brands.length, active, featured };
  }, [brands]);

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEditModal = (row) => {
    setEditingId(row.id);
    setForm({ name: row.name, logo: row.logo, website: row.website, status: row.status, featured: row.featured });
    setOpen(true);
  };

  const handleToggle = async (row) => {
    try {
      const res = await toggleBrandsApi({
         id: row.id,
         isActive: row.status !== "active"
      });
      if (res?.success) {
         showSnackbar("Brand status updated", "success");
         setBrands(prev => prev.map(b => b.id === row.id ? { ...b, status: row.status === "active" ? "inactive" : "active" } : b));
      } else {
         showSnackbar(res?.message || "Update failed", "error");
      }
    } catch {
      showSnackbar("Failed to update brand", "error");
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    
    if (editingId) {
      showSnackbar("Editing is not supported by API yet. Delete and recreate if needed.", "error");
      return;
    }

    if (!form.logo || form.logo.length === 0) {
      showSnackbar("Please upload a brand image", "error");
      return;
    }

    const payload = {
      title: form.name.trim(),
      image: {
        imageUrl: form.logo[0]?.imageUrl,
        imageId: form.logo[0]?.imageId,
      },
      backImage: {
        imageUrl: form.logo[0]?.imageUrl,
        imageId: form.logo[0]?.imageId,
      },
    };

    setImageUploading(true);
    try {
      const res = await uploadBrandsApi(payload);
      if (res?.success) {
        showSnackbar(res?.message || "Brand uploaded successfully", "success");
        setOpen(false);
        fetchBrands();
      } else {
        showSnackbar(res?.message || "Brand upload failed", "error");
      }
    } catch (error) {
      showSnackbar(error?.message || "Something went wrong", "error");
    } finally {
      setImageUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const brand = brands.find(b => b.id === id);
    if (!brand) return;

    try {
       const res = await deleteBrandsApi({
          id: brand.id,
          imageId: brand.logo?.[0]?.imageId
       });
       if (res?.success) {
         showSnackbar(res?.message || "Brand deleted successfully", "success");
         setBrands((prev) => prev.filter((b) => b.id !== id));
       } else {
         showSnackbar(res?.message || "Delete failed", "error");
       }
    } catch {
       showSnackbar("Failed to delete brand", "error");
    } finally {
       setConfirmDeleteId(null);
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Brand",
      flex: 1.5,
      minWidth: 240,
      renderCell: (params) => (
        <Box className="flex h-full items-center gap-2.5">
          <Avatar
            src={params.row.logo?.[0]?.imageUrl || undefined}
            variant="rounded"
            sx={{ width: 36, height: 36, borderRadius: "10px", border: "1px solid var(--whiold-border)", background: "#fff", color: "var(--whiold-primary)", fontSize: 13, fontWeight: 700 }}
          >
            {params.row.name.charAt(0)}
          </Avatar>
          <Box className="flex items-center gap-1.5">
            <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "var(--whiold-text-heading)" }}>{params.row.name}</Typography>
            {params.row.featured && (
              <Tooltip title="Featured brand">
                <BadgeCheck size={15} color="var(--whiold-primary)" />
              </Tooltip>
            )}
          </Box>
        </Box>
      ),
    },
    {
      field: "website",
      headerName: "Website",
      flex: 1,
      minWidth: 170,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.6} alignItems="center">
          <Globe size={13} color="var(--whiold-text-muted)" />
          <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-body)" }}>{params.value}</Typography>
        </Stack>
      ),
    },
    {
      field: "products",
      headerName: "Products",
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => <Typography sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-body)" }}>{params.value}</Typography>,
    },
    { field: "status", headerName: "Status", flex: 0.8, minWidth: 120, renderCell: (params) => <Box sx={{ cursor: 'pointer' }} onClick={() => handleToggle(params.row)}><StatusChip status={params.value} /></Box> },
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
          <IconButton
            size="small"
            onClick={() => setConfirmDeleteId(params.row.id)}
            sx={{ color: "var(--whiold-text-muted)", "&:hover": { color: "#F43F5E", background: "rgba(244,63,94,0.08)" } }}
          >
            <Trash2 size={16} />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box className="flex flex-col gap-5">
      <Fade in timeout={350}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box className="flex h-11 w-11 items-center justify-center rounded-2xl" sx={{ background: "var(--whiold-primary-soft)", color: "var(--whiold-primary)" }}>
              <Award size={20} />
            </Box>
            <Box>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: "var(--whiold-text-heading)" }}>Brands</Typography>
              <Typography sx={{ fontSize: 12.5, color: "var(--whiold-text-muted)" }}>Manage the labels sold across your catalogue</Typography>
            </Box>
          </Stack>
          <ButtonComponent color="primary" variant="contained" startIcon={<Plus size={17} />} onClick={openAddModal}>
            Add Brand
          </ButtonComponent>
        </Stack>
      </Fade>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <StatCard icon={<Award size={20} />} label="Total brands" value={stats.total} accent={{ soft: "var(--whiold-primary-soft)", solid: "var(--whiold-primary)" }} delay={0} />
        <StatCard icon={<CircleCheck size={20} />} label="Active" value={stats.active} accent={{ soft: "rgba(15,157,88,0.1)", solid: "#0F9D58" }} delay={120} />
        <StatCard icon={<BadgeCheck size={20} />} label="Featured" value={stats.featured} accent={{ soft: "rgba(186,112,79,0.12)", solid: "var(--whiold-primary)" }} delay={240} />
      </Stack>

      <TableComponent title="All Brands" rows={brands} columns={columns} loading={loading} />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth TransitionComponent={Slide} TransitionProps={slideProps} PaperProps={{ sx: { borderRadius: "20px" } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: "var(--whiold-text-heading)" }}>{editingId ? "Edit Brand" : "New Brand"}</Typography>
          <IconButton size="small" onClick={() => setOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: "var(--whiold-border)" }} />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.2}>
            
            <ImageUploadComponent
              label="Brand logo"
              subLabel="Upload brand logo"
              multiple={false}
              images={form.logo}
              setImages={(imgs) => setForm((f) => ({ ...f, logo: imgs }))}
              setUploading={setImageUploading}
            />

            <InputComponent label="Brand name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required fullWidth />
            <InputComponent label="Website" value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="example.com" fullWidth />
            <InputComponent
              label="Status"
              type="select"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              fullWidth
            />
            <InputComponent
              label="Featured"
              type="select"
              value={form.featured ? "yes" : "no"}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.value === "yes" }))}
              options={[
                { value: "no", label: "Not featured" },
                { value: "yes", label: "Featured on homepage" },
              ]}
              fullWidth
            />

            <Stack direction="row" spacing={1.5} justifyContent="flex-end" pt={1}>
              <ButtonComponent variant="outlined" color="inherit" onClick={() => setOpen(false)}>
                Cancel
              </ButtonComponent>
              <ButtonComponent color="primary" variant="contained" onClick={handleSave} loading={imageUploading} disabled={imageUploading}>
                {editingId ? "Save changes" : "Create brand"}
              </ButtonComponent>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(confirmDeleteId)} onClose={() => setConfirmDeleteId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}>
        <DialogContent>
          <Box className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl" sx={{ background: "rgba(244,63,94,0.1)", color: "#F43F5E" }}>
            <Trash2 size={20} />
          </Box>
          <Typography align="center" sx={{ fontWeight: 700, fontSize: 15, color: "var(--whiold-text-heading)" }}>
            Delete this brand?
          </Typography>
          <Typography align="center" sx={{ fontSize: 13, color: "var(--whiold-text-muted)", mt: 0.5, mb: 3 }}>
            Products linked to it will remain, but lose the brand tag.
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <ButtonComponent fullWidth variant="outlined" color="inherit" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </ButtonComponent>
            <ButtonComponent fullWidth color="error" variant="contained" onClick={() => handleDelete(confirmDeleteId)}>
              Delete
            </ButtonComponent>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Brands;