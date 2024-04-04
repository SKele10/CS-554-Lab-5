import axios from "axios";

export const HistoryURL = "https://api.spacexdata.com/v4/history";
export const CompanyURL = "https://api.spacexdata.com/v4/company";
export const LaunchesURL = "https://api.spacexdata.com/v4/launches";
export const PayloadsURL = "https://api.spacexdata.com/v4/payloads";
export const CoresURL = "https://api.spacexdata.com/v4/cores";
export const RocketsURL = "https://api.spacexdata.com/v4/rockets";
export const ShipsURL = "https://api.spacexdata.com/v4/ships";
export const LaunchPadsURL = "https://api.spacexdata.com/v4/launchpads";

export default axios.create({
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});
