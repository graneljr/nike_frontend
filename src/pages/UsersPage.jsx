import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
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
  TablePagination,
  useTablePagination,
} from "../components/dashboard/DashboardUI";
import api from "@/middleware/apiMiddleware";
import { toast } from "sonner";
import { formatDate } from "@/utils/DateFormatter";

function normalizeUserList(responseData) {
  let data = responseData;

 
  for (let depth = 0; depth < 2 && typeof data === "string"; depth += 1) {
    try {
      data = JSON.parse(data);
    } catch {
      return null;
    }
  }

  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return null;

  for (const key of ["users", "data", "items", "results"]) {
    if (Array.isArray(data[key])) return data[key];
  }
  return null;
}

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
            {formatDate(member?.createdAt)}
          </dd>
        </div>
        <div className="flex items-center justify-between py-4">
          <dt className="text-xs text-zinc-500">Phone Number</dt>
          <dd className="mt-1 text-sm font-semibold">
            {member.contactNumber || "N/A"}
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
  const [members, setMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const memberRows = Array.isArray(members) ? members : [];
  const memberPagination = useTablePagination(memberRows);
  const [metrics, setMetrics] = useState({
    totalCustomers: 0,
    newCustomersThisMonth: 0,
    ordersPlaced: 0,
  });
  useEffect(() => {
    const getUsers = async () => {
      try {
        const users = await api.get("/users/");
        const responseUsers = normalizeUserList(users.data);
        console.log(responseUsers)
        if (!responseUsers) {
          setMembers([]);
          console.error("Unexpected /users response shape", {
            status: users.status,
            contentType: users.headers?.["content-type"],
            dataType: typeof users.data,
            dataKeys:
              users.data && typeof users.data === "object"
                ? Object.keys(users.data)
                : undefined,
          });
          toast.error("Could not read the customer list. Check the /api/users response.");
          return;
        }

        setMembers(responseUsers);
      } catch (error) {
        setMembers([]);
        toast.error(
          error.response?.data?.message || "Unable to load customers.",
        );
      } finally {
        setIsLoadingMembers(false);
      }
    };
    const getMetrics = async () => {
      try {
        const response = await api.get("/users/metrics");
        setMetrics(response.data);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load customer metrics.",
        );
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
              {isLoadingMembers ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-sm text-zinc-500"
                  >
                    Loading customers…
                  </td>
                </tr>
              ) : memberRows.length > 0 ? (
                memberPagination.pageItems.map((member) => (
                  <tr key={member?._id ?? member?.email}>
                    <td className="px-5 py-4">
                      <p className="font-bold">{member?.fullName}</p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {member?.email}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-zinc-500">
                      {formatDate(member?.createdAt)}
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-5 py-10 text-center text-sm text-zinc-500"
                  >
                    No registered customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          itemCount={memberRows.length}
          page={memberPagination.page}
          pageCount={memberPagination.pageCount}
          onPageChange={memberPagination.setPage}
        />
      </div>
      <AnimatePresence>
        {selectedMember && (
          <MemberDetailsModal
            key={selectedMember._id ?? selectedMember.email}
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default UsersPage;
