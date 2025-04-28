import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    english: { type: String, required: true },
    french: { type: String, required: true },
    japanese: { type: String, required: true },
    chinese: { type: String, required: true }
  },
  type: [{
    type: String,
    required: true
  }],
  base: {
    HP: { type: Number, required: true },
    Attack: { type: Number, required: true },
    Defense: { type: Number, required: true },
    'Sp. Attack': { type: Number, required: true },
    'Sp. Defense': { type: Number, required: true },
    Speed: { type: Number, required: true }
  },
  image: { type: String },
  imageShiny: { type: String }
}, {
  timestamps: true
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);

export default Pokemon; 