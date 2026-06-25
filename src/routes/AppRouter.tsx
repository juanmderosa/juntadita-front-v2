import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { LoginPage } from "../features/auth/pages/LoginPage";
import { OnboardingPage } from "../features/auth/pages/OnboardingPage";
import { HomePage } from "../features/home/pages/HomePage";
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
        children: [{ path: "/", element: <HomePage /> }],
      },
    ],
  },
]);
