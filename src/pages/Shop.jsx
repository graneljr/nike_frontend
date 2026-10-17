import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductGrid from "../components/ProductGrid";
import api from "@/middleware/apiMiddleware";
import { toast } from "sonner";

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const categoryFromUrl = searchParams.get("category") || "All";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  function handleCategoryChange(category) {
    setSelectedCategory(category);
    setSearchParams(category === "All" ? {} : { category });
  }

  useEffect(() => {
    const getProductByCategory = async () => {
      try {
        
        const endpoint =
          selectedCategory === "All"
            ? "/products"
            : `/products/${selectedCategory.toLowerCase()}`;
            
        const response = await api.get(endpoint);
        const productList = Array.isArray(response) ? response : response?.data || [];
        setProducts(productList);
      } catch (error) {
        toast.error(error?.data?.message || "Something went wrong");
        setProducts([]);
      }
    };
    getProductByCategory();
  }, [selectedCategory]);
  const filteredProducts = (Array.isArray(products) ? products : []).filter((product) => {
    const matchesSearch = product?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase()) ?? false;
    const matchesCategory =
      selectedCategory === "All" ||
      product?.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-8 sm:py-14 lg:py-20">
      <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
        Find your pair
      </p>
      <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
        Shop Nike
      </h1>
      <div className="my-10 flex flex-col gap-5 border-y border-zinc-200 py-6 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <CategoryFilter
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
        />
      </div>
      <p className="mb-6 text-sm text-zinc-500">
        {filteredProducts.length} products
      </p>
      <ProductGrid products={filteredProducts} />
    </section>
  );
}

export default Shop;
