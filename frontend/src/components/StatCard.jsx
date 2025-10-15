import React from "react";
// import { Card, CardContent } from "./ui/card";
// import { motion } from "framer-motion";

const Card = ({ children, className = '' }) => (
  <div className={`border rounded-lg shadow p-4 bg-white ${className}`}>{children}</div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>{children}</div>
);

const StatCard = ({ title, value, icon: Icon, color = "text-blue-600" }) => {
  return (
      <Card className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          {/* {Icon && <Icon className={`w-8 h-8 ${color}`} />} */}
        </CardContent>
      </Card>
  );
};

export default StatCard;
