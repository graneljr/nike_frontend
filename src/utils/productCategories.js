export const PRODUCT_CATEGORIES = [
  { value: "running", label: "Running" },
  { value: "basketball", label: "Basketball" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "training", label: "Training" },
];

const normalizeCategory = (category) => {
  const normalized = String(category ?? "").trim().toLowerCase();
  return normalized === "traning" ? "training" : normalized;
};

export function getCategoryLabels(category) {
  const categories = Array.isArray(category) ? category : [category];
  return categories
    .map(normalizeCategory)
    .filter(Boolean)
    .map((value) =>
      PRODUCT_CATEGORIES.find((option) => option.value === value)?.label ?? value,
    );
}

export function formatCategories(category) {
  return getCategoryLabels(category).join(", ");
}

export function productHasCategory(productCategory, selectedCategory) {
  if (selectedCategory === "All") return true;
  const selected = normalizeCategory(selectedCategory);
  const categories = Array.isArray(productCategory)
    ? productCategory
    : [productCategory];
  return categories.some((category) => normalizeCategory(category) === selected);
}
