type PaginationProps = {
  pageNumber: number;
  onClickPrev: () => void;
  onClickNext: () => void;
};

function Pagination({ pageNumber, onClickPrev, onClickNext }: PaginationProps) {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        onClick={onClickPrev}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ← Previous
      </button>
      <p>{pageNumber}</p>
      <button
        onClick={onClickNext}
        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        Next →
      </button>
    </div>
  );
}

export default Pagination;
