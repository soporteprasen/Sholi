'use client';
import dynamic from 'next/dynamic';

const FBlock = dynamic(() => import('@/components/Footer/Fblock'), { ssr: false, loading: () => null });

export default function FBlockDeferred() {
  return <FBlock />;
}
