import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Loader } from "./components/Loader.jsx";

const Home = lazy(() => import("./pages/Home.jsx").then((module) => ({ default: module.Home })));
const SignIn = lazy(() => import("./pages/SignIn.jsx").then((module) => ({ default: module.SignIn })));
const SignUp = lazy(() => import("./pages/SignUp.jsx").then((module) => ({ default: module.SignUp })));
const Dashboard = lazy(() =>
  import("./pages/Dashboard.jsx").then((module) => ({ default: module.Dashboard })),
);

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<Loader label="Loading page..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
