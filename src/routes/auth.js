import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';

// Remplace par une vraie clé secrète en prod
const JWT_SECRET = 'votre_cle_secrete_super_longue';

// Helper pour valider le username côté backend
function isValidUsername(username) {
  return /^[A-Za-z]{1,12}$/.test(username);
}

router.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    if (!isValidUsername(username)) {
      return res.status(400).json({ message: "Le nom d'utilisateur doit contenir uniquement des lettres (a-z, A-Z), sans espaces ni symboles, 12 max." });
    }
    // Vérifie si l'utilisateur existe déjà (email seulement)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé.' });
    }
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    // Création de l'utilisateur
    const user = new User({ email, password: hashedPassword, username });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;
  try {
    // Recherche par email OU username
    const user = await User.findOne({ $or: [ { email: emailOrUsername }, { username: emailOrUsername } ] });
    if (!user) return res.status(400).json({ message: 'Identifiants invalides.' });
    // Vérifie le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Identifiants invalides.' });
    // Génère le token JWT avec username
    const token = jwt.sign({ userId: user._id, email: user.email, username: user.username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// PATCH - Modifier le username de l'utilisateur connecté
router.patch('/me/username', authMiddleware, async (req, res) => {
  const { username } = req.body;
  if (!isValidUsername(username)) {
    return res.status(400).json({ message: "Le nom d'utilisateur doit contenir uniquement des lettres (a-z, A-Z), sans espaces ni symboles, 12 max." });
  }
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { username },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    res.json({ message: 'Pseudo modifié !', username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

export default router;