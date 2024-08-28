import { createClient } from '@supabase/supabase-js';
import { findPictureById } from "@/database/pictureRepo";
import { NextRequest } from "next/server";

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

  if (error) throw error;
  return data;
}

export default async function PicturePage({ params }: { params: { id: string } }) {
  const picture = await getPictureDetails(params.id);
  return new Response(JSON.stringify(picture), {
    headers: { 'Content-Type': 'application/json' },
  });
}


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id") || "";

  const picture = await findPictureById(id);

  return new Response(JSON.stringify(picture), { status: 200 });
}