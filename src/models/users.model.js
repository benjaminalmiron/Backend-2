import mongoose  from 'mongoose';

const usersCollection = 'users';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: { 
        type: String,
        required: true
    },
    /* createdAt: {
        type: Date,
        default: Date.now
    } */
   role: {
       type: String,
       enum: ['user', 'admin'],
       default: 'user'
   }
});

const User = mongoose.model('User', userSchema);

export default User;