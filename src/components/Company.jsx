import { useEffect, useState } from "react";
import api, { CompanyURL } from "../api";
import { Language, Twitter } from "@mui/icons-material";
import SquareCard from "./SquareCard";
import Map from "./Map";
import "leaflet/dist/leaflet.css";

const Company = () => {
  const [company, setCompany] = useState(null);
  useEffect(() => {
    api.get(CompanyURL).then((response) => {
      setCompany(response.data);
    });
  }, []);

  return (
    company && (
      <div className="container mx-auto px-4 mt-8 font-oswald">
        <h1 className="text-3xl font-semibold mb-4 text-center">
          {company.name}
        </h1>
        <div className="grid grid-cols-6 gap-4">
          <SquareCard title="Founder" name={company.founder} />
          <SquareCard title="Founded" name={company.founded} />
          <SquareCard title="Employees" name={company.employees} />
          <SquareCard title="Vehicles" name={company.vehicles} />
          <SquareCard title="Launch Sites" name={company.launch_sites} />
          <SquareCard
            title="Valuation"
            name={`$${company.valuation.toLocaleString()}`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="mt-6 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p>{company.summary}</p>
          </div>
          <div className="mt-6 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Headquarters</h2>
            <p>
              {company.headquarters.address}, {company.headquarters.city},{" "}
              {company.headquarters.state}
            </p>
            <Map
              address={company.headquarters.address}
              city={company.headquarters.city}
              state={company.headquarters.state}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-6 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Leadership</h2>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <SquareCard title="CEO" name={company.ceo} />
              <SquareCard title="CTO" name={company.cto} />
              <SquareCard title="COO" name={company.coo} />
              <SquareCard
                title="CTO Propulsion"
                name={company.cto_propulsion}
              />
            </div>
          </div>
          <div className="mt-6 bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold">Links</h2>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-4">
                <a
                  href={company.links.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <Language /> Website
                </a>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-4">
                <a
                  href={company.links.flickr}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <Language /> Flickr
                </a>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-4">
                <a
                  href={company.links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <Twitter /> Twitter
                </a>
              </div>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-4">
                <a
                  href={company.links.elon_twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  <Twitter /> Elon Musk
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Company;
