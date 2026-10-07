import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Avatar, Typography, Grid, Divider } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Edit3,
  ShieldAlert,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
  Check,
  RotateCcw,
} from "lucide-react";

import { useAuth } from "../../../../context/AuthContext";
import { useSnackbar } from "../../../../context/SnackBarContext";
import { editProfile } from "../../../../api/user/users.api";
import ButtonComponent from "../../../ui/ButtonComponent";
import InputComponent from "../../../ui/InputComponent";
import { useNavigate } from "react-router-dom";

const FIELD_ICONS = {
  name: User,
  email: Mail,
  mobile: Phone,
  address: MapPin,
};

/* ─────────────────────────────────────────────────────────
   CropModal — drag to reposition, slider to zoom, exports
   a circular-cropped square image via canvas
───────────────────────────────────────────────────────── */
const VIEWPORT_SIZE = 260; // px, on-screen crop circle
const OUTPUT_SIZE = 480; // px, exported image resolution

const CropModal = ({ open, src, onCancel, onSave }) => {
  const containerRef = useRef(null);
  const imgElRef = useRef(null); // native Image() for natural dimensions
  const [ready, setReady] = useState(false);
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef(null);

  // Load the source image and compute the scale that makes it cover the circle
  useEffect(() => {
    if (!open || !src) return;
    setReady(false);
    setZoom(1);
    setOffset({ x: 0, y: 0 });

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgElRef.current = img;
      const scale = Math.max(
        VIEWPORT_SIZE / img.naturalWidth,
        VIEWPORT_SIZE / img.naturalHeight
      );
      setBaseScale(scale);
      setReady(true);
    };
    img.src = src;
  }, [open, src]);

  const displayWidth = ready ? imgElRef.current.naturalWidth * baseScale * zoom : 0;
  const displayHeight = ready ? imgElRef.current.naturalHeight * baseScale * zoom : 0;

  const clampOffset = useCallback(
    (x, y, w = displayWidth, h = displayHeight) => {
      const maxX = Math.max(0, (w - VIEWPORT_SIZE) / 2);
      const maxY = Math.max(0, (h - VIEWPORT_SIZE) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, x)),
        y: Math.min(maxY, Math.max(-maxY, y)),
      };
    },
    [displayWidth, displayHeight]
  );

  // Re-clamp whenever zoom changes (image may now be smaller than current offset allows)
  useEffect(() => {
    if (!ready) return;
    setOffset((prev) => clampOffset(prev.x, prev.y));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, ready]);

  const handlePointerDown = (e) => {
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset(clampOffset(dragState.current.offsetX + dx, dragState.current.offsetY + dy));
  };

  const handlePointerUp = () => {
    dragState.current = null;
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  const handleSave = () => {
    if (!ready || !imgElRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");

    // Circular clip so the exported PNG is already avatar-shaped
    ctx.save();
    ctx.beginPath();
    ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const exportScale = OUTPUT_SIZE / VIEWPORT_SIZE;
    const destWidth = displayWidth * exportScale;
    const destHeight = displayHeight * exportScale;
    const destX = OUTPUT_SIZE / 2 + offset.x * exportScale - destWidth / 2;
    const destY = OUTPUT_SIZE / 2 + offset.y * exportScale - destHeight / 2;

    ctx.drawImage(imgElRef.current, destX, destY, destWidth, destHeight);
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const previewUrl = URL.createObjectURL(blob);
        const file = new File([blob], "profile-photo.png", { type: "image/png" });
        onSave(file, previewUrl);
      },
      "image/png",
      0.95
    );
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: "rgba(43,33,25,0.55)", backdropFilter: "blur(4px)" }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="w-full max-w-sm rounded-[var(--whiold-radius-lg)] p-6"
          style={{
            background: "var(--whiold-bg)",
            border: "1px solid var(--whiold-border)",
            boxShadow: "var(--whiold-shadow-card)",
          }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="m-0 text-[15px] font-bold" style={{ color: "var(--whiold-text-heading)" }}>
              Adjust your photo
            </h3>
            <button
              onClick={onCancel}
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: "var(--whiold-bg-soft)" }}
            >
              <X size={15} style={{ color: "var(--whiold-text-body)" }} />
            </button>
          </div>

          {/* Crop viewport */}
          <div
            className="mx-auto flex items-center justify-center rounded-[var(--whiold-radius-md)]"
            style={{
              width: VIEWPORT_SIZE + 32,
              height: VIEWPORT_SIZE + 32,
              background: "var(--whiold-bg-soft)",
              border: "1px solid var(--whiold-border)",
            }}
          >
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="relative overflow-hidden rounded-full"
              style={{
                width: VIEWPORT_SIZE,
                height: VIEWPORT_SIZE,
                cursor: ready ? "grab" : "default",
                touchAction: "none",
                boxShadow: "0 0 0 3px var(--whiold-primary-soft), 0 0 0 4px var(--whiold-border)",
                background: "var(--whiold-100)",
              }}
            >
              {ready && (
                <img
                  src={src}
                  alt=""
                  draggable={false}
                  className="absolute select-none"
                  style={{
                    width: displayWidth,
                    height: displayHeight,
                    left: `calc(50% + ${offset.x}px)`,
                    top: `calc(50% + ${offset.y}px)`,
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>
          </div>

          {/* Zoom control */}
          <div className="mt-5 flex items-center gap-3">
            <ZoomOut size={16} style={{ color: "var(--whiold-text-muted)" }} />
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-[var(--whiold-primary)]"
            />
            <ZoomIn size={16} style={{ color: "var(--whiold-text-muted)" }} />
          </div>

          <button
            onClick={handleReset}
            className="mt-3 flex items-center gap-1.5 text-[11.5px] font-semibold"
            style={{ color: "var(--whiold-primary)" }}
          >
            <RotateCcw size={12} /> Reset
          </button>

          {/* Actions */}
          <div className="mt-5 flex gap-3">
            <ButtonComponent variant="text" onClick={onCancel} sx={{ flex: 1 }}>
              Cancel
            </ButtonComponent>
            <ButtonComponent
              onClick={handleSave}
              disabled={!ready}
              startIcon={<Check size={15} />}
              sx={{ flex: 1 }}
            >
              Save
            </ButtonComponent>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ProfilePage = () => {
  const { user, loading, refreshUser } = useAuth();
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const fileInputRef = React.useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [rawFile, setRawFile] = useState(null);

  // Crop modal state
  const [cropSrc, setCropSrc] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });

  /* ================= SYNC USER ================= */
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
        address: user.address?.area || "",
      });

      if (user?.memberPhoto) {
        setProfileImage({
          url: user?.memberPhoto?.imageUrl || user?.memberPhoto?.image,
          public_id: user?.memberPhoto?.imageId,
        });
      }
    }
  }, [user]);

  if (loading) return <Typography align="center">Loading...</Typography>;
  if (!user) return <Typography>User not found</Typography>;

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ================= PHOTO SELECT → open crop modal ================= */
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setCropModalOpen(true);
    // reset input so selecting the same file again still fires onChange
    e.target.value = "";
  };

  const handleCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setCropModalOpen(false);
  };

  const handleCropSave = (croppedFile, previewUrl) => {
    setRawFile(croppedFile);
    setProfileImage({ url: previewUrl, public_id: "local_preview" });
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setCropModalOpen(false);
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        image: profileImage
          ? {
              imageUrl: profileImage.url,
              imageId: profileImage.public_id,
            }
          : null,
      };

      const res = await editProfile(payload);

      if (res?.success) {
        showSnackbar("Profile updated successfully", "success");
        refreshUser();
        setIsEditing(false);
      } else {
        showSnackbar(res?.message || "Update failed", "error");
      }
    } catch (err) {
      console.error(err);
      showSnackbar("Profile update failed", "error");
    }
  };

  /* ================= FIELD RENDER ================= */
  const renderField = (label, value, name) => {
    const Icon = FIELD_ICONS[name];

    if (isEditing) {
      return (
        <InputComponent
          type="text"
          label={label}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          startIcon={<Icon size={17} style={{ color: "var(--whiold-text-muted)" }} />}
        />
      );
    }

    return (
      <Box
        className="group relative flex items-start gap-3 rounded-[14px] border p-4 transition-all duration-300"
        sx={{
          borderColor: "var(--whiold-border)",
          bgcolor: "var(--whiold-bg-soft)",
          "&:hover": {
            borderColor: "var(--whiold-border-hover)",
            bgcolor: "var(--whiold-bg)",
            boxShadow: "var(--whiold-shadow-card)",
          },
        }}
      >
        <Box
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors"
          sx={{
            bgcolor: "var(--whiold-primary-soft)",
            color: "var(--whiold-primary)",
          }}
        >
          <Icon size={16} />
        </Box>
        <Box className="min-w-0 flex-1">
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--whiold-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              mb: 0.4,
            }}
          >
            {label}
          </Typography>
          <Typography
            className="truncate"
            sx={{
              fontSize: 14.5,
              fontWeight: 600,
              color: "var(--whiold-text-heading)",
            }}
          >
            {value || "—"}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box className="mx-auto max-w-8xl pb-10">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&display=swap");
        .whiold-profile-serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      {/* Page heading */}
      <Box className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Box>
          <Typography
            className="whiold-profile-serif"
            sx={{
              fontSize: { xs: 24, sm: 27, md: 30 },
              fontWeight: 700,
              color: "var(--whiold-text-heading)",
              lineHeight: 1.2,
            }}
          >
            My Profile
          </Typography>
          <Typography sx={{ fontSize: { xs: 12.5, sm: 13.5 }, color: "var(--whiold-text-body)", mt: 0.3 }}>
            Manage your personal information and preferences
          </Typography>
        </Box>
        {!isEditing && (
          <ButtonComponent
            variant="outlined"
            onClick={() => setIsEditing(true)}
            startIcon={<Edit3 size={16} />}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Edit Profile
          </ButtonComponent>
        )}
      </Box>

      {/* KYC STRIPE */}
      <AnimatePresence>
        {!user?.isKycVerified && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              className="mb-5 flex flex-col gap-4 rounded-[16px] border p-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:p-5"
              sx={{
                borderColor: "rgba(244, 63, 94, 0.2)",
                background:
                  "linear-gradient(90deg, rgba(244,63,94,0.06) 0%, rgba(244,63,94,0.02) 100%)",
              }}
            >
              <Box className="flex gap-3">
                <Box
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11"
                  sx={{ bgcolor: "rgba(244,63,94,0.1)" }}
                >
                  <ShieldAlert size={20} color="#F43F5E" />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: { xs: 14, sm: 15 }, fontWeight: 700, color: "#F43F5E" }}>
                    Complete your KYC verification
                  </Typography>
                  <Typography sx={{ fontSize: { xs: 12.5, sm: 13 }, color: "var(--whiold-text-body)", mt: 0.4 }}>
                    Verify your identity to unlock all premium features and seamless
                    withdrawals.
                  </Typography>
                </Box>
              </Box>
              <ButtonComponent
                sx={{
                  background: "#F43F5E",
                  boxShadow: "0 10px 24px -8px rgba(244,63,94,0.45)",
                  flexShrink: 0,
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": { background: "#E11D48" },
                }}
              >
                Verify Now
              </ButtonComponent>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CARD */}
      <div className="whiold-foil-border relative">
        <Box
          className="overflow-hidden rounded-[24px] border"
          sx={{
            borderColor: "var(--whiold-border)",
            background: "var(--whiold-bg)",
            boxShadow: "var(--whiold-shadow-card)",
          }}
        >
          {/* Cover banner */}
          <Box
            className="relative h-20 w-full sm:h-28 md:h-32"
            sx={{ background: "var(--whiold-gradient-brand)" }}
          >
            <Box
              className="absolute inset-0 opacity-10"
              sx={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, #fff 0%, transparent 45%), radial-gradient(circle at 80% 70%, #fff 0%, transparent 40%)",
              }}
            />
          </Box>

          <Box className="px-4 pb-5 sm:px-6 sm:pb-6 md:px-8">
            <Box className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
              <Box className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:gap-4">
                <Box
                  position="relative"
                  className="shrink-0 -mt-10 sm:-mt-12 md:-mt-14"
                >
                  <Avatar
                    src={profileImage?.url || ""}
                    sx={{
                      width: { xs: 76, sm: 88, md: 96 },
                      height: { xs: 76, sm: 88, md: 96 },
                      fontSize: { xs: 24, sm: 28, md: 30 },
                      fontWeight: 700,
                      border: "4px solid var(--whiold-bg)",
                      bgcolor: "var(--whiold-primary)",
                      boxShadow: "var(--whiold-shadow-card)",
                    }}
                  >
                    {!profileImage?.url && user?.name?.charAt(0)}
                  </Avatar>
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </Box>

                <Box className="min-w-0 pb-1">
                  <Box className="flex flex-wrap items-center gap-2.5">
                    <Typography
                      className="whiold-profile-serif truncate"
                      sx={{
                        fontSize: { xs: 21, sm: 24, md: 26 },
                        fontWeight: 700,
                        color: "var(--whiold-text-heading)",
                        textTransform: "capitalize",
                        lineHeight: 1.15,
                        maxWidth: { xs: "60vw", sm: "none" },
                      }}
                    >
                      {user?.name}
                    </Typography>

                    <AnimatePresence>
                      {isEditing && (
                        <motion.button
                          type="button"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.85 }}
                          transition={{ duration: 0.18 }}
                          onClick={() => fileInputRef.current.click()}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-bold transition-colors"
                          style={{
                            background: "var(--whiold-primary-soft)",
                            color: "var(--whiold-primary)",
                            border: "1px solid var(--whiold-primary)",
                          }}
                        >
                          <Camera size={13} />
                          Change Photo
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </Box>

                  <Box className="mt-1 flex flex-wrap items-center gap-2">
                    <Typography
                      className="truncate"
                      sx={{
                        fontSize: 13.5,
                        color: "var(--whiold-text-muted)",
                        maxWidth: { xs: "60vw", sm: "none" },
                      }}
                    >
                      {user?.email}
                    </Typography>
                    {user?.isKycVerified && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          background: "var(--whiold-primary-soft)",
                          color: "var(--whiold-primary)",
                        }}
                      >
                        <Sparkles size={10} /> Verified
                      </span>
                    )}
                  </Box>
                </Box>
              </Box>

              {user?.sponsor?.userId && (
                <Box
                  className="inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5"
                  sx={{
                    bgcolor: "var(--whiold-bg-soft)",
                    border: "1px solid var(--whiold-border)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "var(--whiold-text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Sponsor ID
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "var(--whiold-text-heading)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.sponsor.userId}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: { xs: 3, sm: 4 }, borderColor: "var(--whiold-border)" }} />

            {/* DETAILS */}
            <Grid container spacing={{ xs: 2, sm: 2.5 }}>
              <Grid item xs={12} md={6}>
                {renderField("Full Name", user.name, "name")}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderField("Email Address", user.email, "email")}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderField("Mobile Number", user.mobile, "mobile")}
              </Grid>
              <Grid item xs={12} md={6}>
                {renderField("Area Address", user?.address?.area, "address")}
              </Grid>
            </Grid>

            {/* ACTION BUTTONS */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Box
                    sx={{
                      mt: { xs: 3, sm: 4 },
                      pt: { xs: 2.5, sm: 3 },
                      borderTop: "1px solid var(--whiold-border)",
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <ButtonComponent
                      variant="text"
                      startIcon={<X size={16} />}
                      onClick={() => setIsEditing(false)}
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      Cancel
                    </ButtonComponent>
                    <ButtonComponent
                      onClick={handleSave}
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                    >
                      Save Changes
                    </ButtonComponent>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </div>

      <CropModal
        open={cropModalOpen}
        src={cropSrc}
        onCancel={handleCropCancel}
        onSave={handleCropSave}
      />
    </Box>
  );
};

export default ProfilePage;