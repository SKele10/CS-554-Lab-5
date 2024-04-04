import { useLocation, Link } from "react-router-dom";
import space from "/spacex.png";

const Error = () => {
  const location = useLocation();
  const { code, text } = location.state || {};

  return (
    <div className="font-oswald grid min-h-full place-items-center bg-white py-24 px-8 grid-cols-2 gap-10">
      <div className="text-center">
        <p className="text-5xl font-semibold text-sk-7">{code}</p>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {text}
        </h1>
        <p className="mt-6 text-2xl text-gray-600">
          We couldn`t find the page you`re looking for
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <div className="bg-sk-7 text-lg hover:bg-sk-22 text-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-2">
            <Link to={"/"}>Home</Link>
          </div>
        </div>
      </div>
      <div className="bg-sk-22">
        <img src={space} alt="SpaceXplorer" className="max-w-full h-auto" />
      </div>
    </div>
  );
};

export default Error;
