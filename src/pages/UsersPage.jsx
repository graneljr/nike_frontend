import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faCartShopping, faChevronRight, faUsers } from "@fortawesome/free-solid-svg-icons";
import { MetricCard, Modal, PageHeading, Status } from "../components/dashboard/DashboardUI";

const sampleMembers = [
  { name: "Jordan Lee", email: "jordan.lee@email.com", joined: "Sep 18, 2026", orders: 4, status: "Active" },
  { name: "Sam Rivera", email: "sam.rivera@email.com", joined: "Sep 12, 2026", orders: 7, status: "Active" },
  { name: "Alex Morgan", email: "alex.morgan@email.com", joined: "Aug 29, 2026", orders: 2, status: "Active" },
];

function MemberDetailsModal({ member, onClose }) {
  if (!member) return null;
  return (
    <Modal eyebrow="Customer details" title={member.name} onClose={onClose}>
      <dl className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 px-4">
        <div className="py-4"><dt className="text-xs text-zinc-500">Email address</dt><dd className="mt-1 text-sm font-semibold">{member.email}</dd></div>
        <div className="flex justify-between gap-4 py-4"><div><dt className="text-xs text-zinc-500">Member since</dt><dd className="mt-1 text-sm font-semibold">{member.joined}</dd></div><div className="text-right"><dt className="text-xs text-zinc-500">Orders placed</dt><dd className="mt-1 text-sm font-semibold">{member.orders}</dd></div></div>
        <div className="flex items-center justify-between py-4"><dt className="text-xs text-zinc-500">Account status</dt><dd><Status>{member.status}</Status></dd></div>
      </dl>
      <button type="button" onClick={onClose} className="mt-6 w-full rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800">Close</button>
    </Modal>
  );
}

function UsersPage() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <>
      <PageHeading eyebrow="Store management" title="Customers" description="Your Nike store community and their recent activity." />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <MetricCard icon={faUsers} label="Total customers" value="1,204" change="6.2%" />
        <MetricCard icon={faCartShopping} label="New this month" value="86" change="10.1%" />
        <MetricCard icon={faBox} label="Orders placed" value="3,418" change="4.8%" />
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-500"><tr><th className="px-5 py-4">Customer</th><th className="px-5 py-4">Joined</th><th className="px-5 py-4">Orders</th><th className="px-5 py-4">Status</th><th className="px-5 py-4"><span className="sr-only">Actions</span></th></tr></thead>
            <tbody className="divide-y divide-zinc-100">{sampleMembers.map((member) => <tr key={member.email}><td className="px-5 py-4"><p className="font-bold">{member.name}</p><p className="mt-1 text-xs text-zinc-500">{member.email}</p></td><td className="px-5 py-4 text-zinc-500">{member.joined}</td><td className="px-5 py-4">{member.orders}</td><td className="px-5 py-4"><Status>{member.status}</Status></td><td className="px-5 py-4 text-right"><button type="button" aria-label={`View ${member.name}`} onClick={() => setSelectedMember(member)} className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-black"><FontAwesomeIcon icon={faChevronRight} /></button></td></tr>)}</tbody>
          </table>
        </div>
      </div>
      <MemberDetailsModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    </>
  );
}

export default UsersPage;
