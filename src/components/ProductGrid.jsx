import ProductCard from "./ProductCard";

function ProductGrid({ products }) {
  if (products?.length === 0) {
    return (
      <div className="border-y border-zinc-200 py-20 text-center">
        <p className="text-lg font-medium">No products found.</p>
        <p className="mt-2 text-sm text-zinc-500">Try a different search or category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
