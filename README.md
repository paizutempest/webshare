# ⚡ Webshare Account Creator & Proxy Extractor

<p align="center">
  <img src="https://img.shields.io/github/stars/paizutempest/webshare?style=for-the-badge&color=00FF88" alt="Stars">
  <img src="https://img.shields.io/github/forks/paizutempest/webshare?style=for-the-badge&color=0099FF" alt="Forks">
  <img src="https://img.shields.io/github/license/paizutempest/webshare?style=for-the-badge&color=7000FF" alt="License">
</p>

<p align="center">
  <b>Automated HTTP Radar Engine</b> designed to generate accounts, bypass reCAPTCHA Enterprise via Capsolver, and seamlessly inject newly formatted residential backconnect proxies directly into a local configuration layout.
</p>

---

## 🚀 Key Features

* **Dual Operational Modes:** Supports pure HTTP request handling (No-Browser API mode) for high efficiency, alongside advanced Playwright network interception.
* **Smart Failover Retry:** Zero-drop slot queue control. If a cycle fails mid-way, the script automatically retries the exact same instance until completion.
* **Adaptive Network Routing:** Dynamically rotates outbound traffic using clean active residential lines parsed line-by-line from your `config.txt`.
* **Instant Extraction:** Fetches active `plan_id` objects instantly upon registration, formats credentials using the standard `-rotate` template, and dumps them into the active pool.

---

## 🛠️ Stack & Dependencies

The core environment relies completely on a modern vanilla JavaScript architecture managed under Node.js:

* **Runtime:** Node.js (v18+)
* **HTTP Client:** [Axios](https://github.com/axios/axios)
* **Automation Interface:** [Playwright](https://playwright.dev/)
* **Captcha Handler:** [Capsolver API SDK](https://www.capsolver.com/)
* **UI & Logging:** `chalk`, `dayjs`, `gradient-string`, `@inquirer/prompts`

---

## 📋 Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/paizutempest/webshare.git](https://github.com/paizutempest/webshare.git)
   cd webshare
