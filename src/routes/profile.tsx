import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { StaffForm } from "@/components/staff-form";
import { Badge, EmploymentBadge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/empty";
import { readFileAsDataUrl } from "@/lib/file";
import { useInvalidate, usePerm, useStaff } from "@/lib/me";
import { ROLE_LABELS } from "@/lib/roles";
import { updateStaff } from "@/lib/server/fns";

export const Route = createFileRoute("/profile")({ component: Page });

function Page() {
  return (
    <AppShell>
      <Profile />
    </AppShell>
  );
}

function Profile() {
  const staff = useStaff();
  const perm = usePerm();
  const invalidate = useInvalidate();

  async function onPhoto(file: File) {
    try {
      const dataUrl = await readFileAsDataUrl(file);
      await updateStaff({
        data: {
          id: staff.id,
          fullName: staff.fullName,
          email: staff.email,
          phone: staff.phone ?? undefined,
          departmentId: staff.departmentId,
          position: staff.position ?? undefined,
          role: staff.role,
          employmentType: staff.employmentType,
          employmentStatus: staff.employmentStatus,
          dateJoined: staff.dateJoined,
          profilePicture: dataUrl,
        },
      });
      toast.success("Photo updated");
      invalidate("me", "staff");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not update photo");
    }
  }

  return (
    <div className="grid gap-6">
      <PageHeader kicker="Account" title="Your profile" description="Update the details you own. Role and department are managed by Admin or HR." />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-cream p-5 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            {staff.profilePicture ? (
              <img src={staff.profilePicture} alt="" className="size-16 rounded-2xl object-cover" />
            ) : (
              <span className="grid size-16 place-items-center rounded-2xl bg-teal-soft font-display text-xl text-teal-2">
                {staff.fullName.charAt(0)}
              </span>
            )}
            <div>
              <p className="font-medium">{staff.fullName}</p>
              <p className="text-xs text-mist">{staff.staffId}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>{ROLE_LABELS[staff.role]}</Badge>
            <EmploymentBadge status={staff.employmentStatus} />
          </div>
          <label className="mt-5 inline-flex h-11 cursor-pointer items-center rounded-lg bg-paper px-3 text-sm shadow-[var(--shadow-card)]">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void onPhoto(f);
              }}
            />
            Change photo
          </label>
        </div>
        <div className="rounded-2xl bg-cream p-5 shadow-[var(--shadow-card)] lg:col-span-2">
          <StaffForm
            initial={staff}
            selfLimited={!perm.manageStaff}
            onDone={() => invalidate("me", "staff")}
          />
        </div>
      </div>
    </div>
  );
}
