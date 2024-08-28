"use client";
import { ALL_GENERATOR } from "@/config/generator";
import { WAITLIST_FORM_LINK } from "@/config/tiers";
import { Button, Input, Select, SelectItem, Slider, Switch, Textarea } from "@nextui-org/react";
import { Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const initialTags: string[] = [];

export default function Generator({
  id,
  locale,
  langName,
}: {
  id: string;
  locale: any;
  langName: string;
}) {
  const GENERATOR = ALL_GENERATOR[`GENERATOR_${langName.toUpperCase()}`];

  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // New state for additional inputs
  const [imageSize, setImageSize] = useState("landscape_4_3");
  const [numInferenceSteps, setNumInferenceSteps] = useState(4);
  const [seed, setSeed] = useState("");
  const [syncMode, setSyncMode] = useState(false);
  const [numImages, setNumImages] = useState(1);
  const [enableSafetyChecker, setEnableSafetyChecker] = useState(true);


  async function handleGenerateImage() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: content,
          imageSize,
          numInferenceSteps,
          seed: seed ? parseInt(seed) : undefined,
          syncMode,
          numImages,
          enableSafetyChecker,
        }),
      });

      if (!response.ok) {
        const errmsg = await response.text();
        throw new Error(errmsg || response.statusText);
      }

      const data = await response.json();
      router.push(`/picture/${data.id}`);
    } catch (error: any) {
      toast.error(`Failed to generate image: ${error.message}`);
      console.error("Failed to generate image:", error);
    } finally {
      setIsLoading(false);
    }
  }

//   return (
//     <div className="lg:max-w-4xl md:max-w-3xl w-[95%] px-4 sm:px-6 lg:px-8 pb-8 pt-8 md:pt-12 space-y-6 text-center">
//       {/* <h2 className="text-5xl">{GENERATOR.title}</h2> */}
//       <div className="flex w-full space-x-4">
//         <Textarea
//           key="input"
//           variant="bordered"
//           label=""
//           labelPlacement="inside"
//           placeholder={GENERATOR.description}
//           className="col-span-12 md:col-span-6 flex-grow basis-2/3"
//           value={content}
//           onChange={(e) => setContent(e.target.value)}
//         />
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Image Size</label>
//             <Select
//               value={imageSize}
//               onChange={(e) => setImageSize(e.target.value)}
//             >
//               <SelectItem key="landscape_4_3" value="landscape_4_3">Landscape 4:3</SelectItem>
//               <SelectItem key="square_hd" value="square_hd">Square HD</SelectItem>
//               <SelectItem key="square" value="square">Square</SelectItem>
//               <SelectItem key="portrait_4_3" value="portrait_4_3">Portrait 4:3</SelectItem>
//               <SelectItem key="portrait_16_9" value="portrait_16_9">Portrait 16:9</SelectItem>
//               <SelectItem key="landscape_16_9" value="landscape_16_9">Landscape 16:9</SelectItem>
//             </Select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Num Inference Steps</label>
//             <Input
//               type="number"
//               value={numInferenceSteps.toString()}
//               onChange={(e) => setNumInferenceSteps(parseInt(e.target.value))}
//               min={1}
//               max={50}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Seed</label>
//             <Input
//               value={seed}
//               onChange={(e) => setSeed(e.target.value)}
//               placeholder="random"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Num Images</label>
//             <Input
//               type="number"
//               value={numImages.toString()}
//               onChange={(e) => setNumImages(parseInt(e.target.value))}
//               min={1}
//               max={4}
//             />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <Switch
//             checked={syncMode}
//             onChange={(e) => setSyncMode(e.target.checked)}
//           >
//             Sync Mode
//           </Switch>
//           <Switch
//             checked={enableSafetyChecker}
//             onChange={(e) => setEnableSafetyChecker(e.target.checked)}
//             isDisabled={true}
//           >
//             Enable Safety Checker
//           </Switch>
//         </div>
        
//         <Button
//           type="button"
//           className="flex flex-grow items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
//           onClick={handleGenerateImage}
//           disabled={isLoading} // 禁用按钮
//         >
//           <Tag />
//           {isLoading
//             ? GENERATOR.buttonTextGenerating
//             : GENERATOR.buttonTextGenerate}
//         </Button>
//       </div>
//       <p>{GENERATOR.textFullFeature}</p>
//       {visible && (
//         <p className="text-red-500">
//           Coming soon! Please join our{" "}
//           <a href={WAITLIST_FORM_LINK} className="underline">
//             waitlist
//           </a>
//           !
//         </p>
//       )}
//     </div>
//   );
// }




return (
  <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Prompt*</label>
        <Textarea
        key="input"
        variant="bordered"
        label=""
        labelPlacement="inside"
        placeholder={GENERATOR.description}
        className="col-span-12 md:col-span-6 flex-grow basis-2/3"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image Size</label>
          <Select
            value={imageSize}
            onChange={(e) => setImageSize(e.target.value)}
          >
            <SelectItem key="landscape_4_3" value="landscape_4_3">Landscape 4:3</SelectItem>
            <SelectItem key="square_hd" value="square_hd">Square HD</SelectItem>
            <SelectItem key="square" value="square">Square</SelectItem>
            <SelectItem key="portrait_4_3" value="portrait_4_3">Portrait 4:3</SelectItem>
            <SelectItem key="portrait_16_9" value="portrait_16_9">Portrait 16:9</SelectItem>
            <SelectItem key="landscape_16_9" value="landscape_16_9">Landscape 16:9</SelectItem>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Seed</label>
          <Input
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="random"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Num Inference Steps: {numInferenceSteps}
          </label>
          <Slider
            size="sm"
            step={1}
            minValue={1}
            maxValue={50}
            value={numInferenceSteps}
            onChange={(value) => setNumInferenceSteps(value as number)}
            className="max-w-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Num Images: {numImages}
          </label>
          <Slider
            size="sm"
            step={1}
            minValue={1}
            maxValue={4}
            value={numImages}
            onChange={(value) => setNumImages(value as number)}
            className="max-w-md"
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Switch
          checked={syncMode}
          onChange={(e) => setSyncMode(e.target.checked)}
        >
          Sync Mode
        </Switch>
        <Switch
          checked={enableSafetyChecker}
          onChange={(e) => setEnableSafetyChecker(e.target.checked)}
          isDisabled={true}
        >
          Enable Safety Checker
        </Switch>
      </div>

      <div className="text-xs text-gray-500">
        The safety checker cannot be disabled on the playground. This property is only available through the API.
      </div>

      {/* <Button
        color="primary"
        onClick={handleGenerateImage}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? GENERATOR.buttonTextGenerating : GENERATOR.buttonTextGenerate}
      </Button> */}
      <div className="flex justify-center mt-8">
        <Button
        type="button"
        className="text-lg w-1/2 flex flex-grow items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
        onClick={handleGenerateImage}
        disabled={isLoading} // 禁用按钮
        >
        <Tag />
        {isLoading
          ? GENERATOR.buttonTextGenerating
          : GENERATOR.buttonTextGenerate}
        </Button>
      </div>
    </div>
  </div>
);
}