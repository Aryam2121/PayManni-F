import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="text-center mt-20">
    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p className="mb-6">Oops! The page you're looking for doesn't exist.</p>
    <Link to="/" className="text-blue-500 underline">Go back home</Link>
  </div>
);

export default NotFound;
