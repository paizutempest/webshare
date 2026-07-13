import fs from 'fs';
import axios from 'axios';
import chalk from 'chalk';
import dayjs from 'dayjs';
import gradient from 'gradient-string';
import { input, confirm } from '@inquirer/prompts';
import { HttpsProxyAgent } from 'https-proxy-agent';

const CAPSOLVER_KEY = "CAP-GANTI KE TOKEN CAPSOLVER KAMU";
const EMAIL_DOMAIN = "@anbu.my.id"; // BISA GANTI KE EMAIL TMAIL KAMU
const SITE_KEY = "6LeHZ6UUAAAAAKat_YS--O2tj_by3gv3r_l03j9d"; // BISA GANTI SITE_KEY SNIFF LAGI DI WEBSHARE

process.on('uncaughtException', (err) => {
    if (err.code === 'ECONNRESET' || err.message.includes('TLS')) return;
    console.error('\n[SYSTEM ERROR]', err);
});
process.on('unhandledRejection', () => {});

function displayBanner() {
    console.clear();
    const wsGradient = gradient(['#00FF88', '#0099FF', '#7000FF']);
    console.log(wsGradient(`
    ██╗    ██╗███████╗██████╗ ███████╗██╗  ██╗ █████╗ ██████╗ ███████╗
    ██║    ██║██╔════╝██╔══██╗██╔════╝██║  ██║██╔══██╗██╔══██╗██╔════╝
    ██║ █╗ ██║█████╗  ██████╔╝███████╗███████║███████║██████╔╝█████╗  
    ██║███╗██║██╔══╝  ██╔══██╗╚════██║██╔══██║██╔══██║██╔══██╗██╔══╝  
    ╚███╔███╔╝███████╗██████╔╝███████║██║  ██║██║  ██║██║  ██║███████╗
     ╚══╝╚══╝ ╚══════╝╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
    WEBSHARE.IO AUTO REGIESTER
    By Paizutempest | Bypass Captcha & Get Proxy Residential
    `));
}

const log = {
    info: (msg) => console.log(`${chalk.cyan('ℹ')} [${dayjs().format('HH:mm:ss')}] ${msg}`),
    success: (msg) => console.log(`${chalk.green('✔')} [${dayjs().format('HH:mm:ss')}] ${chalk.bold(msg)}`),
    error: (msg, detail = "") => {
        console.log(`${chalk.red('✖')} [${dayjs().format('HH:mm:ss')}] ${chalk.red.bold(msg)}`);
        if (detail) console.log(`${chalk.red('  └ Details:')} ${chalk.gray(detail)}`);
    },
    process: (msg) => console.log(`${chalk.blue('⚙')} [${dayjs().format('HH:mm:ss')}] ${chalk.italic(msg)}`),
};

function loadConfigProxies() {
    try {
        if (!fs.existsSync('config.txt')) {
            log.error("File config.txt tidak ditemukan! Membuat file kosong baru.");
            fs.writeFileSync('config.txt', '', 'utf-8');
            return [];
        }
        const content = fs.readFileSync('config.txt', 'utf-8');
        return content.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && line.startsWith('http'));
    } catch (error) {
        log.error("Gagal membaca file config.txt", error.message);
        return [];
    }
}

function getRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function solveCaptcha() {
    log.process("Meminta token solusi reCAPTCHA dari Capsolver...");
    try {
        const createTask = await axios.post("https://api.capsolver.com/createTask", {
            clientKey: CAPSOLVER_KEY,
            task: {
                type: "ReCaptchaV2EnterpriseTaskProxyLess",
                websiteURL: "https://dashboard.webshare.io/register?source=login_signup_link",
                websiteKey: SITE_KEY
            }
        });

        if (createTask.data.errorId > 0) throw new Error(createTask.data.errorDescription);
        const taskId = createTask.data.taskId;
        
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const getResult = await axios.post("https://api.capsolver.com/getTaskResult", {
                clientKey: CAPSOLVER_KEY,
                taskId: taskId
            });

            if (getResult.data.status === "ready") {
                log.success("Token reCAPTCHA berhasil didapatkan.");
                return getResult.data.solution.gRecaptchaResponse;
            }
            if (getResult.data.status === "failed") throw new Error("Capsolver gagal menyelesaikan captcha.");
        }
    } catch (error) {
        log.error("Gagal mendapatkan solusi Captcha.", error.message);
        return null;
    }
}

async function registerViaAPI(email, password, captchaToken, agent) {
    log.process(`Mengirim data pendaftaran HTTP POST: ${email}`);
    try {
        const response = await axios.post("https://proxy.webshare.io/api/v2/register/", {
            email: email,
            password: password,
            tos_accepted: true,
            recaptcha: captchaToken
        }, {
            httpsAgent: agent,
            httpAgent: agent,
            timeout: 15000,
            headers: {
                'accept': 'application/json, text/plain, */*',
                'content-type': 'application/json',
                'origin': 'https://dashboard.webshare.io',
                'referer': 'https://dashboard.webshare.io/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'
            }
        });

        if (response.data && response.data.token) {
            log.success(`Registrasi Berhasil! Token Otorisasi didapat.`);
            return response.data.token;
        }
        return null;
    } catch (error) {
        const errorDetail = error.response ? JSON.stringify(error.response.data) : error.message;
        log.error("API Registrasi menolak permintaan.", errorDetail);
        return null;
    }
}

