import { useHasPermission } from "../../rbac/userPermissions";

function PermissionGate({ permission, children, fallback = null }) {
    const hasPermission = useHasPermission(permission);

    if (hasPermission) {
        return children;
    }

    return fallback;
}

export default PermissionGate;
