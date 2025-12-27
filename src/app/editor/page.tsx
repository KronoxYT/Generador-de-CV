'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useSupabase } from '@/firebase';
import { initialData } from '@/lib/initial-data';

export default function EditorRedirectPage() {
  const { user, isUserLoading } = useUser();
  const supabase = useSupabase();
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (isUserLoading) return;
      if (!user) {
        router.replace('/login');
        return;
      }
      if (!supabase) return;
      const { data, error } = await supabase
        .from('cvs')
        .select('id')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) {
        console.error('Error fetching latest CV:', error);
      }
      if (data?.id) {
        router.replace(`/editor/${data.id}`);
        return;
      }
      const { data: created, error: createError } = await supabase
        .from('cvs')
        .insert({
          title: 'CV sin título',
          content: initialData,
          user_id: user.uid,
        })
        .select('id')
        .single();
      if (createError) {
        console.error('Error creating CV:', createError);
        setIsBusy(false);
        return;
      }
      router.replace(`/editor/${created.id}`);
    };
    run();
  }, [isUserLoading, user?.uid]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Cargando editor...</p>
    </div>
  );
}
