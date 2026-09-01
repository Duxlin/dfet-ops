import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { ROLE_LABELS, ROLES } from "@/lib/roles";
import { createStaff, listDepartments, updateStaff, type StaffWrite } from "@/lib/server/fns";
import type { EmploymentType, Role, Staff } from "@/lib/types";

export function StaffForm({
  initial,
  onDone,
  selfLimited,
}: {
  initial?: Staff;
  onDone: () => void;
  selfLimited?: boolean;
}) {
  const { data: depts = [] } = useQuery({ queryKey: ["departments"], queryFn: () => listDepartments() });
  const [form, setForm] = useState({
    fullName: initial?.fullName ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    departmentId: initial?.departmentId ? String(initial.departmentId) : "",
    position: initial?.position ?? "",
    role: (initial?.role ?? "staff") as Role,
    employmentType: (initial?.employmentType ?? "employee") as EmploymentType,
    employmentStatus: initial?.employmentStatus ?? "active",
    dateJoined: initial?.dateJoined?.slice(0, 10) ?? "",
  });
  const save = useMutation({
    mutationFn: () => {
      const payload: StaffWrite = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        position: form.position,
        role: form.role,
        employmentType: form.employmentType,
        employmentStatus: form.employmentStatus,
        dateJoined: form.dateJoined || null,
      };
      if (initial) return updateStaff({ data: { ...payload, id: initial.id } });
      return createStaff({ data: payload });
    },
    onSuccess: () => {
      toast.success(initial ? "Profile updated" : "Staff member added");
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const locked = !!selfLimited;

  return (
    <form
      className="grid gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <Field label="Full name">
        <Input required value={form.fullName} onChange={(e) => set("fullName", e.target.value)} disabled={locked} />
      </Field>
      <Field label="Email">
        <Input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} disabled={locked} />
      </Field>
      <Field label="Phone">
        <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </Field>
      {!locked ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Department">
              <Select value={form.departmentId} onChange={(e) => set("departmentId", e.target.value)}>
                <option value="">—</option>
                {depts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Position">
              <Input value={form.position} onChange={(e) => set("position", e.target.value)} />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Role">
              <Select value={form.role} onChange={(e) => set("role", e.target.value)}>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Type">
              <Select value={form.employmentType} onChange={(e) => set("employmentType", e.target.value)}>
                <option value="employee">Employee</option>
                <option value="intern">Intern</option>
              </Select>
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Status">
              <Select value={form.employmentStatus} onChange={(e) => set("employmentStatus", e.target.value)}>
                <option value="active">Active</option>
                <option value="on_leave">On leave</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Field>
            <Field label="Date joined">
              <Input type="date" value={form.dateJoined} onChange={(e) => set("dateJoined", e.target.value)} />
            </Field>
          </div>
        </>
      ) : null}
      <div className="mt-2 flex justify-end">
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : initial ? "Save changes" : "Create record"}
        </Button>
      </div>
    </form>
  );
}
