import { useEffect, useState } from "react";
import api, { HistoryURL } from "../api";

const History = () => {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    api.get(HistoryURL).then((response) => {
      setHistory(response.data);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 my-4 grid lg:grid-cols-4 gap-4">
      {history &&
        history.map((history, i) => (
          <div
            key={i}
            className="max-w-md mx-auto font-oswald bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold text-sk-7">
                {history.title}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Event Date: {new Date(history.event_date_utc).toDateString()}
              </p>
              <p className="mt-4 h-[100px] overflow-y-auto">
                {history.details}
              </p>
            </div>
            <div className="px-4 py-3 mb-4">
              <a
                href={history.links.article}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-semibold bg-sk-5 hover:bg-sk-7 hover:text-black px-4 py-2 rounded-lg"
              >
                Read More
              </a>
            </div>
          </div>
        ))}
    </div>
  );
};

export default History;
