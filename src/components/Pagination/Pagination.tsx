import React, { useState } from "react";

export const Pagination = () => {
  const [page, setPage] = useState(1);

  const handleNextPage = () => {
    setPage((page) => page + 1);
  };

  const handlePrevPage = () => {
    setPage((page) => Math.max(page - 1, 1));
  };

  return (
    <div className="join bg-neutral flex justify-center py-2 rounded-none">
      <button onClick={handlePrevPage} disabled={page === 1} className="join-item btn">
        «
      </button>
      <button className="join-item btn">Page {page}</button>
      <button onClick={handleNextPage} className="join-item btn">
        »
      </button>
    </div>
  );
};
