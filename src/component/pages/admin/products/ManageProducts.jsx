import React, { useState, useMemo, useEffect } from "react";
import {
  Edit3,
  Eye,
  Plus,
  ImageOff,
  Star
} from "lucide-react";
import { Box, Typography } from "@mui/material";
import ButtonComponent from "../../../ui/ButtonComponent";
import InputComponent from "../../../ui/InputComponent";
import TableComponent from "../../../ui/TableComponent";
import { useNavigate } from "react-router-dom";
import { adminRoutes } from "../../../../constants/router";
import { getAllProducts, toggleProduct, toggleBestSeller } from "../../../../api/admin/products.api";
import { useSnackbar } from "../../../../context/SnackBarContext";
import ProductPreviewCard from "./ProductPreviewCard";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const StatusPill = ({ isActive, onClick }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`inline-flex items-center leading-none gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition cursor-pointer ${
      isActive
        ? "bg-[var(--whiold-primary-soft)] text-[var(--whiold-primary)] hover:opacity-80"
        : "bg-[var(--whiold-bg-soft)] text-[var(--whiold-text-muted)] hover:opacity-80"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        isActive ? "bg-[var(--whiold-primary)]" : "bg-[var(--whiold-text-muted)]"
      }`}
    />
    {isActive ? "Active" : "Inactive"}
  </button>
);

const BestSellerPill = ({ isBestSeller, onClick }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`inline-flex items-center leading-none gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide transition cursor-pointer ${
      isBestSeller
        ? "bg-[#FEF9C3] text-[#CA8A04] hover:opacity-80"
        : "bg-[var(--whiold-bg-soft)] text-[var(--whiold-text-muted)] hover:opacity-80"
    }`}
  >
    <Star size={12} className={isBestSeller ? "fill-[#CA8A04]" : ""} />
    {isBestSeller ? "Best Seller" : "Normal"}
  </button>
);

