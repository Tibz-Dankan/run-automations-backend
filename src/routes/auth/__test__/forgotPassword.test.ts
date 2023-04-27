import request from "supertest";
import { server } from "../../../app";

it("returns a 400 with missing email", async () => {
  await request(server)
    .post("/api/users/forgot-password")
    .send({ email: "" })
    .expect(400);
});

it("returns a 404 with invalid email", async () => {
  await request(server)
    .post("/api/users/forgot-password")
    .send({
      email: "invalid@test.com",
    })
    .expect(404);
});

it("returns a 200 with valid email", async () => {
  await request(server)
    .post("/api/users/signup")
    .send({
      username: "test user",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  await request(server)
    .post("/api/users/forgot-password")
    .send({
      email: "test@test.com",
    })
    .expect(200);
});
