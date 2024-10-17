import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  githubNickname: {
    type: String,
  },
  githubAvatar: {
    type: String,
  }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
