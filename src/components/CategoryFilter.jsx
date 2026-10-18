import { PRODUCT_CATEGORIES } from "@/utils/productCategories";

const categories = ["All", ...PRODUCT_CATEGORIES.map(({ label }) => label)];

function CategoryFilter({ selectedCategory, setSelectedCategory }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => setSelectedCategory(category)}
          className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
            selectedCategory === category
              ? "border-black bg-black text-white"
              : "border-zinc-300 bg-white text-black hover:border-black"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
