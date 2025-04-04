import React from "react";
import { Tabs, Tab, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const IndicatorMenu = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const pages = [
    { label: "Add Metric", path: "/add-metric" },
    { label: "View Metrics", path: "/view-metric" },
    { label: "Statistics", path: "/metric-statistic" },
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

export default IndicatorMenu;
