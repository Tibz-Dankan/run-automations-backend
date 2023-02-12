import request from "supertest";
import { server } from "../../../app";

it("returns a 201 on successful signup", async () => {
  return request(server)
    .post("/api/users/signup")
    .send({
      username: "test user",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(server)
    .post("/api/users/signup")
    .send({
      username: "test user",
      email: "test.com",
      password: "password",
    })
    .expect(400);
});

it("returns a 400 with missing username or email or password", async () => {
  await request(server)
    .post("/api/users/signup")
    .send({
      username: "",
      email: "email@test.com",
      password: "password",
    })
    .expect(400);
  await request(server)
    .post("/api/users/signup")
    .send({
      username: "test user",
      email: "",
      password: "password",
    })
    .expect(400);
  await request(server)
    .post("/api/users/signup")
    .send({
      username: "test user",
      email: "test@gmail.com",
      password: "",
    })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(server)
    .post("/api/users/signup")
    .send({
      username: "test user",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  await request(server)
    .post("/api/users/signup")
    .send({
      username: "test user",
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("expects a token after signup", async () => {
  const response: any = await request(server)
    .post("/api/users/signup")
    .send({
      username: "test user",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const data = JSON.parse(response.text);
  expect(data["token"]).toBeDefined();
});
