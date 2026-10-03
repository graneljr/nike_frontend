import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faCartShopping,
  faChevronRight,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import {
  MetricCard,
  Modal,
  PageHeading,
  Status,
} from "../components/dashboard/DashboardUI";
import api from "@/middleware/apiMiddleware";
import { toast } from "sonner";
import { formatter } from "@/utils/DateFormatter";

function MemberDetailsModal({ member, onClose }) {
  if (!member) return null;
  return (
    <Modal eyebrow="Customer details" title={member.fullName} onClose={onClose}>
      <dl className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 px-4">
        <div className="py-4">
          <dt className="text-xs text-zinc-500">Email address</dt>
          <dd className="mt-1 text-sm font-semibold">{member.email}</dd>
        </div>

        <div className="flex items-center justify-between py-4">
          <dt className="text-xs text-zinc-500">Member Since</dt>
          <dd className="mt-1 text-sm font-semibold">
            {formatter.format(new Date(member?.createdAt)).replace(",", "")}
          </dd>
        </div>
        <div className="flex items-center justify-between py-4">
          <dt className="text-xs text-zinc-500">Phone Number</dt>
          <dd className="mt-1 text-sm font-semibold">
            {member.conactNumber || "N/A"}
          </dd>
        </div>
      </dl>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
      >
        Close
      </button>
    </Modal>
  );
}

function UsersPage() {
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState(null);
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    ordersPlaced: 0,
  });
  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await api.get("/users/");
        setMembers(users.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load customers.");
      }
    };
    const getMetrics = async () => {
      try {
        const response = await api.get("/users/metrics");
        setMetrics(response.data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load customer metrics.");
      }
    };

    getUsers();
    getMetrics();
  }, []);
  return (
    <>
      <PageHeading
        eyebrow="Store management"
        title="Customers"
        description="Your Nike store community and their recent activity."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <MetricCard
          icon={faUsers}
          label="Total customers"
          value={metrics.totalCustomers.toLocaleString()}
          trend={metrics.trends?.totalCustomers}
          change="vs last month"
        />
        <MetricCard
          icon={faCartShopping}
          label="New this month"
          value={metrics.newCustomersThisMonth.toLocaleString()}
          trend={metrics.trends?.newCustomersThisMonth}
          change="vs last month"
        />
        <MetricCard
          icon={faBox}
          label="Orders placed"
          value={metrics.ordersPlaced.toLocaleString()}
          trend={metrics.trends?.ordersPlaced}
          change="vs last month"
        />
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-zinc-50 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {members?.map((member) => (
                <tr key={member?.email}>
                  <td className="px-5 py-4">
                    <p className="font-bold">{member?.fullName}</p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {member?.email}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-zinc-500">
                    {formatter
                      .format(new Date(member?.createdAt))
                      .replace(",", "")}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      aria-label={`View ${member.fullName}`}
                      onClick={() => setSelectedMember(member)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-black"
                    >
                      <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <MemberDetailsModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </>
  );
}

export default UsersPage;
