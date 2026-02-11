import React from 'react';
import { useSelector } from 'react-redux';

/**
 * Custom hook to get the user's role in a specific group.
 * @param {Object} group - The group object containing a members array.
 * @returns {string|null} - The user's role in the group or null if not found.
 */
export const useGroupRole = (group) => {
    const userDetails = useSelector(state => state.userDetails);
    if (!group || !userDetails) return null;

    const userEmail = userDetails.email?.toLowerCase();
    const member = group.members?.find(
        m => m.email?.toLowerCase() === userEmail
    );

    if (member) return member.role;

    // Fallback to adminEmail if member not explicitly found in array
    if (group.adminEmail?.toLowerCase() === userEmail) {
        return 'admin';
    }

    return null;
};

/**
 * Gate component that only renders children if the user has one of the allowed roles in the group.
 */
export const GroupRoleGate = ({ group, allowedRoles, children, fallback = null }) => {
    const role = useGroupRole(group);

    if (role && allowedRoles.includes(role)) {
        return <>{children}</>;
    }

    return fallback;
};
