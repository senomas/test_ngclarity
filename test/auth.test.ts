import * as mocha from "mocha";
import * as chai from "chai";
import * as forge from "node-forge";
import chaiHttp = require("chai-http");

chai.use(chaiHttp);
const expect = chai.expect;

const http = chai.request("http://localhost:3000");

const delay = async (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  })
}

describe("baseRoute", function () {
  this.timeout(60000);

  it("login", async () => {
    try {
      let authInit = (await http.get("/api/auth/seno")).body;
      console.log("authInit: ", authInit);
      let hmac = forge.hmac.create();
      hmac.start('sha256', 'seno');
      hmac.update('dodol123');
      let bx = hmac.digest().getBytes();
      hmac.start('sha256', authInit.secret);
      hmac.update(bx);
      let token = (await http.post("/api/auth/seno").send({ secret: authInit.secret, password: forge.util.encode64(hmac.digest().getBytes()) })).body;
      console.log("token: ", token);
      // await delay(5000);
      let user = (await http.get(`/api/auth/${token.token}/user`)).body;
      console.log("user: ", user);
      let newToken = (await http.get(`/api/auth/${token.refreshToken}/refresh`)).body;
      console.log("newToken: ", newToken);
    } catch (err) {
      if (err.response) {
        throw new Error(`${err.response.status}: ${err.response.body}`);
      }
      throw err;
    }
  });

  it("should be json", () => {
    return http
      .get("/api/auth/seno")
      .then(res => {
        expect(res.type).to.eql("application/json");
      });
  });
});