const StockBadge = ({ stock }) => {
  const isLow = stock > 0 && stock <= 10;
  const isOut = stock === 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[12.5px] font-medium ${
        isOut ? "text-[#C0392B]" : isLow ? "text-[var(--whiold-600)]" : "text-[var(--whiold-text-body)]"
      }`}
    >
      {isOut ? "Out of stock" : `${stock} in stock`}
    </span>
  );
};

const ProductThumb = ({ image, name }) => (
  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-[var(--whiold-radius-sm)] border border-[var(--whiold-border)] bg-[var(--whiold-bg-soft)]">
    {image ? (
      <img src={image} alt={name} className="h-full w-full object-cover" />
    ) : (
      <ImageOff size={16} className="text-[var(--whiold-text-muted)]" />
    )}
  </div>
);

const RowActions = ({ onView, onEdit }) => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onView(); }}
      className="rounded-[8px] p-2 text-[var(--whiold-text-muted)] transition-colors duration-200 hover:!bg-[var(--whiold-bg-soft)] hover:!text-[var(--whiold-text-body)]"
      aria-label="View product"
    >
      <Eye size={15} />
    </button>
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onEdit(); }}
      className="rounded-[8px] p-2 text-[var(--whiold-text-muted)] transition-colors duration-200 hover:!bg-[var(--whiold-primary-soft)] hover:!text-[var(--whiold-primary)]"
      aria-label="Edit product"
    >
      <Edit3 size={15} />
    </button>
  </div>
);

const ManageProduct = () => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts();
      setProducts(Array.isArray(res?.data) ? res.data : res?.data?.data || []);
    } catch (error) {
      showSnackbar("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStatus = async (product) => {
    try {
      const res = await toggleProduct({
        id: product._id,
        isActive: !product.isActive,
      });

      if (res?.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === product._id ? { ...p, isActive: !p.isActive } : p
          )
        );
        showSnackbar("Product status updated", "success");
      } else {
        showSnackbar(res?.message || "Update failed", "error");
      }
    } catch {
      showSnackbar("Failed to update product", "error");
    }
  };

  const handleToggleBestSeller = async (product) => {
    try {
      const res = await toggleBestSeller({
        productId: product._id,
        isBestSeller: !product.isBestSeller,
      });

      if (res?.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === product._id ? { ...p, isBestSeller: !p.isBestSeller } : p
          )
        );
        showSnackbar("Best seller status updated", "success");
      } else {
        showSnackbar(res?.message || "Update failed", "error");
      }
    } catch {
      showSnackbar("Failed to update product", "error");
    }
  };

  const uniqueCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category?.name || p.category).filter(Boolean));
    return ["", ...Array.from(cats)];
  }, [products]);

  const CATEGORY_OPTIONS = uniqueCategories.map(c => ({
    value: c, label: c ? c : "All categories"
  }));

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const pCategory = p.category?.name || p.category;
      const matchesCategory = !category || pCategory === category;
      
      const pStatus = p.isActive ? "active" : "inactive";
      const matchesStatus = !status || pStatus === status;
      
      return matchesCategory && matchesStatus;
    });
  }, [products, category, status]);

  const getStock = (product) => {
    return product.variants?.reduce((sum, v) => sum + Number(v.stock || 0), 0) || 0;
  };

  const getImage = (product) => {
     return product.images?.[0]?.imageUrl || product.images?.[0]?.image || "";
  };

  const handleEdit = (product) => {
    navigate(`/admin/product/edit/${product._id}`, { state: { product } });
  }

  const columns = [
    {
      field: "productName",
      headerName: "Product",
      flex: 1.5,
      minWidth: 250,
      valueGetter: (_, row) => row.name,
      renderCell: (params) => (
        <Box className="flex items-center gap-3">
          <ProductThumb image={getImage(params.row)} name={params.row.name} />
          <Box>
            <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "var(--whiold-text-heading)" }}>{params.row.name}</Typography>
            <Typography sx={{ fontSize: 11, fontFamily: "monospace", color: "var(--whiold-text-muted)" }}>{params.row.brand || "N/A"}</Typography>
          </Box>
        </Box>
      )
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      minWidth: 120,
      valueGetter: (_, row) => row.category?.name || row.category,
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13, color: "var(--whiold-text-body)" }}>
          {params.row.category?.name || params.row.category}
        </Typography>
      )
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.8,
      minWidth: 100,
      valueGetter: (_, row) => Number(row.price || 0),
      renderCell: (params) => (
        <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: "var(--whiold-text-heading)" }}>
          ₹{Number(params.row.price || 0).toLocaleString("en-IN")}
        </Typography>
      )
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 0.8,
      minWidth: 120,
      valueGetter: (_, row) => getStock(row),
      renderCell: (params) => (
        <StockBadge stock={getStock(params.row)} />
      )
    },
    {
      field: "isActive",
      headerName: "Status",
      flex: 0.8,
      minWidth: 120,
      valueGetter: (_, row) => row.isActive ? "Active" : "Inactive",
      renderCell: (params) => (
        <StatusPill isActive={params.row.isActive} onClick={() => handleToggleStatus(params.row)} />
      )
    },
    {
      field: "isBestSeller",
      headerName: "Best Seller",
      flex: 0.8,
      minWidth: 120,
      valueGetter: (_, row) => row.isBestSeller ? "Yes" : "No",
      renderCell: (params) => (
        <BestSellerPill isBestSeller={params.row.isBestSeller} onClick={() => handleToggleBestSeller(params.row)} />
      )
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <RowActions
          onView={() => setViewProduct(params.row)}
          onEdit={() => handleEdit(params.row)}
        />
      )
    }
  ];

  return (
    <Box className="mx-auto ">
      {/* ── Header ── */}
      <Box className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Box>
          <Typography sx={{ fontSize: 22, fontWeight: 800, color: "var(--whiold-text-heading)" }}>Manage products</Typography>
          <Typography sx={{ fontSize: 13.5, color: "var(--whiold-text-body)" }}>
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </Typography>
        </Box>
        <Box className="flex gap-3">
          <ButtonComponent variant="outlined" onClick={fetchProducts} sx={{ alignSelf: "flex-start", height: "40px" }}>
            Refresh
          </ButtonComponent>
          <ButtonComponent onClick={() => navigate(adminRoutes?.ADD_PRODUCT)} sx={{ alignSelf: "flex-start", height: "40px" }}>
            <Plus size={16} style={{ marginRight: 6 }} />
            Add product
          </ButtonComponent>
        </Box>
      </Box>

      {/* ── Filters ── */}
      <Box className="mb-5 flex flex-col sm:flex-row gap-3 rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-4">
        <Box flex={1} />
        <Box className="w-full sm:w-[200px]">
          <InputComponent
            type="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORY_OPTIONS}
            label={undefined}
            placeholder="Category"
          />
        </Box>
        <Box className="w-full sm:w-[180px]">
          <InputComponent
            type="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={STATUS_OPTIONS}
            label={undefined}
            placeholder="Status"
          />
        </Box>
      </Box>

      {/* ── TableComponent ── */}
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        <TableComponent 
          title="Products List" 
          rows={filtered.map(p => ({ ...p, id: p._id }))} 
          columns={columns} 
          loading={loading} 
        />
      </Box>

      {/* ── View Modal ── */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[380px] max-h-[90vh] overflow-y-auto rounded-[var(--whiold-radius-lg)]">
            <ProductPreviewCard 
               data={viewProduct} 
               onClose={() => setViewProduct(null)} 
            />
          </div>
        </div>
      )}
    </Box>
  );
};

export default ManageProduct;