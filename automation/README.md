# 🤖 LPC Facebook AI Quiz & MCQ Automation Bot

LPC Language Portal-এর জন্য তৈরি সম্পূর্ণ স্বয়ংক্রিয় AI কুইজ পোস্টিং সিস্টেম। এটি আপনার ওয়েবসাইটের কারিকুলাম (Google Drive PDF এবং `courseData.js` কুইজ পুল) ব্যবহার করে প্রতিদিন ৩টি চমৎকার MCQ ফেসবুকে পোস্ট করে এবং ঠিক ২ ঘণ্টা পর প্রতিটি পোস্টের কমেন্টে সঠিক উত্তর ও ব্যাখ্যা জানিয়ে দেয়।

---

## ⏰ দৈনিক রুটিন (Schedule)

| সময় (বাংলাদেশ সময়) | ইভেন্ট | বিস্তারিত |
| :--- | :--- | :--- |
| **সকাল ১০:০০ টা** | ❓ **প্রশ্ন ১ পোস্ট** | গ্রুপের ওয়ালে ১ম MCQ প্রশ্ন |
| **দুপুর ১২:০০ টা** | 🎯 **উত্তর ১ কমেন্ট** | ২ ঘণ্টা পর ১ম প্রশ্নের কমেন্টে উত্তর ও ব্যাখ্যা |
| **দুপুর ০২:০০ টা** | ❓ **প্রশ্ন ২ পোস্ট** | গ্রুপের ওয়ালে ২য় MCQ প্রশ্ন |
| **বিকাল ০৪:০০ টা** | 🎯 **উত্তর ২ কমেন্ট** | ২ ঘণ্টা পর ২য় প্রশ্নের কমেন্টে উত্তর ও ব্যাখ্যা |
| **সন্ধ্যা ০৬:০০ টা** | ❓ **প্রশ্ন ৩ পোস্ট** | গ্রুপের ওয়ালে ৩য় MCQ প্রশ্ন |
| **রাত ০৮:০০ টা** | 🎯 **উত্তর ৩ কমেন্ট** | ২ ঘণ্টা পর ৩য় প্রশ্নের কমেন্টে উত্তর ও পরবর্তী দিনের আপডেট |

---

## 🧠 এটি কীভাবে কাজ করে? (Dual-Mode Intelligence)

1. **PDF এর দিন (Day 1, 3, 5...):**
   * Google Drive শেয়ারিং লিঙ্ক থেকে PDF সরাসরি ডাউনলোড/রিড করে।
   * **Gemini 1.5 Flash AI** পুরো লেকচারটি পড়ে ৩টি নতুন, সোশ্যাল মিডিয়া উপযোগী প্রশ্ন তৈরি করে।
2. **MCQ এর দিন (Day 2, 4, 6...):**
   * `courseData.js` থেকে ওই দিনের ১০টি প্রশ্ন লোড করে।
   * **Gemini AI** প্রশ্নগুলো বিশ্লেষণ করে সবচেয়ে বেশি ট্রিকি, কঠিন ও শিক্ষার্থীরা যেগুলোতে বেশি ভুল করে এমন **টপ ৩টি প্রশ্ন** নির্বাচন করে।

---

## 🔑 প্রয়োজনীয় কনফিগারেশন (API Keys & Secrets)

এই সিস্টেমটি সম্পূর্ণ ফ্রিতে চালানোর জন্য নিচের ৩টি সিক্রেট ভ্যালু প্রয়োজন:

