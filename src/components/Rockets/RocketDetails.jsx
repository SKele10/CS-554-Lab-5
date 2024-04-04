import { useEffect, useState, useRef } from "react";
import api, { RocketsURL } from "../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import noimage from "/noimage.png";

const RocketDetails = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [rocket, setRocket] = useState(null);
  const getVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
    );
    return match && match[1];
  };
  useEffect(() => {
    api
      .post(`${RocketsURL}/query`, {
        query: {
          _id: id,
        },
        options: {
          populate: [],
        },
      })
      .then((response) => {
        const { data } = response;
        if (data.docs.length > 0) {
          setRocket(data.docs[0]);
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
  if (!rocket)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-t-4 border-r-4 border-b-4 border-l-4 border-gray-900 animate-spin"></div>
      </div>
    );
  return (
    <div className="container mx-auto px-4 mt-8 font-oswald">
      <h1 className="text-3xl font-bold mb-4 flex items-center">
        {rocket.name || "N/A"}
      </h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white col-span-2 rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <div className="flex items-center mt-4">
            {rocket.flickr_images.length > 0 ? (
              <img
                src={rocket.flickr_images[0]}
                alt={rocket.name}
                className="w-60 h-full object-cover mr-4"
              />
            ) : (
              <img
                src={noimage}
                alt="No Image"
                className="w-60 h-full object-cover mr-4"
              />
            )}
            <div>
              <p className="text-gray-600">Type: {rocket.type || ""}</p>
              <p className="text-gray-600">Country: {rocket.country || ""}</p>
              <p className="text-gray-600">Company: {rocket.company || ""}</p>
              <p className="text-gray-600">
                First Flight: {rocket.first_flight || ""}
              </p>
              {rocket.cost_per_launch && (
                <p className="text-gray-600">
                  Cost per launch: {rocket.cost_per_launch} USD
                </p>
              )}
              {rocket.success_rate_pct && (
                <p className="text-gray-600">
                  Success Rate: {rocket.success_rate_pct}
                </p>
              )}
              <p className="text-gray-600 flex items-center">
                Active:{" "}
                {rocket.active ? (
                  <CheckCircleIcon className="text-green-500 ml-1" />
                ) : (
                  <CancelIcon className="text-red-500 ml-1" />
                )}
              </p>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 text-center p-1 w-16">
                <a
                  href={rocket.wikipedia || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Wikipedia
                </a>
              </div>
            </div>
          </div>
          <p className="text-gray-600 mt-4">{rocket.description || ""}</p>
        </div>
        <div className="grid grid-rows-2 gap-4">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-2">Dimensionality</h2>
            {rocket.height && (
              <p className="text-gray-600">
                Height: {rocket.height.meters} meters
              </p>
            )}
            {rocket.diameter && (
              <p className="text-gray-600">
                Diameter: {rocket.diameter.meters} meters
              </p>
            )}
            {rocket.mass && (
              <p className="text-gray-600">Mass: {rocket.mass.lb} lbs</p>
            )}
            {rocket.landing_legs && (
              <p className="text-gray-600">
                Number of Landing Legs: {rocket.landing_legs.number}
              </p>
            )}
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-2">Payload Weights</h2>
            <div className="overflow-x-auto">
              <div className="flex">
                {rocket.payload_weights &&
                  rocket.payload_weights.map((payload) => (
                    <div
                      key={payload.id}
                      className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-4 mr-4 whitespace-nowrap flex-shrink-0"
                    >
                      <h3 className="text-lg font-semibold">{payload.name}</h3>
                      <p>{payload.lb} lbs</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-2">Engines</h2>
          {rocket.engines && (
            <>
              <p className="text-gray-600">Type: {rocket.engines.type}</p>
              <p className="text-gray-600">Version: {rocket.engines.version}</p>
              <p className="text-gray-600">Layout: {rocket.engines.layout}</p>
              <p className="text-gray-600">
                Propellant 1: {rocket.engines.propellant_1}
              </p>
              <p className="text-gray-600">
                Propellant 2: {rocket.engines.propellant_2}
              </p>
              <p className="text-gray-600">
                Thrust-Weight: {rocket.engines.thrust_to_weight}
              </p>
              <p className="text-gray-600">
                Thrust Sea Level: {rocket.engines.thrust_sea_level.kN} kN
              </p>
              <p className="text-gray-600">
                Thrust Vacuum: {rocket.engines.thrust_vacuum.kN} kN
              </p>
            </>
          )}
        </div>
        <div className="bg-white col-span-2 rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-2">Stages</h2>
          <div className="overflow-x-auto">
            <div className="flex">
              {rocket.first_stage && (
                <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-4 px-8 mr-4 whitespace-nowrap flex-shrink-0">
                  <h3 className="text-lg font-semibold">First Stage</h3>
                  <p className="text-gray-600">
                    Engines: {rocket.first_stage.engines}
                  </p>
                  <p className="text-gray-600">
                    Burn Time: {rocket.first_stage.burn_time_sec} seconds
                  </p>
                  <p className="text-gray-600">
                    Thrust Sea Level: {rocket.first_stage.thrust_sea_level.kN}{" "}
                    kN
                  </p>
                  <p className="text-gray-600">
                    Thrust Vacuum: {rocket.first_stage.thrust_vacuum.kN} kN
                  </p>
                  <p className="text-gray-600">
                    Fuel Amount: {rocket.first_stage.fuel_amount_tons} tons
                  </p>
                  <p className="text-gray-600 flex items-center">
                    Reusable:{" "}
                    {rocket.first_stage.reusable ? (
                      <CheckCircleIcon className="text-green-500 ml-1" />
                    ) : (
                      <CancelIcon className="text-red-500 ml-1" />
                    )}
                  </p>
                </div>
              )}
              {rocket.second_stage && (
                <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-4 px-8 mr-4 whitespace-nowrap flex-shrink-0">
                  <h3 className="text-lg font-semibold">Second Stage</h3>
                  <p className="text-gray-600">
                    Engines: {rocket.second_stage.engines}
                  </p>
                  <p className="text-gray-600">
                    Payloads: {rocket.second_stage.payloads.option_1}
                  </p>
                  <p className="text-gray-600">
                    Burn Time: {rocket.second_stage.burn_time_sec} seconds
                  </p>
                  <p className="text-gray-600">
                    Thrust: {rocket.second_stage.thrust.kN} kN
                  </p>
                  <p className="text-gray-600">
                    Fuel Amount: {rocket.second_stage.fuel_amount_tons} tons
                  </p>
                  <p className="text-gray-600 flex items-center">
                    Reusable:{" "}
                    {rocket.second_stage.reusable ? (
                      <CheckCircleIcon className="text-green-500 ml-1" />
                    ) : (
                      <CancelIcon className="text-red-500 ml-1" />
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RocketDetails;
