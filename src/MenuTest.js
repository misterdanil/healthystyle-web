import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Stack,
  IconButton,
  Paper,
  Divider,
   List,
   Badge,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { fetchUsernameRequest, fetchNotificationsRequest } from './healthSlice';

import { checkAuth, isAuthenticated, logout } from './oauth2.js';

import Cookies from 'js-cookie';

const mockNotifications = [
  { id: 1, text: "Вам прислали приглашение на участие в мероприятии: Йога на свежем воздухе" },
  { id: 2, text: "Новое событие рядом с вами: Утренняя пробежка" },
  { id: 3, text: "Обновился план лечения: Гастрит" },
    { id: 3, text: "Обновился план лечения: Гастрит" },

      { id: 3, text: "Обновился план лечения: Гастрит" },

        { id: 3, text: "Обновился план лечения: Гастрит" },
  { id: 3, text: "Обновился план лечения: Гастрит" },
  { id: 3, text: "Обновился план лечения: Гастрит" },
  { id: 3, text: "Обновился план лечения: Гастрит" },
  { id: 3, text: "Обновился план лечения: Гастрит" },
  { id: 3, text: "Обновился план лечения: Гастрит" },
  { id: 3, text: "Обновился план лечения: Гастрит" },
  { id: 3, text: "Обновился план лечения: Гастрит" },

];
const MenuTest = () => {
  const [searchParams] = useSearchParams();
  checkAuth(null, 'GET', null, "http://localhost:3001/oauth2/refresh", window.location.href, searchParams);

  const dispatch = useDispatch();

  const notifications = useSelector((state) => state.health.notifications);
  
  const [healthElements, setHealthElements] = useState(null);
  const [treatmentElements, setTreatmentElements] = useState(null);
  const [sportElements, setSportElements] = useState(null);
  const [dietElements, setDietElements] = useState(null);
  const [articleElements, setArticleElements] = useState(null);
  const [eventElements, setEventElements] = useState(null);
  const [userElements, setUserElements] = useState(null);
  const [notificationElements, setNotificationElements] = useState(null);
  const [count, setCount] = useState(0);

  const handleOpen = (setElements) => (event) => {
    console.log(event.currentTarget);
    setElements(event.currentTarget);
  };

  const handleNotificationsOpen = (setElements) => (event) => {
    dispatch(fetchNotificationsRequest({page: 0, limit: 50}));
    // readNotifications();
    setElements(event.currentTarget);
  };

  const handleLogin = (setElements) => (event) => {
    checkAuth('http://localhost:3001/metrics', 'GET', "http://localhost:3001/oauth2/redirect", "http://localhost:3001/oauth2/refresh", window.location.href, searchParams);
    setElements(event.currentTarget);
  };

  const handleClose = (setElements) => () => {
    setElements(null);
  };

  const handleLogout = (setElements) => () => {
    logout();
    setElements(null);
  };

    const handleAccept = (id) => {
    console.log("Принято уведомление с id:", id);
  };

  const handleDecline = (id) => {
    console.log("Отклонено уведомление с id:", id);
  };

  useEffect(() => {
    if(isAuthenticated()) {
      fetchCountUnwatched();
    }
      }, [dispatch]);

   const fetchCountUnwatched = async (ids)=>{
        let res = await fetch("http://localhost:3004/notifications/count?status=UNWATCHED", {
          headers: {'Authorization': 'Bearer ' + Cookies.get('access_token')}
        });
        const count = await res.json();
        setCount(count);
      }

  const readNotifications = async () => {
        let res = await fetch("http://localhost:3004/notifications", {
          method: "PUT",
          body: JSON.stringify({ids: notifications.map(n => n.id), type: 'UNWATCHED'}),
          headers: {"Authorization": "Bearer " + Cookies.get('access_token'), "Content-Type": "application/json"},
        });

        if(res.status == 204) {
          setCount(0);
        }
      }
    

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Здоровый образ жизни
          </Typography>

          <Button color="inherit" onClick={handleOpen(setHealthElements)}>
            Здоровье
          </Button>
          <Button color="inherit" onClick={handleOpen(setTreatmentElements)}>
            Лечение
          </Button>
          <Menu
            anchorEl={treatmentElements}
            open={Boolean(treatmentElements)}
            onClose={handleClose(setTreatmentElements)}
          >
            <MenuItem onClick={handleClose(setTreatmentElements)}>
              Добавить лечение
            </MenuItem>
            <MenuItem onClick={handleClose(setTreatmentElements)}>
              Запланированные приёмы
            </MenuItem>
            <MenuItem onClick={handleClose(setTreatmentElements)}>
              Пропущенные приёмы
            </MenuItem>
            <MenuItem onClick={handleClose(setTreatmentElements)}>
              Добавить лекарство
            </MenuItem>
          </Menu>

          <Button color="inherit" onClick={handleOpen(setSportElements)}>
            Занятия
          </Button>
          <Menu
            anchorEl={sportElements}
            open={Boolean(sportElements)}
            onClose={handleClose(setSportElements)}
          >
            <MenuItem onClick={handleClose(setSportElements)}>
              Добавить план занятий
            </MenuItem>
            <MenuItem onClick={handleClose(setSportElements)}>
              Планы
            </MenuItem>
            <MenuItem onClick={handleClose(setSportElements)}>
              Тренировки по расписанию
            </MenuItem>
            <MenuItem onClick={handleClose(setSportElements)}>
              Статистика выполнения
            </MenuItem>
            <MenuItem onClick={handleClose(setSportElements)}>
              Добавить упражнение
            </MenuItem>
          </Menu>

          <Button color="inherit" onClick={handleOpen(setSportElements)}>
            Диеты
          </Button>
          <Menu
            anchorEl={dietElements}
            open={Boolean(dietElements)}
            onClose={handleClose(setDietElements)}
          >
            <MenuItem onClick={handleClose(setDietElements)}>
              Диеты
            </MenuItem>
            <MenuItem onClick={handleClose(setDietElements)}>
              Приёмы пищи
            </MenuItem>
            <MenuItem onClick={handleClose(setDietElements)}>
              Добавить блюдо
            </MenuItem>
            <MenuItem onClick={handleClose(setDietElements)}>
              Список блюд
            </MenuItem>
            <MenuItem onClick={handleClose(setDietElements)}>
              Статистика потребления
            </MenuItem>
          </Menu>

          <Button color="inherit" onClick={handleOpen(setEventElements)}>
            Мероприятия
          </Button>
          <Menu
            anchorEl={eventElements}
            open={Boolean(eventElements)}
            onClose={handleClose(setEventElements)}
          >
            <MenuItem onClick={handleClose(setEventElements)}>
              Добавить мероприятие
            </MenuItem>
            <MenuItem onClick={handleClose(setEventElements)}>
              Поиск мероприятий
            </MenuItem>
          </Menu>
          <Button color="inherit" onClick={handleOpen(setEventElements)}>
            Статьи
          </Button>
          <Menu
            anchorEl={articleElements}
            open={Boolean(articleElements)}
            onClose={handleClose(setArticleElements)}
          >
            <MenuItem onClick={handleClose(setArticleElements)}>
              Добавить статью
            </MenuItem>
            <MenuItem onClick={handleClose(setArticleElements)}>
              Статьи
            </MenuItem>
          </Menu>
          <Button color="inherit">Лекарства</Button>
        </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {isAuthenticated() && (<div><IconButton color="inherit" onClick={handleNotificationsOpen(setNotificationElements)}>
          <Badge badgeContent={count} color="error">
    <NotificationsIcon />
  </Badge>          </IconButton>
          <Menu
            anchorEl={notificationElements}
            open={Boolean(notificationElements)}
            onClose={handleClose(setNotificationElements)}
            PaperProps={{
              sx: {
                width: 360,
                maxHeight: 400,
                overflowY: "auto",
              },
            }}
          >
            {notifications.length === 0 ? (
              <MenuItem disabled>Нет уведомлений</MenuItem>
            ) : (
              <Stack spacing={2}>
                {notifications.map((notification) => (
                 <Box
                 key={notification.id}
                 sx={{
                   border: "1px solid #e0e0e0",
                   borderRadius: 2,
                   backgroundColor: "#fafafa",
                   p: 2,
                   display: "flex",
                   flexDirection: "column",
                   gap: 1,
                 }}
               >
                 <Typography variant="body2" sx={{ color: "text.primary" }}>
                   {notification.text}
                 </Typography>
               </Box>
                ))}
</Stack>
            )}
          </Menu></div>)}
          <Button
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            {isAuthenticated() ?
            (<Stack direction="row" spacing={1} alignItems="center">
              <Avatar alt="Иван" src="/avatar.jpg" sx={{ width: 32, height: 32 }} />
              <Typography variant="body1" onClick={handleOpen(setUserElements)}>Иван</Typography>
            </Stack>) : (<Typography variant="body1" onClick={handleLogin(setUserElements)}>Войти</Typography>)
            }
          </Button>
          <Menu
            anchorEl={userElements}
            open={Boolean(userElements)}
            onClose={handleClose(setUserElements)}
          >
            <MenuItem onClick={handleClose(setUserElements)}>Профиль</MenuItem>
            <MenuItem onClick={handleLogout(setUserElements)}>Выход</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuTest;
