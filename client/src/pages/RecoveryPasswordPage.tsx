import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { Link } from "react-router-dom";
import '../styles/RegisterPage.css'

interface FormData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export const RecoveryPasswordPage = () => {
  const [form, setForm] = useState<FormData>({
    firstname: "",
    lastname: "",
    username: "",
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
      const response = await axios.post<{ msg: string }>(
        "http://localhost:5000/auth/register",
        form
      );
      setMessage(response.data.msg);
    } catch (err) {
      const axiosErr = err as AxiosError<{ msg?: string }>;
      setMessage(axiosErr?.response?.data?.msg ?? "Ошибка");
    }
  };

  return (
    <div className="loginBox flex-column flex-center">
      <p className="headingText">Регистрация</p>

      <form onSubmit={handleSubmit} className="flex-column flex-center">
        <div className="floating-input">
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            placeholder="Имя"
            required
          />
          <label htmlFor="firstname">Имя</label>
        </div>

        <div className="floating-input">
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            placeholder="Фамилия"
            required
          />
          <label htmlFor="lastname">Фамилия</label>
        </div>

        <div className="floating-input">
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="@Имя пользователя"
            required
          />
          <label htmlFor="username">@Имя пользователя</label>
        </div>

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
        <p className="ifUserHaveAccount">Уже есть аккаунт? <Link to={"/login"}>Войти в аккаунт</Link></p>

        <button type="submit">Зарегистрироваться</button>
      </form>

      {message && (
        <div className="notificationMessage flex-center">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
