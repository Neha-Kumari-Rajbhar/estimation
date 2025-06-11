import React, { useState, useContext } from "react"; // Import useContext
import axios from "axios";
import { UserDataContext } from "../context/UserContext"; // Corrected context import

const SearchButtonSection = () => {
  const { user } = useContext(UserDataContext); // Access user from context
  const [productType, setProductType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    type: "", // This will be 'specifications' or 'requirements'
    make: "",
    model: "",
  });
  const [currencyPreference, setCurrencyPreference] = useState("INR"); // New state for currency
  const [estimationResult, setEstimationResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
    setFormData({ name: "", type: "", make: "", model: "" });
    setEstimationResult("");
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCurrencyChange = (e) => {
    setCurrencyPreference(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setEstimationResult("");
    setError("");

    let prompt = "";
    // Construct the prompt based on the selected productType
    if (productType === "ExactMakeModel") {
      prompt = `Item Name: ${formData.name}, Type: ${formData.type}, Make: ${formData.make}, Model: ${formData.model}`;
    } else if (productType === "RelevantSpecifications") {
      prompt = `Item Name: ${formData.name}, Specifications: ${formData.type}`;
    } else if (productType === "BasicRequirements") {
      prompt = `Service Name: ${formData.name}, Requirements: ${formData.type}`;
    }

    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000'; // Define BASE_URL

      const response = await axios.post(`${BASE_URL}/api/estimate`, {
        prompt,
        currencyPreference, // Send currency preference to backend
        userId: user ? user._id : null, // Send userId if available for history tracking
        productType: productType, // Send productType for history
        formData: formData // Send formData for history
      });
      setEstimationResult(response.data.estimation);
    } catch (err) {
      console.error("Error fetching estimation:", err);
      setError("Failed to get cost estimation. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <h3 className="text-lg md:text-xl font-semibold mb-4 text-center text-gray-800">
          Enter Product Details
        </h3>

        {!productType ? (
          <div className="mb-4">
            <label className="block text-sm md:text-base font-medium text-gray-700">
              Product Type:
            </label>
            <select
              value={productType}
              onChange={handleProductTypeChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            >
              <option value="">Select a product type</option>
              <option value="ExactMakeModel">
                Query based on exact Make/Model of a Product
              </option>
              <option value="RelevantSpecifications">
                Query based on Most Relevant Specifications of a Product
              </option>
              <option value="BasicRequirements">
                Query based on Basic Requirements of a Service
              </option>
            </select>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
              {productType === "ExactMakeModel"
                ? "Exact Make/Model Search"
                : productType === "RelevantSpecifications"
                ? "Relevant Specifications Search"
                : "Basic Requirements Search"}
            </h3>

            {/* Currency Preference Selector */}
            <div className="mb-4">
              <label className="block text-sm md:text-base font-medium text-gray-700">
                Currency:
              </label>
              <select
                value={currencyPreference}
                onChange={handleCurrencyChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              >
                <option value="INR">Indian Rupees (₹)</option>
                <option value="USD">US Dollars ($)</option>
              </select>
            </div>

            {/* Existing Input Fields */}
            {productType === "ExactMakeModel" && (
              <>
                <InputField
                  label="Item Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Laptop"
                />
                <InputField
                  label="Item Type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="e.g., Gaming PC"
                />
                <InputField
                  label="Make"
                  name="make"
                  value={formData.make}
                  onChange={handleInputChange}
                  placeholder="e.g., Dell"
                />
                <InputField
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  placeholder="e.g., XPS 15"
                />
              </>
            )}

            {productType === "RelevantSpecifications" && (
              <>
                <InputField
                  label="Item Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Smartphone"
                />
                <InputField
                  label="Specifications"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="e.g., 6.1-inch OLED, 128GB storage, 5G"
                />
              </>
            )}

            {productType === "BasicRequirements" && (
              <>
                <InputField
                  label="Service Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Website Development"
                />
                <InputField
                  label="Requirements"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="e.g., 5 pages, e-commerce, user login"
                />
              </>
            )}

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-all duration-300 ease-in-out mt-4 text-sm md:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Getting Estimate..." : "Get Estimate"}
            </button>
          </form>
        )}

        {/* Display Estimation Result or Error */}
        {isLoading && (
          <p className="mt-4 text-center text-blue-600">
            Fetching your cost estimate...
          </p>
        )}

        {error && (
          <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
        )}

        {estimationResult && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md shadow-sm">
            <h4 className="text-md md:text-lg font-semibold text-blue-800 mb-2">
              Cost Estimation:
            </h4>
            {/* Render the raw text, assuming Gemini formatted it well */}
            <pre className="text-gray-700 whitespace-pre-wrap font-sans">
              {estimationResult}
            </pre>
            <p className="text-xs text-gray-500 mt-2">
              *This is an AI-generated estimate and should be used for informational purposes only.
              Pricing and links are based on AI's training data and may not be real-time or accurate.
              Always verify information with external sources.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const InputField = ({ label, name, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-sm md:text-base font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
    />
  </div>
);

export default SearchButtonSection;