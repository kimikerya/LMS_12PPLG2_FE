// Isolated UI contract fixture. Never connects to or changes the school database.
import { createServer } from "node:http";
import { spawn } from "node:child_process";
const now = Date.now();
const stamp = hours => new Date(now + hours * 3600000).toISOString();
const teacher = {id:1,teacher_user_id:2,full_name:"Suci Indah Sari",role:"homeroom",subject_id:null,subject_name:null,status:"active"};
const classroom = id => ({id,title:id===1?"12 PPLG 2":"Bahasa Indonesia",status:"active",grade_level:12,year:"2026/2027",level:"SMK",major:"Pengembangan Perangkat Lunak dan Gim",room:"Lab 2",description:"Ruang belajar untuk berdiskusi, berlatih, dan berkarya bersama.",member_count:32,members:[],teachers:[teacher,{...teacher,id:2,role:"subject_teacher",subject_id:11,subject_name:"Pemrograman Web"},{...teacher,id:3,teacher_user_id:4,full_name:"Dewi Lestari",role:"subject_teacher",subject_id:12,subject_name:"Bahasa Indonesia"},{...teacher,id:4,role:"subject_teacher",subject_id:11,subject_name:"Pemrograman Web"},{...teacher,id:5,role:"subject_teacher",subject_id:13,subject_name:"Mapel nonaktif",status:"inactive"}],announcements:[{id:1,title:"Selamat datang di kelas",content:"Pelajari materi pertemuan pertama sebelum mengerjakan tugas.",author:teacher.full_name,created_at:stamp(-24)}]});
const base = {class_id:1,subject_id:11,teacher_name:teacher.full_name,status:"published",description:"Baca petunjuk dengan saksama, kemudian tuliskan jawaban Anda.",instructions:"Kerjakan secara mandiri.",published_at:stamp(-24),due_at:stamp(24),close_at:stamp(48),allow_late:true,type:null,meeting_no:null,url:null,start_at:stamp(24),end_at:stamp(26),duration_minutes:60,question_count:20,max_points:100,submission_status:null,submitted_at:null};
const materials=[{...base,id:203,subject_id:12,title:"Menulis teks argumentasi",type:"link",meeting_no:1,url:"https://example.test/bahasa"},{...base,id:201,title:"Pengenalan HTML dan CSS",type:"pdf",meeting_no:1,url:"https://example.test/materi.pdf"},{...base,id:202,title:"Struktur halaman web",type:"link",meeting_no:2,url:"https://example.test/web"}];
const assignments=[{...base,id:101,title:"Membuat halaman profil"},{...base,id:102,title:"Tautan proyek kelompok"},{...base,id:103,title:"Latihan minggu lalu",due_at:stamp(-48),close_at:stamp(-24)},{...base,id:104,title:"Refleksi pembelajaran"}];
const assessments=[{...base,id:301,class_id:null,title:"Asesmen dasar pemrograman",type:"quiz"}];
let submissions,profile,failNext;
let users=[];
function reset(){submissions={104:{id:404,submission_type:"text",text_answer:"Saya sudah memahami dasar HTML.",submitted_at:stamp(-2),status:"graded",score:88,teacher_feedback:"Penjelasan sudah baik.",result_released_at:stamp(-1)}};profile={id:3,login_id:"STDTEST",full_name:"Budi Santoso",role:"student",status:"active",bio:"Senang belajar pemrograman.",email:"",nis:"0012345",nisn:"0098765432"};failNext=false;}
reset();
function resetUsers(){users=[{id:900,login_id:"ADMINTEST",full_name:"Admin Pengujian",role:"admin",status:"active",email:""},{id:901,login_id:"GURTEST",full_name:"Guru Pengujian",role:"teacher",status:"active",email:"",employee_id:"12345"}];}
resetUsers();
const api=createServer(async(req,res)=>{
 const url=new URL(req.url,"http://127.0.0.1");const path=url.pathname;let raw="";for await(const chunk of req)raw+=chunk;const body=raw?JSON.parse(raw):{};
 const send=(data,status=200)=>{res.writeHead(status,{"Content-Type":"application/json"});res.end(JSON.stringify(data));};
 if(path==="/__shutdown"){send({ok:true});setImmediate(()=>{app.kill();api.closeAllConnections();api.close();});return;}
 if(path==="/__reset"){reset();resetUsers();return send({ok:true});}
 if(path==="/__fail-submit"){failNext=true;return send({ok:true});}
 if(path==="/auth/me"){const admin=req.headers.authorization==="Bearer isolated-admin-fixture";return req.headers.authorization?send({user_id:admin?900:3,login_id:admin?"ADMINTEST":"STDTEST",role:admin?"admin":"student",exp:Math.floor(Date.now()/1000)+3600}):send({error:"Unauthenticated"},401);}
 if(!req.headers.authorization)return send({error:"Unauthenticated"},401);
 
 if(path==="/api/academic-options")return send({years:[],levels:[],majors:[],subjects:[]});
 if(path==="/api/users"||path.startsWith("/api/users/")){
  if(req.headers.authorization!=="Bearer isolated-admin-fixture")return send({error:"Forbidden"},403);
  if(path==="/api/users"){
   if(req.method==="POST"){const {password,...fields}=body;void password;const item={...fields,id:users.length+1000,login_id:fields.login_id||"GUR-AUTO"};users.push(item);return send(item,201);}
   return send({data:users.filter(u=>!url.searchParams.get("role")||u.role===url.searchParams.get("role"))});
  }
  const id=Number(path.split("/")[3]);const item=users.find(u=>u.id===id);if(!item)return send({error:"Not found"},404);
  if(req.method==="DELETE"){users=users.filter(u=>u.id!==id);return send({status:"deleted"});}
  if(req.method==="PATCH"){const {password,...fields}=body;void password;Object.assign(item,fields);return send({status:"updated"});}
  return send(item);
 }
 if(path==="/api/profile"){if(req.method==="PATCH")profile={...profile,full_name:body.full_name,bio:body.bio};return send(profile);}
 if(path==="/api/classes")return send({data:[classroom(1)]});
 if(path==="/api/classes/1")return send(classroom(Number(path.split("/").at(-1))));
 const sub=path.match(/^\/api\/assignments\/(\d+)\/submissions$/);
 if(sub){const id=Number(sub[1]);if(req.method==="POST"){if(failNext){failNext=false;return send({error:"Temporarily unavailable"},503);}if(submissions[id])return send({error:"Tugas sudah dikumpulkan."},409);submissions[id]={id:id+400,...body,submitted_at:stamp(0),status:"submitted",score:null,teacher_feedback:null,result_released_at:null};return send({id:id+400},201);}return send({data:submissions[id]?[submissions[id]]:[]});}
 for(const [kind,items]of Object.entries({materials,assignments,assessments})){
  const projected=items.map(item=>({...item,submission_status:kind==="assignments"?submissions[item.id]?.status??null:null,submitted_at:kind==="assignments"?submissions[item.id]?.submitted_at??null:null}));
  if(path===`/api/${kind}`)return send({data:Number(url.searchParams.get("offset"))>0||url.searchParams.get("class_id")==="2"?[]:projected.filter(i=>!url.searchParams.has("subject_id")||String(i.subject_id)===url.searchParams.get("subject_id"))});
  const item=projected.find(i=>path===`/api/${kind}/${i.id}`);if(item)return send(item);
 }
 return send({error:"Not found"},404);
});
await new Promise(resolve=>api.listen(8088,"127.0.0.1",resolve));
const app=spawn(process.execPath,["node_modules/next/dist/bin/next","start","-p","3100","-H","127.0.0.1"],{stdio:"inherit",env:{...process.env,BACKEND_URL:"http://127.0.0.1:8088"}});
const close=()=>{app.kill();api.close();};process.on("SIGINT",close);process.on("SIGTERM",close);app.on("exit",code=>{api.close();process.exitCode=code??0;});
