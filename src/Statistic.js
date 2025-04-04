import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const Statistic = () => {
  const data = {
    labels: ["2025-04-01", "2025-04-02", "2025-04-03"],
    datasets: [
      {
        label: "Blood Sugar",
        data: [120, 125, 130],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <Card sx={{ padding: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Metrics Statistics
        </Typography>
        <Line data={data} />
      </CardContent>
    </Card>
  );
};

export default Statistic;
