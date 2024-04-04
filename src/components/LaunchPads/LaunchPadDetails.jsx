import { useEffect, useState, useRef } from "react";
import api, { LaunchPadsURL } from "../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import noimage from "/noimage.png";
import Globe from "react-globe.gl";

const LaunchPadDetails = () => {
  let { id } = useParams();
  const navigate = useNavigate();
  const [launchpad, setLaunchpad] = useState(null);
  const getVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
    );
    return match && match[1];
  };
  const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="black" cx="14" cy="14" r="7"></circle>
  </svg>`;

  const getColorClass = (status) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "inactive":
        return "text-gray-300";
      case "unknown":
        return "text-yellow-500";
      case "retired":
        return "text-blue-500";
      case "lost":
        return "text-red-500";
      case "under construction":
        return "text-orange-500";
      default:
        return "text-gray-400";
    }
  };
  const getColorHexCode = (status) => {
    switch (status) {
      case "active":
        return "#10B981";
      case "inactive":
        return "#D1D5DB";
      case "unknown":
        return "#F59E0B";
      case "retired":
        return "#3B82F6";
      case "lost":
        return "#EF4444";
      case "under construction":
        return "#F97316";
      default:
        return "#9CA3AF";
    }
  };
  useEffect(() => {
    api
      .post(`${LaunchPadsURL}/query`, {
        query: {
          _id: id,
        },
        options: {
          populate: ["rockets"],
        },
      })
      .then((response) => {
        const { data } = response;
        if (data.docs.length > 0) {
          setLaunchpad(data.docs[0]);
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

  const globeEl = useRef(undefined);
  useEffect(() => {
    if (globeEl.current && typeof globeEl.current.pointOfView === "function") {
      globeEl.current.pointOfView({
        lat: launchpad.latitude,
        lng: launchpad.longitude,
        altitude: 1.5,
      });
    }
  }, [globeEl, launchpad?.latitude, launchpad?.longitude]);
  if (!launchpad)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-t-4 border-r-4 border-b-4 border-l-4 border-gray-900 animate-spin"></div>
      </div>
    );
  return (
    <div className="container mx-auto px-4 mt-8 font-oswald">
      <h1 className="text-3xl font-bold mb-4 flex items-center">
        {launchpad.name || "N/A"}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <div className="flex items-center mt-4">
            {launchpad.images.large ? (
              <img
                src={launchpad.images.large}
                alt={launchpad.name}
                className="w-52 h-full object-cover mr-4"
              />
            ) : (
              <img
                src={noimage}
                alt="No Image"
                className="w-52 h-full object-cover mr-4"
              />
            )}
            <div>
              <p className="text-gray-600">Full Name: {launchpad.full_name}</p>
              <p className="text-gray-600">Locality: {launchpad.locality}</p>
              <p className="text-gray-600">Region: {launchpad.region}</p>
              <p className="text-gray-600">Timezone: {launchpad.timezone}</p>
              <p className="text-gray-600">
                Status:{" "}
                <span className={getColorClass(launchpad.status)}>
                  {launchpad.status}
                </span>
              </p>
            </div>
          </div>
          <p className="mt-4">{launchpad.details || ""}</p>
        </div>
        <div className="bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-lg border border-gray-200">
          <Globe
            backgroundColor="#00000000"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            width={300}
            height={300}
            htmlElementsData={[
              {
                lat: launchpad.latitude,
                lng: launchpad.longitude,
                size: 30,
                color: getColorHexCode(launchpad.status),
              },
            ]}
            htmlElement={(d) => {
              const el = document.createElement("div");
              el.innerHTML = markerSvg;
              el.style.color = d.color;
              el.style.width = `${d.size}px`;

              return el;
            }}
            ref={globeEl}
          />
        </div>
        <div className="bg-white col-span-2 rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-2">Rockets</h2>
          <ul className="grid grid-cols-2 gap-4">
            {launchpad.rockets.length > 0 &&
              launchpad.rockets.map((rocket, index) => (
                <li
                  key={rocket.id}
                  className="bg-gray-100 rounded-lg shadow-lg p-4 grid grid-cols-2 gap-4"
                >
                  <div>
                    <Link
                      to={`/rockets/${rocket.id}`}
                      className="flex items-center hover:text-sk-7 w-fit"
                    >
                      <h3 className="text-lg font-semibold  mb-2  hover:underline w-fit">
                        {rocket.name || "N/A"}
                      </h3>
                    </Link>
                    <p className="text-gray-600 flex items-center">
                      Active:{" "}
                      {rocket.active ? (
                        <CheckCircleIcon className="text-green-500 ml-1" />
                      ) : (
                        <CancelIcon className="text-red-500 ml-1" />
                      )}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      Cost per Launch: {rocket.cost_per_launch} USD
                    </p>
                    <p className="text-gray-600 flex items-center">
                      Success Rate: {rocket.success_rate_pct}%
                    </p>
                    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-2 w-fit">
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

                  {rocket.flickr_images.length > 0 ? (
                    <img
                      src={rocket.flickr_images[0]}
                      alt={rocket.name}
                      className="w-40 h-full object-cover"
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

export default LaunchPadDetails;
