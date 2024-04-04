import { useEffect, useState, useCallback } from "react";
import api, { ShipsURL } from "../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import noimage from "/noimage.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const ShipCard = ({
  id,
  name,
  image,
  type,
  home_port,
  active,
  numberOfLaunches,
}) => {
  return (
    <Link to={`/ships/${id}`}>
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
          <p className="text-gray-600">Type: {type}</p>
          <p className="text-gray-600">Home Port: {home_port}</p>
          <p className="text-gray-600">
            Number of Launches: {numberOfLaunches}
          </p>
          <p className="text-gray-600 flex items-center">
            Active:{" "}
            {active ? (
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

const Ships = () => {
  const [ships, setShips] = useState([]);
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
    (event, newPage) => {
      setLoading(true);
      setPagination((prev) => ({ ...prev, page: newPage }));
      navigate(`/ships/page/${newPage - 1}`);
      api
        .post(ShipsURL + "/query", {
          query: {},
          options: {
            page: newPage,
            limit: pagination.limit,
          },
        })
        .then((response) => {
          const data = response.data;
          setShips(data.docs);
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
    [navigate, pagination.limit]
  );

  useEffect(() => {
    setLoading(true);
    api
      .post(ShipsURL + "/query", {
        query: {},
        options: {
          page: pagination.page,
          limit: pagination.limit,
        },
      })
      .then((response) => {
        const data = response.data;
        setShips(data.docs);
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
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-12 h-12 border-t-4 border-r-4 border-b-4 border-l-4 border-gray-900 animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-4">
            {ships.map((ship) => (
              <ShipCard
                key={ship.id}
                id={ship.id}
                name={ship.name}
                active={ship.active}
                home_port={ship.home_port}
                image={ship.image}
                numberOfLaunches={ship.launches ? ship.launches.length : 0}
                type={ship.type}
              />
            ))}
          </div>
          {pagination.totalPages > 1 && (
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
          )}
        </>
      )}
    </div>
  );
};

export default Ships;
