import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: false,
    minlength: 1,
    maxlength: 12,
    match: [/^[A-Za-z]{1,12}$/, 'Le nom d\'utilisateur ne doit contenir que des lettres (a-z, A-Z), sans espaces ni symboles.']
  },
  password: {
    type: String,
    required: true
  }
});

export default mongoose.model('User', userSchema); 