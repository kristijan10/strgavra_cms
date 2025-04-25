import express from "express";
import cors from "cors";

import error from "./middleware/error.js";

import authRouter from "./router/auth.js";
import navRouter from "./router/nav.js";
import heroRouter from "./router/hero.js";
import aboutRouter from "./router/about.js";
import productsRouter from "./router/products.js";
import categoriesRouter from "./router/categories.js";
import contactRouter from "./router/contact.js";
import mediaRouter from "./router/media.js";

const app = express();

app.use(express.json());

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"] }));

app.use("/auth", authRouter);

app.use("/nav", navRouter);

app.use("/hero", heroRouter);

app.use("/about", aboutRouter);

app.use("/products", productsRouter);

app.use("/categories", categoriesRouter);

app.use("/contact", contactRouter);

app.use("/media", mediaRouter);

app.use(error);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));
