import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (userData: any) => Promise<boolean>;
    updateUser: (newData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for existing session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('fala_comigo_user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Error parsing stored user:', error);
                localStorage.removeItem('fala_comigo_user');
            }
        }
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            // Chamar API de login do backend
            const response = await fetch('http://localhost:8000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Erro no login:', result);
                return false;
            }

            if (result.success && result.user) {
                // Salvar token
                localStorage.setItem('fala_comigo_token', result.token);

                // Salvar dados do usuário
                const userData = {
                    id: result.user.id || result.user.userId || result.user.lawyer_id,
                    fullName: result.user.fullName || result.user.full_name || result.user.nome,
                    email: result.user.email || result.user.professionalEmail,
                    phoneNumber: result.user.phoneNumber || result.user.phone_number || result.user.professionalPhone,
                    isAdmin: result.user.isAdmin || result.user.is_admin || false,
                    role: result.user.role || 'user',
                    ...result.user
                };

                localStorage.setItem('fala_comigo_user', JSON.stringify(userData));

                setUser(userData as User);
                setIsAuthenticated(true);

                console.log('Login bem-sucedido:', userData);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('fala_comigo_user');
        localStorage.removeItem('fala_comigo_token');
    };

    const register = async (userData: any): Promise<boolean> => {
        // MOCK REGISTRATION - In production, this would create user in Supabase
        await new Promise(resolve => setTimeout(resolve, 500));

        const newUser: User = {
            id: 'user-' + Date.now(),
            fullName: userData.fullName,
            birthDate: userData.birthDate,
            nationality: userData.nationality,
            gender: userData.gender,
            documentType: userData.documentType,
            documentNumber: userData.documentNumber,
            phoneNumber: userData.phoneNumber,
            phoneVerified: userData.phoneVerified || false,
            email: userData.email,
            emailVerified: userData.emailVerified || false,
            passwordHash: 'hashed_' + userData.password, // Never store plain passwords!
            twoFactorEnabled: userData.twoFactorEnabled || false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('fala_comigo_user', JSON.stringify(newUser));
        return true;
    };

    const updateUser = (newData: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...newData };
        setUser(updatedUser);
        localStorage.setItem('fala_comigo_user', JSON.stringify(updatedUser));
    };

    const isAdmin = (user as any)?.isAdmin || false;

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        register,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
