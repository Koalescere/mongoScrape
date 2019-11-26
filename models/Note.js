var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
var noteSchema = new Schema({
  _headlineID: {
    type: Schema.Types.ObjectId,
    ref: "Headline"
  },
  date: {
    type:  String
  },
  noteText: {
    type: String
  },  
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", noteSchema);

// Export the User model
module.exports = Note;