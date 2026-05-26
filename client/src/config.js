export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads/')) return `${API_URL}${imagePath}`;
  return imagePath; // local public asset
};
