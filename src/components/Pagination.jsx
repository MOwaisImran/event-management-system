export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages) return null;
  // Ticketmaster only allows size * page < 1000 ("deep paging" limit)
  const maxPage = Math.min(totalPages, Math.floor(1000 / 12)) - 1;
  if (maxPage <= 0) return null;
  return (
    <div className="pagination">
      <button className="btn btn-outline" disabled={page <= 0} onClick={() => onChange(page - 1)}>← Prev</button>
      <span>Page {page + 1} of {maxPage + 1}</span>
      <button className="btn btn-outline" disabled={page >= maxPage} onClick={() => onChange(page + 1)}>Next →</button>
    </div>
  );
}