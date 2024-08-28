import dotenv from 'dotenv';
import path from 'path';
import { auth } from '@clerk/nextjs/server';
import { createPicture } from "@/database/pictureRepo";
import { downloadAndUploadImage } from "@/lib/s3";
import { PictureStatus } from "@/prisma/enums";
import * as fal from "@fal-ai/serverless-client";
import { createClient } from '@supabase/supabase-js';
import { clerkClient } from '@clerk/nextjs/server';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// 初始化 FAL 客户端
fal.config({
  credentials: process.env.FAL_API_KEY,
});

type ImageSize = "square_hd" | "square" | "portrait_4_3" | "portrait_16_9" | "landscape_4_3" | "landscape_16_9";
// 初始化 Supabase 客户端
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 

console.log('Supabase URL:', supabaseUrl) // 用于调试
console.log('Supabase Anon Key:', supabaseAnonKey ? '[REDACTED]' : undefined) // 用于调试，不显示实际的密钥

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)
export async function generateImage(
  userPrompt: string,
  options?: {
    image_size?: ImageSize;
    num_inference_steps?: number;
    seed?: number;
    sync_mode?: boolean;
    num_images?: number;
    enable_safety_checker?: boolean;
  }
) {
  console.log("Received userPrompt in generateImage:", userPrompt);
  // Get the current user from Clerk
  const { userId } = auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  // Fetch user details from Clerk
  const user = await clerkClient().users.getUser(userId)

  const username = user.username || user.firstName || user.lastName || user.emailAddresses[0].emailAddress.split('@')[0] || 'Anonymous';


  console.log("userId:", userId);
  console.log("prompt:", userPrompt);
  console.log("userEmail:", user.emailAddresses[0].emailAddress);
  console.log("username:", username);

  const systemPrompt = process.env.PROMPT_PICTURE_STYLE || "manga style, ";
  const prompt = systemPrompt + " " + userPrompt;

  try {
    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input: {
        prompt: prompt,
        image_size: options?.image_size || "landscape_4_3",
        num_inference_steps: options?.num_inference_steps || 8,
        seed: options?.seed,
        sync_mode: options?.sync_mode || false,
        num_images: options?.num_images || 1,
        enable_safety_checker: options?.enable_safety_checker !== false,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    if (result && typeof result === 'object' && 'images' in result && Array.isArray(result.images) && result.images.length > 0) {
      const imageUrl = result.images[0].url;
      const url = await downloadAndUploadImage(imageUrl);

      // 准备存储到 Supabase 的数据
      const imageData = {
        user_id: userId,
        url: url,
        prompt: userPrompt,
        settings: {
          image_size: options?.image_size || "landscape_4_3",
          num_inference_steps: options?.num_inference_steps || 4,
          seed: options?.seed,
          sync_mode: options?.sync_mode || false,
          num_images: options?.num_images || 1,
          enable_safety_checker: options?.enable_safety_checker !== false,
        },
        email: user.emailAddresses[0].emailAddress,
        username: username
      };

      console.log("Attempting to insert data into Supabase:", JSON.stringify(imageData, null, 2));

      // 存储图片信息到 Supabase
      const { data: supabaseData, error: supabaseError } = await supabase
        .from('images')
        .insert(imageData)
        .select()
  
      if (supabaseError) {
        console.error('Error storing image data in Supabase:', supabaseError)
        throw new Error(`Failed to store image data: ${supabaseError.message}`)
      }
  
      console.log("Successfully inserted data into Supabase:", supabaseData);

      const tags: string[] = [];
      // 保存到数据库
      const picture = {
        userId,
        prompt: userPrompt,
        tags,
        params: {
          input: prompt,
          tags,
          seed: result && typeof result === 'object' && 'seed' in result ? result.seed : undefined,
          has_nsfw_concepts: result && typeof result === 'object' && 'has_nsfw_concepts' in result ? result.has_nsfw_concepts : undefined,
        },
        url,
        status: PictureStatus.ONLINE,
      };

      const ret = await createPicture(picture);

      return {
        picture: ret,
        originalResponse: {
          images: Array.isArray(result.images) ? result.images : [],
          timings: typeof result === 'object' && 'timings' in result ? result.timings : undefined,
          seed: typeof result === 'object' && 'seed' in result ? result.seed : undefined,
          has_nsfw_concepts: typeof result === 'object' && 'has_nsfw_concepts' in result ? result.has_nsfw_concepts : undefined,
          prompt: typeof result === 'object' && 'prompt' in result ? result.prompt : undefined,
        },
        supabaseImage: supabaseData ? supabaseData[0] : null
      }; 
    }
    throw new Error("Failed to generate image");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

