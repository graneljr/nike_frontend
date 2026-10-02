import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="group">
      <Link to={`/product/${product._id ?? product.id}`} aria-label={`View ${product.name}`}>
        <div className="aspect-square relative overflow-hidden  bg-zinc-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain z-0 p-5 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0  bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300">
            <p className="absolute bottom-0 left-0 right-0 p-4 text-sm text-white opacity-0 group-hover:opacity-100 transition duration-300">
              {product.description}
            </p>
          </div>
        </div>
        <div className="pt-4">
          <h3 className="font-semibold text-black">{product.name}</h3>
          <p className="mt-1 text-sm text-zinc-500">{product.category}</p>
          <p className="mt-2 font-medium text-black">₱{product.price.toLocaleString()}</p>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
