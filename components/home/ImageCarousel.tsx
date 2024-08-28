"use client";
import ImageGallery from "@/components/ImageGallery";
const images = [
  {
    src: "https://image.omostai.com/I1OzOjvHde0qrf1VC0HxS.png",
    alt: "Girl in Sea",
    href: "/picture/16794e6b-c8f0-40f1-88b7-0731699110cb",
    tags: ["Girl", "Sea"],
  },
  {
    src: "https://image.omostai.com/qHrr3Vcok7-Q2qAcqwaRs.png",
    alt: "Magic",
    href: "#",
    tags: ["Girl", "Magic"],
  },
  {
    src: "https://image.omostai.com/RYAiMkxLmT0_k64T241_L.png",
    alt: "Girl in Desert",
    href: "#",
    tags: ["Girl", "Desert"],
  },
  {
    src: "https://image.omostai.com/K-IufKLiFYuZ5WS58gZxl.png",
    alt: "Girl Surfing",
    href: "#",
    tags: ["Surfing", "Sea"],
  },
  {
    src: "https://image.omostai.com/J0qdM35Kg1LWdfj5WUGXz.png",
    alt: "Castle",
    href: "/picture/6c7ef88a-7b71-40f6-8ef7-677de36f5b21",
    tags: ["Girl", "Castle"],
  },
  {
    src: "https://image.omostai.com/JuLfa5A5xcj1dY0tbaClq.png",
    alt: "Court",
    href: "/picture/34a7ff69-0980-41e1-802f-217c68ffa1a4",
    tags: ["Girl", "Court"],
  },
];

export default function ImageCarousel() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <ImageGallery images={images} />
      </div>
    </>
  );
}

