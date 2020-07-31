import React, { useEffect, useState } from "react";
import { Doughnut, Pie } from "react-chartjs-2";

function PieChart(props) {
  const [chartData, setChartData] = useState({});

  function setChart(data, title, color, label, population) {
    // console.log(obj);
    // if (obj !== undefined) {
    //   //   const done = await Object.keys(obj).forEach(key => {
    //   //     date.push(key);
    //   //     count.push(obj[key]);
    //   //   });
    // }

    setChartData({
      labels: [label, "population"],
      datasets: [
        {
          data: [data, population],
          label: title,
          backgroundColor: color,
          borderWidth: 4
        }
      ]
    });
  }

  useEffect(() => {
    setChart(
      props.data,
      props.title,
      props.color,
      props.label,
      props.population
    );
  }, []);

  return (
    <div style={{ height: "300px", width: "500px" }}>
      <Pie data={chartData} options={{ responsive: true }} />
    </div>
  );
}

export default PieChart;
