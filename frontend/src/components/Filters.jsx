export default function Filters({ onFilterChange }) {
  return (
    <div className="flex gap-4 mb-4">
      <select
        className="border p-2 rounded-md"
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="">All Listings</option>
        <option value="1A Soho Loft">1A Soho Loft</option>
        <option value="2B N1 A - 29 Shoreditch Heights">
          2B N1 A - 29 Shoreditch Heights
        </option>
      </select>
    </div>
  );
}
