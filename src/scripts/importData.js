import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Pokemon from '../models/pokemon.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pokedex', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Lire le fichier JSON des Pokémon
    const pokemonsFile = path.join(__dirname, '../../src/data/pokemons.json');
    const pokemons = JSON.parse(fs.readFileSync(pokemonsFile, 'utf8'));

    // Supprimer toutes les données existantes
    await Pokemon.deleteMany({});

    // Insérer les nouvelles données
    await Pokemon.insertMany(pokemons);

    console.log('Données importées avec succès !');
    process.exit();
  } catch (error) {
    console.error(`Erreur : ${error}`);
    process.exit(1);
  }
};

importData(); 