'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardBody, CardHeader, CardFooter, Button } from "@nextui-org/react";
import { format } from 'date-fns';

interface PictureDetailProps {
  picture: {
    id: string;
    url: string;
    prompt: string;
    settings?: {
      image_size?: string;
      num_inference_steps?: number;
      seed?: number;
      sync_mode?: boolean;
      num_images?: number;
      enable_safety_checker?: boolean;
    };
    created_at: string;
    username: string;
  };
}

const PictureDetail: React.FC<PictureDetailProps> = ({ picture }) => {
  const handleBackClick = () => {
    window.history.back();
  };

  const formattedDate = format(new Date(picture.created_at), 'yyyy/MM/dd HH:mm:ss');

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Image Details</h1>
        <span className="text-sm text-gray-500">Created by: {picture.username || 'Unknown'}</span>
      </CardHeader>
      <CardBody>
        <div className="relative w-full h-96 mb-4">
          <Image
            src={picture.url}
            alt={picture.prompt || 'No prompt available'}
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="space-y-2">
          <p><strong>Prompt:</strong> {picture.prompt || 'No prompt available'}</p>
          <p><strong>Image Size:</strong> {picture.settings?.image_size || 'N/A'}</p>
          <p><strong>Inference Steps:</strong> {picture.settings?.num_inference_steps || 'N/A'}</p>
          {picture.settings?.seed && <p><strong>Seed:</strong> {picture.settings.seed}</p>}
          <p><strong>Sync Mode:</strong> {picture.settings?.sync_mode ? 'On' : 'Off'}</p>
          <p><strong>Number of Images:</strong> {picture.settings?.num_images || 'N/A'}</p>
          <p><strong>Safety Checker:</strong> {picture.settings?.enable_safety_checker ? 'Enabled' : 'Disabled'}</p>
          <p><strong>Created At:</strong> {formattedDate}</p>
        </div>
      </CardBody>
      <CardFooter>
        <Button color="primary" onClick={handleBackClick}>
          Back to Gallery
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PictureDetail;