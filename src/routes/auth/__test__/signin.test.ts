import request from "supertest";
import { server } from "../../../app";

it("returns a 200 on successful signin", async () => {
  await request(server)
    .post("/api/users/signup")
    .send({
      username: "test user",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  await request(server)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);
});

it("returns 400 with missing email or password ", async () => {
  await request(server)
    .post("/api/users/signin")
    .send({
      email: "",
      password: "password",
    })
    .expect(400);
  await request(server)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "",
    })
    .expect(400);
});

it("returns 400 when email is invalid", async () => {
  await request(server)
    .post("/api/users/signup")
    .send({
      username: "test user",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  await request(server)
    .post("/api/users/signin")
    .send({
      email: "t@test.com",
      password: "password",
    })
    .expect(400);
});

it("returns 400 when password is invalid", async () => {
  await request(server)
    .post("/api/users/signup")
    .send({
      username: "test user",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  await request(server)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "bsjsa",
    })
    .expect(400);
});

it("expects a token after signin", async () => {
  await request(server)
    .post("/api/users/signup")
    .send({
      username: "test user",
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  const response: any = await request(server)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  const data = JSON.parse(response.text);
  expect(data["token"]).toBeDefined();
});
