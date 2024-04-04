import { useEffect, useState, useCallback } from "react";
import api, { RocketsURL } from "../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import noimage from "/noimage.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const RocketCard = ({
  id,
  name,
  image,
  type,
  country,
  company,
  active,
  success_rate_pct,
  first_flight,
}) => {
  return (
    <Link to={`/rockets/${id}`}>
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
          <p className="text-gray-600">Company: {company}</p>
          <p className="text-gray-600">Country: {country}</p>
          <p className="text-gray-600">Success Rate: {success_rate_pct}%</p>
          <p className="text-gray-600">First Flight: {first_flight}</p>
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

const Rockets = () => {
  const [rockets, setRockets] = useState([]);
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
      navigate(`/rockets/page/${newPage - 1}`);
      api
        .post(RocketsURL + "/query", {
          query: {},
          options: {
            page: newPage,
            limit: pagination.limit,
          },
        })
        .then((response) => {
          const data = response.data;
          setRockets(data.docs);
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
      .post(RocketsURL + "/query", {
        query: {},
        options: {
          page: pagination.page,
          limit: pagination.limit,
        },
      })
      .then((response) => {
        const data = response.data;
        setRockets(data.docs);
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
            {rockets.map((rocket) => (
              <RocketCard
                key={rocket.id}
                id={rocket.id}
                name={rocket.name}
                active={rocket.active}
                company={rocket.company}
                country={rocket.country}
                first_flight={rocket.first_flight}
                success_rate_pct={rocket.success_rate_pct}
                image={rocket.flickr_images[0]}
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

export default Rockets;
