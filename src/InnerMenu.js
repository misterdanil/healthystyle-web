import React from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

const InnerMenu = (props) => {
  const routes = props.routes;
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = routes.findIndex((route) =>
    location.pathname.startsWith(route.path)
  );

  const handleChange = (event, newValue) => {
    navigate(routes[newValue].path);
  };

  return (
    <Paper elevation={2} sx={{ mb: 3 }}>
      <Box sx={{ px: 2 }}>
        <Tabs
          value={currentTab === -1 ? 0 : currentTab}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
        >
          {routes.map((route) => (
            <Tab key={route.path} label={route.label} />
          ))}
        </Tabs>
      </Box>
    </Paper>
  );
};

export default InnerMenu;
