// lib/format.tsx
import React from 'react';

export const toNum = (v: any): number | undefined => {
  if (v === null || v === undefined) return undefined;
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  const s = String(v).replace(/[, \u00A0]/g, ''); // 쉼표/공백 제거
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

export const formatWon = (n?: number) => {
  if (typeof n !== 'number' || Number.isNaN(n)) return '—';
  return new Intl.NumberFormat('ko-KR').format(n) + '원';
};

export const nl2br = (text?: string) => {
  if (!text) return null;
  return text.split(/\r?\n/).map((line, i) => (
    <React.Fragment key={i}>
      {line}
      <br />
    </React.Fragment>
  ));
};
