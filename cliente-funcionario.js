const WebSocket = require("ws");

const addDays = require("./utils");

const socket = new WebSocket("ws://localhost:3000");

const currentDate = new Date().setHours(0, 0, 0, 0);

socket.addEventListener("open", () => {
  socket.send(JSON.stringify({
    type: "seller",
    content: {
      code: "0001",
      seller: "Bart",
      store: "apple",
      date: currentDate,
      ammount: 1000
    }
  }));

  socket.send(JSON.stringify({
    type: "seller",
    content: {
      code: "0002",
      seller: "Bart",
      store: "apple",
      date: addDays(currentDate, 1),
      ammount: 1000
    }
  }));

  socket.send(JSON.stringify({
    type: "seller",
    content: {
      code: "0003",
      seller: "Bart",
      store: "apple",
      date: addDays(currentDate, 2),
      ammount: 1000
    }
  }));

  socket.send(JSON.stringify({
    type: "seller",
    content: {
      code: "0001",
      seller: "Carl",
      store: "xiomi",
      date: addDays(currentDate, 2),
      ammount: 5000
    }
  }));

  socket.send(JSON.stringify({
    type: "seller",
    content: {
      code: "0002",
      seller: "Carl",
      store: "xiomi",
      date: addDays(currentDate, 2),
      ammount: 10
    }
  }));
});

socket.addEventListener("message", ({ data }) => {
  console.log(data.toString())
  console.log("-----------------------------------------------------")
});