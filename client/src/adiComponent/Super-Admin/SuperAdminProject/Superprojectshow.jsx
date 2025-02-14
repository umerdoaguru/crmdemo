import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { FaTrash, FaEdit} from "react-icons/fa";
import cogoToast from "cogo-toast";
import { Link } from "react-router-dom";

const Superprojectshow = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [projectsPerPage] = useState(7);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState({});
  const [addProject, setAddProject] = useState();

  const [addunits, setUnits] = useState(false);

  // const [unitData, setUnitData] = useState({
  //   main_project_id: '',
  //   unit_type: '',
  //   unit_size: '',
  //   total_units: '',
  //   base_price: '',
  //   additional_costs: '',
  //   amenities: '',
  // });
  
  // const handleUnitChange = (e) => {
  //   const { name, value } = e.target;
  //   setUnitData((prevData) => ({ ...prevData, [name]: value }));
  // };
  
  // const handleUnitSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post("http://localhost:9000/api/project-add", unitData);
  
  //     if (response.status === 200) {
  //       cogoToast.success("Unit added successfully!", { position: "top-right" });
  //       setUnits(false); // Modal ko band karne ke liye
  //     } else {
  //       cogoToast.error("Failed to add unit.", { position: "top-right" });
  //     }
  //   } catch (error) {
  //     console.error("Error submitting the form:", error);
  //     cogoToast.error("An error occurred while submitting the form.", { position: "top-right" });
  //   }
  // };

  // const handleAddUnits = () => {
  //   setUnits(true);
  // };

  // const handleCloseUnits = () => {
  //   setUnits(false);
  // };

  const [formData, setFormData] = useState({
    projectName: "",
    projectId: "",
    location: "",
    total_area: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9000/api/project-add", formData);

      if (response.status === 200) {
        cogoToast.success("Project added successfully!", { position: "top-right" });
        setAddProject(false);
        fetchProjects();
      } else {
        cogoToast.error("Failed to add project.", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      cogoToast.error("An error occurred while submitting the form.", { position: "top-right" });
    }
  };

  const handleAddProject = () => {
    setAddProject(true);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get("http://localhost:9000/api/all-project");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      cogoToast.error("An error occurred while fetching the projects.");
    }
  };

  const handleDelete = async (id) => {

    const isConfirmed = window.confirm("Are you sure you want to delete this project?");
    if (!isConfirmed) return;
    try {
      const { data } = await axios.delete(`http://localhost:9000/api/delete-project/${id}`);
      cogoToast.success(data.message || "Project deleted successfully!");
      setProjects((prev) => prev.filter((project) => project.main_project_id !== id));
    } catch (error) {
      console.error("Error deleting project:", error);
      cogoToast.error("An error occurred while deleting the project.");
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(`http://localhost:9000/api/edit-project/${editProject.main_project_id}`, editProject);
      cogoToast.success(data.message || "Project updated successfully!");
      setProjects((prev) => prev.map((project) => (project.main_project_id === editProject.main_project_id ? editProject : project)));
      setShowModal(false);
    } catch (error) {
      console.error("Error updating project:", error);
      cogoToast.error("An error occurred while updating the project.");
    }
  };

  const indexOfLastProject = (currentPage + 1) * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="p-4 mt-6 bg-white rounded-lg shadow-lg mx-7 mb-2">
      <div className="flex justify-between items-center">
      <h3 className="mb-4 text-lg font-semibold">All Projects</h3>
      <button
        onClick={handleAddProject}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
      >
        Add Project
      </button>

    </div>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Project Name</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Project ID</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Location</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Total Area</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Action</th>
              <th className="px-6 py-3 border-b-2 border-gray-300">Unit Profile</th>
            </tr>
          </thead>
          <tbody>
            {currentProjects.length > 0 ? (
              currentProjects.map((project, index) => (
                <tr key={project.main_project_id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{currentPage * projectsPerPage + index + 1}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.project_name}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.project_id}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.location}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.total_area}</td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                    <button onClick={() => handleEdit(project)} className="mr-2 text-blue-600 hover:text-blue-800"><FaEdit /></button>
                    <button onClick={() => handleDelete(project.main_project_id)} className="text-red-600 hover:text-red-800"><FaTrash /></button>
                    {/* <button onClick={handleAddUnits} className="ml-2 text-green-600 hover:text-green-800"><FaBoxOpen /></button> */}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
                  <Link to={`/super-admin-project-units/${project.main_project_id}`} className="inline-block">
                  <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
                   Profile
                  </button>
                  </Link>
                  </td>
                  
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No Data Available</td>
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
          pageCount={Math.ceil(projects.length / projectsPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>

      {addProject && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Add Real Estate Project</h1>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-600 mb-1">Project Name</label>
                  <input
                    type="text"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Project ID</label>
                  <input
                    type="text"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter unique project ID"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-600 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter project location"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Total Area</label>
                  <input
                    type="text"
                    name="total_area"
                    value={formData.total_area}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g., 5000sqft, 40000sqft"
                  />
                </div>
              </div>

              {/* Submission Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setAddProject(false)}
                  className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addunits && (
        <div> </div>
        // <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        //   <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-6">
        //     <h1 className="text-2xl font-bold text-gray-800 mb-4">Add Real Estate Unit</h1>
        //     <form onSubmit={handleUnitSubmit} className="bg-white p-6 shadow-lg rounded-lg">
        //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        //         <input type="number" name="main_project_id" value={unitData.main_project_id} onChange={handleUnitChange} placeholder="Project ID" className="p-3 border rounded-lg w-full" required />
        //         <select name="unit_type" value={unitData.unit_type} onChange={handleUnitChange} className="p-3 border rounded-lg w-full" required>
        //           <option value="">Select Unit Type</option>
        //           <option value="1BHK">1BHK</option>
        //           <option value="2BHK">2BHK</option>
        //           <option value="3BHK">3BHK</option>
        //           <option value="Bungalow">Bungalow</option>
        //           <option value="Commercial">Commercial</option>
        //           <option value="Plot">Plot</option>
        //         </select>
        //       </div>

        //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        //         <input type="number" name="unit_size" value={unitData.unit_size} onChange={handleUnitChange} placeholder="Unit Size" className="p-3 border rounded-lg w-full" required />
        //         <input type="number" name="total_units" value={unitData.total_units} onChange={handleUnitChange} placeholder="Total Units" className="p-3 border rounded-lg w-full" required />
        //       </div>

        //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        //         <input type="number" name="base_price" value={unitData.base_price} onChange={handleUnitChange} placeholder="Base Price" className="p-3 border rounded-lg w-full" required />
        //         <input type="number" name="additional_costs" value={unitData.additional_costs} onChange={handleUnitChange} placeholder="Additional Costs" className="p-3 border rounded-lg w-full" />
        //       </div>

        //       <textarea name="amenities" value={unitData.amenities} onChange={handleUnitChange} placeholder="Amenities" className="w-full p-3 mt-4 border rounded-lg" rows="3" />
              
        //       <div className="flex justify-center items-center gap-4 mt-4">
        //       <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"> Add Unit </button>
        //       <button type="button" onClick={handleCloseUnits} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition">Close Unit</button>
        //       </div>
        //     </form>

        //     {/* Close Button */}
            
        //   </div>
        // </div>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl mb-4">Edit Project</h2>
            
            <div> 
            <label className="block text-gray-600 mb-1">Total Area</label>
            <input type="text" value={editProject.project_name} onChange={(e) => setEditProject({ ...editProject, project_name: e.target.value })} className="border p-2 w-full mb-2" placeholder="Project Name" />
            </div>

            <div> 
            <label className="block text-gray-600 mb-1">Total Area</label>
            <input type="text" value={editProject.project_id} onChange={(e) => setEditProject({ ...editProject, project_id: e.target.value })} className="border p-2 w-full mb-2" placeholder="Project ID" />
            </div>

            <div>
            <label className="block text-gray-600 mb-1">Total Area</label>
            <input type="text" value={editProject.location} onChange={(e) => setEditProject({ ...editProject, location: e.target.value })} className="border p-2 w-full mb-2" placeholder="Location" />
            </div>
            <div>             
            <label className="block text-gray-600 mb-1">Total Area</label>
            <input type="text" value={editProject.total_area} onChange={(e) => setEditProject({ ...editProject, total_area: e.target.value })} className="border p-2 w-full mb-2" placeholder="Total Area" />
            </div>

            <div className="flex justify-end">
              <button onClick={() => setShowModal(false)} className="mr-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
              <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Superprojectshow;