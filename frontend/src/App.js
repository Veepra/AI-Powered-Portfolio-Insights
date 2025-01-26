import React, { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState(""); // Input URL
  const [message, setMessage] = useState(""); // Response message
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    console.log("Form submitted!"); // Debugging
    
  
    e.preventDefault(); // Prevent form from refreshing the page
    console.log("Default prevented!");
    setLoading(true);
    const trimmedUrl = url.trim();
    console.log("Trimmed URL:", trimmedUrl);
  
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
        "(\\?[;&a-z\\d%_.~+=-]*)?" +
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
  
    if (!trimmedUrl || !urlPattern.test(trimmedUrl)) {
      console.log("Validation failed for:", trimmedUrl);
      setMessage("Please enter a valid URL.");
      return;
    }
  
    console.log("Validation passed for:", trimmedUrl);
  
    let formattedUrl = trimmedUrl;
    if (!/^https?:\/\//i.test(trimmedUrl)) {
      formattedUrl = `http://${trimmedUrl}`;
    }
  
    console.log("Formatted URL:", formattedUrl);
    
    
    try {
      console.log("Sending POST request to backend...");
      const response = await axios.post("http://127.0.0.1:8000/analyze", {
        url: formattedUrl,
      });
      console.log("Response from backend:", response.data);
      const {
        metadata,
        links,
        images,
        headers,
      } = response.data;
  
      setMessage(response.data);
      console.log("Response from backend:", response.data);
    } catch (error) {
      console.error("Error contacting backend:", error);
      setMessage("An error occurred while contacting the server.");
    }finally {
      setLoading(false); // Stop loading
    }
  };
  
  
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-500">
          AI-Powered Portfolio Insights
        </h1>
        <form onSubmit={handleSubmit}>
  <div className="mb-4">
    <label
      htmlFor="url"
      className="block text-sm font-medium text-gray-700"
    >
      Enter Website URL
    </label>
    <input
      type="url"
      id="url"
      value={url}
      onChange={(e) => {
        setUrl(e.target.value);
        console.log("Updated input value:", e.target.value); // Logs input changes
      }}
      placeholder="https://example.com"
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
  <button
  type="button" // Change type to button
  onClick={handleSubmit} // Trigger handleSubmit directly
  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
>
  Analyze
</button>
</form>
{loading && (
        <div className="flex justify-center items-center mt-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
  {/* Table to display analysis results */}
  {!loading && message && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg w-full">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Analysis Results
          </h3>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">Metric</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Title</td>
                <td className="border border-gray-300 px-4 py-2">{message.metadata?.title || "N/A"}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Description</td>
                <td className="border border-gray-300 px-4 py-2">{message.metadata?.description || "N/A"}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Total Links</td>
                <td className="border border-gray-300 px-4 py-2">{message.links?.total_links || 0}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Internal Links</td>
                <td className="border border-gray-300 px-4 py-2">{message.links?.internal_links || 0}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">External Links</td>
                <td className="border border-gray-300 px-4 py-2">{message.links?.external_links || 0}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Total Images</td>
                <td className="border border-gray-300 px-4 py-2">{message.images?.total_images || 0}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Missing Alt Attributes</td>
                <td className="border border-gray-300 px-4 py-2">{message.images?.missing_alt || 0}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">H1 Tags</td>
                <td className="border border-gray-300 px-4 py-2">{message.headers?.h1.join(", ") || "None"}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">H2 Tags</td>
                <td className="border border-gray-300 px-4 py-2">{message.headers?.h2.join(", ") || "None"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>

      
  );
}

export default App;
