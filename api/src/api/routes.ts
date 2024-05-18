import express from "express";
import { invalidPath } from "./errors/invalid-path";
import { initUsers } from "./routes/users";
import {initAuth} from "./routes/auth";
import {initOrganizations} from "./routes/organizations";

export const initRoutes = (app: express.Express) => {
    app.get("/health", (req, res) => {
        res.status(200).json({ data: "lol" });
    });

    initUsers(app);
    initAuth(app);
    initOrganizations(app)

    app.use(invalidPath);
};
