// const crypto = require("crypto");
// const resetToken = crypto.randomBytes(32).toString("hex");

// console.log(crypto.createHash("sha256").update(resetToken).digest("hex"));
// // console.log(resetToken);

// const myDate = new Date();
// console.log(myDate.getTime());

console.log(Date.now());
console.log(new Date().getTime());
const myTime = parseInt(new Date().getTime() / 1000, 10);
