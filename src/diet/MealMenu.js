import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MealMenu = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const pages = [
    { label: "Запланированные приёмы пищи", path: "/planned-meals" },
    { label: "Следующий приём пищи", path: "/next-meals" },
    { label: "Актуальные диеты", path: "/actual-diets" },
  ];
  return (
    
    <Box sx={{ width: "100%", bgcolor: "background.paper", marginTop: 10 }}>
      <Tabs
        value={value}
        onChange={(e, newValue) => {
          setValue(newValue);
          navigate(pages[newValue].path);
        }}
        textColor="inherit"
        indicatorColor="secondary"
        variant="fullWidth"
      >
        {pages.map((page, index) => (
          <Tab key={index} label={page.label} />
        ))}
      </Tabs>
    </Box>
  );
};

export default MealMenu;
