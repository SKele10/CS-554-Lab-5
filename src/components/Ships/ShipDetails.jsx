import { useEffect, useState, useRef } from "react";
import api, { ShipsURL } from "../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import noimage from "/noimage.png";

const ShipDetails = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [ship, setShip] = useState(null);
  const getVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
    );
    return match && match[1];
  };
  useEffect(() => {
    api
      .post(`${ShipsURL}/query`, {
        query: {
          _id: id,
        },
        options: {
          populate: ["launches"],
        },
      })
      .then((response) => {
        const { data } = response;
        if (data.docs.length > 0) {
          setShip(data.docs[0]);
        } else
          throw {
            response: { status: 404, statusText: "Not Found" },
          };
      })
      .catch((error) => {
        const data = {
          code: error.response.status,
          text: error.response.statusText,
        };
        navigate("/error", { state: data });
      });
  }, []);
  if (!ship)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-t-4 border-r-4 border-b-4 border-l-4 border-gray-900 animate-spin"></div>
      </div>
    );
  return (
    <div className="container mx-auto px-4 mt-8 font-oswald">
      <h1 className="text-3xl font-bold mb-4 flex items-center">
        {ship.name || "N/A"}
      </h1>
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <div className="flex items-center mt-4">
            {ship.image ? (
              <img
                src={ship.image}
                alt={ship.name}
                className="w-72 h-full object-cover mr-4"
              />
            ) : (
              <img
                src={noimage}
                alt="No Image"
                className="w-72 h-full object-cover mr-4"
              />
            )}
            <div>
              <p className="text-gray-600">Type: {ship.type || ""}</p>
              <p className="text-gray-600">Home Port: {ship.home_port || ""}</p>
              {ship.mass_lbs && (
                <p className="text-gray-600">Mass: {ship.mass_lbs} lbs</p>
              )}
              {ship.year_built && (
                <p className="text-gray-600">Year Built: {ship.year_built}</p>
              )}
              {ship.roles.length > 0 && (
                <p className="text-gray-600 flex items-center">
                  Roles:{" "}
                  <ul className="list-none flex flex-wrap">
                    {ship.roles.map((role, index) => (
                      <li key={index} className="inline-block mr-2">
                        <span className="bg-sk-6 text-sk-5 rounded-full px-3 py-1 text-sm font-semibold">
                          {role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </p>
              )}
              <p className="text-gray-600">
                Number of Launches: {ship.launches ? ship.launches.length : 0}
              </p>
              <p className="text-gray-600 flex items-center">
                Active:{" "}
                {ship.active ? (
                  <CheckCircleIcon className="text-green-500 ml-1" />
                ) : (
                  <CancelIcon className="text-red-500 ml-1" />
                )}
              </p>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 text-center p-1 w-16">
                <a
                  href={ship.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Link
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-2">Launches</h2>
          <ul className="grid grid-cols-3 gap-4">
            {ship.launches.length > 0 &&
              ship.launches.map((launch, index) => (
                <li
                  key={launch.id}
                  className="bg-gray-100 rounded-lg shadow-lg p-4 grid grid-cols-2 gap-4"
                >
                  <div>
                    <Link
                      to={`/launches/${launch.id}`}
                      className="flex items-center hover:text-sk-7 w-fit"
                    >
                      <h3 className="text-lg font-semibold  mb-2  hover:underline w-fit">
                        {launch.name || "N/A"}
                      </h3>
                    </Link>
                    <p className="text-gray-600 flex items-center">
                      Flight Number: {launch.flight_number}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      Number of Ships: {launch.ships.length}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      Number of Capsules: {launch.capsules.length}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      Number of Payloads: {launch.payloads.length}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      Success:{" "}
                      {launch.success ? (
                        <CheckCircleIcon className="text-green-500 ml-1" />
                      ) : (
                        <CancelIcon className="text-red-500 ml-1" />
                      )}
                    </p>
                    <div className="flex gap-2">
                      <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-2 w-fit">
                        <a
                          href={launch.article || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Article
                        </a>
                      </div>
                      <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-2 w-fit">
                        <a
                          href={launch.wikipedia || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Wikipedia
                        </a>
                      </div>
                    </div>
                  </div>
                  {launch.links.patch.large ? (
                    <img
                      src={launch.links.patch.large}
                      alt={launch.name}
                      className="w-40 h-40 object-cover"
                    />
                  ) : (
                    <img
                      src={noimage}
                      alt="No Image"
                      className="w-40 h-full object-cover"
                    />
                  )}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShipDetails;
