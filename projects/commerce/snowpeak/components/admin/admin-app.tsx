"use client";

import { useState } from "react";
import "@/projects/commerce/snowpeak/styles/snowpeak.css";
import type { AdminScreen } from "@/projects/commerce/snowpeak/lib/navigation";
import { AdminShell } from "@/projects/commerce/snowpeak/components/admin/admin-shell";
import { AdminDashboard } from "@/projects/commerce/snowpeak/components/admin/admin-dashboard";
import { AdminReservations } from "@/projects/commerce/snowpeak/components/admin/admin-reservations";
import { AdminProducts } from "@/projects/commerce/snowpeak/components/admin/admin-products";
import { AdminMembers } from "@/projects/commerce/snowpeak/components/admin/admin-members";
import { AdminInventory } from "@/projects/commerce/snowpeak/components/admin/admin-inventory";
import { AdminErp } from "@/projects/commerce/snowpeak/components/admin/admin-erp";

export function AdminApp() {
  const [screen, setScreen] = useState<AdminScreen>("dashboard");

  return (
    <AdminShell screen={screen} onNavigate={setScreen}>
      <div className="sp-admin-enter" key={screen}>
        {screen === "dashboard" && <AdminDashboard />}
        {screen === "reservations" && <AdminReservations />}
        {screen === "products" && <AdminProducts />}
        {screen === "members" && <AdminMembers />}
        {screen === "inventory" && <AdminInventory />}
        {screen === "erp" && <AdminErp />}
      </div>
    </AdminShell>
  );
}
