const WebSocket = require("ws");

const addDays = require("./utils");

const socket = new WebSocket("ws://localhost:3000");

const currentDate = new Date().setHours(0, 0, 0, 0);

function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

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
      name: "apple",
      date: { start: currentDate, end: addDays(currentDate, 1) }
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

  try {
    const { store, date, storeSales } = JSON.parse(data);

    if (store && date && storeSales) {

      console.log(`Vendas da loja ${store} de ${formatDate(date.start)} até ${formatDate(date.end)})`)

      for (const { code, seller, store, ammount, date } of storeSales) {
        console.log(`Código: ${code} | Vendedor ${seller} | Loja ${store} | Valor ${ammount} | Data ${formatDate(date)}`)
      }

    }

  } catch {
    console.log(data.toString())
  }

  console.log("-------------------------------------------------------------------------------------------------------")
});