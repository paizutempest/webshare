# ⚡ Webshare Auto Reg & Proxy Injector

<p align="center">
  <img src="https://img.shields.io/github/stars/paizutempest/webshare?style=for-the-badge&color=00FF88" alt="Stars">
  <img src="https://img.shields.io/github/forks/paizutempest/webshare?style=for-the-badge&color=0099FF" alt="Forks">
  <img src="https://img.shields.io/github/license/paizutempest/webshare?style=for-the-badge&color=7000FF" alt="License">
</p>

<p align="center">
  <b>Script bot sat-set</b> buat bikin akun Webshare otomatis, bypass reCAPTCHA Enterprise pake CapSolver / 2Captcha, terus langsung nyomot proxy residential-nya tanpa ribet. Tinggal bikin, duduk manis, proxy langsung masuk <code>config.txt</code>! ❤️
</p>

---

## 🚀 Fitur Kece

* ❤️ **Dual Engine Captcha Solver:** Bebas pilih mau pake CapSolver atau 2Captcha langsung dari terminal.
* 💖 **Dual Mode Super Kenceng:** Bisa jalan full HTTP Request (API Mode, hemat RAM tanpa browser) atau pake Playwright kalo butuh pantau network.
* 💕 **Auto Retry Anti-Gagal:** Slot antrean gak bakal hilang. Kalo pas tengah jalan ada error, bot bakal otomatis ngulang di slot yang sama sampe dapet.
* 💗 **Rotasi Network Pintar:** Lalu lintas jaringan otomatis gantian pake proxy bersih dari `config.txt` biar gak gampang kena rate limit.
* ❤️ **Auto Inject Proxy:** Langsung narik `plan_id` aktif abis daftar, di-format jadi kredensial `-rotate`, terus otomatis disuntik masuk ke file `config.txt` lokal lo.

---

## 🛠️ Tech Stack & Sesajen

Bikinnya full pake Vanilla JavaScript biar kenceng, ringan, dan gak banyak gaya di Node.js:

* **Runtime:** Node.js (v18+)
* **HTTP Client:** [Axios](https://github.com/axios/axios)
* **Automation:** [Playwright](https://playwright.dev/)
* **Captcha Solver:** CapSolver API & 2Captcha API
* **Tampilan Terminal:** `chalk`, `dayjs`, `gradient-string`, `@inquirer/prompts`

---

## 📋 Cara Pasang & Gas

1. **Clone repo ini:**
   ```bash
   git clone [https://github.com/paizutempest/webshare.git](https://github.com/paizutempest/webshare.git)
   cd webshare
