import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import UnauthorizedAccess from "../components/errors/UnauthorizedAccess";
import { useHasPermission } from "./userPermissions";

function ProtectedRoute({ roles, permission, children }) {
    const userDetails = useSelector((state) => state.userDetails);
    const hasPermission = useHasPermission(permission);

    if (!userDetails) {
        return <Navigate to="/login" />;
    }

    // Role check (legacy)
    if (roles && !roles.map(r => r.toLowerCase()).includes(userDetails.role?.toLowerCase())) {
        return (
            <AppLayout>
                <UnauthorizedAccess />
            </AppLayout>
        );
    }

    // Permission check (preferred)
    if (permission && !hasPermission) {
        return (
            <AppLayout>
                <UnauthorizedAccess />
            </AppLayout>
        );
    }

    return children ? children : <Outlet />;
}

export default ProtectedRoute;
