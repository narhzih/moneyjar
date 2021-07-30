const crypto = require("crypto");
const resetToken = crypto.randomBytes(32).toString("hex");

console.log(crypto.createHash("sha256").update(resetToken).digest("hex"));
// console.log(resetToken);
