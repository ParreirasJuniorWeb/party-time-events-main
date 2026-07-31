import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import methodOverride from "method-override";
import cors from "cors";
import routes from "./routes/Router.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.write("Olá, Servidor Online!");
});

app.use("/api", routes);

export default app;
