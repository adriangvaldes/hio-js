import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_TOKEN;

const customerPayload = {
  role: "customer",
  userId: "customer-123-abc", // This will be the room ID
  name: "John Doe",
};

const customerToken = jwt.sign(customerPayload, JWT_SECRET, { expiresIn: "1h" });
console.log("--- Customer Token ---");
console.log(customerToken);
console.log("\nCustomer Connection URL:");
console.log(`ws://localhost:8080?token=${customerToken}\n`);

// --- Generate a token for an AGENT ---
const agentPayload = {
  role: "agent",
  agentId: "agent-456-xyz",
  name: "Support Agent Smith",
};
const agentToken = jwt.sign(agentPayload, JWT_SECRET, { expiresIn: "1h" });
console.log("--- Agent Token ---");
console.log(agentToken);
console.log("\nAgent Connection URL:");
console.log(`ws://localhost:8080?token=${agentToken}`);
