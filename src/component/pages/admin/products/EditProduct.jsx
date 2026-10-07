import React, { useState, useEffect } from "react";
import {
  Package,
  Tag,
  Layers,
  ImageIcon,
  CheckCircle2,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft as ChevronLeftIcon,
  ImageOff,
} from "lucide-react";
import ButtonComponent from "../../../ui/ButtonComponent";
import InputComponent from "../../../ui/InputComponent";
import ImageUploadComponent from "../../../../ui/ImageUploadComponent";
import { editProduct } from "../../../../api/admin/products.api";
import { getAllActiveCategories, getAllSubCategoriesByCategory } from "../../../../api/admin/subCategory.api";
import { useSnackbar } from "../../../../context/SnackBarContext";
import { useLocation, useNavigate } from "react-router-dom";
import ProductPreviewCard from "./ProductPreviewCard";

const STEPS = [
  { key: "basic", label: "Basic details", icon: Package },
  { key: "pricing", label: "Pricing & stock", icon: Tag },
  { key: "variants", label: "Variants", icon: Layers },
  { key: "media", label: "Media", icon: ImageIcon },
  { key: "review", label: "Review", icon: CheckCircle2 },
];

const emptyVariant = () => ({
  id: crypto.randomUUID(),
  spec: "",
  stock: "",
});



