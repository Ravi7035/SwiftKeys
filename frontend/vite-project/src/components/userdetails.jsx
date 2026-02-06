import React, { useState, useEffect, useRef } from "react";
import { Camera, Mail, User } from "lucide-react";
import userAuthStore from "../store/AuthenticationStore";

const UserDetails = () => {
  const { userauth, updatingprofile, isUpdatingprofile } = userAuthStore();
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (userauth) {
      const pic = userauth.profile_pic || userauth.profilePicture || userauth.avatar;
      // Only set preview if it's a valid URL (not empty or just whitespace)
      setPreview(pic && pic.trim() ? pic : null);
    }
  }, [userauth]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const url = URL.createObjectURL(file);
    setPreview(url);

    // Convert file to base64 and upload to server
    const reader = new FileReader();
    reader.onloadend = () => {
      updatingprofile({ profile_pic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full min-h-screen bg-black text-white pt-24 pb-10">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            Profile Details
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-8 shadow-lg">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-32 h-32 mb-4">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-500/20 to-neutral-900 border-2 border-neutral-700 flex items-center justify-center overflow-hidden">
                {preview ? (
                  <img src={preview} alt="User Avatar" className="w-full h-full object-cover object-center" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-neutral-900">
                    <Camera size={48} className="text-neutral-500" />
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <label className="absolute bottom-0 right-0 bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-full cursor-pointer shadow-lg transition-colors">
                <Camera size={18} />
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            {isUpdatingprofile && <p className="text-sm text-neutral-400">Uploading...</p>}
          </div>

          {/* User Info Section */}
          <div className="space-y-6">
            {/* Username */}
            <div>
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-bold block mb-2 flex items-center gap-2">
                <User size={14} /> Username
              </label>
              <input
                type="text"
                value={userauth?.username || ""}
                disabled
                className="w-full px-4 py-3 rounded-lg border bg-neutral-900 border-neutral-700 text-neutral-200 cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-bold block mb-2 flex items-center gap-2">
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                value={userauth?.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-lg border bg-neutral-900 border-neutral-700 text-neutral-200 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-6 text-center text-sm text-neutral-500">
          <p>Click the camera icon to update your profile picture.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
