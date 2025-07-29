import React, { useState, useRef, useEffect } from 'react';
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
  const [previewUrl, setPreviewUrl] = useState(() => {
    // Validate initial URL
    if (currentAvatar && (currentAvatar.startsWith('http') || currentAvatar.startsWith('/') || currentAvatar.startsWith('blob:'))) {
      return currentAvatar;
    }
    return '/images/profile.png';
  });
  const fileInputRef = useRef(null);

  // Update preview when currentAvatar prop changes
  useEffect(() => {
    // Validate URL before setting it
    if (currentAvatar) {
      try {
        // Check if it's a valid URL or a valid relative path
        if (currentAvatar.startsWith('http') || currentAvatar.startsWith('/') || currentAvatar.startsWith('blob:')) {
          setPreviewUrl(currentAvatar);
        } else {
          console.warn('Invalid avatar URL:', currentAvatar);
          setPreviewUrl('/images/profile.png');
        }
      } catch (error) {
        console.warn('Error validating avatar URL:', error);
        setPreviewUrl('/images/profile.png');
      }
    } else {
      setPreviewUrl('/images/profile.png');
    }
  }, [currentAvatar]);

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
      if (userId) {
        formData.append('userId', userId);
      }

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for authentication
      });

      const result = await response.json();

      if (result.success && result.avatarUrl) {
        // Clean up object URL
        URL.revokeObjectURL(objectUrl);
        
        // Update with the server-returned URL
        setPreviewUrl(result.avatarUrl);
        if (onAvatarChange) {
          onAvatarChange(result.avatarUrl);
        }
        
        console.log('Avatar uploaded successfully:', result.avatarUrl);
      } else {
        // Revert preview on error
        setPreviewUrl(currentAvatar);
        alert(result.message || 'Failed to upload avatar');
        console.error('Upload failed:', result);
      }
    } catch (error) {
      // Revert preview on error
      setPreviewUrl(currentAvatar);
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar. Please try again.');
    } finally {
      setIsUploading(false);
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
      <div
        className={`overflow-hidden rounded-full bg-gray-200 ${editable ? 'cursor-pointer' : ''}`}
        style={{ width: size, height: size }}
        onClick={openFileDialog}
      >
        <Image
          src={previewUrl || '/images/profile.png'}
          alt="Avatar"
          width={size}
          height={size}
          className="object-cover w-full h-full"
          onError={() => setPreviewUrl('/images/profile.png')}
          unoptimized={previewUrl?.startsWith('blob:')}
        />
      </div>
      {/* Show remove button only if a custom image is selected and not uploading */}
      {editable && previewUrl && previewUrl !== '/images/profile.png' && !isUploading && (
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
    </div>
  );
};

export default AvatarUpload;
