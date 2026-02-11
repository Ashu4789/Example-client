import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { NavDropdown, Nav } from "react-bootstrap";

function UserHeader() {
    const user = useSelector((state) => state.userDetails);
    const location = useLocation();

    // Helper to set active class
    const isActive = (path) =>
        location.pathname === path
            ? "active fw-bold text-primary"
            : "text-secondary";

    const profileIcon = (
        <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1 border shadow-sm">
            <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2 shadow-sm"
                style={{
                    width: "28px",
                    height: "28px",
                    fontSize: "12px",
                }}
            >
                {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : "U"}
            </div>
            <span className="text-dark fw-medium small">
                {user ? user.name : "Account"}
            </span>
        </div>
    );

    return (
        <nav className="navbar navbar-expand-lg bg-white sticky-top border-bottom shadow-sm py-2">
            <div className="container">
                {/* Brand Logo */}
                <Link
                    className="navbar-brand fw-bold fs-4 d-flex align-items-center"
                    to="/dashboard"
                >
                    <span className="text-primary">Merge</span>Money
                </Link>

                <button
                    className="navbar-toggler border-0 shadow-none"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#userNavbar"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="userNavbar">
                    {/* Primary App Navigation */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                    </ul>

                    {/* User Profile Dropdown */}
                    <Nav className="ms-auto align-items-center">
                        <NavDropdown title={profileIcon} id="user-profile-dropdown" align="end" className="p-0 border-0 shadow-none no-caret">
                            <li
                                className="px-3 py-2 border-bottom mb-1"
                                style={{ minWidth: "220px" }}
                            >
                                <p className="mb-0 small fw-bold text-dark">
                                    Signed in as
                                </p>
                                <p className="mb-0 small text-muted text-truncate" style={{ maxWidth: '180px' }}>
                                    {user?.email}
                                </p>
                            </li>
                            <NavDropdown.Item as={Link} to="/manage-users" className="py-2 fw-medium">
                                <i className="bi bi-person-check me-2"></i>{" "}
                                Manage Users
                            </NavDropdown.Item>
                            <NavDropdown.Divider className="m-0" />
                            <NavDropdown.Item as={Link} to="/logout" className="py-2 text-danger fw-medium">
                                <i className="bi bi-box-arrow-right me-2"></i>{" "}
                                Sign Out
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </div>
            </div>
        </nav>
    );
}

export default UserHeader;
