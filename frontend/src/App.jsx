import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminShell } from './layouts/AdminShell';

// Admin Views
import { OverviewPage } from './pages/admin/OverviewPage';
import { EventsPage } from './pages/admin/EventsPage';
import { EventDetailPage } from './pages/admin/EventDetailPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { PromotionsPage } from './pages/admin/PromotionsPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { StaffPage } from './pages/admin/StaffPage';
import { PaymentSettingsView } from './pages/admin/PaymentSettingsView';
import { PlatformSettingsPage } from './pages/admin/PlatformSettingsPage';

// Auxiliary Views
import {
  OrdersView,
  TicketsView,
  CategoriesView,
  VenuesView,
  AuditLogsView
} from './pages/admin/AdminAuxiliaryViews';

import { AdminLoginPage } from './pages/AdminLoginPage';
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Unprotected Admin Login */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Locked Admin SaaS Platform */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route element={<AdminShell />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<OverviewPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/details/:id" element={<EventDetailPage />} />
              <Route path="events/create" element={<CreateEventPage />} />
              <Route path="events/edit/:id" element={<CreateEventPage />} />
              <Route path="categories" element={<CategoriesView />} />
              <Route path="venues" element={<VenuesView />} />
              <Route path="orders" element={<OrdersView />} />
              <Route path="tickets" element={<TicketsView />} />
              <Route path="promotions" element={<PromotionsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="staff" element={<StaffPage />} />
              <Route path="settings/payments" element={<PlatformSettingsPage />} />
              <Route path="settings/commissions" element={<PlatformSettingsPage />} />
              <Route path="settings" element={<PlatformSettingsPage />} />
              <Route path="audit-logs" element={<AuditLogsView />} />
            </Route>
          </Route>

          {/* Catch-all redirect to Admin Dashboard */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
