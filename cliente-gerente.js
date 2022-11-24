const WebSocket = require("ws");

const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", () => {
  socket.send(JSON.stringify({
    type: "manager",
    content: {
      type: "TOTAL_SALES_BY_SELLER",
      name: "Bart",
    }
  }));

  socket.send(JSON.stringify({
    type: "manager",
    content: {
      type: "TOTAL_SALES_BY_STORE",
      name: "apple",
    }
  }));

  socket.send(JSON.stringify({
    type: "manager",
    content: {
      type: "TOTAL_SALES_BY_STORE_WITH_FILTER",
      name: "fast",
      date: { start: new Date(), end: new Date() }
    }
  }));

  socket.send(JSON.stringify({
    type: "manager",
    content: {
      type: "BEST_SELLER",
    }
  }));

  socket.send(JSON.stringify({
    type: "manager",
    content: {
      type: "BEST_STORE",
    }
  }));
});

socket.addEventListener("message", ({ data }) => {
  console.log(data.toString())
  console.log("-------------------------------------------------------------------------------------------------------")
});