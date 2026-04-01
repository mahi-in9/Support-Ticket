const Loader = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 animate-pulse"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;
