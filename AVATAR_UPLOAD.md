# Avatar Upload Functionality

## Overview
This application now supports avatar (profile photo) upload functionality for both registration and profile management with complete state persistence and default avatar fallback.

## Features

### Registration Page
- Users can upload a profile photo during registration
- Photo preview is shown immediately after selection
- Supports common image formats (PNG, JPG, JPEG, GIF, WebP)
- File size limit: 5MB
- Photos are validated on both frontend and backend
- **Default avatar**: Shows `/images/profile.png` when no custom photo is uploaded

### Profile Page
- Users can update their profile photo
- Avatar editing is only available when in edit mode
- **Avatar persistence**: Changes are saved to backend and persist across sessions
- **Default fallback**: Gracefully falls back to default avatar on load errors
- Same validation rules as registration

## Recent Fixes Applied

### ✅ **Photo Persistence Issue**
- **Problem**: Photos weren't saving when updated in profile
- **Solution**: Updated profile `handleSubmit` to include avatar in backend API calls
- **Result**: Avatar changes now persist across sessions

### ✅ **Default Avatar Fallback**
- **Problem**: No default avatar shown when user has no custom photo
- **Solution**: Added proper fallback to `/images/profile.png`
- **Result**: Users always see a profile image, never empty placeholder

### ✅ **State Synchronization**
- **Problem**: Component state not updating when props changed
- **Solution**: Added `useEffect` to sync preview with `currentAvatar` prop
- **Result**: Avatar updates are immediately reflected in UI

### ✅ **Import Errors**
- **Problem**: Missing icon imports causing runtime errors
- **Solution**: Added all required FiIcon imports (`FiUser`, `FiEye`, etc.)
- **Result**: Registration page loads without errors

### ✅ **Invalid URL Error**
- **Problem**: Next.js Image component receiving invalid URL `"uploaded-avatar.jpg"`
- **Solution**: 
  - Fixed registration placeholder to send actual avatar URL
  - Added URL validation in AvatarUpload component
  - Enhanced error handling for malformed URLs
- **Result**: Profile page loads without URL constructor errors

## Technical Implementation

### Backend API Endpoints

#### Upload Avatar
- **POST** `/api/upload/avatar`
- Accepts multipart form data with `avatar` file field
- Optional `userId` field for user association
- Returns: `{ success: true, avatarUrl: string }`

#### Delete Avatar
- **DELETE** `/api/upload/avatar`
- Body: `{ userId: string }`
- Returns: `{ success: true, message: string }`

### Frontend Components

#### AvatarUpload Component
- **Location**: `/components/AvatarUpload.jsx`
- **Props**:
  - `currentAvatar`: Current avatar URL
  - `onAvatarChange`: Callback when avatar changes
  - `userId`: User ID for API calls
  - `size`: Avatar size in pixels (default: 100)
  - `editable`: Whether avatar can be changed (default: true)
  - `className`: Additional CSS classes
  - `showUploadText`: Show upload instruction text (default: true)

### File Storage
- Uploaded avatars are stored in `/public/uploads/` directory
- Files are named using timestamp and user ID for uniqueness
- Direct URL access: `/uploads/filename.ext`

### Validation Rules
- **File Types**: PNG, JPG, JPEG, GIF, WebP
- **File Size**: Maximum 5MB
- **Dimensions**: No specific restrictions (auto-resized for display)

## Usage Examples

### Registration Integration
```jsx
<AvatarUpload
  currentAvatar={null}
  onAvatarChange={(avatarUrl) => setForm(prev => ({ ...prev, avatar: avatarUrl }))}
  userId={`temp_${Date.now()}`}
  size={120}
  editable={true}
  showUploadText={true}
/>
```

### Profile Integration
```jsx
<AvatarUpload
  currentAvatar={form.avatar}
  onAvatarChange={(avatarUrl) => setForm(prev => ({ ...prev, avatar: avatarUrl }))}
  userId={authUser?.id}
  size={128}
  editable={isEditing}
  className="border-4 border-white shadow-xl"
  showUploadText={false}
/>
```

## Error Handling
- Invalid file types show user-friendly error messages
- File size violations are caught and reported
- Network errors during upload are handled gracefully
- Fallback to default avatar image if upload fails

## Browser Compatibility
- Works in all modern browsers
- Uses File API for client-side validation
- Progressive enhancement approach
