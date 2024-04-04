import moment from "moment";

const ClockIcon = ({ time, textSize }) => {
  const hours = moment(time).format("h");
  const minutes = moment(time).format("mm");
  const hourRotation = (hours % 12) * 30 + minutes * 0.5;
  const minuteRotation = minutes * 6;
  return (
    <span
      className={`flex items-center ${textSize || "text-xl"} font-semibold`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="70"
        height="70"
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="#fff"
          stroke="#333"
          strokeWidth="3"
        />
        {/* Hour hand */}
        <line
          x1="50"
          y1="55"
          x2="50"
          y2="30"
          transform={`rotate(${hourRotation} 50 50)`}
          stroke="#333"
          strokeWidth="4"
        />
        {/* Minute hand */}
        <line
          x1="50"
          y1="55"
          x2="50"
          y2="20"
          transform={`rotate(${minuteRotation} 50 50)`}
          stroke="#333"
          strokeWidth="4"
        />
      </svg>
      <text x="50" y="60" textAnchor="middle" fill="#333" fontSize="10">
        {moment(time).format("MMMM Do YYYY, h:mm:ss a")}
      </text>
    </span>
  );
};

export default ClockIcon;
