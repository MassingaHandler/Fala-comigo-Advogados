import { DocumentType } from '../types';

// Email validation
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation (Mozambican format: +258 XX XXX XXXX or 8X XXX XXXX)
export function validatePhone(phone: string): boolean {
    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s-]/g, '');

    // Check for +258 format or local format starting with 8
    const internationalRegex = /^\+258[0-9]{9}$/;
    const localRegex = /^8[0-9]{8}$/;

    return internationalRegex.test(cleaned) || localRegex.test(cleaned);
}

// Password validation with requirements
export interface PasswordValidation {
    valid: boolean;
    errors: string[];
}

export function validatePassword(password: string): PasswordValidation {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('A senha deve ter no mínimo 8 caracteres');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('A senha deve conter pelo menos uma letra maiúscula');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('A senha deve conter pelo menos uma letra minúscula');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('A senha deve conter pelo menos um número');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('A senha deve conter pelo menos um caractere especial');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

// Document number validation
export function validateDocumentNumber(type: DocumentType, number: string): boolean {
    // Remove spaces and special characters
    const cleaned = number.replace(/[\s-]/g, '');

    switch (type) {
        case DocumentType.BI:
            // BI format: 12 digits (example format, adjust as needed)
            return /^[0-9]{12}[A-Z]?$/.test(cleaned);

        case DocumentType.PASSAPORTE:
            // Passport format: 2 letters + 7 digits
            return /^[A-Z]{2}[0-9]{7}$/.test(cleaned);

        case DocumentType.CARTA_CONDUCAO:
            // Driver's license format (adjust as needed)
            return /^[0-9]{8,12}$/.test(cleaned);

        default:
            return false;
    }
}

// Birth date validation (minimum age 18)
export function validateBirthDate(date: Date): { valid: boolean; error?: string } {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    // Check if date is in the future
    if (date > today) {
        return { valid: false, error: 'A data de nascimento não pode ser no futuro' };
    }

    // Calculate exact age
    let exactAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        exactAge--;
    }

    if (exactAge < 18) {
        return { valid: false, error: 'Deve ter pelo menos 18 anos para se registrar' };
    }

    if (exactAge > 120) {
        return { valid: false, error: 'Por favor, verifique a data de nascimento' };
    }

    return { valid: true };
}

// Full name validation
export function validateFullName(name: string): boolean {
    // At least 2 words, each with at least 2 characters
    const words = name.trim().split(/\s+/);
    return words.length >= 2 && words.every(word => word.length >= 2);
}

// OTP code validation (6 digits)
export function validateOtpCode(code: string): boolean {
    return /^[0-9]{6}$/.test(code);
}

// OAM Number validation (Ordem dos Advogados de Moçambique)
export function validateOAMNumber(oamNumber: string): boolean {
    // Remove spaces and special characters
    const cleaned = oamNumber.replace(/[\s-]/g, '');
    // OAM format: typically 4-6 digits (adjust based on actual format)
    return /^[0-9]{4,6}$/.test(cleaned);
}

// Professional email validation (stricter than regular email)
export function validateProfessionalEmail(email: string): boolean {
    if (!validateEmail(email)) return false;

    // Avoid common free email providers for professional use
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1]?.toLowerCase();

    // Warning: returns true even for free providers, but could be enhanced
    return true;
}

// File type validation
export function validateFileType(file: File, allowedTypes: string[]): boolean {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    return allowedTypes.some(type => {
        if (type.startsWith('.')) {
            return fileExtension === type;
        }
        return file.type.startsWith(type.replace('*', ''));
    });
}

// File size validation
export function validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
}

// Validate minimum age for lawyers (21 years)
export function validateLawyerAge(date: Date): { valid: boolean; error?: string } {
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    if (date > today) {
        return { valid: false, error: 'A data de nascimento não pode ser no futuro' };
    }

    let exactAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        exactAge--;
    }

    if (exactAge < 21) {
        return { valid: false, error: 'Advogados devem ter pelo menos 21 anos' };
    }

    if (exactAge > 120) {
        return { valid: false, error: 'Por favor, verifique a data de nascimento' };
    }

    return { valid: true };
}
