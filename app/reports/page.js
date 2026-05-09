'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/expenses'); }, [router]);
  return <div style={{padding:40,color:'var(--on-surface-variant)'}}>Redirecting to Financial Intelligence...</div>;
}
