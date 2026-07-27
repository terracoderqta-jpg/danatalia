const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());

async function run() {
  const res = await fetch('https://dana-talia-7vnk8gbrg-victorm-1s-projects.vercel.app/');
  const html = await res.text();
  const imgUrls = [];
  const regex = /<img[^>]+src="([^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    imgUrls.push(match[1]);
  }
  console.log(imgUrls);
}
run();
