const crypto=require("crypto"),http=require("http"),BASE="http://10.114.0.3:5000",KEY="zAL7X5AVRm8l4Ifs",IV="BE/s3V0HtpPsE+1x";
function enc(t){const c=crypto.createCipheriv("aes-128-cbc",Buffer.from(KEY),Buffer.from(IV));return c.update(t,"utf8","base64")+c.final("base64")}
function dec(t){const d=crypto.createDecipheriv("aes-128-cbc",Buffer.from(KEY),Buffer.from(IV));return d.update(t,"base64","utf8")+d.final("utf8")}
function tC(o){if(Array.isArray(o))return o.map(tC);if(o&&typeof o==="object")return Object.fromEntries(Object.entries(o).map(([k,v])=>[k[0].toLowerCase()+k.slice(1),tC(v)]));return o}
function tP(o){if(Array.isArray(o))return o.map(tP);if(o&&typeof o==="object")return Object.fromEntries(Object.entries(o).map(([k,v])=>[k[0].toUpperCase()+k.slice(1),tP(v)]));return o}
function req(m,p,b,tk){return new Promise((res,rej)=>{const u=new URL(p,BASE),o={hostname:u.hostname,port:u.port,path:u.pathname+u.search,method:m,headers:{"X-Correlation-ID":crypto.randomUUID()}};if(tk)o.headers.Authorization="Bearer "+tk;let pd=null;if(b&&Object.keys(b).length>0){pd=JSON.stringify({request:enc(JSON.stringify(tP(b)))});o.headers["Content-Type"]="application/json";o.headers["Content-Length"]=Buffer.byteLength(pd)}const r=http.request(o,rs=>{let d="";rs.on("data",c=>d+=c);rs.on("end",()=>{let result={sc:rs.statusCode};try{const w=JSON.parse(d);const e=w.response||w.Response;if(e){try{result.b=tC(JSON.parse(dec(e)))}catch{result.b=dec(e)}}else result.b=tC(w)}catch{result.b=d}res(result)})});r.on("error",rej);if(pd)r.write(pd);r.end()})}
async function login(email,pw){const r=await req("POST","/api/v1/auth/login",{email,password:pw,token:"1234"});if(r.sc!==200){console.log("FAIL login:",r.sc,JSON.stringify(r.b));process.exit(1)}return r.b.data.accessToken}

async function run(){
  const mgr=await login("manager@test.org","Manager@12345");
  console.log("Manager logged in");

  // First check what approved roles exist
  console.log("\n=== Approved Roles ===");
  const roles=await req("GET","/api/v1/roles?Page=1&Limit=100",null,mgr);
  const roleList=roles.b?.data||[];
  if(Array.isArray(roleList)){
    const approved=roleList.filter(r=>r.status==="Approved");
    approved.forEach(r=>console.log(`  "${r.name}" (${r.id}) - ${r.status}`));
    if(approved.length===0){console.log("  No approved roles! Creating one...");
      // Create and approve a role first
    }
  }

  // Pick the first approved role
  const approvedRoles=Array.isArray(roleList)?roleList.filter(r=>r.status==="Approved"):[];
  const targetRole=approvedRoles[0];
  if(!targetRole){console.log("No approved role to assign. Exiting.");return}
  console.log(`\nWill assign role: "${targetRole.name}"`);

  // Check approved departments
  console.log("\n=== Approved Departments ===");
  const depts=await req("GET","/api/v1/departments?Page=1&Limit=100",null,mgr);
  const deptList=depts.b?.data?.departments||depts.b?.data||[];
  if(Array.isArray(deptList)){
    deptList.forEach(d=>console.log(`  "${d.name}" (${d.id}) - ${d.status}`));
  }
  const approvedDept=(Array.isArray(deptList)?deptList:[] ).find(d=>d.status==="Approved");
  const deptId=approvedDept?.id||"7c9bb0be-f77f-456b-8569-4ef216aed30e";
  console.log(`\nUsing dept: "${approvedDept?.name||'fallback'}" (${deptId})`);

  // Create user with that specific role
  const ts=Date.now();
  console.log(`\n=== Creating user with role "${targetRole.name}" ===`);
  const payload = {
    basicInformation:{firstName:"RoleCheck",lastName:"Test"+ts,email:`rolecheck${ts}@test.org`,phoneNumber:"08099887766"},
    department:{departmentId:deptId},
    assignRole:{roleName:targetRole.name,roleType:"Permanent"}
  };
  console.log("  Payload (camel):", JSON.stringify(payload,null,2));
  console.log("  Payload (pascal):", JSON.stringify(tP(payload),null,2));
  const cr=await req("POST","/api/v1/users",payload,mgr);
  console.log(`  Create: HTTP ${cr.sc}`);
  console.log(`  Response:`,JSON.stringify(cr.b,null,2));

  const userId=cr.b?.data?.id||cr.b?.id;
  if(!userId){console.log("  User creation failed. Cannot proceed.");return}

  // Check in list
  console.log(`\n=== User in LIST (looking for ${userId}) ===`);
  const list=await req("GET","/api/v1/users?Page=1&Limit=100",null,mgr);
  const users=list.b?.data?.users||list.b?.data||[];
  const found=Array.isArray(users)&&users.find(u=>u.id===userId);
  if(found){
    console.log(`  name="${found.name}" role="${found.role}" roleName="${found.roleName}" status="${found.status}"`);
    console.log(`  Full:`,JSON.stringify(found,null,2));
  } else {
    console.log("  NOT FOUND in list");
  }

  // Check detail
  console.log(`\n=== User DETAIL ===`);
  const det=await req("GET",`/api/v1/users/${userId}`,null,mgr);
  console.log(`  HTTP ${det.sc}`);
  console.log(`  Body:`,JSON.stringify(det.b,null,2));

  console.log(`\n=== Expected: role/roleName should be "${targetRole.name}", NOT "User" ===`);
}
run().catch(console.error);
