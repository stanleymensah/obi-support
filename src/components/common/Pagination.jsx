import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({ pagination }) {
  const { 
    currentPage, totalPages, nextPage, prevPage, 
    goToPage, hasNextPage, hasPrevPage, goToFirstPage, goToLastPage 
  } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-4 py-1 bg-white border-t border-gray-100">
      <div className="text-xs text-gray-500 order-2 md:order-1">
        Page <span className="font-bold text-gray-700">{currentPage}</span> of <span className="font-bold text-gray-700">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2 order-1 md:order-2">
        {/* First Page */}
        <button
          onClick={goToFirstPage}
          disabled={!hasPrevPage}
          className="p-2 md:p-2 h-6 md:h-auto rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors flex items-center justify-center"
          title="First page"
        >
          <ChevronsLeft size={18} />
        </button>

        {/* Previous */}
        <button
          onClick={prevPage}
          disabled={!hasPrevPage}
          className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-100 disabled:opacity-30 transition-colors h-6"
        >
          <ChevronLeft size={14} /> Previous
        </button>

        {/* Mobile Previous (icon only) */}
        <button
          onClick={prevPage}
          disabled={!hasPrevPage}
          className="sm:hidden p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors h-6 w-10 flex items-center justify-center"
          title="Previous"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers (Quick Jump) */}
        <div className="flex items-center gap-1 mx-1">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            // Only show 3 pages around current to prevent overflow
            if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - currentPage) <= 1) {
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`min-w-6 h-6 rounded-full text-xs font-semibold transition-all flex items-center justify-center ${
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

        {/* Mobile Next (icon only) */}
        <button
          onClick={nextPage}
          disabled={!hasNextPage}
          className="sm:hidden p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors h-6 w-10 flex items-center justify-center"
          title="Next"
        >
          <ChevronRight size={16} />
        </button>

        {/* Next */}
        <button
          onClick={nextPage}
          disabled={!hasNextPage}
          className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-100 disabled:opacity-30 transition-colors h-6"
        >
          Next <ChevronRight size={14} />
        </button>

        {/* Last Page */}
        <button
          onClick={goToLastPage}
          disabled={!hasNextPage}
          className="p-2 md:p-2 h-6 md:h-auto rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors flex items-center justify-center"
          title="Last page"
        >
          <ChevronsRight size={18} />
        </button>
      </div>
    </div>
  );
}
