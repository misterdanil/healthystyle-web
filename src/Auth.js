import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
} from "@mui/material";

import { addUserRequest, loginRequest } from "./healthSlice";

const AuthPage = (redirectUri) => {
  const dispatch = useDispatch();

  const addedUser = useSelector((state) => state.health.addedUser);
  const loggedUser = useSelector((state) => state.health.loggedUser);

  const [mode, setMode] = useState("login");
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    dispatch(addUserRequest(user));
    setMode('verify');
  };

  const handleLogin = () => {
    dispatch(loginRequest(user));
  };

  const handleVerify = () => {
    console.log("Verifying code:", user.code);
  };

  const recognizeAction = () => {
    if(mode == 'login') {
      return '/login';
    }
    if(mode == 'signup') {
      return '/login';
    }
  };

  useEffect(() => {
    if(addedUser != null) {
      console.log('added ' + addedUser);
      dispatch(loginRequest(user));
    }
    }, [addedUser]);

  useEffect(() => {
    if(loggedUser != null) {
      let res = fetch(loggedUser, {
        credentials: "include",
      }).then()
    }
    }, [loggedUser]);

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
      
      <Box component="form" action={mode === "register"
            ? "/signup"
            : mode === "login"
            ? "/login"
            : "Подтверждение Email"}>
      <Stack spacing={2}>
        {mode === "register" && (
          <>
            <TextField
              label="Имя пользователя"
              name="username"
              fullWidth
              value={user.username}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={user.email}
              onChange={handleChange}
            />
            <TextField
              label="Пароль"
              name="password"
              type="password"
              fullWidth
              value={user.password}
              onChange={handleChange}
            />
            <Button variant="contained" type="submit">
              Зарегистрироваться
            </Button>
            <Button onClick={() => setMode("login")}>Уже есть аккаунт?</Button>
          </>
        )}

        {mode === "login" && (
          <>
            <TextField
              label="Email"
              name="username"
              fullWidth
              value={user.username}
              onChange={handleChange}
            />
            <TextField
              label="Пароль"
              name="password"
              type="password"
              fullWidth
              value={user.password}
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
              value={user.code}
              onChange={handleChange}
            />
            <Button variant="contained" onClick={handleVerify}>
              Подтвердить
            </Button>
          </>
        )}
      </Stack>
      </Box>
    </Container>
  );
};

export default AuthPage;
