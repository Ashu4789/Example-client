import { useSelector } from "react-redux";

const ROLE_PERMISSIONS = {
    admin: [
        'user:create',
        'user:update',
        'user:delete',
        'user:view',
        'group:create',
        'group:update',
        'group:delete',
        'group:view'
    ],
    manager: [
        'user:view',
        'group:create',
        'group:update',
        'group:view'
    ],
    viewer: [
        'user:view',
        'group:view'
    ],
};

export const useHasPermission = (permission) => {
    const userDetails = useSelector((state) => state.userDetails);
    if (userDetails) {
        const userPermissions = ROLE_PERMISSIONS[userDetails.role?.toLowerCase()] || [];
        return userPermissions.includes(permission);
    }
    return false;
};

export default ROLE_PERMISSIONS;
