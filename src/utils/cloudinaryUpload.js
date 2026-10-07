// [MOCK-MIGRATION] original Cloudinary upload code commented out - backend unavailable
/*
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const BASE_URL = import.meta.env.VITE_CLOUDINARY_BASE_URL;

const IMAGE_PRESET = import.meta.env.VITE_CLOUDINARY_IMAGE_PRESET;
// const VIDEO_PRESET = import.meta.env.VITE_CLOUDINARY_VIDEO_PRESET;

const IMAGE_FOLDER = import.meta.env.VITE_CLOUDINARY_IMAGE_FOLDER;
// const VIDEO_FOLDER = import.meta.env.VITE_CLOUDINARY_VIDEO_FOLDER;


const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", IMAGE_PRESET);
  formData.append("folder", IMAGE_FOLDER);

  const response = await fetch(
    BASE_URL,
    { method: "POST", body: formData }
  );

  // console.log("Cloudinary response status:", response);

  const data = await response.json();
  if (!data?.secure_url) throw new Error("Upload failed");
  return data;
};

export const uploadMultipleToCloudinary = async (files = []) => {
  if (!files.length) return [];

//   const url = `${BASE_URL}/${CLOUD_NAME}/image/upload`;
  const url = BASE_URL;

  const uploads = Array.from(files).map((file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", IMAGE_PRESET);
    formData.append("folder", IMAGE_FOLDER);

    return fetch(url, { method: "POST", body: formData })
      .then((r) => r.json())
      .then((d) => {
        if (!d?.secure_url) throw new Error("Upload failed");
        return d.secure_url;
      });
  });

  return Promise.all(uploads);
};



export const deleteFromCloudinary = async (imageUrl) => {
  try {
    const parts = imageUrl.split("/");
    const uploadIndex = parts.indexOf("upload");
    const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;

    const hashBuffer = await crypto.subtle.digest(
      "SHA-1",
      new TextEncoder().encode(stringToSign)
    );

    const signature = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("timestamp", timestamp);
    formData.append("api_key", API_KEY);
    formData.append("signature", signature);

    const res = await fetch(
      `${BASE_URL}/${CLOUD_NAME}/image/destroy`,
      { method: "POST", body: formData }
    );

    const result = await res.json();
    return result.result === "ok";
  } catch (e) {
    console.error("Cloudinary delete error:", e);
    return false;
  }
};
*/

// [MOCK-MIGRATION] Mock image upload — creates a local object URL from the chosen file.
// No network calls are made. The returned shape matches what components expect from Cloudinary.

const mockDelay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

// Persist object-URL → stable path mapping so URLs survive HMR.
// (Object URLs are valid for the lifetime of the page only.)
const _urlCache = {};

export const uploadToCloudinary = async (file) => {
  await mockDelay(600);
  if (!file) throw new Error("No file provided");

  const objectUrl = URL.createObjectURL(file);
  const fakeId = `mock-img-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  _urlCache[fakeId] = objectUrl;

  return {
    secure_url: objectUrl,
    public_id: fakeId,
    imageUrl: objectUrl,
    imageId: fakeId,
    format: file.name.split(".").pop() || "jpg",
    bytes: file.size,
  };
};

export const uploadMultipleToCloudinary = async (files = []) => {
  if (!files.length) return [];
  await mockDelay(800);

  return Array.from(files).map((file) => {
    const objectUrl = URL.createObjectURL(file);
    return objectUrl;
  });
};

export const deleteFromCloudinary = async (_imageUrl) => {
  // No-op in mock mode — nothing to delete from a remote store
  await mockDelay(200);
  return true;
};