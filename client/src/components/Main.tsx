import { Routes, Route } from "react-router-dom";

import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RecoveryPasswordPage from "../pages/RecoveryPasswordPage";
import ProfilePage from "../pages/ProfilePage";
import AddFilmPage from "../pages/AddFilmPage";
import ReviewPage from "../pages/ReviewPage";

function Main() {
    return (
        <div className="main">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/recovery-password" element={<RecoveryPasswordPage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/add" element={<AddFilmPage />} />
                <Route path="/review/:id" element={<ReviewPage />}/>
            </Routes>
        </div>
    )
}

export default Main