import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/database.js";
import Pokemon from "./models/pokemon.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB
connectDB();

// Middleware pour CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour servir des fichiers statiques
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Route GET de base
app.get("/api/pokemons", async (req, res) => {
  try {
    const pokemons = await Pokemon.find();
    res.status(200).send({
      types: [
        "fire", "water", "grass", "electric", "ice", "fighting",
        "poison", "ground", "flying", "psychic", "bug", "rock",
        "ghost", "dragon", "dark", "steel", "fairy"
      ],
      pokemons: pokemons
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Erreur serveur" });
  }
});

app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Pokémon");
});

// GET one pokemon by ID
app.get("/api/pokemons/:id", async (req, res) => {
  try {
    const pokemon = await Pokemon.findOne({ id: parseInt(req.params.id) });
    if (!pokemon) return res.status(404).json({ status: 404, message: "Pokemon non trouvé" });
    res.status(200).json({ status: 200, data: pokemon });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Erreur serveur" });
  }
});

// Fonction utilitaire pour normaliser les stats spéciales
function normalizeSpStats(base) {
  if (base && base.Sp) {
    if (base.Sp.Attack !== undefined) {
      base['Sp. Attack'] = base.Sp.Attack;
    }
    if (base.Sp.Defense !== undefined) {
      base['Sp. Defense'] = base.Sp.Defense;
    }
    delete base.Sp;
  }
  return base;
}

// POST - Create a new pokemon
app.post("/api/pokemons", async (req, res) => {
  try {
    req.body.base = normalizeSpStats(req.body.base);
    const { id, name, type, base, image } = req.body;
    if (!id || !name || !type || !base || !image) {
      return res.status(400).json({ status: 400, message: "Tous les champs sont requis" });
    }

    const pokemonExists = await Pokemon.findOne({ id });
    if (pokemonExists) {
      return res.status(400).json({ status: 400, message: "L'ID existe déjà" });
    }

    const newPokemon = new Pokemon(req.body);
    await newPokemon.save();
    res.status(201).json({ status: 201, data: newPokemon });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Erreur serveur" });
  }
});

// PUT - Update a pokemon
app.put("/api/pokemons/:id", async (req, res) => {
  try {
    req.body.base = normalizeSpStats(req.body.base);
    const pokemon = await Pokemon.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true }
    );
    if (!pokemon) return res.status(404).json({ status: 404, message: "Pokemon non trouvé" });
    res.status(200).json({ status: 200, data: pokemon });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Erreur serveur" });
  }
});

// DELETE - Delete a pokemon
app.delete("/api/pokemons/:id", async (req, res) => {
  try {
    const pokemon = await Pokemon.findOneAndDelete({ id: parseInt(req.params.id) });
    if (!pokemon) return res.status(404).json({ status: 404, message: "Pokemon non trouvé" });
    res.status(200).json({ status: 200, message: "Pokemon supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Erreur serveur" });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
