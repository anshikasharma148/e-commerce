"use client";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

export default function ItemCard({ id }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col hover:shadow-lg transition">
      <img src="/logo.png" alt="Product" className="rounded-lg h-40 w-full object-cover mb-3" />
      <h3 className="text-lg font-semibold text-gray-800">Product {id}</h3>
      <p className="text-gray-600">$ {(id * 10).toFixed(2)}</p>
      <button className="mt-3 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        <ShoppingCartIcon className="w-5 h-5" /> Add to Cart
      </button>
    </div>
  );
}
