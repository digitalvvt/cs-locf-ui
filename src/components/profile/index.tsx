// pages/ProfilePage.tsx (or components/ProfilePage.tsx)
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  User as UserIcon,
  Shield,
  KeyRound,
  School,
  IdCard,
  CalendarClock,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  AnyProfile,
  FacultyProfile,
  StudentProfile,
  useChangePasswordMutation,
  useGetAdminProfileQuery,
  useGetFacultyProfileQuery,
  useGetStudentProfileQuery,
} from "@/api/api/profile/profile-slice";

type UserLS = {
  id: number;
  role: "student" | "faculty" | "admin";
  name?: string;
  email?: string;
  section?: string | null;
  shiftId?: number | null;
  subjectIds?: string;
  p_id?: number;
  semester?: number;
  year?: number;
  org_id?: number;
};

const FieldRow = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-2">
    <div className="mt-0.5 text-muted-foreground">{icon}</div>
    <div className="grid w-full gap-0.5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-sm font-medium break-all">{value ?? "—"}</p>
    </div>
  </div>
);

export default function ProfilePage() {
  // read localStorage safely
  let user: Partial<UserLS> | undefined;
  if (typeof window !== "undefined") {
    try {
      user = JSON.parse(localStorage.getItem("userDetails") || "{}");
    } catch {}
  }

  const isStudent = user?.role === "student";
  const isFaculty = user?.role === "faculty";
  const isAdmin = user?.role === "admin";

  const studentArgs = {
    id: Number(user?.id),
    p_id: Number(user?.p_id),
    semester: Number(user?.semester),
    year: Number(user?.year),
    shiftId: user?.shiftId ?? undefined,
    section: user?.section || undefined,
  };
  const facultyArgs = {
    id: Number(user?.id),
    shiftId: user?.shiftId ?? undefined,
    section: user?.section || undefined,
  };
  const adminArgs = { id: Number(user?.id) };

  // hooks (always same order)
  const {
    data: sData,
    isLoading: sLoad,
    isError: sErr,
  } = useGetStudentProfileQuery(studentArgs as any, {
    skip:
      !isStudent ||
      !studentArgs.id ||
      !studentArgs.p_id ||
      !studentArgs.semester ||
      !studentArgs.year,
  });

  const {
    data: fData,
    isLoading: fLoad,
    isError: fErr,
  } = useGetFacultyProfileQuery(facultyArgs as any, { skip: !isFaculty || !facultyArgs.id });

  const {
    data: aData,
    isLoading: aLoad,
    isError: aErr,
  } = useGetAdminProfileQuery(adminArgs as any, { skip: !isAdmin || !adminArgs.id });

  const profile = (sData ?? fData ?? aData) as AnyProfile | undefined;
  const loading = sLoad || fLoad || aLoad;
  const error = sErr || fErr || aErr;

  if (loading) return <div className="p-6 text-sm text-muted-foreground">Loading profile…</div>;
  if (error || !profile)
    return <div className="p-6 text-sm text-destructive">Failed to load profile.</div>;

  // name fallback (if your API returns single 'name')
  const displayName =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : user?.name ?? "";
  const [fn, ...rest] = displayName.split(" ");
  const ln = rest.join(" ");

  return (
    <ProfileScreen
      profile={
        {
          ...profile,
          firstName: profile.firstName ?? fn,
          lastName: profile.lastName ?? ln,
        } as AnyProfile
      }
    />
  );
}

