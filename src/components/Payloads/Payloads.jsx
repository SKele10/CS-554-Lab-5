import { useEffect, useState, useCallback } from "react";
import api, { PayloadsURL } from "../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const PayloadCard = ({ id, name, type, orbit, mass, reused, date }) => {
  return (
    <Link to={`/payloads/${id}`}>
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out">
        <div className="p-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <p className="text-gray-600">Type: {type}</p>
          <p className="text-gray-600">Orbit: {orbit}</p>
          {mass && <p className="text-gray-600">Mass: {mass} lbs</p>}
          <p className="text-gray-600">
            Launched: {new Date(date).toDateString()}
          </p>
          <p className="text-gray-600 flex items-center">
            Reused:{" "}
            {reused ? (
              <CheckCircleIcon className="text-green-500 ml-1" />
            ) : (
              <CancelIcon className="text-red-500 ml-1" />
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

const Payloads = () => {
  const [payloads, setPayloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
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
      navigate(`/payloads/page/${newPage - 1}`);
      api
        .post(PayloadsURL + "/query", {
          query: {
            name: { $regex: search !== 0 ? search : searchText, $options: "i" },
          },
          options: {
            page: newPage,
            limit: pagination.limit,
            populate: ["launch"],
          },
        })
        .then((response) => {
          const data = response.data;
          setPayloads(data.docs);
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
      .post(PayloadsURL + "/query", {
        query: {},
        options: {
          page: pagination.page,
          limit: pagination.limit,
          populate: ["launch"],
        },
      })
      .then((response) => {
        const data = response.data;
        setPayloads(data.docs);
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
        label="Search payloads"
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
          <div className="grid grid-cols-5 gap-4">
            {payloads.map((payload) => (
              <PayloadCard
                key={payload.id}
                id={payload.id}
                name={payload.name}
                mass={payload.mass_lbs}
                orbit={payload.orbit}
                reused={payload.reused}
                type={payload.type}
                date={payload.launch.date_utc}
              />
            ))}
          </div>

          <div className="p-6">
            <Pagination
              count={pagination.totalPages}
              variant="outlined"
              shape="rounded"
              hideNextButton={!pagination.hasNext}
              hidePrevButton={!pagination.hasPrevious}
              page={pagination.page}
              onChange={handlePagination}
              className="my-4 flex justify-center"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Payloads;
