const { WebSocketServer } = require("ws");

const server = new WebSocketServer({ port: 3000 });

const sales = [];

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function validateSale(content) {
  const { code, seller, store, date, ammount } = content;

  if (!code) {
    return { message: "ERRO: Missing code" }
  }

  if (!seller) {
    return { message: "ERRO: Missing seller" }
  }

  if (!store) {
    return { message: "ERRO: Missing store" }
  }

  if (!date) {
    return { message: "ERRO: Missing date" }
  }

  if (!ammount) {
    return { message: "ERRO: Missing ammount" }
  }

  if (!isValidDate(date)) {
    return { message: "ERRO: Invalid Date" };
  }

  return { message: "OK" }
}

function parseContent(content) {
  return { ...content, date: content.date ? new Date(content.date) : content.date };
}

function getAllStores() {
  return [...new Set(sales.map(({ store }) => store))];
}

function getAllSellers() {
  return [...new Set(sales.map(({ seller }) => seller))];
}

function getSalesByStore(store) {
  return sales.filter(s => s.store === store);
}

function getSalesBySeller(seller) {
  return sales.filter(s => s.seller === seller);
}

function getTotalOfSales(s) {
  return s.reduce((acc, current) => acc + current.ammount, 0)
}

function calculateTotalPurchaesByStore() {
  const stores = getAllStores();

  const storeWithTotal = []

  for (const store of stores) {
    const storeSales = getSalesByStore(store);

    const storeTotalPuchaes = getTotalOfSales(storeSales);

    storeWithTotal.push({ store, purchases: storeSales, total: storeTotalPuchaes });
  }

  return storeWithTotal
}

function calculateTotalPurchaesBySeller() {
  const sellers = getAllSellers();

  const sellerWithTotal = []

  for (const seller of sellers) {
    const storeSales = getSalesBySeller(seller);

    const sellerTotalPuchaes = getTotalOfSales(storeSales);

    sellerWithTotal.push({ seller, purchases: storeSales, total: sellerTotalPuchaes });
  }

  return sellerWithTotal
}

function getTotalByStore(store) {

  const storeSales = getSalesByStore(store);

  return { store, total: storeSales.length };
}

function getTotalBySeller(seller) {

  const sellerSales = getSalesBySeller(seller);

  return { seller, total: sellerSales.length };
}

function getTheBestStore() {
  const stores = calculateTotalPurchaesByStore();

  const [bestSotre] = stores.sort((storeA, storeB) => storeB.total - storeA.total);

  return bestSotre;
}

function getTheBestSeller() {
  const sellers = calculateTotalPurchaesBySeller();

  const [bestSeller] = sellers.sort((storeA, storeB) => storeB.total - storeA.total);

  return bestSeller;
}

server.on("connection", (socket) => {


  socket.on("message", (data) => {
    const { type, content } = JSON.parse(data);

    switch (type) {
      case "seller": {
        const newContent = parseContent(content);

        const { message } = validateSale(newContent);

        if (message === "OK") {
          sales.push(newContent);
        }

        socket.send(message);
        break;
      }
      case "manager": {
        switch (content.type) {
          case "BEST_STORE": {
            const { store, total, purchases } = getTheBestStore();

            socket.send(`Melhor loja ${store} total de compras foram de ${total} compras: ${JSON.stringify(purchases)}`);
            break;
          }
          case "BEST_SELLER": {
            const { seller, total, purchases } = getTheBestSeller();

            socket.send(`O melhor vendedor ${seller} total de compras foram de ${total} compras: ${JSON.stringify(purchases)}`);
            break;
          }
          case "TOTAL_SALES_BY_STORE": {
            const { store, total } = getTotalByStore(content.name);
            socket.send(`A loja ${store} teve ${total} vendas`);
            break;
          }
          case "TOTAL_SALES_BY_SELLER": {
            const { seller, total } = getTotalBySeller(content.name);
            socket.send(`A vendedor ${seller} vendeu ${total} produtos`);
            break;
          }

        }
      }
    }
  });
});