/**
 * API testing utility — handles encryption/decryption for the SCM Admin backend.
 *
 * Usage:
 *   node test-api.js login <email> <password> <otp>
 *   node test-api.js get <endpoint> [token]
 *   node test-api.js post <endpoint> <json-body> [token]
 *
 * Examples:
 *   node test-api.js login admin@example.com MyPass123 1234
 *   node test-api.js get "/api/v1/roles?Page=1&Limit=100" <token>
 *   node test-api.js post "/api/v1/roles" '{"name":"Test"}' <token>
 */
const crypto = require("crypto");
const http = require("http");

const BASE = "http://10.114.0.3:5000";
const KEY = "zAL7X5AVRm8l4Ifs";
const IV = "BE/s3V0HtpPsE+1x";

function encrypt(text) {
  const cipher = crypto.createCipheriv(
    "aes-128-cbc",
    Buffer.from(KEY),
    Buffer.from(IV)
  );
  let enc = cipher.update(text, "utf8", "base64");
  enc += cipher.final("base64");
  return enc;
}

function decrypt(ct) {
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    Buffer.from(KEY),
    Buffer.from(IV)
  );
  let dec = decipher.update(ct, "base64", "utf8");
  dec += decipher.final("utf8");
  return dec;
}

function toPascalCase(obj) {
  if (Array.isArray(obj)) return obj.map(toPascalCase);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.charAt(0).toUpperCase() + k.slice(1),
        toPascalCase(v),
      ])
    );
  }
  return obj;
}

function toCamelCase(obj) {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [
        k.charAt(0).toLowerCase() + k.slice(1),
        toCamelCase(v),
      ])
    );
  }
  return obj;
}

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method,
      headers: {
        "X-Correlation-ID": crypto.randomUUID(),
      },
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    let postData = null;
    if (body && Object.keys(body).length > 0) {
      const pascal = toPascalCase(body);
      const encrypted = encrypt(JSON.stringify(pascal));
      postData = JSON.stringify({ request: encrypted });
      options.headers["Content-Type"] = "application/json";
      options.headers["Content-Length"] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let result = { statusCode: res.statusCode, raw: data };
        try {
          const wrapper = JSON.parse(data);
          const enc = wrapper.response || wrapper.Response;
          if (enc) {
            const decrypted = decrypt(enc);
            try {
              result.decrypted = toCamelCase(JSON.parse(decrypted));
            } catch {
              result.decrypted = decrypted;
            }
          } else {
            result.decrypted = toCamelCase(wrapper);
          }
        } catch {
          result.decrypted = data;
        }
        resolve(result);
      });
    });

    req.on("error", reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function main() {
  const [, , command, ...args] = process.argv;

  if (command === "login") {
    const [email, password, token] = args;
    if (!email || !password || !token) {
      console.log("Usage: node test-api.js login <email> <password> <otp>");
      process.exit(1);
    }
    console.log(`Logging in as ${email}...`);
    const res = await request("POST", "/api/v1/auth/login", {
      email,
      password,
      token,
    });
    console.log(`HTTP ${res.statusCode}`);
    console.log(JSON.stringify(res.decrypted, null, 2));

    // Extract and display token
    if (res.decrypted?.data?.accessToken) {
      console.log("\n=== ACCESS TOKEN ===");
      console.log(res.decrypted.data.accessToken);
    }
  } else if (command === "get") {
    const [endpoint, token] = args;
    if (!endpoint) {
      console.log("Usage: node test-api.js get <endpoint> [token]");
      process.exit(1);
    }
    console.log(`GET ${endpoint}`);
    const res = await request("GET", endpoint, null, token);
    console.log(`HTTP ${res.statusCode}`);
    console.log(JSON.stringify(res.decrypted, null, 2));
  } else if (command === "post") {
    const [endpoint, bodyStr, token] = args;
    if (!endpoint || !bodyStr) {
      console.log('Usage: node test-api.js post <endpoint> <json-string-or-@filepath> [token]');
      process.exit(1);
    }
    console.log(`POST ${endpoint}`);
    const fs = require("fs");
    const body = bodyStr.startsWith("@")
      ? JSON.parse(fs.readFileSync(bodyStr.slice(1), "utf8"))
      : JSON.parse(bodyStr);
    const res = await request("POST", endpoint, body, token);
    console.log(`HTTP ${res.statusCode}`);
    console.log(JSON.stringify(res.decrypted, null, 2));
  } else if (command === "put" || command === "patch") {
    const [endpoint, bodyStr, token] = args;
    if (!endpoint || !bodyStr) {
      console.log(`Usage: node test-api.js ${command} <endpoint> <json-string-or-@filepath> [token]`);
      process.exit(1);
    }
    const method = command.toUpperCase();
    console.log(`${method} ${endpoint}`);
    const fs = require("fs");
    const body = bodyStr.startsWith("@")
      ? JSON.parse(fs.readFileSync(bodyStr.slice(1), "utf8"))
      : JSON.parse(bodyStr);
    const res = await request(method, endpoint, body, token);
    console.log(`HTTP ${res.statusCode}`);
    console.log(JSON.stringify(res.decrypted, null, 2));
  } else {
    console.log("Commands: login, get, post, put, patch");
    console.log("  node test-api.js login <email> <password> <otp>");
    console.log('  node test-api.js get "/api/v1/roles?Page=1&Limit=100" <token>');
    console.log("  node test-api.js post \"/api/v1/roles\" '{\"name\":\"Test\"}' <token>");
  }
}

main().catch(console.error);
