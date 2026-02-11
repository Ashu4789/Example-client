import axios from "axios";
import { serverEndpoint } from "../config/appConfig";
import { useEffect, useState } from "react";
import GroupCard from "../components/GroupCard";
import CreateGroupModal from "../components/CreateGroupModal";
import Can from "../components/Can";

function Groups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [limit, setLimit] = useState(10); // Default limit
    const [sortBy, setSortBy] = useState('newest');

    const fetchGroups = async (page = 1, currentLimit = limit, currentSortBy = sortBy) => {
        try {
            const response = await axios.get(
                `${serverEndpoint}/groups/my-groups?page=${page}&limit=${currentLimit}&sortBy=${currentSortBy}`,
                { withCredentials: true }
            );
            if (response.data.pagination) {
                setGroups(response.data.groups);
                setTotalPages(response.data.pagination.totalPages);
                setCurrentPage(response.data.pagination.currentPage);
            } else {
                // Fallback for non-paginated response or if server format is different
                setGroups(response.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        if (window.confirm("Are you sure you want to delete this group?")) {
            try {
                await axios.post(
                    `${serverEndpoint}/groups/delete`,
                    { groupId },
                    { withCredentials: true }
                );
                // Refresh current page
                fetchGroups(currentPage);
            } catch (error) {
                console.log(error);
                alert("Unable to delete group");
            }
        }
    };

    const handleGroupUpdateSuccess = (data) => {
        // Reload to page 1 to show the new/updated group
        fetchGroups(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setLoading(true);
            fetchGroups(newPage);
        }
    };

    const handleLimitChange = (e) => {
        const newLimit = parseInt(e.target.value);
        setLimit(newLimit);
        setLoading(true);
        fetchGroups(1, newLimit, sortBy);
    };

    // Duplicate function removed

    useEffect(() => {
        fetchGroups(currentPage, limit, sortBy);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, sortBy]);

    if (loading) {
        return (
            <div
                className="container p-5 d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: "60vh" }}
            >
                <div
                    className="spinner-grow text-primary"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                >
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted fw-medium">
                    Syncing your circles...
                </p>
            </div>
        );
    }

    return (
        <div className="container py-5 px-4 px-md-5">
            <div className="row align-items-center mb-5">
                <div className="col-md-8 text-center text-md-start mb-3 mb-md-0">
                    <h2 className="fw-bold text-dark display-6">
                        Manage <span className="text-primary">Groups</span>
                    </h2>
                    <p className="text-muted mb-0">
                        View balances, invite friends, and settle shared
                        expenses in one click.
                    </p>
                </div>
                <div className="col-md-4 text-center text-md-end">
                    <div className="d-flex flex-column flex-md-row align-items-center justify-content-end gap-3">
                        <div className="d-flex align-items-center">
                            <label htmlFor="sortBy" className="me-2 text-muted fw-bold small text-nowrap">Sort By:</label>
                            <select
                                id="sortBy"
                                className="form-select form-select-sm rounded-pill"
                                value={sortBy}
                                onChange={(e) => {
                                    setSortBy(e.target.value);
                                    setCurrentPage(1); // Reset to page 1
                                }}
                                style={{ minWidth: "130px" }}
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                        <Can requiredPermission="canCreateGroups">
                            <button
                                className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm text-nowrap"
                                onClick={() => setShow(true)}
                            >
                                <i className="bi bi-plus-lg me-2"></i>
                                New Group
                            </button>
                        </Can>
                    </div>
                </div>
            </div>

            <hr className="mb-5 opacity-10" />

            {groups.length === 0 && (
                <div className="text-center py-5 bg-light rounded-5 border border-dashed border-primary border-opacity-25 shadow-inner">
                    <div className="bg-white rounded-circle d-inline-flex p-4 mb-4 shadow-sm">
                        <i
                            className="bi bi-people text-primary"
                            style={{ fontSize: "3rem" }}
                        ></i>
                    </div>
                    <h4 className="fw-bold">No Groups Found</h4>
                    <p
                        className="text-muted mx-auto mb-4"
                        style={{ maxWidth: "400px" }}
                    >
                        You haven't joined any groups yet. Create a group to
                        start splitting bills with your friends or roommates!
                    </p>
                    <Can requiredPermission="canCreateGroups">
                        <button
                            className="btn btn-outline-primary rounded-pill px-4"
                            onClick={() => setShow(true)}
                        >
                            Get Started
                        </button>
                    </Can>
                </div>
            )}

            {groups.length > 0 && (
                <>
                    <div className="row g-4 animate__animated animate__fadeIn">
                        {groups.map((group) => (
                            <div className="col-md-6 col-lg-4" key={group._id}>
                                <GroupCard
                                    group={group}
                                    onUpdate={handleGroupUpdateSuccess}
                                    onDelete={handleDeleteGroup}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="d-flex justify-content-between align-items-center mt-5">
                        <div className="d-flex align-items-center">
                            <label htmlFor="pageSize" className="me-2 text-muted small">Items per page:</label>
                            <select
                                id="pageSize"
                                className="form-select form-select-sm"
                                value={limit}
                                onChange={handleLimitChange}
                                style={{ width: "70px" }}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>

                        {totalPages > 1 && (
                            <nav aria-label="Page navigation">
                                <ul className="pagination pagination-sm mb-0">
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            aria-label="Previous"
                                        >
                                            <span aria-hidden="true">&laquo;</span>
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <li
                                            key={index}
                                            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(index + 1)}
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            aria-label="Next"
                                        >
                                            <span aria-hidden="true">&raquo;</span>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </div>
                </>
            )}

            <CreateGroupModal
                show={show}
                onHide={() => setShow(false)}
                onSuccess={handleGroupUpdateSuccess}
            />
        </div>
    );
}

export default Groups;
