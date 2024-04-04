import { useEffect, useState, useCallback } from "react";
import api, { CoresURL } from "../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import noimage from "/noimage.png";

const CoreCard = ({ id, serial, image, status }) => {
  const getStatusTextColor = (status) => {
    const lowercaseStatus = status.toLowerCase();

    switch (lowercaseStatus) {
      case "active":
        return "text-green-600";
      case "lost":
        return "text-red-600";
      case "inactive":
        return "text-gray-600";
      case "expended":
        return "text-yellow-600";
      default:
        return "text-black";
    }
  };
  return (
    <Link to={`/cores/${id}`}>
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
          <h3 className="text-lg font-semibold">{serial}</h3>
          <p className={`font-semibold`}>
            Status: <span className={getStatusTextColor(status)}>{status}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

const Cores = () => {
  const [cores, setCores] = useState([]);
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
      navigate(`/cores/page/${newPage - 1}`);
      api
        .post(CoresURL + "/query", {
          query: {
            serial: {
              $regex: search !== 0 ? search : searchText,
              $options: "i",
            },
          },
          options: {
            page: newPage,
            limit: pagination.limit,
            populate: ["launches"],
          },
        })
        .then((response) => {
          const data = response.data;
          setCores(data.docs);
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
      .post(CoresURL + "/query", {
        query: { serial: { $regex: searchText, $options: "i" } },
        options: {
          page: pagination.page,
          limit: pagination.limit,
          populate: ["launches"],
        },
      })
      .then((response) => {
        const data = response.data;
        setCores(data.docs);
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
        label="Search cores"
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
            {cores.map((core) => (
              <CoreCard
                key={core.id}
                id={core.id}
                serial={core.serial}
                status={core.status}
                image={
                  core.launches.length > 0
                    ? core.launches[0].links.patch.small
                    : null
                }
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

export default Cores;
