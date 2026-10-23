import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/middleware/apiMiddleware";
import { PageHeading } from "../components/dashboard/DashboardUI";

const fieldClassName =
  "mt-1 w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none focus:border-black disabled:bg-zinc-100 disabled:text-zinc-500";

function ProfilePage({ userData, setUserData }) {
  const name = userData?.fullName || "Nike Member";
  const email = userData?.email || "member@nikestore.com";
  const accountType = userData?.role === "admin" ? "Administrator" : "Nike member";
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || "",
    contactNumber: userData?.contactNumber || "",
    address: userData?.address || "",
  });

  useEffect(() => {
    setFormData({
      fullName: userData?.fullName || "",
      contactNumber: userData?.contactNumber || "",
      address: userData?.address || "",
    });
  }, [userData]);

  const startEditing = () => {
    setFormData({
      fullName: userData?.fullName || "",
      contactNumber: userData?.contactNumber || "",
      address: userData?.address || "",
    });
    setIsEditing(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const response = await api.patch("/auth/profile", formData);
      setUserData?.(response.data.userData);
      setFormData({
        fullName: response.data.userData.fullName || "",
        contactNumber: response.data.userData.contactNumber || "",
        address: response.data.userData.address || "",
      });
      setIsEditing(false);
      toast.success(response.data.message || "Profile updated successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update your profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  return (
    <>
      <PageHeading
        eyebrow="Your account"
        title="Profile"
        description="Manage your account information and preferences."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <section className="rounded-xl bg-zinc-100 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-xl font-black text-white">
            {name.slice(0, 1).toUpperCase()}
          </div>
          <h2 className="mt-4 text-lg font-bold">{name}</h2>
          <p className="mt-1 text-sm text-zinc-500">{email}</p>
          <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-600">
            {userData?.role === "admin" ? "Store admin" : "Nike member"}
          </span>
        </section>

        <section className="rounded-xl border border-zinc-200 p-5 sm:p-7">
          <h2 className="text-lg font-bold">Personal information</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Update your name, phone number, and delivery address.
          </p>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-xs font-semibold text-zinc-600">
                Full name
                <input
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={(event) => updateField("fullName", event.target.value)}
                  className={fieldClassName}
                />
              </label>
              <label className="block text-xs font-semibold text-zinc-600">
                Email address (cannot be changed)
                <input
                  type="email"
                  value={email}
                  disabled
                  className={fieldClassName}
                />
              </label>
              <label className="block text-xs font-semibold text-zinc-600">
                Phone number
                <input
                  type="tel"
                  autoComplete="tel"
                  minLength={11}
                  value={formData.contactNumber}
                  onChange={(event) => updateField("contactNumber", event.target.value)}
                  className={fieldClassName}
                />
              </label>
              <label className="block text-xs font-semibold text-zinc-600">
                Address
                <textarea
                  autoComplete="street-address"
                  rows={3}
                  value={formData.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  className={fieldClassName}
                />
              </label>
              <p className="text-xs text-zinc-500">
                Email and password cannot be changed from this profile page.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="rounded-full border border-zinc-200 px-5 py-3 text-sm font-bold transition hover:bg-zinc-50 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:opacity-60"
                >
                  {isSaving ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                {[
                  ["Full name", name],
                  ["Email address", email],
                  ["Phone number", userData?.contactNumber || "Not provided"],
                  ["Address", userData?.address || "Not provided"],
                  ["Account type", accountType],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-zinc-200 pb-3">
                    <dt className="text-xs text-zinc-500">{label}</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-sm font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <button
                type="button"
                onClick={startEditing}
                className="mt-7 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
              >
                Edit profile
              </button>
            </>
          )}
        </section>
      </div>
    </>
  );
}

export default ProfilePage;
