"use client";

export default function FilterSidebar() {
  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Filters</h3>
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Category</h4>
        <div className="flex flex-col gap-2">
          <label><input type="checkbox" /> Electronics</label>
          <label><input type="checkbox" /> Fashion</label>
          <label><input type="checkbox" /> Home</label>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-2">Price</h4>
        <input type="range" min="0" max="500" className="w-full accent-blue-600" />
      </div>
    </div>
  );
}
