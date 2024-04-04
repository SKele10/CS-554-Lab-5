import { useCallback, useEffect, useState } from "react";
import api, { LaunchesURL } from "../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import noimage from "/noimage.png";

const LaunchCard = ({ id, name, flightNumber, image, date, success }) => {
  const isSuccess = success ? "text-green-600" : "text-red-600";

  return (
    <Link to={`/launches/${id}`}>
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-200">
        {image ? (
          <img src={image} alt={name} className="w-full h-40 object-cover" />
        ) : (
          <img
            src={noimage}
            alt="No Image"
            className="w-full h-40 object-cover"
          />
        )}

        <div className="p-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-gray-600">Flight Number: {flightNumber}</p>
          <p className="text-gray-600">Date: {new Date(date).toDateString()}</p>
          <p className={`${isSuccess} font-semibold`}>
            Status: {success ? "Success" : "Failure"}
          </p>
        </div>
      </div>
    </Link>
  );
};

const Launches = () => {
  const [launches, setLaunches] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  let { page } = useParams();
  const [pagination, setPagination] = useState({
    page: parseInt(page) ? parseInt(page) : 0,
    limit: 10,
    hasPrevious: false,
    hasNext: false,
    totalPages: null,
    totalDocs: null,
  });

  const handlePagination = useCallback(
    (event, newPage, search = 0) => {
      setLoading(true);
      setPagination((prev) => ({ ...prev, page: newPage }));
      navigate(`/launches/page/${newPage - 1}`);
      api
        .post(LaunchesURL + "/query", {
          query: {
            name: { $regex: search !== 0 ? search : searchText, $options: "i" },
          },
          options: {
            page: newPage,
            limit: pagination.limit,
          },
        })
        .then((response) => {
          const data = response.data;
          setLaunches(data.docs);
          setPagination({
            page: data.page,
            limit: data.limit,
            hasPrevious: data.hasPrevPage,
            hasNext: data.hasNextPage,
            totalPages: data.totalPages,
            totalDocs: data.totalDocs,
          });
        })
        .catch((error) => {
          const data = {
            code: error.response.status,
            text: error.response.statusText,
          };
          navigate("/error", { state: data });
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [navigate, pagination.limit, searchText]
  );
  const handleSearchTextChange = useCallback(
    (event) => {
      setSearchText(event.target.value);
      handlePagination(null, 1, event.target.value);
    },
    [handlePagination]
  );

  useEffect(() => {
    setLoading(true);
    api
      .post(LaunchesURL + "/query", {
        query: { name: { $regex: searchText, $options: "i" } },
        options: {
          page: pagination.page,
          limit: pagination.limit,
        },
      })
      .then((response) => {
        const data = response.data;
        setLaunches(data.docs);
        setPagination({
          page: data.page,
          limit: data.limit,
          hasPrevious: data.hasPrevPage,
          hasNext: data.hasNextPage,
          totalPages: data.totalPages,
          totalDocs: data.totalDocs,
        });
      })
      .catch((error) => {
        const data = {
          code: error.response.status,
          text: error.response.statusText,
        };
        navigate("/error", { state: data });
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 mt-8 font-oswald">
      <TextField
        label="Search launches"
        variant="outlined"
        value={searchText}
        onChange={handleSearchTextChange}
      />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-t-4 border-r-4 border-b-4 border-l-4 border-gray-900 animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4 mt-4">
            {launches.map((launch) => (
              <LaunchCard
                key={launch.id}
                id={launch.id}
                name={launch.name}
                flightNumber={launch.flight_number}
                image={launch.links.patch.small}
                date={launch.date_utc}
                success={launch.success}
              />
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Pagination
              count={pagination.totalPages}
              variant="outlined"
              shape="rounded"
              hideNextButton={!pagination.hasNext}
              hidePrevButton={!pagination.hasPrevious}
              page={pagination.page}
              onChange={handlePagination}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Launches;
