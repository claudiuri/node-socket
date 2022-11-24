const WebSocket = require("ws");

const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("open", () => {
  socket.send(JSON.stringify({
    type: "seller",
    content: {
      code: "0001",
      seller: "Bart",
      store: "apple",
      date: new Date(),
      ammount: 1000
    }
  }));

  socket.send(JSON.stringify({
    type: "seller",
    content: {
      code: "0002",
      seller: "Bart",
      store: "apple",
      date: new Date(),
      ammount: 1000
    }
  }));

  socket.send(JSON.stringify({
    type: "seller",
    content: {
      code: "0003",
      seller: "Bart",
      store: "apple",
      date: new Date(),
      ammount: 1000
    }
  }));

  socket.send(JSON.stringify({
    type: "seller",
    content: {
      code: "0003",
      seller: "Bart",
      store: "xiomi",
      date: new Date(),
      ammount: 1000
    }
  }));
});

socket.addEventListener("message", ({ data }) => {
  console.log(data.toString())
  console.log("-------------------------------------------------------------------------------------------------------")
});