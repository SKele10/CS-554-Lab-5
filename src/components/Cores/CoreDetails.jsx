import { useEffect, useState } from "react";
import api, { CoresURL } from "../../api";
import { Link, useNavigate, useParams } from "react-router-dom";
import YouTube from "react-youtube";
import moment from "moment";
import noimage from "/noimage.png";
import ClockIcon from "../ClockIcon";

const CoreDetails = () => {
  let { id } = useParams();
  const [core, setCore] = useState(null);
  const navigate = useNavigate();
  const getVideoId = (url) => {
    const match = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/
    );
    return match && match[1];
  };
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
  useEffect(() => {
    api
      .post(`${CoresURL}/query`, {
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
          setCore(data.docs[0]);
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
  if (!core)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-t-4 border-r-4 border-b-4 border-l-4 border-gray-900 animate-spin"></div>
      </div>
    );
  return (
    <div className="container mx-auto px-4 mt-8 font-oswald">
      <h1 className="text-3xl font-bold mb-4 flex items-center">
        {core.serial || "N/A"}
      </h1>
      <div className="grid gap-4">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold ">Details</h2>
          <p className="mt-4">
            Status:{" "}
            <span className={getStatusTextColor(core.status)}>
              {core.status}
            </span>
          </p>
          <p>Last Update: {core.last_update || ""}</p>
        </div>
        <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 relative p-6">
          {core.launches.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Launches</h2>
              <div className="grid grid-cols-2">
                {core.launches.map((launch) => (
                  <div
                    key={launch.id}
                    className="bg-gray-100 rounded-lg shadow-lg p-4 grid gap-4"
                  >
                    <Link
                      to={`/launches/${launch.id}`}
                      className="flex items-center hover:text-sk-7 w-fit"
                    >
                      {launch.links.patch.large ? (
                        <img
                          src={launch.links.patch.large}
                          alt={launch.name}
                          className="w-20 h-20 object-cover"
                        />
                      ) : (
                        <img
                          src={noimage}
                          alt="No Image"
                          className="w-20 object-cover"
                        />
                      )}
                      <h3 className="text-lg font-semibold  mb-2  hover:underline w-fit">
                        {launch.name || "N/A"}
                      </h3>
                      {launch.date_utc && (
                        <ClockIcon
                          textSize="text-black text-lg"
                          time={launch.date_utc}
                        />
                      )}
                    </Link>

                    <YouTube
                      videoId={getVideoId(launch.links.webcast)}
                      opts={{ width: "100%" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoreDetails;
