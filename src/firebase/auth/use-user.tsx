'use client';
import { useUser as useUserFromProvider } from '../provider';

export const useUser = () => {
    const { user, isUserLoading, userError } = useUserFromProvider();
    return { user, isUserLoading, userError };
};
