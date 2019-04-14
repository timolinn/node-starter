import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import validator from 'validator';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please enter your email address',
  },
  phoneNumber: {
    type: Number,
    unique: true,
    required: 'Please enter your phone number',
  },
  password: {
    type: String,
    required: 'You must enter a password',
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: String,
  loginAttempts: String,
  ipAddress: String,
  avatar: String,
  twitter: String,
  instagram: String,
  facebook: String,
  linkedin: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

UserSchema.plugin(timestamps, {
  createdAt: {
    index: true,
  },
  updatedAt: {
    index: true,
  },
});


UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('gravatar').get(function () {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

// Hash password
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = this.encryptPassword(this.password);
  next();
});

UserSchema.methods = {
  encryptPassword: (plainTextWord) => {
    if (!plainTextWord) return '';
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainTextWord, salt);
  },
  comparePassword: function (password) {
    return bcrypt.compareSync(password, this.password);
  }
};

module.exports = mongoose.model('User', UserSchema);
