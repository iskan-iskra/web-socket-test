const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

let clients = [];

server.on("connection", (socket) => {
  console.log("Client connected");
  clients.push(socket);

  // Отправка приветственного сообщения клиенту в формате JSON
  socket.send(JSON.stringify({ message: "Welcome to the WebSocket server!" }));

  // Обработка полученных сообщений от клиента
  socket.on("message", (message) => {
    console.log("Received:", message);
    try {
      const data = JSON.parse(message);
      console.log("Parsed message:", data);

      // Рассылаем сообщение всем подключенным клиентам
      clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ message: data.message }));
        }
      });
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });

  // Обработка закрытия соединения
  socket.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter((client) => client !== socket);
  });
});

console.log(`WebSocket server is running ${server.path}`);
