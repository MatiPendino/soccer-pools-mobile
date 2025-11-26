import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getUser, updateUser, deleteUser, logout, getUserInLeague, editPassword,
    googleOauth2SignIn, resetPassword, getFullUser, register, login
} from '../services/authService';
import { updateCoins, userCoinsRetrieve, listMembers } from '../services/userService';
import { getToken, storeToken } from '../utils/storeToken';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUser = () => {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) return null;
            return getUser(token);
        },
        retry: false,
    });
};

export const useFullUser = () => {
    return useQuery({
        queryKey: ['fullUser'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return getFullUser(token);
        },
    });
};

export const useUserInLeague = () => {
    return useQuery({
        queryKey: ['userInLeague'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return getUserInLeague(token);
        },
    });
};

export const useUserCoins = () => {
    return useQuery({
        queryKey: ['userCoins'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return userCoinsRetrieve(token);
        },
    });
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { userData: any, profileImage?: any }) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return updateUser(token, data.userData, data.profileImage);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
            queryClient.invalidateQueries({ queryKey: ['fullUser'] });
        },
    });
};

export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return deleteUser(token);
        },
        onSuccess: async () => {
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('refreshToken');
            queryClient.clear();
        },
    });
};

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { username: string, password: string }) => {
            return login(data.username, data.password);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        }
    })
}

export const useRegister = () => {
    return useMutation({
        mutationFn: async (
            data: { 
                name: string, last_name: string, username: string, email: string, 
                password: string, referralCode?: string 
            }) => {

            return register(
                data.name, data.last_name, data.username, data.email, 
                data.password, data.referralCode
            );
        }
    })
}

export const useEditPassword = () => {
    return useMutation({
        mutationFn: async (data: { oldPassword: string, newPassword: string }) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return editPassword(token, data.oldPassword, data.newPassword);
        },
    });
};

export const useGoogleSignIn = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { accessToken: string, referralCode?: string }) => {
            return googleOauth2SignIn(data.accessToken, data.referralCode);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
    });
};

export const useResetPassword = () => {
    return useMutation({
        mutationFn: async (email: string) => {
            return resetPassword(email);
        },
    });
};

export const useUpdateCoins = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { coins: number, rewardType: number }) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return updateCoins(token, data.coins, data.rewardType);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userCoins'] });
            queryClient.invalidateQueries({ queryKey: ['fullUser'] });
        },
    });
};
