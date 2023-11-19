import { useQuery } from "@tanstack/react-query";
import { useHistory, useLocation } from "react-router-dom";
import { searchBreedsData, breedsData } from "../API/endpoints";
import { Link } from "react-router-dom";
import { Error } from "../components/Error/Error";
import { Pagination } from "../components/Pagination/Pagination";
import { NoSearchResult } from "../components/NoSearchResult/NoSearchResult";

interface Breed {
  id: string;
  url: string;
  name: string;
  image: {
    id: string;
    width: number;
    height: number;
    url: string;
  };
}

export const GetBreeds: React.FC = () => {
  const history = useHistory();

  const location = useLocation();

  const defaultPageSize = 15;
  const defaultPageNumber = new URLSearchParams(location.search).get("page");
  const query = new URLSearchParams(location.search).get("search");

  const { isLoading, error, data } = useQuery<Breed[]>({
    queryKey: ["breeds", { query, page: defaultPageNumber }],
    queryFn: async () => {
      if (!query || query.trim() === "") {
        return breedsData(parseInt(defaultPageNumber || "1"), defaultPageSize);
      }

      const breeds = await searchBreedsData();

      return breeds.filter((breed: Breed) =>
        breed.name.toLowerCase().includes(query.toLowerCase())
      );
    },
  });

  const handlePageChange = (pageNumber: number) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("page", pageNumber.toString());
    history.push({ search: queryParams.toString() });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-t-5 border-r-1 border-b-4 border-gray-500 h-12 w-12 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Error errorMessage={error.message} />
      </div>
    );
  }

  if (data === undefined) {
    return null;
  }

  if (data.length === 0) {
    return <NoSearchResult />;
  }

  return (
    <div className="flex flex-col items-center">
      <ul
        className={`${
          data.length === 1 || data.length === 2
            ? "flex flex-row justify-between items-center gap-6 py-3"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-3"
        }`}
      >
        {data.map((breed) => (
          <Link
            to={`/dog-details/${breed.id}`}
            key={breed.id}
            className="bg-white rounded-lg shadow-md p-4 text-neutral hover:-translate-y-0.5 transition 0.2s sm:hover-none"
          >
            <h3 className="text-xl font-bold mb-2 flex justify-center">{breed.name}</h3>
            <img
              src={breed.image.url}
              alt={breed.image.id}
              className="w-full h-40 object-contain mb-4 rounded-md"
            />
          </Link>
        ))}
      </ul>
      <Pagination onPageChange={handlePageChange} />
      <div className="mt-4"></div>
    </div>
  );
};