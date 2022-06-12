import { Pinger } from "./lib/pinger";
import { Chart, registerables } from "chart.js";
const urlInput = document.querySelector("input#url");
const canvas = document.querySelector("canvas#myChart");
import "./style.css";
Chart.register(...registerables);

let intervalId;
const labels = [];
const dataset = {
  label: "Ping",
  /**@type {number[]} */
  data: [],
  backgroundColor: "rgba(255, 99, 132, 0.2)",
  borderColor: "rgba(255, 99, 132, 1)",
  borderWidth: 1,
  fill: false,
};
const data = {
  labels,
  datasets: [dataset],
};

const loop = (ip, callback) => {
  intervalId = setInterval(() => {
    Pinger(ip, callback);
  }, 1000);
};

let chart;

const triggerLoop = (url = "8.8.8.8") => {
  if (intervalId) clearInterval(intervalId);
  loop(url, (response, startTime) => {
    const endTime = new Date().getTime();
    const time = endTime - startTime;
    labels.push(labels.length + 1);
    dataset.data.push(time);
    if (chart) {
      chart.data.labels = labels;
      chart.data.datasets[0].data = dataset.data;
      chart.update();
    } else {
      //@ts-ignore
      chart = new Chart(canvas, {
        type: "line",
        data,
        options: {
          aspectRatio: 3,
        },
      });
    }
    console.clear();
    console.table({ response, startTime, endTime, time });
  });
};

triggerLoop();

urlInput?.addEventListener("blur", (e) => {
  //@ts-ignore
  data.labels = [];
  data.datasets[0].data = [];

  triggerLoop(e.target.value);
});
