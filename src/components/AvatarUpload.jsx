import React, { useState, useRef } from 'react';
import { FiCamera, FiX, FiUpload } from 'react-icons/fi';
import Image from 'next/image';

const AvatarUpload = ({ 
  currentAvatar, 
  onAvatarChange, 
  userId, 
  size = 120, 
  editable = true,
  className = "",
  showUploadText = true 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentAvatar);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size too large. Maximum size is 5MB.');
      return;
    }

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Upload file
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', userId);

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setPreviewUrl(result.avatarUrl);
        if (onAvatarChange) {
          onAvatarChange(result.avatarUrl);
        }
      } else {
        // Revert preview on error
        setPreviewUrl(currentAvatar);
        alert(result.message || 'Failed to upload avatar');
      }
    } catch (error) {
      // Revert preview on error
      setPreviewUrl(currentAvatar);
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar. Please try again.');
    } finally {
      setIsUploading(false);
      // Clean up object URL
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!userId) return;

    setIsUploading(true);
    try {
      const response = await fetch(`/api/upload/avatar?userId=${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setPreviewUrl(null);
        if (onAvatarChange) {
          onAvatarChange(null);
        }
      } else {
        alert(result.message || 'Failed to remove avatar');
      }
    } catch (error) {
      console.error('Error removing avatar:', error);
      alert('Error removing avatar. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    if (editable && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar Image */}
      <div 
        className={`relative overflow-hidden rounded-full bg-gray-200 ${
          editable ? 'cursor-pointer group' : ''
        }`}
        style={{ width: size, height: size }}
        onClick={openFileDialog}
      >
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Avatar"
            width={size}
            height={size}
            className="object-cover w-full h-full"
            onError={() => setPreviewUrl(null)}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-300 text-gray-500">
            <FiCamera size={size * 0.3} />
          </div>
        )}

        {/* Upload Overlay */}
        {editable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isUploading ? (
              <div className="flex flex-col items-center text-white">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-1"></div>
                <span className="text-xs">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-white">
                <FiCamera size={size * 0.2} />
                {showUploadText && (
                  <span className="text-xs mt-1">Upload</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Remove Button */}
      {editable && previewUrl && !isUploading && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveAvatar();
          }}
          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow-md"
        >
          <FiX size={12} />
        </button>
      )}

      {/* Hidden File Input */}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      )}

      {/* Upload Text for Registration */}
      {editable && showUploadText && !previewUrl && (
        <div className="text-center mt-2">
          <button
            onClick={openFileDialog}
            disabled={isUploading}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <FiUpload size={14} />
            Upload Photo
          </button>
          <p className="text-xs text-gray-500 mt-1">
            Optional - JPEG, PNG, GIF, WebP (max 5MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
