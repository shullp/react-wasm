import { useEffect, useState } from 'react';

export const useImage = (imageFile: File | null) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result as string;
        setImage(img);
      };

      reader.readAsDataURL(imageFile);
    } else {
      setImage(null);
    }
  }, [imageFile]);
  return image;
};
