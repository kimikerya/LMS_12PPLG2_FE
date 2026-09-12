import { defineConfig } from "@playwright/test";
export default defineConfig({
 testDir:"./tests",testMatch:["student.spec.ts","user-return.spec.ts"],workers:1,fullyParallel:false,
 globalTeardown:"./tests/student-teardown.ts",
 timeout:45000,expect:{timeout:10000},reporter:"list",
 use:{baseURL:"http://127.0.0.1:3100",browserName:"chromium",channel:process.env.PLAYWRIGHT_CHANNEL||"msedge",viewport:{width:1440,height:1000},trace:"off",screenshot:"only-on-failure"},
 webServer:{command:"node tests/student-server.mjs",url:"http://127.0.0.1:3100",reuseExistingServer:false,timeout:30000},
});
