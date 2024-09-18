const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  startDate: Date,
  endDate: Date,
  status: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Status' }],
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
