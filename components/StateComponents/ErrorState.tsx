import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
    message: string;
    onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
    <div className="py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-amber-900">搜尋遇到問題</h3>
        <p className="mb-4 text-amber-800">{message}</p>
        <button
            onClick={onRetry}
            className="rounded-lg bg-amber-500 px-6 py-2 text-white transition-colors hover:bg-amber-600"
        >
            重新搜尋
        </button>
    </div>
);

export default ErrorState;
