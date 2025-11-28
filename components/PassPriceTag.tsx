// components/PassPriceTag.tsx
'use client';

import { Ticket } from 'lucide-react';

interface Props {
  price: number;
  className?: string;
  align?: 'left' | 'right' | 'center';
  showTooltip?: boolean; // ✅ 툴팁 표시 여부 옵션 추가
}

export default function PassPriceTag({ price, className = '', align = 'left', showTooltip = true }: Props) {
  return (
    <div className={`group relative inline-flex items-center ${className}`}>
      {/* 가격 표시 (초록색 텍스트) */}
      <div className="flex items-center gap-1.5 text-emerald-600 font-bold cursor-help">
        <Ticket size={14} strokeWidth={2.5} />
        <span className="tabular-nums">{price.toLocaleString()}원</span>
      </div>

      {/* 툴팁 (showTooltip이 true일 때만 렌더링) */}
      {showTooltip && (
        <div 
          className={`
            absolute bottom-full mb-2 w-48 p-3 
            bg-gray-900/95 text-white text-xs rounded-xl shadow-xl backdrop-blur-sm
            opacity-0 invisible group-hover:opacity-100 group-hover:visible 
            transition-all duration-200 transform translate-y-1 group-hover:translate-y-0
            z-20 pointer-events-none
            ${align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'}
          `}
        >
          <div className="font-bold mb-1 text-emerald-400 flex items-center gap-1">
            <Ticket size={10} /> 북묵 패스 혜택가
          </div>
          <p className="leading-relaxed text-white/80">
            도서 매입가에 수수료 20%만 더한 가격입니다. (마진 0원)
          </p>
          
          {/* 말풍선 꼬리 */}
          <div 
            className={`
              absolute top-full w-0 h-0 border-4 border-transparent border-t-gray-900/95
              ${align === 'left' ? 'left-4' : align === 'right' ? 'right-4' : 'left-1/2 -translate-x-1/2'}
            `} 
          />
        </div>
      )}
    </div>
  );
}