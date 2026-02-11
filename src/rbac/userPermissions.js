import { useSelector } from "react-redux";

const ROLE_PERMISSIONS = {
    admin: {
        canCreateUsers: true,
        canDeleteUsers: true,
        canUpdateUsers: true,
        canViewUsers: true,
        canCreateGroups: true,
        canUpdateGroups: true,
        canDeleteGroups: true,
        canViewGroups: true,
    },
    manager: {
        canCreateUsers: false,
        canDeleteUsers: false,
        canUpdateUsers: true,
        canViewUsers: true,
        canCreateGroups: true,
        canUpdateGroups: true,
        canDeleteGroups: false,
        canViewGroups: true,
    },
    viewer: {
        canCreateUsers: false,
        canDeleteUsers: false,
        canUpdateUsers: false,
        canViewUsers: true,
        canCreateGroups: false,
        canUpdateGroups: false,
        canDeleteGroups: false,
        canViewGroups: true,
    },
};

export const usePermission = () => {
    const user = useSelector((state) => state.userDetails);
    if (user) {
        return ROLE_PERMISSIONS[user.role] || {};
    }
    return {};
};

export default ROLE_PERMISSIONS;
