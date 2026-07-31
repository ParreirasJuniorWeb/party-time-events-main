import express from "express";
const router = express.Router();

// Services router
import servicesRouter from "./Services.js";

router.use("/", servicesRouter);

// Parties router
import partiesRouter from "./Parties.js";

router.use("/", partiesRouter);

export default router;