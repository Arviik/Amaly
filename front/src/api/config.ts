import ky from "ky";
import Router from "next/router";

const api = ky.create({
  prefixUrl: "'http://localhost:3000/'",
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = localStorage.getItem("token");
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          localStorage.removeItem("token");
          Router.push("/login");
        }
      },
    ],
  },
});

export default api;
