import React, { forwardRef, InputHTMLAttributes } from 'react';

interface RInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    helperText?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'outlined' | 'filled' | 'underlined';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    isRequired?: boolean;
}

const RInput = forwardRef<HTMLInputElement, RInputProps>(
    (
        {
            label,
            error,
            helperText,
            size = 'md',
            variant = 'outlined',
            leftIcon,
            rightIcon,
            isRequired = false,
            className = '',
            disabled,
            ...props
        },
        ref
    ) => {
        const sizeClasses = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-2.5 text-base',
            lg: 'px-5 py-3 text-lg',
        };

        const variantClasses = {
            outlined:
                'border border-[var(--input-border)] bg-[var(--input-background)] focus:border-[var(--input-border)] focus:ring-2 focus:ring-[var(--input-border)]',
            filled: 'border-0 bg-[var(--input-background)] focus:bg-[var(--input-background)] focus:ring-2 focus:ring-[var(--input-border)] focus:border-[var(--input-border)]',
            underlined:
                'border-0 border-b-2 border-gray-300 bg-transparent focus:border-[var(--input-border)] focus:ring-0',
        };

        const baseClasses = `
            w-full rounded-lg transition-all duration-200
            placeholder:text-gray-400
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
            ${className}
        `;

        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        {label}
                        {isRequired && <span className="ml-1 text-red-500">*</span>}
                    </label>
                )}

                <div className="relative">
                    {leftIcon && (
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        className={` ${baseClasses} ${leftIcon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} `}
                        disabled={disabled}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>

                {(error || helperText) && (
                    <div className="mt-1.5">
                        {error && (
                            <p className="flex items-center gap-1 text-sm text-red-600">
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {error}
                            </p>
                        )}
                        {helperText && !error && (
                            <p className="text-sm text-gray-500">{helperText}</p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

RInput.displayName = 'RInput';

export default RInput;
