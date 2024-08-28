import { createClient } from '@supabase/supabase-js';
import PictureDetail from '@/components/gallery/PictureDetail';
import { notFound } from 'next/navigation';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  async function getPictureDetails(id: string) {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();
  
    if (error) {
      console.error('Error fetching picture:', error);
      throw new Error(`Failed to fetch picture: ${error.message}`);
    }
    
    if (!data) {
      notFound();
    }
  
    return data;
  }
  
  export default async function PicturePage({ params }: { params: { id: string } }) {
    try {
      const picture = await getPictureDetails(params.id);

      return (
        <div className="container mx-auto p-4">
          <h1>Picture Details</h1>
          <PictureDetail picture={picture} />
        </div>
      );
    } catch (error) {
      console.error('Error in PicturePage:', error);
      return <div>Error loading picture details. Please try again later.</div>;
    }
  }