async function extractProxyCredentials(authToken, agent) {
    try {
        log.process("Mengambil data Plan ID aktif...");
        const planResponse = await axios.get("https://proxy.webshare.io/api/v2/subscription/plan/", {
            httpsAgent: agent,
            httpAgent: agent,
            headers: { 'authorization': `Token ${authToken}` }
        });

        if (!planResponse.data || !planResponse.data.results || planResponse.data.results.length === 0) {
            throw new Error("Plan aktif tidak ditemukan.");
        }

        const planId = planResponse.data.results[0].id;
        log.success(`Mendapatkan Plan ID: ${planId}`);

        await new Promise(resolve => setTimeout(resolve, 4000));

        log.process("Mengambil kredensial proxy residential...");
        const proxyResponse = await axios.get(`https://proxy.webshare.io/api/v3/proxy/list/status?plan_id=${planId}`, {
            httpsAgent: agent,
            httpAgent: agent,
            headers: { 'authorization': `Token ${authToken}` }
        });

        if (proxyResponse.data && proxyResponse.data.username && proxyResponse.data.password) {
            const { username, password } = proxyResponse.data;
            const formattedProxy = `http://${username}-rotate:${password}@p.webshare.io:80`;
            
            log.success(`Kredensial Didapat: ${username} | ${password}`);
            
            fs.appendFileSync('config.txt', `${formattedProxy}\n`, 'utf-8');
            log.success(`Sukses menyuntikkan proxy baru ke config.txt: ${formattedProxy}`);
            return true; 
        }
        throw new Error("Kredensial username/password kosong dari API.");
    } catch (error) {
        const errorDetail = error.response ? JSON.stringify(error.response.data) : error.message;
        log.error("Gagal mengekstrak data proxy dari API internal.", errorDetail);
        return false;
    }
}

async function executeSingleAPICycle(currentCount, customPassword, proxyUrl) {
    const targetEmail = `${getRandomString(8)}${EMAIL_DOMAIN}`;
    let agent = null;

    if (proxyUrl) {
        log.info(`Menggunakan Jalur Proxy Jaringan: ${proxyUrl.split('@')[1] || proxyUrl}`);
        agent = new HttpsProxyAgent(proxyUrl);
        agent.on('error', () => {});
    } else {
        log.info("Berjalan tanpa proxy (Menggunakan IP Publik Lokal/VPS)...");
    }

    const captchaToken = await solveCaptcha();
    if (!captchaToken) return false;

    const authToken = await registerViaAPI(targetEmail, customPassword, captchaToken, agent);
    if (!authToken) return false;

    const isSuccessExtract = await extractProxyCredentials(authToken, agent);
    return isSuccessExtract;
}

async function startEngine(count, customPassword, useProxy) {
    log.info(`Mesin dijalankan (API Mode). Target: ${count} proxy residential...\n`);
    
    let currentAccount = 1;
    let proxyIndex = 0;

    while (currentAccount <= count) {
        let proxyCandidate = null;

        if (useProxy) {
            const activeProxies = loadConfigProxies();
            if (activeProxies.length > 0) {
                proxyCandidate = activeProxies[proxyIndex % activeProxies.length];
                proxyIndex++;
            } else {
                log.error("Opsi proxy aktif, tetapi data di config.txt kosong! Berjalan tanpa proxy...");
            }
        }
        
        log.info(`➔ Memulai proses pengerjaan untuk Slot Akun ke-${currentAccount}`);
        const isCycleSuccess = await executeSingleAPICycle(currentAccount, customPassword, proxyCandidate);
        
        if (isCycleSuccess) {
            log.success(`Slot Akun ke-${currentAccount} selesai diproses dengan sukses.\n`);
            currentAccount++; 
        } else {
            log.error(`Slot Akun ke-${currentAccount} gagal! Mengulang kembali slot ke-${currentAccount}...\n`);
        }

        if (currentAccount <= count && isCycleSuccess) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    log.success(`\n🎉 Seluruh target terpenuhi! Total ${count} proxy residential baru telah ditambahkan.`);
}

(async function main() {
    displayBanner();
    
    const useProxyOpt = await confirm({ message: "Apakah Anda ingin menggunakan daftar proxy dari config.txt?", default: true });
    const inputPassword = await input({ message: "Masukkan Format Password akun:", default: "Paizutempest123!" });
    const jumlahAkun = await input({ message: "Berapa akun yang ingin Anda buat?", default: "1" });
    
    const parsedCount = parseInt(jumlahAkun);
    if (isNaN(parsedCount) || parsedCount <= 0) {
        log.error("Jumlah pembuatan akun tidak valid!");
        process.exit(1);
    }
    
    console.log("");
    await startEngine(parsedCount, inputPassword, useProxyOpt);
})();
