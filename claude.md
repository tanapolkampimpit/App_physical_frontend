# Claude Project Guide: App Kayapat

เอกสารอ้างอิงสำหรับ Claude ในการทำงานกับโปรเจกต์ App Kayapat

---

## Project Overview

| ข้อมูล | รายละเอียด |
|-------|----------|
| **ชื่อโปรเจกต์** | App Kayapat (กายภาพ) |
| **ประเภท** | Web Application สำหรับการจัดการ/บริการกายภาพบำบัด |
| **Framework** | React 19 + Vite + Tailwind CSS v4 |
| **Status** | ระหว่างพัฒนา Infrastructure & UI/UX |

---

## Tech Stack

- **Framework:** React 19 (Functional Components เท่านั้น)
- **Build Tool:** Vite 8+
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`)
- **Routing:** React Router 7
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **HTTP:** Axios
- **Infrastructure:** Docker & Docker Compose (Hot Reload ใน Dev)

---

## Folder Structure

```
src/
├── assets/              # รูปภาพ, ฟอนต์, static assets
├── components/
│   ├── ui/              # Base components (Button, Input, Card)
│   └── features/        # Feature-specific components
├── lib/
│   └── utils.js         # cn() utility, helpers
├── pages/               # Page Components (ผูกกับ React Router)
├── hooks/               # Custom Hooks
├── App.jsx              # Main Routes & Layout
├── index.css            # Global styles + Tailwind Directives
└── main.jsx             # Entry point
```

**Out of Scope:** `node_modules/`, `dist/`, backend, database

---

## Coding Rules

### UI/UX
- **DO:** ใช้ Tailwind classes, cn() utility, framer-motion ในการเปลี่ยนสถานะ, mobile-first, lucide-react icons
- **DON'T:** เขียน raw CSS (ยกเว้น global), ใช้ hex colors ตรงๆ (ใช้ HSL/Tailwind tokens), class-based components, inline styles
- **ห้ามใส่ emoji ในโค้ด, UI, comments, หรือ documentation ทุกกรณี** ถ้าต้องการ icon ให้ใช้ lucide-react เท่านั้น

### React 19
- Functional components + arrow function syntax เท่านั้น
- Destructure props ใน function signature
- ใช้ **Named exports** (ไม่ใช้ default export)
- ใช้ Optional chaining (`?.`) และ Nullish coalescing (`??`)
- ห้ามเรียก Hooks ใน conditional

### Tailwind CSS v4
- Utility-first เสมอ
- ใช้ `cn()` จาก `@/lib/utils` สำหรับ conditional classes
- ใช้ HSL หรือ Tailwind color tokens เท่านั้น

### API & Error Handling
- ใช้ Axios พร้อม try-catch ทุกครั้ง
- แจ้งเตือนผู้ใช้เมื่อเกิด error
- เข้าถึง env ผ่าน `import.meta.env.VITE_*`

### Naming
- `PascalCase` สำหรับ Components
- `camelCase` สำหรับ utilities/hooks
- หนึ่งคอมโพเนนต์ต่อหนึ่งไฟล์

---

## Code Templates

### Component
```jsx
import { motion } from 'framer-motion';
import { IconName } from 'lucide-react';
import { cn } from '@/lib/utils';

export const MyComponent = ({ isActive = false, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn("base-styles", isActive && "active-styles", className)}
    >
      <IconName size={20} />
      <p>Content</p>
    </motion.div>
  );
};
```

### API Call
```jsx
import axios from 'axios';

const fetchData = async () => {
  try {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/endpoint`);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    // แจ้งเตือนผู้ใช้
    throw error;
  }
};
```

### Conditional Classes
```jsx
<div className={cn(
  "p-4 rounded-lg bg-white",
  isActive && "ring-2 ring-blue-500",
  isBig && "p-8"
)} />
```

---

## Commands

```bash
# Local development
npm run dev

# Docker development (แนะนำ)
docker-compose up dev

# Production build
npm run build
```

**สำคัญ:** เพิ่ม npm package ใหม่ ต้อง `docker-compose build` ใหม่เสมอ

---

## Communication

- สื่อสารและเขียน comment เป็นภาษาไทยได้
- คำนึงถึงโครงสร้างปัจจุบันและ Tech Stack เสมอ
- ถามก่อนทำสิ่งที่ไม่แน่ใจ