"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal, ConfirmModal } from "@/components/ui/Modal";
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
  blocked?: boolean;
  blockedReason?: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [message, setMessage] = useState("");
  const [roleUser, setRoleUser] = useState<AdminUser | null>(null);
  const [nextRole, setNextRole] = useState<Role>("supporter");
  const [blockUser, setBlockUser] = useState<AdminUser | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [removeUser, setRemoveUser] = useState<AdminUser | null>(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    fetchJSON<{ users: AdminUser[] }>("/api/admin/users")
      .then((r) => setUsers(r.users))
      .catch(() => undefined);

  useEffect(() => {
    load();
  }, []);

  const saveRole = async () => {
    if (!roleUser) return;
    setBusy(true);
    try {
      await fetchJSON(`/api/admin/users/${encodeURIComponent(roleUser.email)}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: nextRole }),
      });
      setMessage(`Role updated for ${roleUser.email}.`);
      setRoleUser(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Role update failed.");
    } finally {
      setBusy(false);
    }
  };

  const toggleBlock = async () => {
    if (!blockUser) return;
    const blocking = !blockUser.blocked;
    setBusy(true);
    try {
      await fetchJSON(`/api/admin/users/${encodeURIComponent(blockUser.email)}/block`, {
        method: "PATCH",
        body: JSON.stringify({ blocked: blocking, reason: blockReason }),
      });
      setMessage(blocking ? `${blockUser.name} blocked.` : `${blockUser.name} unblocked.`);
      setBlockUser(null);
      setBlockReason("");
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Block action failed.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!removeUser) return;
    setBusy(true);
    try {
      await fetchJSON(`/api/admin/users/${encodeURIComponent(removeUser.email)}`, { method: "DELETE" });
      setMessage(`Removed ${removeUser.email}.`);
      setRemoveUser(null);
      load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Remove failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DashboardHeader
        eyebrow="User governance"
        title="Manage users"
        description="Update roles, block abusive accounts, or remove users that should no longer access Pledgekit."
      />
      {message && <p className="mb-4 border border-[var(--border)] bg-white px-4 py-3 text-sm">{message}</p>}
      {users.length ? (
        <div className="overflow-auto border border-[var(--border)]">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Credits</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.email}>
                  <td>
                    <div className="flex items-center gap-3">
                      {u.image ? (
                        <img src={u.image} alt={u.name} className="h-9 w-9 object-cover" />
                      ) : (
                        <span className="grid h-9 w-9 place-items-center bg-[var(--surface)] text-sm font-semibold">{u.name[0]}</span>
                      )}
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>{u.credits}</td>
                  <td className="capitalize">{u.role}</td>
                  <td>
                    <Badge tone={u.blocked ? "danger" : "success"}>{u.blocked ? "Blocked" : "Active"}</Badge>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="tertiary"
                        onClick={() => {
                          setRoleUser(u);
                          setNextRole(u.role);
                        }}
                      >
                        Role
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setBlockUser(u);
                          setBlockReason(u.blockedReason || "");
                        }}
                      >
                        {u.blocked ? "Unblock" : "Block"}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setRemoveUser(u)}>
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState description="No users found." />
      )}

      <Modal
        open={Boolean(roleUser)}
        onClose={() => setRoleUser(null)}
        title="Update role"
        description={roleUser ? `Change access level for ${roleUser.name}.` : undefined}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setRoleUser(null)}>Cancel</Button>
            <Button size="sm" onClick={() => void saveRole()} disabled={busy}>{busy ? "Saving…" : "Save role"}</Button>
          </>
        }
      >
        <label>
          <span className="field-label">Role</span>
          <Select value={nextRole} onChange={(e) => setNextRole(e.target.value as Role)}>
            <option value="admin">Admin</option>
            <option value="creator">Creator</option>
            <option value="supporter">Supporter</option>
          </Select>
        </label>
      </Modal>

      <Modal
        open={Boolean(blockUser)}
        onClose={() => setBlockUser(null)}
        title={blockUser?.blocked ? "Unblock user" : "Block user"}
        description={
          blockUser?.blocked
            ? "Restore platform access for this account."
            : "Blocked users cannot use protected Pledgekit routes until unblocked."
        }
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setBlockUser(null)}>Cancel</Button>
            <Button
              size="sm"
              variant={blockUser?.blocked ? "primary" : "danger"}
              onClick={() => void toggleBlock()}
              disabled={busy}
            >
              {busy ? "Working…" : blockUser?.blocked ? "Unblock account" : "Block account"}
            </Button>
          </>
        }
      >
        {!blockUser?.blocked && (
          <label>
            <span className="field-label">Reason</span>
            <Input
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Policy violation, fraud risk, abuse…"
              required
            />
          </label>
        )}
        {blockUser?.blocked && (
          <p className="text-sm text-[var(--muted)]">
            Previous reason: {blockUser.blockedReason || "No reason recorded."}
          </p>
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(removeUser)}
        onClose={() => setRemoveUser(null)}
        onConfirm={remove}
        title="Remove user"
        description={removeUser ? `Permanently delete ${removeUser.email} from Pledgekit?` : ""}
        confirmLabel="Remove"
        tone="danger"
        busy={busy}
      />
    </>
  );
}
