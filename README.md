# ⚔️ SkillHunter: The Gamified Career Ecosystem

> **"Where Leveling Up in Life Feels Like Leveling Up in a Game."**

[![Unity](https://img.shields.io/badge/Unity-2022.3%2B-black?style=for-the-badge&logo=unity)](https://unity.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Supported-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](https://github.com/yourusername/skillhunter)
[![Status](https://img.shields.io/badge/Status-Beta-blue?style=for-the-badge)]()

## 🎮 About The Project

**SkillHunter** is a revolutionary mobile RPG that bridges the gap between education and employment. It transforms the tedious process of job hunting into an immersive open-world experience where:
* **Jobs** are Boss Monsters 👹
* **Skills** are Ammunition 🔫
* **Interviews** are Boss Battles ⚔️
* **Your Career** is the Ultimate Quest 🏆

We are solving the "Skills Gap" and "Career Boredom" crisis by replacing scrollable job boards with a Cyberpunk-styled **"City of Opportunity"**.

### 🌟 Key Features
* **🤖 AI Companion & Mentor:** A fully animated 3D AI drone that uses NLP to guide students, build profiles via dialogue, and act as a co-op teammate.
* **🔫 Skill-Based Combat:** The "Scanner Gun" mechanic. You can't defeat a "Data Scientist NPC" without "Python Ammo" (verified course completion).
* **🏙️ Open World Metropolis:** Explore corporate towers (Jobs), academies (Courses), and guild halls (Community) in a high-fidelity 3D environment.
* **🔥 The "Boss Fight" Interview:** Interactive challenges that simulate real-world technical interviews. Win the battle to get the Offer Letter.
* **📊 Real-Time Market Data:** Powered by Kaggle & LinkedIn datasets, ensuring every "Enemy" has realistic stats (Salary, Skill Requirements).

---

## 🛠️ Tech Stack

This project is built using industry-standard game development and cloud technologies.

* **Game Engine:** [Unity 3D](https://unity.com/) (C#) - *For immersive physics and rendering.*
* **Backend:** [Google Firebase](https://firebase.google.com/)
    * **Auth:** Google Sign-In for secure student onboarding.
    * **Firestore:** Storing User XP, Inventory, and World State.
    * **Cloud Functions:** Serverless validation of "Boss Kills" (Course Completion).
* **AI Integration:** OpenAI API / Custom LLM Wrapper - *For dynamic NPC dialogue.*
* **Data Pipeline:** Python (Pandas) - *Processing Job Skill Datasets.*

---

## 📂 Project Structure

```text
SkillHunter/
├── Assets/
│   ├── Scripts/          # C# Game Logic (PlayerController, EnemyAI, FirebaseManager)
│   ├── Prefabs/          # 3D Assets (ScannerGun, AI_Drone, Job_NPCs)
│   ├── Scenes/           # Unity Scenes (MainMenu, CityHub, BossArena)
│   └── Animations/       # Player and UI Animations
├── Data/                 # Parsed CSVs (Job_Skill_Set.csv)
├── Firebase/             # Security Rules and Cloud Functions
└── README.md
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1kIm_mXLxzlcBoKuj_no0X-1IwzQVwlsL

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
