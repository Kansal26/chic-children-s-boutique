import React, { useState, useRef, DragEvent } from "react";
import { AdminImage } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadCloud, X, GripVertical, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type ImageManagerProps = {
  images: AdminImage[];
  onChange: (images: AdminImage[]) => void;
};

export function ImageManager({ images, onChange }: ImageManagerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Drag and drop for reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (files: FileList | File[]) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const newImages: AdminImage[] = [];
    
    Array.from(files).forEach((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(`Invalid file type: ${file.name}. Only JPG, PNG, and WEBP are supported.`);
        return;
      }
      
      const url = URL.createObjectURL(file);
      
      // Determine default role
      let role: AdminImage["role"] = "gallery";
      if (images.length === 0 && newImages.length === 0) role = "primary";
      else if (images.length === 0 && newImages.length === 1) role = "hover";
      else if (images.length === 1 && !images.some(i => i.role === "hover") && newImages.length === 0) role = "hover";

      newImages.push({
        url,
        role,
        altText: "",
        order: images.length + newImages.length
      });
    });

    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
      toast.success(`${newImages.length} image(s) uploaded successfully.`);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    // If dropping files for upload
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input so the same files can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateImage = (index: number, updates: Partial<AdminImage>) => {
    const newImages = [...images];
    
    // Enforce Radio-button behavior for primary and hover
    if (updates.role === "primary") {
      newImages.forEach(img => {
        if (img.role === "primary") img.role = "gallery";
      });
    } else if (updates.role === "hover") {
      newImages.forEach(img => {
        if (img.role === "hover") img.role = "gallery";
      });
    }

    newImages[index] = { ...newImages[index], ...updates };
    onChange(newImages);
  };

  const removeImage = (index: number) => {
    const imgToRemove = images[index];
    const newImages = images.filter((_, i) => i !== index);
    
    // Re-assign order
    newImages.forEach((img, i) => {
      img.order = i;
    });

    onChange(newImages);
    
    if (imgToRemove.role === "primary" || imgToRemove.role === "hover") {
      toast.warning(`You removed the ${imgToRemove.role} image. Please reassign a new one before publishing.`);
    }
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to remove all images?")) {
      onChange([]);
    }
  };

  // Reordering Logic
  const handleReorderDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    // Prevent file dropzone from activating
    e.stopPropagation();
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Setup drag image if needed, HTML5 usually handles it if draggable=true
  };

  const handleReorderDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.stopPropagation();
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newImages = [...images];
    const [draggedItem] = newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedItem);
    
    // Update order property
    newImages.forEach((img, i) => {
      img.order = i;
    });

    onChange(newImages);
    setDraggedIndex(null);
  };

  const handleReorderDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation(); // crucial for nested dropzones
    e.dataTransfer.dropEffect = "move";
  };
  
  const hasPrimary = images.some(img => img.role === "primary");
  const hasHover = images.some(img => img.role === "hover");

  return (
    <div className="space-y-6">
      {/* Validation Warning Header */}
      {(!hasPrimary || !hasHover) && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-md border border-rose-100 flex items-start gap-3">
          <ImageIcon className="h-5 w-5 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium">Missing Required Images</p>
            <p className="mt-1 opacity-90">
              Please assign exactly one <strong>Primary</strong> image and one <strong>Hover</strong> image before publishing.
            </p>
          </div>
        </div>
      )}

      {/* Upload Dropzone */}
      <div 
        className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <UploadCloud className={`h-10 w-10 mb-4 ${isDragging ? "text-blue-500" : "text-slate-400"}`} />
        <h3 className="text-lg font-medium text-slate-900 mb-1">Drag and drop images here</h3>
        <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">
          Supported formats: JPG, PNG, WEBP. You can upload multiple images at once.
        </p>
        <div className="flex gap-3">
          <Button type="button" onClick={() => fileInputRef.current?.click()}>
            Browse Files
          </Button>
          {images.length > 0 && (
            <Button type="button" variant="outline" onClick={clearAll} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
              Clear All
            </Button>
          )}
        </div>
        <input 
          type="file" 
          multiple 
          accept=".jpg,.jpeg,.png,.webp" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileInput}
        />
      </div>

      {/* Thumbnails Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <div 
              key={`${img.url}-${index}`}
              draggable
              onDragStart={(e) => handleReorderDragStart(e, index)}
              onDragOver={handleReorderDragOver}
              onDrop={(e) => handleReorderDrop(e, index)}
              className={`group relative bg-white border rounded-lg overflow-hidden shadow-sm transition-all
                ${draggedIndex === index ? "opacity-50 ring-2 ring-blue-400" : "hover:shadow-md"}
                ${img.role === "primary" ? "ring-2 ring-amber-400" : ""}
                ${img.role === "hover" ? "ring-2 ring-blue-400" : ""}
              `}
            >
              {/* Image Preview Container */}
              <div className="relative h-48 bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                <img src={img.url} alt={img.altText || "Preview"} className="h-full w-full object-cover" />
                
                {/* Overlay actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="h-8 w-8 bg-white/90 hover:bg-rose-500 hover:text-white rounded flex items-center justify-center text-slate-700 transition-colors shadow-sm"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div 
                  className="absolute top-2 left-2 h-8 w-8 bg-white/90 rounded flex items-center justify-center text-slate-500 cursor-grab active:cursor-grabbing shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Drag to reorder"
                >
                  <GripVertical className="h-4 w-4" />
                </div>
                
                {/* Badges */}
                {img.role === "primary" && (
                  <div className="absolute bottom-2 right-2 bg-amber-400 text-amber-950 text-xs font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                    Primary
                  </div>
                )}
                {img.role === "hover" && (
                  <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                    Hover
                  </div>
                )}
              </div>

              {/* Edit Controls */}
              <div className="p-4 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Image Role</Label>
                  <Select value={img.role} onValueChange={(val: any) => updateImage(index, { role: val })}>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary (Main)</SelectItem>
                      <SelectItem value="hover">Hover</SelectItem>
                      <SelectItem value="secondary_hover">Secondary Hover (Optional)</SelectItem>
                      <SelectItem value="gallery">Gallery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 uppercase tracking-wider">Alt Text (SEO)</Label>
                  <Input 
                    placeholder="Describe image..." 
                    value={img.altText} 
                    onChange={(e) => updateImage(index, { altText: e.target.value })}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
