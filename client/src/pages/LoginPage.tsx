import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import '../styles/RegisterPage.css'

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

export const LoginPage = () => {
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
    <>
    <div className="loginBox flex-column">
      <div className="backgroundText"></div>
      <div className="loginCard flex-column">
        <p className="headingText">Вход в личный кабинет</p>
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
          <div className="linksBox flex-between">
            <div className="rememberBox flex-center">
              <input className="rememberCheckbox" type="checkbox" id="remember" />
              <label className="rememberLabel" htmlFor="remember">
                Запомнить меня
              </label>
            </div>
            <p className="ifUserFoggotPassword">
              <Link to="/recovery-password">Забыли пароль?</Link>
            </p>
          </div>
          <button type="submit">Войти</button>
          <Link to="/register">Впервые на сайте? Зарегистрироваться</Link>
        </form>
      </div>

      {message && (
        <div className="notificationMessage flex-center">
          <p>{message}</p>
        </div>
      )}
    </div>
    </>
  );
}
