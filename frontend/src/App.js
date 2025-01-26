import React, { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState(""); // Input URL
  const [message, setMessage] = useState(""); // Response message

  const handleSubmit = async (e) => {
    console.log("Form submitted!"); // Debugging
  
    e.preventDefault(); // Prevent form from refreshing the page
    console.log("Default prevented!");
  
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
      setMessage(`Title: ${response.data.title}, Length: ${response.data.length} characters`);

    } catch (error) {
      console.error("Error contacting backend:", error);
      setMessage("An error occurred while contacting the server.");
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

{message && <p className="mt-4 text-gray-700">{message}</p>}

      </div>
    </div>
  );
}

export default App;