const StepRail = ({ activeIndex, onStepClick, furthestReached }) => (
  <div className="flex flex-col gap-0">
    {STEPS.map((step, index) => {
      const Icon = step.icon;
      const isActive = index === activeIndex;
      const isDone = index < activeIndex;
      const isClickable = index <= furthestReached;

      return (
        <div key={step.key} className="flex gap-3">
          <div className="flex flex-col items-center">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(index)}
              className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-300 ease-out ${
                isActive
                  ? "border-[var(--whiold-primary)] bg-[var(--whiold-primary)] text-white shadow-[var(--whiold-shadow-btn)]"
                  : isDone
                  ? "border-[var(--whiold-primary)] bg-[var(--whiold-primary-soft)] text-[var(--whiold-primary)]"
                  : "border-[var(--whiold-border)] bg-[var(--whiold-bg)] text-[var(--whiold-text-muted)]"
              } ${isClickable ? "cursor-pointer hover:!border-[var(--whiold-primary)]" : "cursor-not-allowed"}`}
            >
              {isDone ? <CheckCircle2 size={16} /> : <Icon size={15} />}
            </button>
            {index < STEPS.length - 1 && (
              <div className="my-1 h-10 w-[2px] overflow-hidden rounded-full bg-[var(--whiold-border)]">
                <div
                  className="w-full rounded-full bg-[var(--whiold-primary)] transition-all duration-500 ease-out"
                  style={{ height: isDone ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>

          <div className={`pb-8 ${index === STEPS.length - 1 ? "pb-0" : ""}`}>
            <p
              className={`pt-1.5 text-[13.5px] font-semibold transition-colors duration-300 ${
                isActive || isDone ? "text-[var(--whiold-text-heading)]" : "text-[var(--whiold-text-muted)]"
              }`}
            >
              {step.label}
            </p>
            <p className="text-[11.5px] text-[var(--whiold-text-muted)]">Step {index + 1} of {STEPS.length}</p>
          </div>
        </div>
      );
    })}
  </div>
);

const EditProduct = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [furthestReached, setFurthestReached] = useState(4); // Pre-fill allows all steps
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const { showSnackbar } = useSnackbar();
  
  const navigate = useNavigate();
  const location = useLocation();
  const product = location?.state?.product ?? null;

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [data, setData] = useState({
    name: "",
    brand: "",
    category: "",
    subCategory: "",
    description: "",
    price: "",
    mrp: "",
    actualPrice: "",
    gst: "",
    bp: "",
    hsnCode: "",
    variants: [emptyVariant()],
    images: [],
  });

  const [transitionKey, setTransitionKey] = useState(0);
  
  useEffect(() => {
    if (!product?._id) {
      showSnackbar("No product data found", "error");
      navigate(-1);
      return;
    }

    setData({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category?._id || product.category || "",
      subCategory: product.subCategory?._id || product.subCategory || "",
      description: product.description || "",
      price: String(product.price || ""),
      mrp: String(product.mrp || ""),
      actualPrice: String(product.actualPrice || ""),
      bp: String(product.bp || ""),
      gst: String(product.gst || ""),
      hsnCode: product.hsnCode || "",
      variants: product.variants?.length ? product.variants.map(v => ({...v, id: v._id || crypto.randomUUID()})) : [emptyVariant()],
      images: product.images || [],
    });
  }, [product, navigate]);

  useEffect(() => {
    setTransitionKey((k) => k + 1);
  }, [activeStep]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllActiveCategories();
        setCategories(Array.isArray(res?.data) ? res?.data : res?.data?.data || []);
      } catch (err) {
        showSnackbar("Failed to load categories", "error");
      }
    })();
  }, []);

  useEffect(() => {
    if (!data.category) {
      setSubCategories([]);
      return;
    }
    (async () => {
      try {
        const res = await getAllSubCategoriesByCategory(data.category);
        setSubCategories(Array.isArray(res?.data) ? res.data : res?.data?.data || []);
      } catch (err) {
        showSnackbar("Failed to load sub categories", "error");
      }
    })();
  }, [data.category]);

  const update = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const updateVariant = (id, field, value) => {
    setData((prev) => ({
      ...prev,
      variants: prev.variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)),
    }));
  };

  const addVariant = () => setData((prev) => ({ ...prev, variants: [...prev.variants, emptyVariant()] }));
  const removeVariant = (id) =>
    setData((prev) => ({
      ...prev,
      variants: prev.variants.length > 1 ? prev.variants.filter((v) => v.id !== id) : prev.variants,
    }));

  const validateStep = (stepIndex) => {
    const newErrors = {};
    if (stepIndex === 0) {
      if (!data.name.trim()) newErrors.name = "Product name is required";
      if (!data.category) newErrors.category = "Select a category";
    }
    if (stepIndex === 1) {
      if (!data.price || Number(data.price) <= 0) newErrors.price = "Enter a valid price";
      if (!data.mrp || Number(data.mrp) <= 0) newErrors.mrp = "Enter a valid MRP";
      if (Number(data.price) > Number(data.mrp)) newErrors.price = "Price must be less than MRP";
      if (!data.actualPrice) newErrors.actualPrice = "Enter actual price";
      if (!data.gst) newErrors.gst = "Enter GST";
      if (!data.bp) newErrors.bp = "Enter BP";
      if (!data.hsnCode) newErrors.hsnCode = "Enter HSN Code";
    }
    if (stepIndex === 2) {
      const cleanVariants = data.variants.filter((v) => v.spec.trim() && v.stock !== "");
      if (!cleanVariants.length) {
        newErrors.variants = "At least one complete variant is required";
        showSnackbar("At least one variant (Spec and Stock) is required", "error");
      }
    }
    if (stepIndex === 3) {
      if (!data.images.length) {
        newErrors.images = "At least one image is required";
        showSnackbar("At least one image is required", "error");
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(activeStep)) return;
    const next = Math.min(activeStep + 1, STEPS.length - 1);
    setActiveStep(next);
    setFurthestReached((f) => Math.max(f, next));
  };

  const goBack = () => setActiveStep((s) => Math.max(0, s - 1));

  const handleStepClick = (index) => {
    if (index > activeStep && !validateStep(activeStep)) return;
    setActiveStep(index);
  };

  const handleSubmit = async () => {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2) || !validateStep(3)) {
      if (!validateStep(0)) setActiveStep(0);
      else if (!validateStep(1)) setActiveStep(1);
      else if (!validateStep(2)) setActiveStep(2);
      else setActiveStep(3);
      return;
    }

    const cleanVariants = data.variants.filter((v) => v.spec.trim() && String(v.stock) !== "");

    const payload = {
        id: product._id,
        name: data.name,
        brand: data.brand,
        category: data.category,
        subCategory: data.subCategory,
        description: data.description,
        price: Number(data.price),
        mrp: Number(data.mrp),
        actualPrice: Number(data.actualPrice),
        gst: Number(data.gst),
        bp: Number(data.bp),
        hsnCode: data.hsnCode,
        variants: cleanVariants.map((v) => ({
            spec: v.spec.trim(),
            stock: Number(v.stock),
        })),
        images: data.images.map((img) => ({
            imageUrl: img.imageUrl || img.image,
            imageId: img.imageId,
        })),
    };

    setSubmitting(true);
    try {
        const res = await editProduct(payload);
        if (res?.success) {
            showSnackbar(res.message || "Product updated successfully", "success");
            navigate(-1);
        } else {
            showSnackbar(res?.message || "Product update failed", "error");
        }
    } catch (error) {
        showSnackbar(error?.response?.message || error?.message || "Something went wrong", "error");
    } finally {
        setSubmitting(false);
    }
  };

  const isLastStep = activeStep === STEPS.length - 1;

  const categoryOptions = [{ value: "", label: "Select Category" }, ...categories.map(c => ({ value: c._id, label: c.name }))];
  const subCategoryOptions = [{ value: "", label: "Select Sub Category" }, ...subCategories.map(s => ({ value: s._id, label: s.name }))];

  return (
    <div className="mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--whiold-text-heading)]">Edit product</h1>
          <p className="text-[13.5px] text-[var(--whiold-text-body)]">
            Modify the product details below.
          </p>
        </div>
        <ButtonComponent variant="outlined" onClick={() => navigate(-1)} sx={{ color: "var(--whiold-text-body)" }}>
           Back
        </ButtonComponent>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)_340px]">
        {/* ── Stepper rail ── */}
        <div className="rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-5 lg:h-fit">
          <StepRail activeIndex={activeStep} onStepClick={handleStepClick} furthestReached={furthestReached} />
        </div>

        {/* ── Form content ── */}
        <div className="rounded-[var(--whiold-radius-lg)] border border-[var(--whiold-border)] bg-[var(--whiold-bg)] p-6">
          <div key={transitionKey} className="animate-[fadeSlide_0.35s_ease-out]">
            {activeStep === 0 && (
              <div className="flex flex-col gap-5">
                <InputComponent
                  label="Product name"
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
                <InputComponent
                  label="Brand"
                  value={data.brand}
                  onChange={(e) => update("brand", e.target.value)}
                />
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <InputComponent
                    label="Category"
                    type="select"
                    value={data.category}
                    onChange={(e) => update("category", e.target.value)}
                    options={categoryOptions}
                    error={!!errors.category}
                    helperText={errors.category}
                    required
                  />
                  <InputComponent
                    label="Sub Category"
                    type="select"
                    value={data.subCategory}
                    onChange={(e) => update("subCategory", e.target.value)}
                    options={subCategoryOptions}
                    error={!!errors.subCategory}
                    helperText={errors.subCategory}
                  />
                </div>
                <InputComponent
                  label="Description"
                  type="textarea"
                  rows={5}
                  value={data.description}
                  onChange={(e) => update("description", e.target.value)}
                  helperText="A short, clear summary customers will see first."
                />
              </div>
            )}

            {activeStep === 1 && (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <InputComponent
                    label="Price (₹)"
                    type="number"
                    value={data.price}
                    onChange={(e) => update("price", e.target.value)}
                    error={!!errors.price}
                    helperText={errors.price}
                    required
                  />
                  <InputComponent
                    label="MRP (₹)"
                    type="number"
                    value={data.mrp}
                    onChange={(e) => update("mrp", e.target.value)}
                    error={!!errors.mrp}
                    helperText={errors.mrp}
                    required
                  />
                  <InputComponent
                    label="Actual Price (₹)"
                    type="number"
                    value={data.actualPrice}
                    onChange={(e) => update("actualPrice", e.target.value)}
                    error={!!errors.actualPrice}
                    helperText={errors.actualPrice}
                    required
                  />
                  <InputComponent
                    label="GST (%)"
                    type="number"
                    value={data.gst}
                    onChange={(e) => update("gst", e.target.value)}
                    error={!!errors.gst}
                    helperText={errors.gst}
                    required
                  />
                  <InputComponent
                    label="BP"
                    type="number"
                    value={data.bp}
                    onChange={(e) => update("bp", e.target.value)}
                    error={!!errors.bp}
                    helperText={errors.bp}
                    required
                  />
                  <InputComponent
                    label="HSN Code"
                    value={data.hsnCode}
                    onChange={(e) => update("hsnCode", e.target.value)}
                    error={!!errors.hsnCode}
                    helperText={errors.hsnCode}
                    required
                  />
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="flex flex-col gap-4">
                <p className="text-[13px] text-[var(--whiold-text-body)]">
                  Add variant specifications like colour or size, and their respective stock.
                </p>

                {data.variants.map((variant, index) => (
                  <div
                    key={variant.id || index}
                    className="rounded-[var(--whiold-radius-md)] border border-[var(--whiold-border)] bg-[var(--whiold-bg-soft)] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">
                        Variant {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        disabled={data.variants.length === 1}
                        className="text-[var(--whiold-text-muted)] transition-colors duration-200 hover:!text-[#C0392B] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <InputComponent
                        label="Variant (e.g. Size M)"
                        value={variant.spec}
                        onChange={(e) => updateVariant(variant.id, "spec", e.target.value)}
                      />
                      <InputComponent
                        label="Stock"
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(variant.id, "stock", e.target.value)}
                      />
                    </div>
                  </div>
                ))}

                <ButtonComponent color="" variant="outlined" onClick={addVariant} sx={{ alignSelf: "flex-start", color: "var(--whiold-primary)" }}>
                  <Plus size={15} style={{ marginRight: 6 }} />
                  Add variant
                </ButtonComponent>
              </div>
            )}

            {activeStep === 3 && (
              <div className="flex flex-col gap-4">
                <p className="text-[13px] text-[var(--whiold-text-body)]">
                  Upload product images.
                </p>
                <ImageUploadComponent
                  multiple
                  images={data.images}
                  setImages={(imgs) => update("images", imgs)}
                  setUploading={setImageUploading}
                />
              </div>
            )}

            {activeStep === 4 && (
              <div className="flex flex-col gap-5">
                <p className="text-[13px] text-[var(--whiold-text-body)]">
                  Review everything before updating. You can jump back to any step to make changes.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ReviewRow label="Name" value={data.name} />
                  <ReviewRow label="Category" value={categories.find((c) => c._id === data.category)?.name} />
                  <ReviewRow label="Price" value={data.price && `₹${Number(data.price).toLocaleString("en-IN")}`} />
                  <ReviewRow label="MRP" value={data.mrp && `₹${Number(data.mrp).toLocaleString("en-IN")}`} />
                  <ReviewRow label="Actual Price" value={data.actualPrice && `₹${Number(data.actualPrice).toLocaleString("en-IN")}`} />
                  <ReviewRow label="HSN Code" value={data.hsnCode} />
                </div>

                <div>
                  <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">
                    Variants
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {data.variants.filter((v) => v.spec).length === 0 && (
                      <span className="text-[13px] text-[var(--whiold-text-muted)]">No variants added</span>
                    )}
                    {data.variants
                      .filter((v) => v.spec)
                      .map((v) => (
                        <span
                          key={v.id || v._id}
                          className="rounded-[8px] bg-[var(--whiold-primary-soft)] px-2.5 py-1 text-[12px] font-medium text-[var(--whiold-primary)]"
                        >
                          {v.spec} (Stock: {v.stock})
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation ── */}
          <div className="mt-8 flex items-center justify-between border-t border-[var(--whiold-border)] pt-5">
            <ButtonComponent variant="text" onClick={goBack} disabled={activeStep === 0} sx={{ color: "var(--whiold-text-body)" }}>
              <ChevronLeftIcon size={16} style={{ marginRight: 4 }} />
              Back
            </ButtonComponent>

            {isLastStep ? (
              <ButtonComponent onClick={handleSubmit} loading={submitting || imageUploading} disabled={submitting || imageUploading}>
                 {imageUploading ? "Uploading Image..." : submitting ? "Updating..." : "Update product"}
              </ButtonComponent>
            ) : (
              <ButtonComponent onClick={goNext}>
                Continue
                <ChevronRight size={16} style={{ marginLeft: 4 }} />
              </ButtonComponent>
            )}
          </div>
        </div>

        {/* ── Live preview ── */}
        <div className="sticky top-6">
          <ProductPreviewCard data={data} categories={categories} subCategories={subCategories} />
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const ReviewRow = ({ label, value }) => (
  <div className="rounded-[var(--whiold-radius-sm)] border border-[var(--whiold-border)] bg-[var(--whiold-bg-soft)] px-3.5 py-2.5">
    <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-[var(--whiold-text-muted)]">{label}</p>
    <p className="text-[13.5px] font-medium text-[var(--whiold-text-heading)]">{value || "—"}</p>
  </div>
);

export default EditProduct;
