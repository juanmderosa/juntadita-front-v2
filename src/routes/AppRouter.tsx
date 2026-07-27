import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        element: <ProtectedRoute mode="public" />,
        children: [
          {
            path: "/login",
            lazy: async () => {
              const { LoginPage } = await import("@/features/auth/pages/LoginPage");
              return { Component: LoginPage };
            },
          },
        ],
      },
      {
        element: <ProtectedRoute mode="onboarding" />,
        children: [
          {
            path: "/onboarding",
            lazy: async () => {
              const { OnboardingPage } = await import("@/features/auth/pages/OnboardingPage");
              return { Component: OnboardingPage };
            },
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AuthenticatedLayout />,
            children: [
              {
                path: "/",
                lazy: async () => {
                  const { HomePage } = await import("@/features/home/pages/HomePage");
                  return { Component: HomePage };
                },
              },
              {
                path: "/groups",
                lazy: async () => {
                  const { GroupsPage } = await import("@/features/groups/pages/GroupsPage");
                  return { Component: GroupsPage };
                },
              },
              {
                path: "/groups/:groupId",
                lazy: async () => {
                  const { GroupDetailPage } = await import(
                    "@/features/groups/pages/GroupDetailPage"
                  );
                  return { Component: GroupDetailPage };
                },
              },
              {
                path: "/events/new",
                lazy: async () => {
                  const { CreateEventPage } = await import(
                    "@/features/events/pages/CreateEventPage"
                  );
                  return { Component: CreateEventPage };
                },
              },
              {
                path: "/events/:eventId",
                lazy: async () => {
                  const { EventDetailPage } = await import(
                    "@/features/events/pages/EventDetailPage"
                  );
                  return { Component: EventDetailPage };
                },
              },
              {
                path: "/events/:eventId/expenses",
                lazy: async () => {
                  const { ExpensesPage } = await import(
                    "@/features/expenses/pages/ExpensesPage"
                  );
                  return { Component: ExpensesPage };
                },
              },
              {
                path: "/events/:eventId/edit",
                lazy: async () => {
                  const { EditEventPage } = await import(
                    "@/features/events/pages/EditEventPage"
                  );
                  return { Component: EditEventPage };
                },
              },
            ],
          },
        ],
      },
    ],
  },
]);
