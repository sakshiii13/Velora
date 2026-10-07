import React, { useState } from "react";
import { Box, Avatar, Typography, IconButton, CircularProgress } from "@mui/material";
import { ImagePlus, X } from "lucide-react";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import { useSnackbar } from "../context/SnackBarContext";

const ImageUploadComponent = ({
  label,
  subLabel = "PNG or JPG, square works best",
  multiple = false,
  setUploading,
  images = [],
  setImages,
  requiredWidth,
  requiredHeight,
}) => {
  const [localUploading, setLocalUploading] = useState(false);
  const [localPreviews, setLocalPreviews] = useState([]);
  const inputId = `image-upload-${Math.random().toString(36).substr(2, 9)}`;
  const {showSnackbar} = useSnackbar();

  // 🔍 Check image size
  const validateImageSize = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        if (
          requiredWidth &&
          requiredHeight &&
          (img.width !== requiredWidth || img.height !== requiredHeight)
        ) {
          reject(
            new Error(
              `Image must be exactly ${requiredWidth}x${requiredHeight}px`
            )
          );
        } else {
          resolve(true);
        }
      };

      img.onerror = () => {
        reject(new Error("Invalid image file"));
      };

      img.src = objectUrl;
    });
  };

  const handleSelect = async (e) => {
    const target = e.target;
    const files = Array.from(target.files);
    if (!files.length) return;

    try {
      // const previews = files.map(file => URL.createObjectURL(file));
      // setLocalPreviews(previews);

      setLocalUploading(true);
      setUploading?.(true);

      const uploadedImages = [];

      for (const file of files) {
        // ✅ SIZE VALIDATION
        if (requiredWidth && requiredHeight) {
          await validateImageSize(file);
        }

        const uploaded = await uploadToCloudinary(file);

        uploadedImages.push({
          imageUrl: uploaded.secure_url || uploaded.url,
          imageId: uploaded.public_id,
        });
      }

      setLocalPreviews(uploadedImages);

      setImages(
        multiple ? [...images, ...uploadedImages] : uploadedImages.slice(0, 1)
      );
    } catch (error) {
      console.error("Upload error:", error);
      showSnackbar(error.message || "Image upload failed", "error");
    } finally {
      setLocalUploading(false);
      setUploading?.(false);
      // setLocalPreviews([]);
      // Reset the file input so the same file can be selected again
      target.value = "";
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // For single upload preview
  const singleImagePreview = !multiple ? (localPreviews.length > 0 ? localPreviews[0]?.imageUrl : (images.length > 0 ? images[0]?.imageUrl : undefined)) : undefined;

  return (
    <Box className="flex flex-col gap-3">
      {/* Upload Box */}
      <label
        htmlFor={inputId}
        className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed p-3 transition-colors ${
          localUploading ? "opacity-60 pointer-events-none" : ""
        }`}
        style={{ borderColor: "var(--whiold-border)" }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            background: "var(--whiold-primary-soft)",
            color: "var(--whiold-primary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
            position: "relative"
          }}
        >
          {singleImagePreview ? (
            <>
              <img src={singleImagePreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {localUploading && (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(255, 255, 255, 0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress size={20} color="primary" />
                </Box>
              )}
            </>
          ) : localUploading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <ImagePlus size={20} />
          )}
        </Box>
        <Box>
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, color: "var(--whiold-text-heading)" }}
          >
            {label || (singleImagePreview ? "Change image" : "Upload image")}
          </Typography>
          <Typography sx={{ fontSize: 11.5, color: "var(--whiold-text-muted)" }}>
            {localUploading ? "Uploading..." : subLabel}
            {requiredWidth && requiredHeight && !localUploading && (
              <span className="block mt-0.5 opacity-80">
                Required: {requiredWidth}×{requiredHeight}px
              </span>
            )}
          </Typography>
        </Box>
        <input
          id={inputId}
          type="file"
          accept="image/*"
          hidden
          multiple={multiple}
          onChange={handleSelect}
          disabled={localUploading}
        />
      </label>

      {/* Multiple Previews */}
      {multiple && (images.length > 0 || localPreviews.length > 0) && (
        <Box className="flex gap-3 flex-wrap">
          {/* Render already uploaded images */}
          {images.map((img, i) => (
            <Box
              key={`uploaded-${i}`}
              className="relative rounded-xl border overflow-hidden group"
              sx={{ width: 64, height: 64, borderColor: "var(--whiold-border)" }}
            >
              <img
                src={img?.imageUrl}
                alt={`preview-${i}`}
                className="w-full h-full object-cover"
              />
              <IconButton
                size="small"
                onClick={() => removeImage(i)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  background: "rgba(255,255,255,0.85)",
                  padding: "4px",
                  backdropFilter: "blur(4px)",
                  opacity: 0,
                  transition: "opacity 0.2s ease-in-out",
                  ".group-hover &": { opacity: 1 },
                  "&:hover": { background: "rgba(255,255,255,1)", color: "#F43F5E" },
                }}
              >
                <X size={12} strokeWidth={3} />
              </IconButton>
            </Box>
          ))}

          {/* Render uploading local previews */}
          {localUploading && localPreviews.map((previewUrl, i) => (
            <Box
              key={`local-${i}`}
              className="relative rounded-xl border overflow-hidden"
              sx={{ width: 64, height: 64, borderColor: "var(--whiold-border)" }}
            >
              <img
                src={previewUrl}
                alt={`uploading-${i}`}
                className="w-full h-full object-cover"
              />
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(255, 255, 255, 0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress size={20} color="primary" />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ImageUploadComponent;
