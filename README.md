# 🛡️ **SEKUR** : OWASP & Web Security Interactive Learning Platform

An interactive, web-based educational platform designed to teach users about common web security vulnerabilities through a mix of theory, quizzes, and **hands-on simulated challenges**.

---

## 🎯 Project Goal

This platform aims to provide beginners and students with **practical cybersecurity knowledge** by explaining common web attacks, demonstrating how they work, and **allowing users to exploit intentionally vulnerable challenges in a safe environment**. 

---

## 🧩 Key Features

- 📚 Educational content on major web vulnerabilities  
- ❓ Comprehension quizzes for each topic  
- 🧪 Simulated hands-on challenges unlocked after quiz completion  
- ⚙️ Built with Nest.js backend, PostgreSQL & SQLite database, HTML/CSS/JS frontend  

---

## 📋 Vulnerabilities Planned To Be Covered

### OWASP Top 10 Vulnerabilities (2021)

1. Injection (SQL Injection) [A03:2021]  
2. Broken Access Control (IDOR) [A01:2021]  
3. Identification and Authentication Failures [A07:2021]  
4. Cross-Site Scripting (XSS) [A03:2021 / Previous versions]  
5. Security Misconfiguration [A05:2021]  
6. Cryptographic Failures [A02:2021]  
7. Insecure Design [A04:2021]  
8. Vulnerable and Outdated Components [A06:2021]  
9. Software and Data Integrity Failures [A08:2021]  
10. Security Logging and Monitoring Failures [A09:2021]  
11. Server-Side Request Forgery (SSRF) [A10:2021]  

### Additional Web Attacks

12. Cross-Site Request Forgery (CSRF)  
13. Open Redirect  
14. Clickjacking  


> ⚠️ Only a subset of these will have working simulation challenges in the **initial release** 
---

## 🌟 What Makes SEKUR Different

- **Simplicity and Clarity:** Our content breaks down complex cybersecurity concepts into easy-to-understand explanations, making it beginner-friendly.  
- **User-Friendly Experience:** The platform combines learning and practice seamlessly, unlocking challenges only after users demonstrate understanding via quizzes.  
 - **Localized Accessibility:** We plan to provide educational materials in **Amharic and other Ethiopian local languages** to make cybersecurity education accessible to a broader audience.  (Future Plan)
 - **Focused on Practical Skills:** Unlike many platforms that focus solely on theory, SEKUR emphasizes hands-on simulations of real-world vulnerabilities in a safe environment.  
 - **Open and Expandable:** Designed to grow with community contributions and feature additions like supporting local languages, leaderboards, and certificates. 

---

## 🚀 Future Plans

- Add challenge pages for all OWASP Top 10
- User accounts with saved progress
- Scoreboard and leaderboard
 - Optional integrations (chat, feedback) may be added later
- Certificates/badges for completion
- **Localization of educational content in Amharic and other Ethiopian local languages** 

---

## 👨‍💻 Contributors

This project was developed by **Group 18** from the **Cybersecurity Department**  
as part of the **INSA Summer Camp 2017 EC**.  
We are passionate about making security education accessible, practical, and hands-on.

**Team Members:**

- Abiy Hailu Getachew  
- Bonsan Fuad Muhammed  
- Akin Debebe Gebremeskel  
- Doftore Leta Goshu  
- Jerusalem Tsega Fida  

---

## 📂 Project Structure

```
project-root/
├── app/                         # Backend code (Node.js)
│   ├── routes/                  # HTTP route handlers
│   ├── templates/               # HTML templates for frontend
│   ├── static/                  # CSS, JavaScript files
│   ├── challenges/              # Vulnerable challenge pages
│   └── database/                # Database files and models
├── content/                     # Educational material and quizzes
├── README.md                    # Project documentation
├── LICENSE                      # Project license file (MIT)
└── index.js                     # Backend entry point
```

---

## ⚠️ Disclaimer

This project is for educational purposes only. Simulated challenges contain intentional vulnerabilities and should never be deployed publicly without proper isolation.

---

## 🧾 License

***MIT License — free to use, modify, and share. See [LICENSE](./LICENSE) file for details.***

