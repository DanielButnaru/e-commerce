import { useUserProfile } from "../../hooks/user/useUserProfile";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { current } from "@reduxjs/toolkit";

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  address: Address;
}

const ProfileForm = () => {
  const { currentUser: user } = useAuth();
  const { profile, loading, updateProfile } = useUserProfile(user);
  

  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Update form data when profile or user changes
  useEffect(() => {
    if (user || profile) {
      setFormData((prev) => ({
        name: profile?.name || user?.displayName || prev.name,
        email: profile?.email || user?.email || prev.email,
        phone: profile?.phone || user?.phoneNumber || prev.phone,
        address: {
          street: profile?.address?.street || prev.address.street,
          city: profile?.address?.city || prev.address.city,
          state: profile?.address?.state || prev.address.state,
          zip: profile?.address?.zip || prev.address.zip,
        },
      }));
    }
  }, [user, profile]);

  // Show loading while profile loads
  if (loading) {
    return <div>Loading profile...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submit if loading or no user/profile
    if (loading) {
      setError("Profile is still loading. Please wait.");
      return;
    }

    if (!user) {
      setError("User not authenticated. Please log in.");
      return;
    }

    if (!profile) {
      setError("Profile not loaded - please try again");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updateProfile(formData, user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Profile Information
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Full Name</label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            className="w-full border border-gray-300 p-2 rounded bg-gray-100"
            type="email"
            value={formData.email}
            readOnly
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Phone Number</label>
          <input
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Address Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1">Street Address</label>
              <input
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="Enter street address"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">City</label>
                <input
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value },
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-1">State</label>
                <input
                  className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="text"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, state: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1">ZIP Code</label>
              <input
                className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                placeholder="ZIP code"
                value={formData.address.zip}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, zip: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loading}
          className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
