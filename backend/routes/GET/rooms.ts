import { app, JWT_SECRET, rooms } from "../..";
import { UserPayload } from "../../types";
import jwt from "jsonwebtoken";

app.get("/rooms", (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header is missing or invalid." });
    }
    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;

    if (payload.role !== "agent") {
      return res.status(403).json({ message: "Access denied: Agent role required." });
    }

    const activeRooms = Array.from(rooms.entries()).map(([roomId, clients]) => {
      const firstClient = clients.values().next().value;
      return {
        roomId,
        customerName: firstClient?.user?.name || "Unknown Customer",
        clientCount: clients.size,
      };
    });

    res.status(200).json(activeRooms);
  } catch (error) {
    res.status(401).json({ message: "Authentication failed.", error: (error as Error).message });
  }
});
