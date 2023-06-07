import express from "express";
import cors from "cors";

import redis from "redis";

import dotenv from "dotenv";
import axios from "axios";

const client = redis.createClient();

export const main = () => {
  dotenv.config();

  const port = process.env.PORT || 3000;

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(async (req, res, next) => {
    try {
      await client.connect();
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  });

  app.get("/all", async (req, res) => {
    try {
      const pokemons = JSON.parse((await client.get("pokemons", {})) || "null");

      if (pokemons) {
        console.log("ttl", await client.ttl("pokemons"));
        return res.status(200).json(pokemons);
      }

      const { data } = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
      );

      await client.set("pokemons", JSON.stringify(data), {
        EX: 10,
      });

      return res.json(data);
    } catch (error) {
      res.status(500).json({ error });
    } finally {
      await client.disconnect();
    }
  });

  app.listen(port, () => {
    console.log("app listening on port", port);
  });
};
