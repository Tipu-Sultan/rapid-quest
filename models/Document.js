// models/Document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  path: String,
  mimetype: String,
  size: Number,
  content: String,
  category: String,
  project: String,
  team: String,
  topics: [String],
  uploadedAt: { type: Date, default: Date.now },
  searchableText: String,
});

// CRITICAL: Include topics in searchableText
documentSchema.pre('save', function (next) {
  this.searchableText = `${this.originalName} ${this.content} ${this.topics.join(' ')}`.slice(0, 500_000);
  next();
});

// Text index on searchableText only
documentSchema.index({ searchableText: 'text' });

export default mongoose.models.Document || mongoose.model('Document', documentSchema);