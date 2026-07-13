"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Select } from "@/components/ui/Select";
import { fetchJSON } from "@/lib/api";
import type { Role } from "@/lib/types";

type AdminUser = {
  _id?: string;
  name: string;
  email: string;
  image?: string | null;
  role: Role;
  credits: number;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [message, setMessage] = useState("");

  const load = () =>
    fetchJSON<{ users: AdminUser[] }>("/api/admin/users")
      .then((r) => setUsers(r.users))
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, []);

  const updateRole = async (email: string, role: Role) => {
    try {
      await fetchJSON(`/api/admin/users/${encodeURIComponent(email)}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      });
      setMessage(`Updated role for ${email}.`);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Role update failed.");
    }
  };

  const remove = async (email: string) => {
    if (!confirm(`Remove user ${email}?`)) return;
    try {
      await fetchJSON(`/api/admin/users/${encodeURIComponent(email)}`, { method: "DELETE" });
      setMessage(`Removed ${email}.`);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Remove failed.");
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="User governance"
        title="Manage users"
        description="Update roles or remove accounts that should no longer access Fundora."
      />
      {message && <p className="mb-4 text-sm">{message}</p>}
      {users.length ? (
        <div className="overflow-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Credits</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email}>
                  <td>
                    {u.image ? (
                      <img src={u.image} alt={u.name} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--surface)] text-sm font-semibold">{u.name[0]}</span>
                    )}
                  </td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.credits}</td>
                  <td>
                    <Select
                      className="min-w-36"
                      value={u.role}
                      onChange={(e) => void updateRole(u.email, e.target.value as Role)}
                    >
                      <option value="admin">Admin</option>
                      <option value="creator">Creator</option>
                      <option value="supporter">Supporter</option>
                    </Select>
                  </td>
                  <td>
                    <Button className="h-9 px-3" variant="ghost" onClick={() => void remove(u.email)}>Remove</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="No users found." />
      )}
    </>
  );
}
