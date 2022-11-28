const { WebSocketServer } = require("ws");

const server = new WebSocketServer({ port: 3000 });

const sales = [];

const LIST_TYPES = [
  "BEST_STORE",
  "BEST_SELLER",
  "TOTAL_SALES_BY_STORE",
  "TOTAL_SALES_BY_SELLER",
  "TOTAL_SALES_BY_STORE_WITH_FILTER"]

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function validateSellerInput(content) {
  const { code, seller, store, date, ammount } = content;

  if (!code) {
    return { message: "ERRO: Informe o codigo da operação (code)" }
  }

  if (!seller) {
    return { message: "ERRO: Informe o vendedor (seller)" }
  }

  if (!store) {
    return { message: "ERRO: Informe a loja (store)" }
  }

  if (!date) {
    return { message: "ERRO: Informe a data (date)" }
  }

  if (!ammount) {
    return { message: "ERRO: Informe o valor (ammount)" }
  }

  if (!isValidDate(date)) {
    return { message: "ERRO: Data invalida" };
  }

  return { message: "OK" }
}

function validateManagerInput(content) {
  const { type, name, date } = content;

  if (!LIST_TYPES.includes(type)) {
    return { isValid: false, message: "ERRO: Tipo de listagem inválido" }
  }

  if (type === "TOTAL_SALES_BY_STORE" && !name) {
    return { isValid: false, message: "ERRO: Informe o nome da loja" }
  }

  if (type === "TOTAL_SALES_BY_SELLER" && !name) {
    return { isValid: false, message: "ERRO: Informe o nome do vendedor" }
  }

  if (type === "TOTAL_SALES_BY_STORE_WITH_FILTER") {
    if (!name) {
      return { isValid: false, message: "ERRO: Informe o nome da loja" }
    }

    if (!date || !date.start || !date.end) {
      return { isValid: false, message: "ERRO: Informe o data do filtro" }
    }
  }

  return { isValid: true };
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

function getSalesByStoreWithFilter(store, date) {
  const salesStore = getSalesByStore(store);

  return salesStore.filter((sale) => sale.date >= date.start && sale.date <= date.end);
}

function getSalesBySeller(seller) {
  return sales.filter(s => s.seller === seller);
}

function getTotalOfSales(s) {
  return s.reduce((acc, current) => acc + current.ammount, 0)
}

function calculateTotalSalesByStore() {
  const stores = getAllStores();

  const storeWithTotal = []

  for (const store of stores) {
    const storeSales = getSalesByStore(store);

    const storeTotalPuchaes = getTotalOfSales(storeSales);

    storeWithTotal.push({ store, purchases: storeSales, total: storeTotalPuchaes });
  }

  return storeWithTotal
}

function calculateTotalSalesBySeller() {
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
  const stores = calculateTotalSalesByStore();

  const [bestSotre] = stores.sort((storeA, storeB) => storeB.total - storeA.total);

  return bestSotre;
}

function getTheBestSeller() {
  const sellers = calculateTotalSalesBySeller();

  const [bestSeller] = sellers.sort((storeA, storeB) => storeB.total - storeA.total);

  return bestSeller;
}

function printCurrentSales() {
  console.log("Lista de vendas:")
  for (const { code, seller, store, ammount, date } of sales) {
    console.log(`Código: ${code} | Vendedor ${seller} | Loja ${store} | Valor ${ammount} | Data ${date.toISOString()}`)
  }

  console.log("----------------------------------------------------------")
}

server.on("connection", (socket) => {

  socket.on("message", (data) => {
    const { type, content } = JSON.parse(data);

    switch (type) {
      case "seller": {
        const newContent = parseContent(content);

        const { message } = validateSellerInput(newContent);

        if (message === "OK") {
          sales.push(newContent);
        }

        socket.send(message);

        printCurrentSales();
        break;
      }
      case "manager": {
        const { isValid, message } = validateManagerInput(content);

        if (isValid) {
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
            case "TOTAL_SALES_BY_STORE_WITH_FILTER": {
              const storeSales = getSalesByStoreWithFilter(content.name, {
                start: new Date(content.date.start),
                end: new Date(content.date.end)
              });

              socket.send(JSON.stringify({ store: content.name, date: content.date, storeSales }));
              break;
            }
          }
        } else {
          socket.send(message);
        }
      }
    }
  });
});