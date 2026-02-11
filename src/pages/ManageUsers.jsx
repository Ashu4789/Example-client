import { useEffect, useState } from "react";
import { serverEndpoint } from "../config/appConfig";
import axios from "axios";
import { usePermission } from "../rbac/userPermissions";
import Can from "../components/Can";

function ManageUsers() {
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "Select",
    });

    const permissions = usePermission();

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${serverEndpoint}/users/`, {
                withCredentials: true,
            });
            setUsers(response.data.users);
        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to fetch users, please try again" });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        let isValid = true;
        let newErrors = {};
        if (formData.name.length === 0) {
            isValid = false;
            newErrors.name = "Name is required";
        }

        if (formData.email.length === 0) {
            isValid = false;
            newErrors.email = "Email is required";
        }

        if (formData.role === "Select") {
            isValid = false;
            newErrors.role = "Role is required";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            setActionLoading(true);
            try {
                if (editingUser) {
                    const response = await axios.patch(
                        `${serverEndpoint}/users/`,
                        {
                            name: formData.name,
                            role: formData.role,
                            userId: editingUser._id,
                        },
                        { withCredentials: true }
                    );

                    const updatedUsers = users.map((u) =>
                        u._id === editingUser._id ? response.data.user : u
                    );
                    setUsers(updatedUsers);
                    setMessage("User updated!");
                    resetForm();
                } else {
                    const response = await axios.post(
                        `${serverEndpoint}/users/`,
                        {
                            name: formData.name,
                            email: formData.email,
                            role: formData.role,
                        },
                        { withCredentials: true }
                    );
                    setUsers([...users, response.data.user]);
                    setMessage("User added!");
                    resetForm();
                }
            } catch (error) {
                console.log(error);
                setErrors({
                    message: `Unable to ${editingUser ? "update" : "add"
                        } user, please try again`,
                });
            } finally {
                setActionLoading(false);
            }
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.post(
                    `${serverEndpoint}/users/delete`,
                    { userId },
                    { withCredentials: true }
                );
                setUsers(users.filter((user) => user._id !== userId));
                setMessage("User deleted!");
            } catch (error) {
                console.log(error);
                setErrors({
                    message: "Unable to delete user, please try again",
                });
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email || "", // Email might be missing if it's strictly from auth, but here we have it
            role: user.role,
        });
        setErrors({});
        setMessage(null);
    };

    const resetForm = () => {
        setEditingUser(null);
        setFormData({
            name: "",
            email: "",
            role: "Select",
        });
        setErrors({});
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="container p-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5 px-4 px-md-5">
            {errors.message && (
                <div className="alert alert-danger" role="alert">
                    {errors.message}
                </div>
            )}

            <div className="row align-items-center mb-5">
                <div className="col-md-8 text-center text-md-start mb-3 mb-md-0">
                    <h2 className="fw-bold text-dark display-6">
                        Manage <span className="text-primary">Users</span>
                    </h2>
                    <p className="text-muted mb-0">
                        View and manage all the users along with their permissions
                    </p>
                </div>
            </div>

            {message && (
                <div className="alert alert-success" role="alert">
                    {message}
                </div>
            )}

            <div className="row">
                {/* Add/Edit user form */}
                {(permissions.canCreateUsers ||
                    (editingUser && permissions.canUpdateUsers)) && (
                        <div className="col-md-3">
                            <div className="card shadow-sm">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">
                                        {editingUser ? "Edit Member" : "Add Member"}
                                    </h5>
                                    {editingUser && (
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={resetForm}
                                            type="button"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>

                                <div className="card-body p-2">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                className={
                                                    errors.name
                                                        ? "form-control is-invalid"
                                                        : "form-control"
                                                }
                                                value={formData.name}
                                                onChange={handleChange}
                                            />
                                            {errors.name && (
                                                <div className="invalid-feedback ps-1">
                                                    {errors.name}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">
                                                Email
                                            </label>
                                            <input
                                                type="text"
                                                name="email"
                                                className={
                                                    errors.email
                                                        ? "form-control is-invalid"
                                                        : "form-control"
                                                }
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={!!editingUser}
                                            />
                                            {errors.email && (
                                                <div className="invalid-feedback ps-1">
                                                    {errors.email}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">
                                                Role
                                            </label>
                                            <select
                                                name="role"
                                                className={
                                                    errors.role
                                                        ? "form-select is-invalid"
                                                        : "form-select"
                                                }
                                                value={formData.role}
                                                onChange={handleChange}
                                            >
                                                <option value="Select">
                                                    Select
                                                </option>
                                                <option value="manager">
                                                    Manager
                                                </option>
                                                <option value="viewer">
                                                    Viewer
                                                </option>
                                            </select>
                                            {errors.role && (
                                                <div className="invalid-feedback ps-1">
                                                    {errors.role}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <button className="btn btn-primary w-100">
                                                {actionLoading ? (
                                                    <div
                                                        className="spinner-border spinner-border-sm"
                                                        role="status"
                                                    >
                                                        <span className="visually-hidden">
                                                            Loading...
                                                        </span>
                                                    </div>
                                                ) : editingUser ? (
                                                    "Update"
                                                ) : (
                                                    "Add"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                {/* View users table */}
                <div
                    className={
                        permissions.canCreateUsers ||
                            (editingUser && permissions.canUpdateUsers)
                            ? "col-md-9"
                            : "col-md-12"
                    }
                >
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5>Team Members</h5>
                        </div>

                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="text-center">
                                                Name
                                            </th>
                                            <th className="text-center">
                                                Email
                                            </th>
                                            <th className="text-center">
                                                Role
                                            </th>
                                            {(permissions.canUpdateUsers ||
                                                permissions.canDeleteUsers) && (
                                                    <th className="text-center">
                                                        Actions
                                                    </th>
                                                )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={4}
                                                    className="text-center py-4 text-muted"
                                                >
                                                    No users found. Start by
                                                    adding one!
                                                </td>
                                            </tr>
                                        )}

                                        {users.length > 0 &&
                                            users.map((user) => (
                                                <tr key={user._id}>
                                                    <td className="align-middle">
                                                        {user.name}
                                                    </td>
                                                    <td className="align-middle">
                                                        {user.email}
                                                    </td>
                                                    <td className="align-middle">
                                                        {user.role}
                                                    </td>
                                                    {(permissions.canUpdateUsers ||
                                                        permissions.canDeleteUsers) && (
                                                            <td className="align-middle">
                                                                {permissions.canUpdateUsers && (
                                                                    <button
                                                                        className="btn btn-link text-primary"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                user
                                                                            )
                                                                        }
                                                                    >
                                                                        Edit
                                                                    </button>
                                                                )}
                                                                {permissions.canDeleteUsers && (
                                                                    <button
                                                                        className="btn btn-link text-danger"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                user._id
                                                                            )
                                                                        }
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                )}
                                                            </td>
                                                        )}
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ManageUsers;
