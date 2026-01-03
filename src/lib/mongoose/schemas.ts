import bcrypt from "bcryptjs";
import * as mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    _id: true,
    methods: {
      comparePassword: async function (password: string) {
        return await bcrypt.compare(password, this.password);
      },
    },
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);

  await this.save();
});

export type User = mongoose.InferSchemaType<typeof userSchema>;
export const User = mongoose.model("User", userSchema);

export const orderSchema = new mongoose.Schema(
  {
    lab: { type: String, required: true },
    patient: { type: String, required: true },
    customer: { type: String, required: true },
    state: {
      type: String,
      enum: ["CREATED", "ANALYSIS", "COMPLETED"],
      default: "CREATED",
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "DELETED"],
      default: "ACTIVE",
      required: true,
    },
    services: [
      {
        name: {
          type: String,
          required: true,
        },
        value: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["PENDING", "DONE"],
          default: "PENDING",
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    _id: true,
    methods: {
      calculateTotal: function () {
        return this.services.reduce((acc, service) => acc + service.value, 0);
      },
    },
  }
);

export type Order = mongoose.InferSchemaType<typeof orderSchema>;
export const Order = mongoose.model("Order", orderSchema);
