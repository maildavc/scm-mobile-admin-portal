import crypto from "crypto";

const KEY = "zAL7X5AVRm8l4Ifs";
const IV = "BE/s3V0HtpPsE+1x";

function encryptPayload(plaintext) {
  const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(KEY, "utf-8"), Buffer.from(IV, "utf-8"));
  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

async function run() {
  const payload = {
    Email: "admin@scmcapital.com",
    Password: "P@ssw0rd!",
    Token: "1234"
  };
  
  const encryptedPayload = {
    request: encryptPayload(JSON.stringify(payload))
  };

  try {
    const res = await fetch("http://10.114.0.3:5000/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(encryptedPayload)
    });
    console.log("Status:", res.status);
    
    const json = await res.json();
    console.log("Raw Response JSON:", json);
    if (json.response) {
      const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(KEY, "utf-8"), Buffer.from(IV, "utf-8"));
      let decrypted = decipher.update(json.response, "base64", "utf8");
      decrypted += decipher.final("utf8");
      console.log("Decrypted response:", decrypted);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
