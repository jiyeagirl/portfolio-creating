"use client";

import { useState } from "react";
import "@/projects/b2b/orderlog/styles/orderlog.css";
import { AdminLogin } from "@/projects/b2b/orderlog/components/admin/admin-login";
import { AdminShell } from "@/projects/b2b/orderlog/components/admin/admin-shell";
import { AdminConsole } from "@/projects/b2b/orderlog/components/admin/admin-console";

export function AdminApp() {
  const [authed, setAuthed] = useState(false);

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  return (
    <AdminShell onLogout={() => setAuthed(false)}>
      <AdminConsole />
    </AdminShell>
  );
}
