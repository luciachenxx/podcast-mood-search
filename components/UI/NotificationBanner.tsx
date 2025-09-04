import React from 'react';
import { Info, AlertCircle, CheckCircle } from 'lucide-react';

interface NotificationBannerProps {
    message: string;
    type: 'info' | 'warning' | 'success';
    className?: string;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({
    message,
    type,
    className = '',
}) => {
    const getConfig = () => {
        switch (type) {
            case 'info':
                return {
                    icon: Info,
                    bgColor: 'bg-amber-100',
                    borderColor: 'border-amber-200',
                    textColor: 'text-amber-800',
                    iconColor: 'text-amber-500',
                };
            case 'warning':
                return {
                    icon: AlertCircle,
                    bgColor: 'bg-yellow-100',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-800',
                    iconColor: 'text-yellow-500',
                };
            case 'success':
                return {
                    icon: CheckCircle,
                    bgColor: 'bg-green-100',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-800',
                    iconColor: 'text-green-500',
                };
            default:
                return {
                    icon: Info,
                    bgColor: 'bg-gray-100',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-800',
                    iconColor: 'text-gray-500',
                };
        }
    };

    const config = getConfig();
    const IconComponent = config.icon;

    return (
        <div
            className={`flex items-start rounded-lg border p-4 ${config.bgColor} ${config.borderColor} ${config.textColor} ${className}`}
        >
            <IconComponent className={`mt-0.5 mr-2 h-5 w-5 flex-shrink-0 ${config.iconColor}`} />
            <p>{message}</p>
        </div>
    );
};

export default NotificationBanner;
