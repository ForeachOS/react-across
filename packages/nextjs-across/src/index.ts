import { execSync }  from "child_process";
execSync("yarn next " + process.argv.slice(2).join(" "), { stdio: 'inherit' });

