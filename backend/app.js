import app from "./server.js";
import { connect } from "./db/conn.js";

const port = 3000;

// Connect to DBMongo
connect();

app.listen(port, () => console.log(`Rodando em http://localhost:${port}`));
