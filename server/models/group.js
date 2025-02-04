import mongoose from "mongoose";

// Define the schema for a Group
const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      unique: true, // Ensures group names are unique
      trim: true,
    },
    employeeIds: [
      {
        type: mongoose.Schema.Types.ObjectId, // References employee documents
        ref: 'Employee', // The collection/model to reference
        required: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now, // Automatically sets the creation date
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // User or manager who created the group
      ref: 'Manager',
      required: false,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Create the model from the schema
const Group = mongoose.model('Group', groupSchema);

export default Group;
