import mongoose from 'mongoose';

const chatSchema = ({
  name: String,
  text: String,
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
