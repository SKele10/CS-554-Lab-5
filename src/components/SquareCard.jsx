const SquareCard = ({ title, name }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 p-4">
      <p>{title}</p>
      <h3 className="text-lg font-semibold text-sk-7">{name}</h3>
    </div>
  );
};

export default SquareCard;
