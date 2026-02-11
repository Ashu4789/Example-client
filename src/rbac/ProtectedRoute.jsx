import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import UnauthorizedAccess from "../components/errors/UnauthorizedAccess";

function ProtectedRoute({ roles, children }) {
    const user = useSelector((state) => state.userDetails);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return (
            <AppLayout>
                <UnauthorizedAccess />
            </AppLayout>
        );
    }

    return children ? children : <Outlet />;
}

export default ProtectedRoute;
