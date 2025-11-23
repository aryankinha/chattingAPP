import React, { useState } from "react";

const ProfileSettings = () => {
  const [name, setName] = useState("Alex Doe");

  return (
    <main className="flex-1 p-6 bg-background-light">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-text-primary-dark text-3xl font-black tracking-[-0.02em]">
            Profile Settings
          </h1>
          <p className="text-text-secondary-dark text-sm">
            Manage your profile information and account security
          </p>
        </div>

        <div className="flex flex-col gap-6">

          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-6 rounded-lg border border-gray-200 p-6">
            <div className="flex flex-col items-center text-center gap-1">
              <h2 className="text-text-primary-dark text-base font-bold">Profile Picture</h2>
              <p className="text-text-secondary-dark text-xs">
                Recommended size: 200×200px
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div
                className="h-28 w-28 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-UN9ClhiXnmaho9DuDWn1Sc98ciki6uS9N6zvBSDJReFxjdGz_VklEaGREpEePC1fiEIZslW-_8tunxrLur2amKcCWIAYhR8ndiBq_MKmCgvAPUJgjk5btYn1Rdt-4Fh6yAHQ8O1P0p0zVAfA4Tl-F_jNdkvdhzcUZZtKzmmH3CRzHTO5DLdkHjD0BjYECXrYPu_y91hbMddaWZdGAV96vOBiAvA3eox8vGXc3RuiXCOIKnMpYLydb3XEpnBGrAFAtYz5V6WjEDlv")',
                }}
              />

              <div className="flex gap-3">
                <button className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-accent-tertiary transition-colors">
                  Upload
                </button>
                <button className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-text-primary-dark hover:bg-gray-200 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="flex flex-col md:flex-row items-start gap-4 rounded-lg border border-gray-200 p-5">
            <div className="flex-1">
              <h2 className="text-text-primary-dark text-base font-bold">Name</h2>
              <p className="text-text-secondary-dark text-xs">
                This is the name other users will see
              </p>
            </div>

            <div className="w-full md:w-1/2">
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-full border border-gray-300 bg-white py-2.5 px-5 
                text-sm text-text-primary-dark placeholder:text-text-secondary-dark 
                focus:border-primary focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Password Section */}
          <div className="flex flex-col md:flex-row items-start gap-4 rounded-lg border border-gray-200 p-5">
            <div className="flex-1">
              <h2 className="text-text-primary-dark text-base font-bold">Password</h2>
              <p className="text-text-secondary-dark text-xs">
                Update your password regularly to stay secure
              </p>
            </div>

            <div className="w-full md:w-1/2 flex flex-col gap-3">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full rounded-full border border-gray-300 bg-white py-2.5 px-5 
                text-sm text-text-primary-dark placeholder:text-text-secondary-dark 
                focus:border-primary focus:ring-primary outline-none"
              />

              <input
                type="password"
                placeholder="New Password"
                className="w-full rounded-full border border-gray-300 bg-white py-2.5 px-5 
                text-sm text-text-primary-dark placeholder:text-text-secondary-dark 
                focus:border-primary focus:ring-primary outline-none"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full rounded-full border border-gray-300 bg-white py-2.5 px-5 
                text-sm text-text-primary-dark placeholder:text-text-secondary-dark 
                focus:border-primary focus:ring-primary outline-none"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-2">
          <button className="rounded-full bg-gray-100 px-5 py-2 text-xs font-bold text-text-primary-dark hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-accent-tertiary transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
};

export default ProfileSettings;
