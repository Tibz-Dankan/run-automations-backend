import request from "supertest";
import { server } from "../../../app";

it("returns 400 with missing token", async () => {
  await request(server)
    .patch(`/api/users/reset-password/missing-token`)
    .send({
      password: "newpassword",
    })
    .expect(400);
});

it("returns 400 for an invalid or expired token", async () => {
  await request(server)
    .patch(`/api/users/reset-password/invalid-token`)
    .send({
      password: "newpassword",
    })
    .expect(400);
});
