import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import { useApplyTheme } from "./hooks/useApplyTheme";

import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { RecoveryPasswordPage } from "./pages/RecoveryPasswordPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AddFilmPage } from "./pages/AddFilmPage";
import { ReviewPage } from "./pages/ReviewPage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { FavoriteUsersPage } from "./pages/FavoriteUsersPage";
import { NotFoundPage } from "./pages/NotFoundPage"; // ← твоя 404 страница

function LayoutWithHeader() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function App() {
  useApplyTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route element={<LayoutWithHeader />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/recovery-password" element={<RecoveryPasswordPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile/:id/edit" element={<EditProfilePage />} />
          <Route path="/add" element={<AddFilmPage />} />
          <Route path="/review/:id" element={<ReviewPage />} />
          <Route path="/favorites/:id" element={<FavoriteUsersPage />} />
        </Route>

        {/* 404 — тоже без Header */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
