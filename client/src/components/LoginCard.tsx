import React, { useState } from "react";
import type { ChangeEvent, FormEvent, JSX } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";

interface FormData {
  email: string;
  password: string;
}

interface UserDto {
  id: string;
  username: string;
  email: string;
}

interface LoginResponse {
  token: string;
  user: UserDto;
  msg?: string;
}

export default function LoginCard(): JSX.Element {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // говорим TS, какой ответ мы ожидаем
      const response = await axios.post<LoginResponse>(
        "http://localhost:5000/auth/login",
        form
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("authUser", JSON.stringify(response.data.user));

      setMessage(response.data.msg ?? `Добро пожаловать, ${response.data.user.username}!`);
      navigate("/");
      window.location.reload();
    } catch (err) {
      const axiosErr = err as AxiosError<{ msg?: string }>;
      setMessage(axiosErr?.response?.data?.msg ?? "Ошибка");
    }
  };

  return (
    <div className="loginBox flex-column flex-center">
      <p className="headingText">Вход</p>
      <button className="useAuthButton flex-center">
        <img src="../../public/images/google.svg" alt="" />
        Вход с аккаунтом Google
      </button>
      <button className="useAuthButton flex-center">
        <img src="../../public/images/apple.svg" alt="" />
        Вход с аккаунтом Apple
      </button>
      <div className="orBox flex-center">
        <span></span>
        <p>ИЛИ</p>
        <span></span>
      </div>

      <form onSubmit={handleSubmit} className="flex-column flex-center">
        <div className="floating-input">
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Электронная почта"
            required
          />
          <label htmlFor="email">Электронная почта</label>
        </div>

        <div className="floating-input">
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Пароль"
            required
          />
          <label htmlFor="password">Пароль</label>
        </div>

        <div className="linksBox flex-column">
          <p className="ifUserFoggotPassword">
            <Link to="/recovery-password">Забыли пароль?</Link>
          </p>
          <p className="ifUserHaveAccount">
            Впервые на сайте? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </div>

        <button type="submit">Войти</button>
      </form>

      {message && (
        <div className="notificationMessage flex-center">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
