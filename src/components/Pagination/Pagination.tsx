import type { PaginationProps } from '../../types';

function Pagination({
  nextUrl,
  prevUrl,
  setUrl,
  pageNumber,
  setPageNumber,
}: PaginationProps) {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        onClick={() => {
          if (prevUrl) {
            setUrl(prevUrl);
            setPageNumber(pageNumber - 1);
          }
        }}
        disabled={!prevUrl}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Previous
      </button>
      <p>{pageNumber}</p>
      <button
        onClick={() => {
          if (nextUrl) {
            setUrl(nextUrl);
            setPageNumber(pageNumber + 1);
          }
        }}
        disabled={!nextUrl}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;
