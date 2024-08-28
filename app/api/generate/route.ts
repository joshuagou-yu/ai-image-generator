import { checkUserCredits, consumeUserCredits } from "@/actions/credits";
import { NextApiRequest, NextApiResponse } from 'next';
import { generateImage } from "@/actions/generateImage";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    console.log("Received body in API route:", JSON.stringify(body, null, 2));

    const { prompt: userPrompt, imageSize, numInferenceSteps, syncMode, numImages, enableSafetyChecker } = body
    
    if (!userPrompt || userPrompt.trim() === '') {
      return NextResponse.json({ error: 'User prompt is required and cannot be empty' }, { status: 400 })
    }

    console.log("Extracted userPrompt in API route:", userPrompt);

    const options = {
      image_size: imageSize,
      num_inference_steps: numInferenceSteps,
      sync_mode: syncMode,
      num_images: numImages,
      enable_safety_checker: enableSafetyChecker
    }

    const result = await generateImage(userPrompt, options)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in generate API route:', error)
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 })
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { userId, userPrompt } = req.body
    const result = await generateImage(userId, userPrompt)
    res.status(200).json(result)
  } catch (error) {
    console.error('Error in generate-image API route:', error)
    res.status(500).json({ error: 'Failed to generate image' })
  }
}
