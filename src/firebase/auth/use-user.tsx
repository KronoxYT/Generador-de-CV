'use client';
import { useFirebase } from '../provider';

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = () => {
    const { user, isUserLoading, userError } = useFirebase();
    return { user, isUserLoading, userError };
};
