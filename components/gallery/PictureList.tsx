import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Picture {
  id: string
  url: string
  prompt: string
  username: string
  created_at: string
}

interface PictureListProps {
  pictures: Picture[]
}

const PictureList: React.FC<PictureListProps> = ({ pictures }) => {
  console.log('Pictures in PictureList:', pictures) // 添加这行来确认数据

  if (!pictures || pictures.length === 0) {
    return <div>No pictures found.</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {pictures.map((picture) => (
        <Link href={`/picture/${picture.id}`} key={picture.id}>
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-48">
              {picture.url ? (
                <Image
                  src={picture.url}
                  alt={picture.prompt || 'No prompt available'}
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  No image available
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">By {picture.username || 'Unknown'}</p>
              <p className="text-gray-800 font-semibold truncate">{picture.prompt || 'No prompt available'}</p>
              <p className="text-xs text-gray-500 mt-2">
                {picture.created_at ? new Date(picture.created_at).toLocaleDateString() : 'Date unknown'}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default PictureList