import type { Character } from '../data/types';

const paths: Record<Character, { hair: string; hairFill: string; skin: string; shirt: string; extra?: string }> = {
  A: {
    shirt: '#3E7EA6',
    skin: '#C99B6E',
    hairFill: '#2A1D12',
    hair: 'M25 42c-6-16 6-28 25-28s31 12 25 28c-2-8-8-6-10-12-5 7-14 7-20 2-4 6-9 5-13 6-3 1-6 3-7 4z',
  },
  B: {
    shirt: '#D96A2B',
    skin: '#E9C9A8',
    hairFill: '#5C4127',
    hair: 'M27 30c8-10 38-10 46 0 3 8 2 22-3 30-1-10-2-18-6-20-8 4-24 4-32 0-4 2-5 10-6 20-5-8-6-22-3-30z',
    extra: 'headband',
  },
  C: {
    shirt: '#7A9A3E',
    skin: '#7A5230',
    hairFill: '#1F2430',
    hair: 'M28 34c10-8 34-8 44 0 2-4-2-10-8-11-6-6-22-6-28 0-6 1-10 7-8 11z',
    extra: 'strap',
  },
  D: {
    shirt: '#C24270',
    skin: '#B98150',
    hairFill: '#6B4322',
    hair: 'M27 34c9-11 37-11 46 0-1 8-4 14-4 14s-9-8-19-8-18 8-19 8 0-6-4-14z',
    extra: 'glasses,wavy',
  },
  E: {
    shirt: '#E8B93C',
    skin: '#8A5A34',
    hairFill: '#3B2A1C',
    hair: 'M29 36c8-7 34-7 42 0',
    extra: 'chefhat',
  },
  F: {
    shirt: '#3E7EA6',
    skin: '#8A5A34',
    hairFill: '#1F2430',
    hair: 'M28 40c-2-14 8-22 22-22s24 8 22 22c-10-6-34-6-44 0z',
    extra: 'cap',
  },
};

export function TeenAvatar({ character, size = 60 }: { character: Character; size?: number }) {
  const p = paths[character];
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 100 120">
      <path d="M26 100c0-15 6-25 24-25s24 10 24 25" fill={p.shirt} stroke="#241C11" strokeWidth="3" strokeLinejoin="round" />
      {p.extra?.includes('strap') && (
        <path d="M20 96l14-46" stroke="#5C4127" strokeWidth="7" strokeLinecap="round" />
      )}
      {p.extra?.includes('wavy') && (
        <>
          <path d="M23 86c-6-20-6-40 4-50 4 20 2 36-4 50z" fill={p.hairFill} stroke="#241C11" strokeWidth="3" strokeLinejoin="round" />
          <path d="M77 86c6-20 6-40-4-50-4 20-2 36 4 50z" fill={p.hairFill} stroke="#241C11" strokeWidth="3" strokeLinejoin="round" />
        </>
      )}
      <circle cx="50" cy={character === 'E' ? 48 : 46} r="23" fill={p.skin} stroke="#241C11" strokeWidth="3" />
      {p.extra?.includes('chefhat') ? (
        <>
          <path d={p.hair} fill="none" stroke="#241C11" strokeWidth="8" strokeLinecap="round" />
          <path d="M31 18c-8 0-8 12 0 14 0-8 6-10 6-10s2 8 13 8 13-8 13-8 6 2 6 10c8-2 8-14 0-14-2-8-36-8-38 0z" fill="#FFFDF6" stroke="#241C11" strokeWidth="3" strokeLinejoin="round" />
        </>
      ) : (
        <path d={p.hair} fill={p.hairFill} stroke="#241C11" strokeWidth="3" strokeLinejoin="round" />
      )}
      {p.extra?.includes('headband') && (
        <path d="M29 32c14 5 28 5 42 0" fill="none" stroke="#E8B93C" strokeWidth="5" strokeLinecap="round" />
      )}
      {p.extra?.includes('cap') && (
        <path d="M63 24c8-2 15 2 15 8s-9 6-15 4z" fill="#C24270" stroke="#241C11" strokeWidth="3" strokeLinejoin="round" />
      )}
      {p.extra?.includes('glasses') ? (
        <>
          <circle cx="41" cy="49" r="6" fill="none" stroke="#241C11" strokeWidth="2.4" />
          <circle cx="59" cy="49" r="6" fill="none" stroke="#241C11" strokeWidth="2.4" />
          <path d="M47 49h6" stroke="#241C11" strokeWidth="2.4" />
        </>
      ) : (
        <>
          <circle cx="41" cy={character === 'E' ? 51 : 49} r="3.2" fill="#241C11" />
          <circle cx="59" cy={character === 'E' ? 51 : 49} r="3.2" fill="#241C11" />
        </>
      )}
      <path d={`M40 ${character === 'E' ? 61 : 59}c4 5 16 5 20 0`} stroke="#241C11" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function MascotIcon({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" className={className}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2C85B" />
          <stop offset="100%" stopColor="#D96A2B" />
        </linearGradient>
      </defs>
      <path
        d="M40 6c10 14 26 24 26 42a26 26 0 0 1-52 0c0-8 3-14 7-19 2 7 7 10 11 7-5-13 1-22 8-30z"
        fill="url(#sparkGrad)"
        stroke="#241C11"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="52" r="4" fill="#241C11" />
      <circle cx="50" cy="52" r="4" fill="#241C11" />
      <path d="M32 62c3 3 13 3 16 0" stroke="#241C11" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
