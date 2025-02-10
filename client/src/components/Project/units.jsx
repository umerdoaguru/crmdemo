import React, { useState, useEffect } from 'react';
import cogoToast from "cogo-toast";
import axios from 'axios';

const Units = () => {
  const [unitData, setUnitData] = useState({
    main_project_id: '',
    unit_type: '',
    unit_size: '',
    total_units: '',
    base_price: '',
    additional_costs: '',
  });

  const [units, setUnits] = useState([]);

  const fetchUnits = async () => {
    try {
      const response = await axios.get("http://localhost:9000/api/units");
      console.log("API Response:", response.data);
  
      if (response.data && Array.isArray(response.data.data)) {
        setUnits(response.data.data);
      } else {
        console.error("Invalid API response format", response.data);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };
  

   useEffect(() => {
    fetchUnits();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUnitData({ ...unitData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9000/api/add-unit", unitData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      cogoToast.success("Unit added successfully!", { position: "top-center" });
  
      // setUnits([...(units || []), response.data.data]);
   
      fetchUnits();
  
      setUnitData({
        main_project_id: "",
        unit_type: "",
        unit_size: "",
        total_units: "",
        base_price: "",
      });
    } catch (error) {
      console.error("Error adding unit:", error);
      cogoToast.error("Failed to add unit. Please try again.", { position: "top-center" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-700 mb-6">Units Management</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Add New Unit</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <input type="number" name="main_project_id" value={unitData.main_project_id} onChange={handleChange} placeholder="Project ID" className="p-3 border rounded-lg w-full" required />
          <select name="unit_type" value={unitData.unit_type} onChange={handleChange} className="p-3 border rounded-lg w-full" required>
            <option value="">Select Unit Type</option>
            <option value="1BHK">1BHK</option>
            <option value="2BHK">2BHK</option>
            <option value="3BHK">3BHK</option>
            <option value="Bungalow">Bungalow</option>
            <option value="Commercial">Commercial</option>
            <option value="Plot">Plot</option>
            <option value="Villa">Villa</option>
          </select>
          <input type="number" name="unit_size" value={unitData.unit_size} onChange={handleChange} placeholder="Unit Size" className="p-3 border rounded-lg w-full" required />
          <input type="number" name="total_units" value={unitData.total_units} onChange={handleChange} placeholder="Total Units" className="p-3 border rounded-lg w-full" required />
          <input type="number" name="base_price" value={unitData.base_price} onChange={handleChange} placeholder="Base Price" className="p-3 border rounded-lg w-full" required />
          <button type="submit" className="w-full sm:w-1/8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition shadow-md">Add Unit</button>
         {/* <input type="number" name="additional_costs" value={unitData.additional_costs} onChange={handleChange} placeholder="Additional Costs" className="p-3 border rounded-lg w-full" /> */}
        </div>

        <div className="text-center mt-6">
          
        </div>
      </form>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6 mt-6">
  <table className="w-full border-collapse overflow-hidden rounded-lg">
    {/* Table Header */}
    <thead className="bg-blue-600 text-white uppercase text-sm">
      <tr>
        {['Project ID', 'Unit Type', 'Size', 'Total Units', 'Units Sold', 'Available'].map((header) => (
          <th key={header} className="px-6 py-3 text-center border border-blue-500">{header}</th>
        ))}
      </tr>
    </thead>

    {/* Table Body */}
    <tbody>
      {units?.length > 0 ? (
        units?.map((unit, index) => (
          <tr key={unit.unit_id || index} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 border-b`}>
            <td className="px-6 py-3 text-center">{unit.main_project_id}</td>
            <td className="px-6 py-3 text-center">{unit.unit_type}</td>
            <td className="px-6 py-3 text-center">{unit.unit_size} sqft</td>
            <td className="px-6 py-3 text-center">{unit.total_units}</td>
            <td className="px-6 py-3 text-center text-green-600 font-bold">{unit.units_sold ?? "0"}</td>
            <td className="px-6 py-3 text-center text-red-600 font-bold">{unit.units_remaining ?? "N/A"}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="10" className="text-center py-6 text-gray-500 text-lg font-medium">No units available</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default Units;
