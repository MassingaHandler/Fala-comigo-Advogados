import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (userData: any) => Promise<boolean>;
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
        // MOCK LOGIN - In production, this would call Supabase Auth
        // For demo purposes, accept any email/password combination

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Check for admin credentials
        if (email === 'admin@falacomigo.mz' && password === 'admin123') {
            const adminUser: User = {
                id: 'admin-001',
                fullName: 'Administrador Sistema',
                birthDate: new Date('1990-01-01'),
                nationality: 'Moçambicana',
                documentType: 'bi' as any,
                documentNumber: 'ADMIN001',
                phoneNumber: '+258 84 000 0000',
                phoneVerified: true,
                email: 'admin@falacomigo.mz',
                emailVerified: true,
                passwordHash: 'hashed_password',
                twoFactorEnabled: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Add admin flag (extend User type if needed)
            (adminUser as any).isAdmin = true;

            setUser(adminUser);
            setIsAuthenticated(true);
            localStorage.setItem('fala_comigo_user', JSON.stringify(adminUser));
            return true;
        }

        // Regular user login (demo)
        if (email && password) {
            const mockUser: User = {
                id: 'user-' + Date.now(),
                fullName: 'Usuário Demo',
                birthDate: new Date('1995-05-15'),
                nationality: 'Moçambicana',
                documentType: 'bi' as any,
                documentNumber: '123456789012A',
                phoneNumber: '+258 84 123 4567',
                phoneVerified: true,
                email: email,
                emailVerified: true,
                passwordHash: 'hashed_password',
                twoFactorEnabled: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            setUser(mockUser);
            setIsAuthenticated(true);
            localStorage.setItem('fala_comigo_user', JSON.stringify(mockUser));
            return true;
        }

        return false;
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('fala_comigo_user');
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

    const isAdmin = (user as any)?.isAdmin || false;

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        register,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
