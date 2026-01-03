import React, { useRef, useState } from 'react';

interface DocumentUploadProps {
    label: string;
    accept?: string;
    maxSizeMB?: number;
    onFileSelect: (file: File | null) => void;
    currentFile?: File | null;
    required?: boolean;
    helpText?: string;
}

export default function DocumentUpload({
    label,
    accept = '.pdf,.jpg,.jpeg,.png',
    maxSizeMB = 5,
    onFileSelect,
    currentFile,
    required = false,
    helpText
}: DocumentUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string>('');

    const validateFile = (file: File): boolean => {
        setError('');

        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            setError(`Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`);
            return false;
        }

        // Check file type
        const acceptedTypes = accept.split(',').map(t => t.trim());
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        const isValidType = acceptedTypes.some(type => {
            if (type.startsWith('.')) {
                return fileExtension === type;
            }
            return file.type.startsWith(type.replace('*', ''));
        });

        if (!isValidType) {
            setError(`Tipo de arquivo não suportado. Aceitos: ${accept}`);
            return false;
        }

        return true;
    };

    const handleFile = (file: File) => {
        if (validateFile(file)) {
            onFileSelect(file);
        } else {
            onFileSelect(null);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleRemove = () => {
        onFileSelect(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return '📄';
        if (['jpg', 'jpeg', 'png'].includes(ext || '')) return '🖼️';
        return '📎';
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {helpText && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{helpText}</p>
            )}

            {!currentFile ? (
                <div
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-all ${dragActive
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : error
                                ? 'border-red-300 dark:border-red-600'
                                : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
                        }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                        <div className="text-4xl mb-2">📤</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            Arraste o arquivo aqui ou clique para selecionar
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            {accept} • Máx {maxSizeMB}MB
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="text-3xl">{getFileIcon(currentFile.name)}</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                            {currentFile.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {(currentFile.size / 1024).toFixed(1)} KB
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        aria-label="Remover arquivo"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span>⚠️</span>
                    {error}
                </p>
            )}
        </div>
    );
}
