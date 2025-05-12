import React, { useState, useEffect } from "react";

const BloodBankStatus = () => {
  // Sample blood bank data (can be replaced with real data from an API)
  const [bloodInventory, setBloodInventory] = useState([
    { bloodType: "A+", quantity: 10, status: "Available" },
    { bloodType: "A-", quantity: 5, status: "Low" },
    { bloodType: "B+", quantity: 8, status: "Available" },
    { bloodType: "B-", quantity: 3, status: "Critical" },
    { bloodType: "O+", quantity: 15, status: "Available" },
    { bloodType: "O-", quantity: 2, status: "Critical" },
    { bloodType: "AB+", quantity: 7, status: "Available" },
    { bloodType: "AB-", quantity: 1, status: "Critical" },
  ]);

  // Fetch data from an API (example)
  useEffect(() => {
    // Replace this with an actual API call
    // fetch("/api/blood-inventory")
    //   .then((response) => response.json())
    //   .then((data) => setBloodInventory(data))
    //   .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Blood Bank Inventory Status
      </h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Blood Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity (Units)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bloodInventory.map((item, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.bloodType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.quantity}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                    item.status === "Critical"
                      ? "text-red-600"
                      : item.status === "Low"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {item.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BloodBankStatus;