import { Input } from '@/components/ui/input';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
}

export function ImageUploader({ onImageChange }: ImageUploaderProps) {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      onImageChange(file);
    } else {
      onImageChange(null);
    }
  };

  return (
    <Input
      id="picture"
      type="file"
      accept="image/*"
      onChange={handleImageChange}
    />
  );
}
