import React from 'react';

// ==========================================
// إعدادات العملة (Currency Settings)
// ==========================================

// يمكنك تغيير اسم العملة هنا
// You can change the currency name here
export const CURRENCY_NAME = 'عملة الكازينو';

// يمكنك تغيير رمز العملة هنا (اختياري)
// You can change the currency symbol here (optional)
export const CURRENCY_SYMBOL = '🪙';

// يمكنك وضع مسار الصورة الخاصة بالعملة هنا
// ضع صورتك في مجلد public واستخدم المسار الخاص بها، مثلا: /images/my-coin.png
// You can change the currency image URL here
export const CURRENCY_IMAGE_URL = 'https://cdn-icons-png.flaticon.com/512/2875/2875887.png'; // صورة افتراضية

// هذا المكون يعرض صورة العملة في الألعاب
// This component renders the coin image across the games
export const CurrencyIcon = ({ size = 18, className = '', style = {} }) => {
    return (
        <img 
            src={CURRENCY_IMAGE_URL} 
            alt={CURRENCY_NAME}
            width={size}
            height={size}
            className={`currency-icon ${className}`}
            style={{ 
                objectFit: 'contain', 
                display: 'inline-block', 
                verticalAlign: 'middle', 
                ...style 
            }}
            onError={(e) => {
                // إذا لم يجد الصورة، سيعرض هذه الأيقونة الذهبية الافتراضية
                e.target.onerror = null; 
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%23FFD700' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.14 1.64-1.74 0-2.1-.96-2.17-1.92H8.15c.09 1.7 1.14 2.85 2.75 3.21V19h2.36v-1.67c1.67-.35 2.9-1.37 2.9-2.91-.01-1.52-.97-2.43-3.85-3.28z'/%3E%3C/svg%3E";
            }}
        />
    );
};
