"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import "@/projects/b2b/orderlog/styles/orderlog.css";
import { AppShell } from "@/projects/b2b/orderlog/components/layout/app-shell";
import { LoginScreen } from "@/projects/b2b/orderlog/components/screens/login-screen";
import { DashboardScreen } from "@/projects/b2b/orderlog/components/screens/dashboard-screen";
import { ThreadScreen } from "@/projects/b2b/orderlog/components/screens/thread-screen";
import { ItemsScreen } from "@/projects/b2b/orderlog/components/screens/items-screen";
import { AnomalyScreen } from "@/projects/b2b/orderlog/components/screens/anomaly-screen";
import { StatsScreen } from "@/projects/b2b/orderlog/components/screens/stats-screen";
import { NotificationsScreen } from "@/projects/b2b/orderlog/components/screens/notifications-screen";
import type { Navigate, Screen } from "@/projects/b2b/orderlog/lib/navigation";
import type { Role } from "@/projects/b2b/orderlog/lib/types";

export default function OrderLogApp() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<Role>("buyer");
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [activeOrderId, setActiveOrderId] = useState<string | undefined>(undefined);
  const reduceMotion = useReducedMotion();

  const navigate: Navigate = (next, orderId) => {
    setScreen(orderId ? "thread" : next);
    if (orderId) setActiveOrderId(orderId);
  };

  if (!authed) {
    return (
      <LoginScreen
        onLogin={(selectedRole) => {
          setRole(selectedRole);
          setAuthed(true);
          setScreen("dashboard");
        }}
      />
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "dashboard":
        return <DashboardScreen role={role} onNavigate={navigate} />;
      case "thread":
        return (
          <ThreadScreen
            orderId={activeOrderId ?? "ord-1"}
            role={role}
            onNavigate={navigate}
            onBack={() => setScreen("dashboard")}
          />
        );
      case "items":
        return <ItemsScreen />;
      case "anomaly":
        return <AnomalyScreen onNavigate={navigate} />;
      case "stats":
        return <StatsScreen />;
      case "notifications":
        return <NotificationsScreen />;
      default:
        return null;
    }
  };

  return (
    <AppShell
      screen={screen}
      role={role}
      onNavigate={navigate}
      onRoleChange={setRole}
      onLogout={() => setAuthed(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${screen}-${activeOrderId ?? ""}`}
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
