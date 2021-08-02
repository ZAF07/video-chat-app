import mongoose from 'mongoose';

const userSchema = ({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

export default User;
