import { useEffect, useState } from "react";
import api, { PayloadsURL } from "../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import YouTube from "react-youtube";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import moment from "moment";
import noimage from "/noimage.png";
import ClockIcon from "../ClockIcon";

const PayloadDetails = () => {
  let { id } = useParams();
  const [payload, setPayload] = useState(null);
  const navigate = useNavigate();
  const getVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
    );
    return match && match[1];
  };
  useEffect(() => {
    api
      .post(`${PayloadsURL}/query`, {
        query: {
          _id: id,
        },
        options: {
          populate: ["launch.rocket", "launch", "launch.launchpad"],
        },
      })
      .then((response) => {
        const { data } = response;
        if (data.docs.length > 0) {
          setPayload(data.docs[0]);
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
  if (!payload)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-t-4 border-r-4 border-b-4 border-l-4 border-gray-900 animate-spin"></div>
      </div>
    );
  return (
    <div className="container mx-auto px-4 mt-8 font-oswald">
      <h1 className="text-3xl font-bold mb-4 flex items-center">
        {payload.name || "N/A"}
        {"      "}
        {payload.launch.date_utc ? (
          <ClockIcon time={payload.launch.date_utc} />
        ) : (
          "N/A"
        )}
      </h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="grid gap-4">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <p className="text-gray-600">Type: {payload.type}</p>
            <p className="text-gray-600">Orbit: {payload.orbit}</p>
            {payload.mass_lbs && (
              <p className="text-gray-600">Mass: {payload.mass_lbs} lbs</p>
            )}
            <p className="text-gray-600 flex items-center">
              <span>Launch Date: </span>
            </p>
            <p className="text-gray-600 flex items-center">
              Reused:{" "}
              {payload.reused ? (
                <CheckCircleIcon className="text-green-500 ml-1" />
              ) : (
                <CancelIcon className="text-red-500 ml-1" />
              )}
            </p>
          </div>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-2">Orbital parameters</h2>
            {payload.reference_system && (
              <p className="text-gray-600">
                Reference System: {payload.reference_system}
              </p>
            )}
            {payload.regime && (
              <p className="text-gray-600">Regime: {payload.regime}</p>
            )}
            {payload.semi_major_axis_km && (
              <p className="text-gray-600">
                Semi-major axis: {payload.semi_major_axis_km}
              </p>
            )}
            {payload.eccentricity && (
              <p className="text-gray-600">
                Eccentricity: {payload.eccentricity}
              </p>
            )}
            {payload.periapsis_km && (
              <p className="text-gray-600">
                Perigee altitude: {payload.periapsis_km} km
              </p>
            )}
            {payload.apoapsis_km && (
              <p className="text-gray-600">
                Apogee altitude: {payload.apoapsis_km} km
              </p>
            )}
            {payload.inclination_deg && (
              <p className="text-gray-600">
                Inclination: {payload.inclination_deg}&deg;
              </p>
            )}
            {payload.period_min && (
              <p className="text-gray-600">
                Period: {payload.period_min} minutes
              </p>
            )}
            {payload.epoch && (
              <p className="text-gray-600">
                Epoch: {moment(payload.epoch).format("MMMM Do YYYY, h:mm:ss a")}
              </p>
            )}
          </div>
        </div>
        <div className="bg-white col-span-2 rounded-lg overflow-hidden shadow-lg border border-gray-200 relative p-6">
          {payload.launch.links.webcast && (
            <YouTube
              videoId={getVideoId(payload.launch.links.webcast)}
              opts={{ width: "100%" }}
            />
          )}
        </div>

        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-2">Launch Details</h2>
          <Link to={`/launches/${payload.launch.id}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-sk-7 hover:underline">
              {payload.launch.name || "N/A"}
            </h3>
          </Link>
          <div className="flex items-center mt-4">
            {payload.launch.links.patch.large ? (
              <img
                src={payload.launch.links.patch.large}
                alt={payload.launch.name}
                className="w-40 h-full object-cover"
              />
            ) : (
              <img
                src={noimage}
                alt="No Image"
                className="w-full h-40 object-cover"
              />
            )}
            <div>
              <p className="text-gray-600">
                Launch Date:{" "}
                {payload.launch.date_utc
                  ? moment(payload.launch.date_utc).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )
                  : "N/A"}
              </p>
              <p className="text-gray-600">
                Success:{" "}
                {payload.launch.success ? (
                  <CheckCircleIcon style={{ color: "green" }} />
                ) : (
                  <CancelIcon style={{ color: "red" }} />
                )}
              </p>
            </div>
          </div>
          <p className="mt-4">{payload.launch.details || ""}</p>
          <div className="flex space-x-4">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-4">
              <a
                href={payload.launch.links.article || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Article
              </a>
            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-4">
              <a
                href={payload.launch.links.wikipedia || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Wikipedia
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayloadDetails;
