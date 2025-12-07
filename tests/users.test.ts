import { describe, it, expect, beforeEach } from "vitest";
import { agent } from "./support/setup";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";

interface UserResponse {
  message: string;
  users?: {
    _id: string;
    name: string;
    email: string;
  }[];
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

describe("UserRoutes", () => {
  describe("GET /api/user/all", () => {
    it("devrait retourner tous les utilisateurs", async () => {
      const res = await agent.get("/api/user/all");
      expect(res.status).toBe(HttpStatusCodes.OK);
      const body = res.body as UserResponse;
      expect(body).toHaveProperty("users");
    });
  });

  describe("POST /api/user/add", () => {
    it("devrait créer un nouvel utilisateur", async () => {
      const newUser = {
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "password123",
        solde: 100,
        isAdmin: false,
        stocks: [],
        dateOfBirth: new Date("1990-01-01"),
      };
      const res = await agent.post("/api/user/add").send({ user: newUser });
      expect(res.status).toBe(HttpStatusCodes.CREATED);
      const body = res.body as UserResponse;
      expect(body).toHaveProperty("user");
    });
  });

  describe("GET /api/user/:id", () => {
    it("devrait retourner 404 pour un id invalide", async () => {
      const res = await agent.get("/api/user/invalidid123");
      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });

  describe("DELETE /api/user/delete/:id", () => {
    it("devrait retourner 404 pour un id invalide", async () => {
      const res = await agent.delete("/api/user/delete/invalidid123");
      expect(res.status).toBe(HttpStatusCodes.NOT_FOUND);
    });
  });
});
