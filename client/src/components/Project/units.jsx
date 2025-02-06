import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [unitData, setUnitData] = useState({
    main_project_id: '',
    unit_type: '',
    unit_size: '',
    total_units: '',
    base_price: '',
    additional_costs: '',
    amenities: '',
  });

  useEffect(() => {
    axios.get('/api/units')
      .then((response) => setUnits(response.data))
      .catch((error) => console.error('Error fetching units:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUnitData({ ...unitData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/units', unitData);
      setUnits([...units, response.data]);
      setUnitData({
        main_project_id: '',
        unit_type: '',
        unit_size: '',
        total_units: '',
        base_price: '',
        additional_costs: '',
        amenities: '',
      });
    } catch (error) {
      console.error('Error adding unit:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">Units Management</h1>
      
      <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
        <table className="w-full text-sm text-left text-gray-600 border-collapse border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 border">Unit ID</th>
              <th className="px-4 py-3 border">Project ID</th>
              <th className="px-4 py-3 border">Unit Type</th>
              <th className="px-4 py-3 border">Size</th>
              <th className="px-4 py-3 border">Total Units</th>
              <th className="px-4 py-3 border">Units Sold</th>
              <th className="px-4 py-3 border">Remaining</th>
              <th className="px-4 py-3 border">Base Price</th>
              <th className="px-4 py-3 border">Amenities</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit.unit_id} className="hover:bg-blue-50">
                <td className="px-4 py-3 border">{unit.unit_id}</td>
                <td className="px-4 py-3 border">{unit.main_project_id}</td>
                <td className="px-4 py-3 border">{unit.unit_type}</td>
                <td className="px-4 py-3 border">{unit.unit_size}</td>
                <td className="px-4 py-3 border">{unit.total_units}</td>
                <td className="px-4 py-3 border">{unit.units_sold}</td>
                <td className="px-4 py-3 border">{unit.units_remaining}</td>
                <td className="px-4 py-3 border">{unit.base_price}</td>
                <td className="px-4 py-3 border">{unit.amenities}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-lg mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Add or Edit Unit</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <input type="number" name="main_project_id" value={unitData.main_project_id} onChange={handleChange} placeholder="Project ID" className="p-3 border rounded-lg w-full" required />
          <select name="unit_type" value={unitData.unit_type} onChange={handleChange} className="p-3 border rounded-lg w-full" required>
            <option value="">Select Unit Type</option>
            <option value="1BHK">1BHK</option>
            <option value="2BHK">2BHK</option>
            <option value="3BHK">3BHK</option>
            <option value="Bungalow">Bungalow</option>
            <option value="Commercial">Commercial</option>
            <option value="Plot">Plot</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <input type="number" name="unit_size" value={unitData.unit_size} onChange={handleChange} placeholder="Unit Size" className="p-3 border rounded-lg w-full" required />
          <input type="number" name="total_units" value={unitData.total_units} onChange={handleChange} placeholder="Total Units" className="p-3 border rounded-lg w-full" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <input type="number" name="base_price" value={unitData.base_price} onChange={handleChange} placeholder="Base Price" className="p-3 border rounded-lg w-full" required />
          <input type="number" name="additional_costs" value={unitData.additional_costs} onChange={handleChange} placeholder="Additional Costs" className="p-3 border rounded-lg w-full" />
        </div>

        <textarea name="amenities" value={unitData.amenities} onChange={handleChange} placeholder="Amenities" className="w-full p-3 mt-4 border rounded-lg" rows="3" />
         <div className='text-center'>
        <button type="submit" className="w-1/4 bg-blue-600 text-white py-3 mt-6 rounded-lg hover:bg-blue-700 transition">Add Unit</button>
        </div>
      </form>
    </div>
  );
};

export default Units;


