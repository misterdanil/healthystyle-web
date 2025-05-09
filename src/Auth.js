import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "register" | "verify">("register");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    code: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    console.log("Registering:", form);
    setMode("verify");
  };

  const handleLogin = () => {
    console.log("Logging in:", form);
  };

  const handleVerify = () => {
    console.log("Verifying code:", form.code);
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h5" fontWeight={600}>
          {mode === "register"
            ? "Регистрация"
            : mode === "login"
            ? "Вход"
            : "Подтверждение Email"}
        </Typography>
      </Box>

      <Stack spacing={2}>
        {mode === "register" && (
          <>
            <TextField
              label="Имя пользователя"
              name="username"
              fullWidth
              value={form.username}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              label="Пароль"
              name="password"
              type="password"
              fullWidth
              value={form.password}
              onChange={handleChange}
            />
            <Button variant="contained" onClick={handleRegister}>
              Зарегистрироваться
            </Button>
            <Button onClick={() => setMode("login")}>Уже есть аккаунт?</Button>
          </>
        )}

        {mode === "login" && (
          <>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              label="Пароль"
              name="password"
              type="password"
              fullWidth
              value={form.password}
              onChange={handleChange}
            />
            <Button variant="contained" onClick={handleLogin}>
              Войти
            </Button>
            <Button onClick={() => setMode("register")}>
              Нет аккаунта? Зарегистрируйтесь
            </Button>
          </>
        )}

        {mode === "verify" && (
          <>
            <Typography variant="body2" textAlign="center">
              На вашу почту отправлен код подтверждения. Введите его ниже:
            </Typography>
            <TextField
              label="Код подтверждения"
              name="code"
              fullWidth
              value={form.code}
              onChange={handleChange}
            />
            <Button variant="contained" onClick={handleVerify}>
              Подтвердить
            </Button>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default Auth;
