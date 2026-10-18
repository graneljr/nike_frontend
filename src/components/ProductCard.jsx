import { Link } from "react-router-dom";
import { formatCategories } from "@/utils/productCategories";

function ProductCard({ product }) {
  return (
    <div className="group product-enter">
      <Link to={`/product/${product._id ?? product.id}`} aria-label={`View ${product.name}`}>
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          <img
            src={product.image}
            alt={product.name}
            className="z-0 h-full w-full object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 transition duration-300 group-hover:bg-opacity-20">
            <p className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 text-sm text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {product.description}
            </p>
          </div>
        </div>
        <div className="pt-4">
          <h3 className="font-semibold text-black transition-colors duration-300 group-hover:text-zinc-600">{product.name}</h3>
          <p className="mt-1 text-sm text-zinc-500">{formatCategories(product.category)}</p>
          <p className="mt-2 font-medium text-black">₱{product.price.toLocaleString()}</p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
