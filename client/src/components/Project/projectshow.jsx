import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { FaTrash, FaEdit } from "react-icons/fa";
import cogoToast from "cogo-toast";

const Projectshow = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [projectsPerPage] = useState(7);
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get("http://localhost:9000/api/all-project");
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        cogoToast.error("An error occurred while fetching the projects.");
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
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
      <h3 className="mb-4 text-lg font-semibold">All Projects</h3>
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

export default Projectshow;






















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ReactPaginate from "react-paginate";
// import { FaTrash, FaEdit } from "react-icons/fa";
// import cogoToast from "cogo-toast";

// const Projectshow = () => {
//   const [projects, setProjects] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [projectsPerPage] = useState(7);

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:9000/api/all-project");
//         console.log("Fetched projects data:", data);
//         setProjects(data);
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//         cogoToast.error("An error occurred while fetching the projects.");
//       }
//     };

//     fetchProjects();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       const { data } = await axios.delete(`http://localhost:9000/api/delete-project/${id}`);
//       cogoToast.success(data.message || "Project deleted successfully!");
//       setProjects((prev) => prev.filter((project) => project.main_project_id !== id));
//     } catch (error) {
//       console.error("Error deleting project:", error);
//       cogoToast.error("An error occurred while deleting the project.");
//     }
//   };

//   const handleEdit = async (id) => {
//     const updatedProject = {
//       project_name: prompt("Enter the new project name:"),
//       project_id: prompt("Enter the new project ID:"),
//       location: prompt("Enter the new location:"),
//       total_area: prompt("Enter the new total area:"),
//     };
    
//     if (!updatedProject.project_name || !updatedProject.project_id || !updatedProject.location || !updatedProject.total_area) return;

//     try {
//       const { data } = await axios.put(`http://localhost:9000/api/edit-project/${id}`, updatedProject);
//       cogoToast.success(data.message || "Project updated successfully!");
//       setProjects((prev) =>
//         prev.map((project) =>
//           project.main_project_id === id ? { ...project, ...updatedProject } : project
//         )
//       );
//     } catch (error) {
//       console.error("Error updating project:", error);
//       cogoToast.error("An error occurred while updating the project.");
//     }
//   };

//   const indexOfLastProject = (currentPage + 1) * projectsPerPage;
//   const indexOfFirstProject = indexOfLastProject - projectsPerPage;
//   const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

//   const handlePageClick = (data) => {
//     setCurrentPage(data.selected);
//   };

//   return (
//     <div className="p-4 mt-6 bg-white rounded-lg shadow-lg mx-7 mb-2">
//       <h3 className="mb-4 text-lg font-semibold">All Projects</h3>
//       <div className="overflow-x-auto mt-4">
//         <table className="min-w-full bg-white border">
//           <thead>
//             <tr>
//               <th className="px-6 py-3 border-b-2 border-gray-300">S.no</th>
//               <th className="px-6 py-3 border-b-2 border-gray-300">Project Name</th>
//               <th className="px-6 py-3 border-b-2 border-gray-300">Project ID</th>
//               <th className="px-6 py-3 border-b-2 border-gray-300">Location</th>
//               <th className="px-6 py-3 border-b-2 border-gray-300">Total Area</th>
//               <th className="px-6 py-3 border-b-2 border-gray-300">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentProjects.length > 0 ? (
//               currentProjects.map((project, index) => (
//                 <tr key={project.main_project_id} className={index % 2 === 0 ? "bg-gray-100" : ""}>
//                   <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
//                     {currentPage * projectsPerPage + index + 1}
//                   </td>
//                   <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.project_name}</td>
//                   <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.project_id}</td>
//                   <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.location}</td>
//                   <td className="px-6 py-4 border-b border-gray-200 text-gray-800">{project.total_area}</td>
//                   <td className="px-6 py-4 border-b border-gray-200 text-gray-800">
//                     <button
//                       onClick={() => handleEdit(project.main_project_id)}
//                       className="mr-2 text-blue-600 hover:text-blue-800"
//                     >
//                       <FaEdit />
//                     </button>
//                     <button
//                       onClick={() => handleDelete(project.main_project_id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <FaTrash />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
//                   No Data Available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       <div className="mt-4 flex justify-center">
//         <ReactPaginate
//           previousLabel={"Previous"}
//           nextLabel={"Next"}
//           breakLabel={"..."}
//           pageCount={Math.ceil(projects.length / projectsPerPage)}
//           marginPagesDisplayed={2}
//           pageRangeDisplayed={3}
//           onPageChange={handlePageClick}
//           containerClassName={"pagination"}
//           activeClassName={"active"}
//           pageClassName={"page-item"}
//           pageLinkClassName={"page-link"}
//           previousClassName={"page-item"}
//           nextClassName={"page-item"}
//           previousLinkClassName={"page-link"}
//           nextLinkClassName={"page-link"}
//           breakClassName={"page-item"}
//           breakLinkClassName={"page-link"}
//         />
//       </div>
//     </div>
//   );
// };

// export default Projectshow;
