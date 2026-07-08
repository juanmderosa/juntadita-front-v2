import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { AuthenticatedLayout } from "../components/layout/AuthenticatedLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { OnboardingPage } from "../features/auth/pages/OnboardingPage";
import { HomePage } from "../features/home/pages/HomePage";
import { CreateEventPage } from "../features/events/pages/CreateEventPage";
import { EditEventPage } from "../features/events/pages/EditEventPage";
import { EventDetailPage } from "../features/events/pages/EventDetailPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute mode="public" />,
        children: [{ path: "/login", element: <LoginPage /> }],
      },
      {
        element: <ProtectedRoute mode="onboarding" />,
        children: [{ path: "/onboarding", element: <OnboardingPage /> }],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AuthenticatedLayout />,
            children: [
              { path: "/", element: <HomePage /> },
              { path: "/events/new", element: <CreateEventPage /> },
              { path: "/events/:eventId", element: <EventDetailPage /> },
              { path: "/events/:eventId/edit", element: <EditEventPage /> },
            ],
          },
        ],
      },
    ],
  },
]);
