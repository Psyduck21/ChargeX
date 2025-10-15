import React from "react";
import { MapPin } from "lucide-react";

// Simple inline Card components
const Card = ({ children, className = '' }) => (
  <div className={`border rounded-lg shadow p-4 bg-white ${className}`}>{children}</div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-2 flex items-center justify-between ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`text-sm text-gray-600 space-y-1 ${className}`}>{children}</div>
);

const StationCard = ({ stations = [] }) => {
  if (!stations.length) {
    return (
      <div className="text-center text-gray-500 mt-6">
        No stations available.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
      {stations.map((station, index) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-shadow duration-300 cursor-pointer rounded-2xl border border-gray-200"
        >
          <CardHeader>
            <CardTitle>{station.name || "Unnamed Station"}</CardTitle>
            <MapPin className="w-5 h-5 text-blue-600" />
          </CardHeader>

          <CardContent>
            <p>
              <span className="font-medium text-gray-800">Latitude:</span> {station.latitude || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Longitude:</span> {station.longitude || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Address:</span> {station.address || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-800">City:</span> {station.city || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-800">State:</span> {station.state || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Country:</span> {station.country || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-800">ZIP Code:</span> {station.zip_code || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Capacity:</span> {station.capacity || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Available Slots:</span> {station.available_slot || "N/A"}
            </p>
            <p>
              <span className="font-medium text-gray-800">Status:</span> {station.status || "Unknown"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StationCard;
