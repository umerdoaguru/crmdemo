import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import MainHeader from "../../../components/MainHeader";
import SuperAdminSider from "../SuperAdminSider";
import { useSelector } from "react-redux";

const SuperUnitsDetails = () => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [units, setUnits] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();
  const superadminuser = useSelector((state) => state.auth.user);
  const token = superadminuser.token;

    
  const fetchUnits = async () => {
    if (!id) return;
    try {
      const response = await axios.get(`https://crmdemo.vimubds5.a2hosted.com/api/super-admin-getUntitsDetailById/${id}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }});
      if (response.data) {
        setUnits(response.data); 
      } else {
        setUnits([]);
      }
    } catch (error) {
      console.error("Error fetching units:", error);
      setUnits([]);
    }
  };

  const handlePageClick = (event) => {
    const selectedPage = event.selected;
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    fetchUnits();
  }, [id]);

  const filteredUnits = statusFilter
    ? units.filter(unit => unit.status.toLowerCase() === statusFilter.toLowerCase())
    : units;

  const itemsPerPage = 10;
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredUnits.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredUnits.length / itemsPerPage);

  return (
    <>
      <MainHeader />
      <SuperAdminSider />
      <div className="mt-[7rem] 2xl:ml-40">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back
          </button>
        </div>
      <h1 className="text-2xl text-center mt-[2rem]">Units Details</h1>
      <div className="mx-auto h-[3px] w-16 bg-[#34495E] my-3"></div>
      <div className="flex min-h-screen overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 max-w-full 2xl:w-[93%] 2xl:ml-32">
          <div className="p-4 mt-6 bg-white rounded-lg shadow-lg mx-7 mb-2">
            {/* Filter Buttons */}
            <div className="flex justify-between items-center">
              <h3 className="mb-4 text-lg font-semibold mt-2">
                The Details Of Unit ID {id}
              </h3>
              <div className="flex items-center justify-center p-2">
              <select
              value={statusFilter}
              onChange={(e) => {setStatusFilter(e.target.value);   
                                setCurrentPage(0);}}
              className="border border-gray-300 p-2 rounded-lg bg-white text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              </select>
              </div>
            </div>

            {/* Units Table */}
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full bg-white border rounded-lg shadow-md mt-1">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                    <th className="px-6 py-3 border-b border-gray-300 text-left">S.No</th>
                    <th className="px-6 py-3 border-b border-gray-300 text-left">Unit Type</th>
                    <th className="px-6 py-3 border-b border-gray-300 text-left">Unit Area</th>
                    <th className="px-6 py-3 border-b border-gray-300 text-left">Base Price</th>
                    <th className="px-6 py-3 border-b border-gray-300 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.length > 0 ? (
                    currentItems.map((unit, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 text-gray-900">
                        <td className="px-6 py-4">{unit.unit_number}</td>
                        <td className="px-6 py-4">{unit.unit_type}</td>
                        <td className="px-6 py-4">{unit.unit_size}</td>
                        <td className="px-6 py-4">{unit.base_price}</td>
                        <td className="px-6 py-4">{unit.status}</td>     
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-gray-500">
                        No units available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-center">
              <ReactPaginate
                previousLabel={"Previous"}
                nextLabel={"Next"}
                breakLabel={"..."}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                nextClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
              />
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default SuperUnitsDetails;
