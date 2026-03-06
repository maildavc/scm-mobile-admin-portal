import crypto from "crypto";

const KEY = "zAL7X5AVRm8l4Ifs";
const IV = "BE/s3V0HtpPsE+1x";

function encryptPayload(plaintext) {
  const cipher = crypto.createCipheriv("aes-128-cbc", Buffer.from(KEY, "utf-8"), Buffer.from(IV, "utf-8"));
  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

function decryptPayload(ciphertext) {
  const decipher = crypto.createDecipheriv("aes-128-cbc", Buffer.from(KEY, "utf-8"), Buffer.from(IV, "utf-8"));
  let decrypted = decipher.update(ciphertext, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

async function run() {
  // Step 1: Login to get token
  const loginPayload = {
    Email: "admin@test.org",
    Password: "Admin@12345",
    Token: "1234"
  };

  const encryptedLogin = {
    request: encryptPayload(JSON.stringify(loginPayload))
  };

  console.log("--- Step 1: Logging in ---");
  const loginRes = await fetch("http://10.114.0.3:5000/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(encryptedLogin)
  });
  console.log("Login Status:", loginRes.status);

  const loginJson = await loginRes.json();
  let accessToken = null;

  const encryptedResponse = loginJson.response || loginJson.Response;
  if (encryptedResponse) {
    const decryptedLogin = JSON.parse(decryptPayload(encryptedResponse));
    console.log("Login response keys:", Object.keys(decryptedLogin));
    accessToken = decryptedLogin.AccessToken || decryptedLogin.Data?.AccessToken || decryptedLogin.data?.accessToken;
    if (!accessToken && decryptedLogin.Data) {
      accessToken = decryptedLogin.Data.AccessToken;
    }
    console.log("Got access token:", accessToken ? "YES (" + accessToken.substring(0, 20) + "...)" : "NO");
    if (!accessToken) {
      console.log("Full decrypted login:", JSON.stringify(decryptedLogin, null, 2));
    }
  } else {
    console.log("No encrypted response in login. Raw:", JSON.stringify(loginJson, null, 2));
    return;
  }

  if (!accessToken) {
    console.log("Could not get access token, aborting.");
    return;
  }

  // Step 2: Get customers list
  console.log("\n--- Step 2: GET /api/v1/customers?page=1&limit=100 ---");
  const customersRes = await fetch("http://10.114.0.3:5000/api/v1/customers?page=1&limit=100", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "X-Correlation-ID": crypto.randomUUID()
    }
  });

  const customersRaw = await customersRes.text();
  
  try {
    const customersJson = JSON.parse(customersRaw);
    const encResp = customersJson.response || customersJson.Response;
    if (encResp) {
      const decrypted = JSON.parse(decryptPayload(encResp));
      console.log("\n=== CUSTOMER STATUSES ===");
      const list = decrypted.value?.data || decrypted.Data || decrypted.data;
      if (Array.isArray(list)) {
        list.forEach(c => {
          console.log(`ID: ${c.id.substring(0, 8)}... | Name: ${c.name} | Status: '${c.status}' | KYC: '${c.kycStatus}'`);
        });
        console.log(`Total checked: ${list.length}`);
      } else {
        console.log("Response does not contain an array of customers.");
      }
    } else {
      console.log("Non-encrypted response:", JSON.stringify(customersJson, null, 2));
    }
  } catch (err) {
    console.error("Error parsing response:", err.message);
  }
}

run().catch(console.error);
