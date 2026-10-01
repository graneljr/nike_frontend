import { PageHeading } from "../components/dashboard/DashboardUI";

function ProfilePage({ userData }) {
  const name = userData?.fullName || "Nike Member";
  const email = userData?.email || "member@nikestore.com";
  const accountType = userData?.role === "admin" ? "Administrator" : "Nike member";
  const profileDetails = [
    ["Full name", name],
    ["Email address", email],
    ["Account type", accountType],
    ["Preferred store", "Nike online store"],
  ];

  return (
    <>
      <PageHeading eyebrow="Your account" title="Profile" description="Manage your account information and preferences." />
      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <section className="rounded-xl bg-zinc-100 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black text-xl font-black text-white">{name.slice(0, 1).toUpperCase()}</div>
          <h2 className="mt-4 text-lg font-bold">{name}</h2>
          <p className="mt-1 text-sm text-zinc-500">{email}</p>
          <span className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-zinc-600">{userData?.role === "admin" ? "Store admin" : "Nike member"}</span>
        </section>

        <section className="rounded-xl border border-zinc-200 p-5 sm:p-7">
          <h2 className="text-lg font-bold">Personal information</h2>
          <p className="mt-1 text-sm text-zinc-500">Your account details and preferences.</p>
          <dl className="mt-6 grid gap-5 sm:grid-cols-2">
            {profileDetails.map(([label, value]) => <div key={label} className="border-b border-zinc-200 pb-3"><dt className="text-xs text-zinc-500">{label}</dt><dd className="mt-1 text-sm font-semibold">{value}</dd></div>)}
          </dl>
          <button type="button" className="mt-7 rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800">Edit profile</button>
        </section>
      </div>
    </>
  );
}

export default ProfilePage;
