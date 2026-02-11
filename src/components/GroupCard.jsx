import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { serverEndpoint } from "../config/appConfig";
import Can from "./Can";
import { GroupRoleGate } from "../rbac/GroupRoleGate";

function GroupCard({ group, onUpdate, onDelete }) {
    const userDetails = useSelector(state => state.userDetails);
    const [showMembers, setShowMembers] = useState(false);
    const [memberEmail, setMemberEmail] = useState("");
    const [errors, setErrors] = useState({});

    const userEmail = userDetails?.email?.toLowerCase() || '';
    const myRole = group.members?.find(m => m.email?.toLowerCase() === userEmail)?.role
        || (group.adminEmail?.toLowerCase() === userEmail ? 'admin' : 'viewer');

    const [selectedRole, setSelectedRole] = useState("viewer");

    const handleShowMember = () => setShowMembers(!showMembers);

    const handleAddMember = async () => {
        if (memberEmail.length === 0) return;

        try {
            const response = await axios.patch(
                `${serverEndpoint}/groups/members/add`,
                {
                    groupId: group._id,
                    members: [{ email: memberEmail, role: selectedRole }],
                },
                { withCredentials: true }
            );
            setMemberEmail("");
            onUpdate(response.data);
        } catch (error) {
            console.log(error);
            setErrors({ message: error.response?.data?.message || "Unable to add member" });
        }
    };

    const handleUpdateRole = async (email, newRole) => {
        try {
            const response = await axios.patch(
                `${serverEndpoint}/groups/members/role`,
                {
                    groupId: group._id,
                    email,
                    newRole
                },
                { withCredentials: true }
            );
            onUpdate(response.data);
        } catch (error) {
            console.log(error);
            alert("Failed to update role");
        }
    };

    return (
        <div className="card h-100 border-0 shadow-sm rounded-4 transition-hover">
            <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary mb-2">
                        <i className="bi bi-collection-fill fs-4"></i>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className={`badge rounded-pill ${myRole === 'admin' ? 'bg-primary' : (myRole === 'manager' ? 'bg-success' : 'bg-info')} text-white border-0 fw-bold small`}>
                            Your Role: {myRole.toUpperCase()}
                        </span>
                        <GroupRoleGate group={group} allowedRoles={['admin']}>
                            <button
                                className="btn btn-link text-danger p-0 border-0"
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this group?")) {
                                        onDelete(group._id);
                                    }
                                }}
                                title="Delete Group"
                            >
                                <i className="bi bi-trash"></i>
                            </button>
                        </GroupRoleGate>
                    </div>
                </div>

                <h5 className="fw-bold mb-1 text-dark text-truncate">
                    {group.name}
                </h5>

                <button
                    className="btn btn-sm text-primary p-0 text-start fw-medium mb-3"
                    onClick={handleShowMember}
                >
                    <i className={`bi bi-people-fill me-1`}></i>
                    {group.members?.length || 0} Members{" "}
                    {showMembers ? "▴" : "▾"}
                </button>

                <p className="text-muted small mb-3 flex-grow-1">
                    {group.description || "No description provided."}
                </p>

                <Link
                    to={`/groups/${group._id}`}
                    className="btn btn-outline-primary btn-sm rounded-pill fw-bold mb-4 w-100 py-2"
                >
                    View & Add Expenses
                </Link>

                {showMembers && (
                    <div className="bg-light rounded-3 p-3 mb-4 border-0 shadow-inner">
                        <h6 className="extra-small fw-bold text-uppercase text-secondary mb-3">
                            Member List
                        </h6>
                        <div
                            className="overflow-auto"
                            style={{ maxHeight: "150px" }}
                        >
                            {group.members?.map((member, index) => (
                                <div
                                    key={index}
                                    className="d-flex align-items-center justify-content-between mb-2 last-child-mb-0"
                                >
                                    <div className="d-flex align-items-center">
                                        <div
                                            className="rounded-circle bg-white border d-flex align-items-center justify-content-center me-2 fw-bold text-primary shadow-sm"
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                fontSize: "10px",
                                            }}
                                        >
                                            {member.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <span
                                            className="small text-dark text-truncate"
                                            title={member.email}
                                            style={{ maxWidth: '120px' }}
                                        >
                                            {member.email}
                                        </span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        {myRole === 'admin' && member.email !== userDetails.email ? (
                                            <select
                                                className="form-select form-select-sm extra-small py-0 border-0 bg-light text-muted"
                                                style={{ width: 'auto' }}
                                                value={member.role}
                                                onChange={(e) => handleUpdateRole(member.email, e.target.value)}
                                            >
                                                <option value="viewer">Viewer</option>
                                                <option value="manager">Manager</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <span className="badge bg-light text-muted extra-small border-0 py-1">
                                                {member.role}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {errors.message && (
                    <div className="alert alert-danger py-1 px-2 small border-0 mb-3">
                        {errors.message}
                    </div>
                )}

                <GroupRoleGate group={group} allowedRoles={['admin']}>
                    <div className="mt-auto pt-3 border-top">
                        <label className="form-label extra-small fw-bold text-uppercase text-muted mb-2">
                            Invite a Friend
                        </label>
                        <div className="input-group input-group-sm">
                            <input
                                type="email"
                                className="form-control bg-light border-0 px-3"
                                placeholder="email@example.com"
                                value={memberEmail}
                                onChange={(e) => setMemberEmail(e.target.value)}
                            />
                            <select
                                className="form-select bg-light border-0 small"
                                style={{ maxWidth: '100px', fontSize: '12px' }}
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                            >
                                <option value="viewer">Viewer</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                            <button
                                className="btn btn-primary px-3 fw-bold"
                                onClick={handleAddMember}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </GroupRoleGate>
            </div>
        </div>
    );
}

export default GroupCard;
