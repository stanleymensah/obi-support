import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({ pagination }) {
  const { 
    currentPage, totalPages, nextPage, prevPage, 
    goToPage, hasNextPage, hasPrevPage, goToFirstPage, goToLastPage 
  } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-100">
      <div className="text-xs text-gray-500">
        Page <span className="font-bold text-gray-700">{currentPage}</span> of <span className="font-bold text-gray-700">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          onClick={goToFirstPage}
          disabled={!hasPrevPage}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
        >
          <ChevronsLeft size={16} />
        </button>

        {/* Previous */}
        <button
          onClick={prevPage}
          disabled={!hasPrevPage}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-gray-100 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={14} /> Previous
        </button>

        {/* Page Numbers (Quick Jump) */}
        <div className="flex items-center gap-1 mx-2">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            // Only show 3 pages around current to prevent overflow
            if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-6 h-6 rounded-full text-xs font-semibold transition-all ${
                    currentPage === pageNum 
                      ? "bg-azure-pop text-white shadow-md shadow-azure-pop/30" 
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {pageNum}
                </button>
              );
            }
            return null;
          })}
        </div>

        {/* Next */}
        <button
          onClick={nextPage}
          disabled={!hasNextPage}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-gray-100 disabled:opacity-30 transition-colors"
        >
          Next <ChevronRight size={14} />
        </button>

        {/* Last Page */}
        <button
          onClick={goToLastPage}
          disabled={!hasNextPage}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}
