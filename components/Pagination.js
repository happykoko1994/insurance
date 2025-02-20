export default function Pagination({ currentPage, totalPages, setCurrentPage }) {
    return (
      <div className="flex justify-center space-x-2 mt-6">
        <button
          onClick={() => setCurrentPage(1)}
          className="bg-gray-200 px-3 py-1 rounded-lg shadow hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          В начало
        </button>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="bg-gray-200 px-3 py-1 rounded-lg shadow hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === 1}
        >
          Назад
        </button>
        <span className="text-lg font-semibold">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
          className="bg-gray-200 px-3 py-1 rounded-lg shadow hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage >= totalPages}
        >
          Вперёд
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          className="bg-gray-200 px-3 py-1 rounded-lg shadow hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentPage === totalPages}
        >
          В конец
        </button>
      </div>
    );
  }
  