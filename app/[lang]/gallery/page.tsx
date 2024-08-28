'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import PictureList from '@/components/gallery/PictureList';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function fetchPictures() {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching pictures:', error);
    return [];
  }

  return data;
}

export default function GalleryPage() {
  const [pictures, setPictures] = useState([]);

  useEffect(() => {
    async function getPictures() {
      const data = await fetchPictures();
      setPictures(data);
    }

    getPictures();
  }, []);

  const handleRefresh = async () => {
    const data = await fetchPictures();
    setPictures(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Image Gallery</h1>
      <button onClick={handleRefresh} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">
        Refresh
      </button>
      <PictureList pictures={pictures} />
    </div>
  );
}