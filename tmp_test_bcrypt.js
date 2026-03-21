const bcrypt = require('bcryptjs');

async function test() {
  console.log("Starting Bcrypt test...");
  try {
    const hash = await bcrypt.hash("test", 10);
    console.log("Hash created:", hash);
    const match = await bcrypt.compare("test", hash);
    console.log("Match success:", match);
  } catch (err) {
    console.error("Bcrypt failed:", err);
  }
}

test();
