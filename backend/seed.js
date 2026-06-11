require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Task = require('./src/models/Task');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🌱 Seed connection established...");

    // Find or create a default seed user
    let user = await User.findOne({ email: 'seeduser@example.com' });
    if (!user) {
      user = new User({
        name: 'Seed Engineer',
        email: 'seeduser@example.com',
        password: 'password123'
      });
      await user.save();
    }

    // Clean out old seed tasks for this user
    await Task.deleteMany({ user: user._id });

    // Mock payload array
    const structuralDummyTasks = [
      { user: user._id, title: 'Review System Specs', description: 'Read full guidelines for API optimization', status: 'done', dueDate: new Date() },
      { user: user._id, title: 'Build Frontend Layout', description: 'Assemble core dash views with dashboard contexts', status: 'in-progress', dueDate: new Date(Date.now() + 86400000) },
      { user: user._id, title: 'Set Up Production PM2 Instance', description: 'Deploy server code securely directly inside EC2', status: 'todo', dueDate: new Date(Date.now() + 172800000) }
    ];

    await Task.insertMany(structuralDummyTasks);
    console.log("✅ Seed operational tasks added to database!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding execution failure:", error);
    process.exit(1);
  }
};

seedDatabase();