// --------- UI ----------
function ProfileScreen({ profile }: { profile: AnyProfile }) {
  const { toast } = useToast();
  const [changePassword, { isLoading: changing }] = useChangePasswordMutation();
  const fullName = useMemo(
    () => `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim(),
    [profile]
  );
  const initials = useMemo(
    () =>
      `${(profile.firstName ?? "")[0] ?? "?"}${(profile.lastName ?? "")[0] ?? ""}`.toUpperCase(),
    [profile]
  );

  const canChangePassword = profile.role === "student" || profile.role === "faculty";
  // ----- Zod schema & form -----
  const PasswordSchema = z
    .object({
      current: z.string().min(6, "Current password must be at least 6 characters"),
      next: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .regex(/[A-Z]/, "Must include an uppercase letter")
        .regex(/[a-z]/, "Must include a lowercase letter")
        .regex(/\d/, "Must include a number"),
      confirm: z.string().min(1, "Please confirm your new password"),
    })
    .refine((v) => v.next !== v.current, {
      message: "New password must be different from current password",
      path: ["next"],
    })
    .refine((v) => v.confirm === v.next, {
      message: "Passwords do not match",
      path: ["confirm"],
    });

  type PasswordForm = z.infer<typeof PasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<PasswordForm>({
    resolver: zodResolver(PasswordSchema),
    mode: "onChange", // live validation as user types
    defaultValues: { current: "", next: "", confirm: "" },
  });

  const onSubmit = async (values: PasswordForm) => {
    try {
      await changePassword({
        userId: profile.id,
        role: profile.role, // 'student' or 'faculty'
        current: values.current,
        next: values.next,
      }).unwrap();

      toast({
        title: "Password updated",
        description: "Your password was changed successfully.",
      });
      reset();
    } catch (err: any) {
      const apiMsg =
        err?.data?.message || err?.error || "Unable to change password. Please try again.";
      toast({
        title: "Update failed",
        description: apiMsg,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-5">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-semibold leading-tight">{fullName}</h2>
              <Badge variant="secondary" className="capitalize flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" /> {profile.role}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">User ID: {profile.id}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Overview (unchanged) */}
        <TabsContent value="overview" className="mt-5">
          <div className="grid gap-6 md:grid-cols-2 xl:gap-8">
            {/* Account */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-lg font-semibold">Account</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <FieldRow
                    label="Full name"
                    value={fullName}
                    icon={<UserIcon className="h-5 w-5" />}
                  />
                  <FieldRow
                    label="Email"
                    value={profile.email}
                    icon={<Mail className="h-5 w-5" />}
                  />
                  <FieldRow
                    label="Phone"
                    value={profile.phone ?? ""}
                    icon={<Phone className="h-5 w-5" />}
                  />
                  {profile.role !== "admin" && profile.section ? (
                    <>
                      <Separator className="my-4" />
                      <FieldRow
                        label="Section"
                        value={profile.section}
                        icon={<IdCard className="h-5 w-5" />}
                      />
                    </>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Organisation */}
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-1">
                <CardTitle className="text-lg font-semibold">Organisation</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-4">
                {/* Faculty: Subjects + Programs */}
                {profile.role === "faculty" &&
                  (() => {
                    const fp = profile as FacultyProfile & {
                      subjectNames?: string[];
                      programs?: { id: number; name: string }[];
                    };
                    const subjectNames = fp.subjectNames ?? [];
                    const programNames = (fp.programs ?? []).map((p) => p.name);

                    return (
                      <>
                        {/* Subjects */}
                        <div className="grid grid-cols-[24px_1fr] gap-3 py-1">
                          <div className="text-muted-foreground flex items-start justify-center">
                            <School className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Subjects
                            </p>
                            {subjectNames.length ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {subjectNames.map((name, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium"
                                  >
                                    {name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">—</p>
                            )}
                          </div>
                        </div>

                        <Separator className="my-2" />

                        {/* Programs */}
                        <div className="grid grid-cols-[24px_1fr] gap-3 py-1">
                          <div className="text-muted-foreground flex items-start justify-center">
                            <School className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Programs
                            </p>
                            {programNames.length ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {programNames.map((name, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium"
                                  >
                                    {name}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">—</p>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}

                {/* Student: Academic (Registration/Admission moved here) */}
                {profile.role === "student" && (
                  <div className="grid grid-cols-[24px_1fr] gap-3 py-1">
                    <div className="text-muted-foreground flex items-start justify-center">
                      <School className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Academic
                      </p>

                      {/* Two-column on sm+, one column on mobile */}
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                        <FieldRow
                          label="Registration Number"
                          value={(profile as StudentProfile).register_number}
                          icon={<IdCard className="h-5 w-5" />}
                        />
                        <FieldRow
                          label="Admission Number"
                          value={(profile as StudentProfile).admission_number}
                          icon={<IdCard className="h-5 w-5" />}
                        />
                        <FieldRow
                          label="Semester"
                          value={(profile as StudentProfile).semester}
                          icon={<CalendarClock className="h-5 w-5" />}
                        />
                        <FieldRow
                          label="Year"
                          value={(profile as StudentProfile).year}
                          icon={<CalendarClock className="h-5 w-5" />}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {profile.role === "admin" && (
                  <p className="text-sm text-muted-foreground">Admin account</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security (now uses react-hook-form + Zod) */}
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <KeyRound className="h-4 w-4" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              {canChangePassword ? (
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 max-w-md">
                  <div className="grid gap-2">
                    <Label htmlFor="current">Current password</Label>
                    <Input
                      id="current"
                      type="password"
                      placeholder="••••••"
                      {...register("current")}
                    />
                    {errors.current && (
                      <p className="text-xs text-destructive">{errors.current.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="next">New password</Label>
                    <Input
                      id="next"
                      type="password"
                      placeholder="At least 8 chars, mixed case & number"
                      {...register("next")}
                    />
                    {errors.next && (
                      <p className="text-xs text-destructive">{errors.next.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirm">Confirm new password</Label>
                    <Input
                      id="confirm"
                      type="password"
                      placeholder="Re-enter new password"
                      {...register("confirm")}
                    />
                    {errors.confirm && (
                      <p className="text-xs text-destructive">{errors.confirm.message}</p>
                    )}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Password must be 8+ characters with upper, lower and a number. It must be
                    different from your current password.
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      disabled={!isValid || isSubmitting || changing}
                      className="bg-black hover:bg-black/90 text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      {changing ? "Updating..." : "Update password"}
                    </Button>
                    {!isValid && (
                      <span className="text-xs text-muted-foreground">
                        Fill all fields correctly
                      </span>
                    )}
                  </div>
                </form>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Password changes for {profile.role} are managed by administrators.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
