import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { dateFormat } from "dateformat";
function Chart(props) {
  const [chartData, setChartData] = useState({});

  const date = [];
  const count = [];

  async function setChart(obj, title, color) {
    if (obj !== undefined) {
      const done = await Object.keys(obj).forEach(key => {
        var today = new Date(key);

        date.push(
          today.toLocaleDateString("en-US", { day: "numeric", month: "long" })
        );

        count.push(obj[key]);
      });
    }

    setChartData({
      labels: date,
      datasets: [
        {
          data: count,
          label: title,
          backgroundColor: color,
          borderWidth: 3
        }
      ]
    });
  }

  // data={{
  //   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //   datasets: [
  //     {
  //       label: "# of Votes",
  //       data: [12, 19, 3, 5, 2, 3],
  //       backgroundColor: [
  //         "rgba(255, 99, 132, 0.2)",
  //         "rgba(54, 162, 235, 0.2)",
  //         "rgba(255, 206, 86, 0.2)",
  //         "rgba(75, 192, 192, 0.2)",
  //         "rgba(153, 102, 255, 0.2)",
  //         "rgba(255, 159, 64, 0.2)"
  //       ],
  //       borderColor: [
  //         "rgba(255, 99, 132, 1)",
  //         "rgba(54, 162, 235, 1)",
  //         "rgba(255, 206, 86, 1)",
  //         "rgba(75, 192, 192, 1)",
  //         "rgba(153, 102, 255, 1)",
  //         "rgba(255, 159, 64, 1)"
  //       ],
  //       borderWidth: 4
  //     }
  //   ]
  // }}

  useEffect(() => {
    setChart(props.data, props.title, props.color);
  }, [props.data, props.title, props.color]);

  return (
    // <div style={{ height: "300px" }}>
    <Line
      // width={30}
      // height={10}
      data={chartData}
      options={{
        responsive: true,
        // title: { text: "active count", display: true },
        scales: {
          xAxes: [
            {
              ticks: {
                fontSize: 12,
                fontColor: props.labelColor
                // callback: function(label, index, labels) {
                //   return label.toFixed(2) + "%";
                // }
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                callback: function(label, index, labels) {
                  return label;
                },
                fontSize: 12,
                fontColor: props.labelColor
              },
              display: true
            }
          ]
        }
      }}
    />
    // </div>
  );
}

export default Chart;
