import mongoose from "mongoose";
import { hash, compare } from "bcryptjs";

interface UserAttributes {
  username: string;
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
  correctPassword(candidatePassword: string, password: any): boolean;
  build(attributes: UserAttributes): UserDoc;
}
interface UserDoc extends mongoose.Document {
  username: String;
  email: String;
  password: String;
  createdAt: Date;
  role: String;
  passwordResetToken: String | undefined;
  passwordResetExpires: Date | undefined;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    username: {
      type: String,
      required: [true, "username  must be provided"],
    },
    email: {
      type: String,
      required: [true, "email  must be provided"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password  must be provided"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    role: {
      type: String,
      enum: ["admin", "client", "user"],
      default: "user",
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await hash(this.get("password"), 10);
    this.set("password", hashedPassword);
  }
  next();
});

userSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};

userSchema.methods.correctPassword = async (
  candidatePassword: string,
  password: any
) => {
  return await compare(candidatePassword, password);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