### ১. Google Gemini API Key (১০০% ফ্রি)
1. [Google AI Studio](https://aistudio.google.com/app/apikey)-তে যান।
2. আপনার গুগল অ্যাকাউন্ট দিয়ে লগইন করে **"Create API key"**-এ ক্লিক করুন।
3. কী (Key) কপি করুন।

### ২. Facebook Access Token & Target ID
1. [developers.facebook.com](https://developers.facebook.com)-এ যান এবং একটি App তৈরি করুন।
2. Graph API Explorer-এ গিয়ে আপনার Facebook Page সিলেক্ট করুন এবং `pages_manage_posts`, `pages_read_engagement` পারমিশন নিয়ে **Generate Access Token** ক্লিক করুন।
3. আপনার পেজ বা পেজ-লিঙ্কড গ্রুপের আইডি সংগ্রহ করুন (যেমন: `123456789012345`)।

---

## 🚀 GitHub Actions-এ যেভাবে চালু করবেন (No Server Needed!)

আপনার গিটহাব রিপোজিটরিতে ৩টি সিক্রেট যোগ করে দিলেই প্রতিদিন নিজে থেকেই এটি চলতে থাকবে:

1. আপনার GitHub রিপোজিটরিতে যান ➔ **Settings** ➔ **Secrets and variables** ➔ **Actions**।
2. **New repository secret**-এ ক্লিক করে নিচের ৩টি সিক্রেট যোগ করুন:
   * `GEMINI_API_KEY`: আপনার জেমিনি এপিআই কি।
   * `FB_ACCESS_TOKEN`: আপনার ফেসবুক পেজ অ্যাক্সেস টোকেন।
   * `FB_TARGET_ID`: আপনার ফেসবুক গ্রুপ বা পেজের আইডি।
3. ব্যাস! প্রতিদিন সকাল ১০টা থেকে রাত ৮টা পর্যন্ত GitHub Actions নিজে থেকেই চালু হবে এবং পোস্ট করবে।
4. চাইলে **Actions** ট্যাবে গিয়ে `Daily Facebook AI Quiz & MCQ Poster` সিলেক্ট করে **Run workflow** দিয়ে যেকোনো সময় ম্যানুয়ালিও টেস্ট রান করতে পারেন।

---

## 💻 লোকাল মেশিনে টেস্ট করার নিয়ম (Dry Run)

ফেসবুকে কোনো কিছু পোস্ট না করে আপনার কম্পিউটারে সবকিছু টেস্ট করার জন্য:

```bash
# ডিপেন্ডেন্সি ইন্সটল
pip install -r automation/requirements.txt

# আরবি (Arabic) ডে ২ এর ১ম প্রশ্ন টেস্ট করুন (Dry Run)
python3 automation/daily_bot.py --test --subject arabic --day 2 --action post_question --slot 1

# আরবি (Arabic) ডে ২ এর ২ ঘণ্টা পরের উত্তর কমেন্ট টেস্ট করুন
python3 automation/daily_bot.py --test --subject arabic --day 2 --action post_answer --slot 1

# আরবি (Arabic) ডে ১ এর লেকচার ও ভোকাবুলারি প্রশ্ন টেস্ট করুন
python3 automation/daily_bot.py --test --subject arabic --day 1 --action post_question --slot 1

# ইংরেজি (English) কোর্স টেস্ট করতে চাইলে --subject english ব্যবহার করুন:
python3 automation/daily_bot.py --test --subject english --day 2 --action post_question --slot 1
```

---

## 📁 ফাইল স্ট্রাকচার

* `daily_bot.py`: প্রধান এক্সিকিউশন ফাইল।
* `ai_service.py`: Google Gemini API হ্যান্ডলার (প্রশ্ন তৈরি ও কঠিন প্রশ্ন বাছাই)।
* `course_data_reader.py`: `courseData.js` ও কারিকুলাম রিডার।
* `drive_reader.py`: Google Drive PDF ডাউনলোডার ও পার্সার।
* `fb_service.py`: মেটা ফেসবুক Graph API ও পোস্ট/কমেন্ট ফরম্যাটার।
* `state_manager.py`: কোন দিন ও কোন স্লট চলছে তা `state.json`-এ ট্র্যাক করে।
* `.github/workflows/daily_fb_quiz.yml`: স্বয়ংক্রিয় শিডিউলার।
