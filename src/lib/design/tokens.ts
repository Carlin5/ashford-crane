export const colors = {
  navy900: "#0B1220",
  navy700: "#16213A",
  midnight600: "#1E2E4F",
  charcoal950: "#141518",
  charcoal900: "#1C1E22",
  charcoal500: "#4B4F58",
  platinum200: "#DADFE6",
  platinum100: "#EEF1F5",
  champagne500: "#C9A46B",
  success600: "#2E7D5B",
  warning600: "#B8863B",
  danger600: "#B3392C",
  info600: "#3D6FA6",
  white: "#FFFFFF",
} as const;

export const spacing = [8, 16, 24, 32, 48, 64, 96] as const;

export const easing = {
  glide: [0.22, 1, 0.36, 1] as const,
  settle: [0.4, 0, 0.2, 1] as const,
};

export const radii = {
  card: "0.625rem",
  min: "0.5rem",
  max: "0.75rem",
} as const;
