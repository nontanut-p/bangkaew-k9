import type { Content } from "./types";

export const th: Content = {
  locale: "th",
  metadata: {
    title: "บางแก้ว K9 | Agentic Cybersecurity Guard Platform",
    description:
      "แพลตฟอร์ม Agentic Cybersecurity ที่ช่วยตรวจจับ วิเคราะห์ แนะนำการตอบโต้ และสร้างรายงานเหตุการณ์จาก Wazuh, Shuffle, Kali และ AI Agent",
  },
  nav: {
    links: [
      { href: "#problem", label: "ปัญหา" },
      { href: "#solution", label: "โซลูชัน" },
      { href: "#story", label: "วิธีทำงาน" },
      { href: "#pack", label: "ฝูง K9" },
      { href: "#features", label: "ฟีเจอร์" },
      { href: "#tech", label: "Tech Stack" },
    ],
    requestDemo: "ขอ Demo",
    langSwitch: "EN",
    langSwitchTarget: "en",
  },
  hero: {
    badge: "🐕 Agentic Cybersecurity Guard Platform",
    title: "บางแก้ว",
    titleHighlight: "K9",
    subtitle: "หมาเฝ้าระบบไซเบอร์อัจฉริยะสำหรับองค์กรยุค AI",
    description:
      "แพลตฟอร์ม Agentic Cybersecurity ที่ช่วยตรวจจับ วิเคราะห์ แนะนำการตอบโต้ และสร้างรายงานเหตุการณ์จาก Wazuh, Shuffle, Kali และ AI Agent ในหน้าเดียว",
    ctaPrimary: "ดูวิธีการทำงาน",
    ctaSecondary: "ขอ Demo",
    imageAlt: "บางแก้ว K9 — หมาเฝ้าระบบไซเบอร์อัจฉริยะ",
    alerts: [
      { title: "Brute Force Detected", severity: "high" },
      { title: "AI Triage: Critical", severity: "medium" },
      { title: "Playbook Ready", severity: "low" },
    ],
    trustBadges: [
      "1-Click Deploy",
      "Human-in-the-loop",
      "Open-source Stack",
    ],
  },
  problem: {
    badge: "ปัญหาที่พบบ่อย",
    title: "เครื่องมือ Security มีเยอะ แต่คนใช้งานจริงกลับเหนื่อยกว่าเดิม",
    items: [
      {
        icon: "🔔",
        title: "Alert เยอะเกินไป",
        description:
          "ไม่รู้ว่าอะไรสำคัญจริง — ทีมเหนื่อยกับ noise มากกว่า threat",
      },
      {
        icon: "📋",
        title: "Log อ่านยาก",
        description:
          "ต้องใช้ผู้เชี่ยวชาญในการตีความ คนใหม่เข้ามาแทบทำไม่ได้",
      },
      {
        icon: "⏱️",
        title: "ตอบสนองช้า",
        description:
          "ต้องเปิดหลายระบบ สลับหน้าจอ กว่าจะรู้ว่าเกิดอะไรขึ้นเสียเวลาไปมาก",
      },
      {
        icon: "⚠️",
        title: "Automation เสี่ยง",
        description:
          "ถ้าสั่งผิดอาจกระทบทั้งองค์กร — block ผิด IP หรือ isolate server สำคัญ",
      },
      {
        icon: "📊",
        title: "ผู้บริหารไม่เข้าใจ",
        description:
          "รายงาน technical เกินไป ไม่รู้ว่าความเสี่ยงจริงคืออะไร",
      },
    ],
  },
  solution: {
    badge: "โซลูชัน",
    title:
      "บางแก้ว K9 เปลี่ยน Security Operation ให้เข้าใจง่ายเหมือนมีหมาเฝ้าบ้านดิจิทัล",
    bodyBefore: "ระบบไม่ได้มาแทนที่เครื่องมือ Security เดิม แต่ทำหน้าที่เป็น",
    highlight: "สมองกลางและ UX layer",
    bodyAfter:
      "ที่เชื่อม Wazuh, Shuffle, Kali และ AI Agent เข้าด้วยกัน เพื่อให้ทีม IT เข้าใจเหตุการณ์ ตัดสินใจ และตอบสนองได้เร็วขึ้น",
    metaphors: [
      { role: "บ้านดิจิทัล", icon: "🏠", desc: "ระบบและ server ขององค์กร" },
      { role: "หมาป่า", icon: "🐺", desc: "ภัยคุกคามและผู้บุกรุก" },
      {
        role: "หมาเฝ้า",
        icon: "🐕",
        desc: "บางแก้ว K9 ที่เฝ้าระวังตลอด 24/7",
      },
    ],
  },
  story: {
    badge: "How It Works",
    title: "จากศูนย์สู่บ้านดิจิทัลที่มีหมาเฝ้า — เลื่อนอ่านเรื่องราวได้เลย",
    description:
      "สมมติองค์กรคุณมีคอมพิวเตอร์ 10 เครื่อง — server, laptop ทีม IT, PC ผู้บริหาร นี่คือสิ่งที่เกิดขึ้นตั้งแต่กด Deploy จนถึงวันที่เจอภัยคุกคามจริง",
    deployHighlight: "1-Click Deploy the Whole Pack",
    deploySub:
      "ติดตั้ง Wazuh agent, เชื่อม Shuffle, เปิด AI layer, ผูก GitHub และ dashboard — ทั้งฝูงพร้อมทำงานในคำสั่งเดียว ไม่ต้อง setup ทีละเครื่อง ไม่ต้องเปิดห้า dashboard",
    chapters: [
      {
        chapter: "บทที่ 1",
        timing: "วันที่ 1 — 5 นาที",
        title: "Deploy ทั้งฝูงครั้งเดียว",
        narrative:
          "ทีม IT เปิด Bangkaew K9 แล้วกด Deploy — ระบบส่ง agent ไปติดตั้งทุกเครื่องในองค์กรอัตโนมัติ",
        bullets: [
          "Server 2 เครื่อง, Laptop ทีม IT 5 เครื่อง, PC สำนักงาน 3 เครื่อง — รวม 10 endpoints",
          "Agent Shepherd (Wazuh) ลงทุกเครื่อง พร้อมส่ง log กลับศูนย์กลาง",
          "Agent Collie (Shuffle) เชื่อม playbook พื้นฐาน — แจ้งเตือน, เปิด ticket",
          "Agent Bangkaew (AI) พร้อมวิเคราะห์ — รอ event เข้ามา",
          "Agent Retriever ผูก GitHub + scan code baseline (Semgrep, Trivy, Gitleaks) ทุก repo",
        ],
        agents: ["Shepherd", "Collie", "Bangkaew", "Retriever"],
        icon: "🚀",
      },
      {
        chapter: "บทที่ 2",
        timing: "ภายใน 30 นาที",
        title: "เมื่อไหร่ถึงจะ 'ปลอดภัย'",
        narrative:
          "Dashboard แสดงสถานะ endpoint ทีละเครื่อง — เขียว = online และส่ง log แล้ว เหลือง = กำลัง sync แดง = ต้องตรวจ",
        bullets: [
          "เมื่อ endpoint ครบ 10/10 และ baseline สร้างเสร็จ = บ้านดิจิทัลพร้อมเฝ้า",
          "Agent Shepherd เริ่ม 'จำ' พฤติกรรมปกติของแต่ละเครื่อง — login ช่วงไหน, process อะไรรันปกติ",
          "ยังไม่มีเหตุการณ์ แต่ระบบพร้อมแล้ว — ทีม IT ดู dashboard หน้าเดียว ไม่ต้อง SSH ทีละเครื่อง",
        ],
        agents: ["Shepherd"],
        icon: "🛡️",
      },
      {
        chapter: "บทที่ 3",
        timing: "02:14 น. — มีคนพยายามบุก",
        title: "เจอเหตุการณ์ — ใครทำอะไร",
        narrative:
          "Shepherd ตรวจจับ login ผิดปกติจาก IP ต่างประเทศ บน PC ผู้บริหาร — เห่าเตือนทันที",
        bullets: [
          "Agent Shepherd → ส่ง alert: Brute Force Detected, Severity High",
          "Agent Bangkaew → รวม alert ที่เกี่ยวข้อง, จัด severity Critical, สรุปเป็นภาษาไทย",
          "ทีม IT เปิดหน้าเดียว เห็นทั้งเหตุการณ์ — ไม่ต้องเปิด Wazuh, ไม่ต้องอ่าน raw log",
          "ผู้บริหารเห็น summary สั้นๆ: 'มีคนพยายาม login PC คุณจากต่างประเทศ'",
        ],
        agents: ["Shepherd", "Bangkaew"],
        icon: "🔔",
      },
      {
        chapter: "บทที่ 4",
        timing: "02:18 น. — 4 นาทีต่อมา",
        title: "ตอบโต้อย่างปลอดภัย — มนุษย์ตัดสินใจ",
        narrative:
          "Bangkaew แนะนำ 3 action พร้อมเหตุผล — แต่จะไม่ทำเองจนกว่าคุณจะกด Approve",
        bullets: [
          "แนะนำ: Block IP + แจ้ง admin ทาง LINE/Email + Isolate host ชั่วคราว",
          "ทีม IT กด Approve 2 จาก 3 — Block IP และแจ้ง admin",
          "Agent Collie รัน Shuffle playbook ทันที — block IP, ส่งแจ้งเตือน, บันทึก ticket",
          "ทุก decision ถูก audit log — ตรวจสอบย้อนหลังได้ว่าใครอนุมัติอะไร เมื่อไหร่",
        ],
        agents: ["Bangkaew", "Collie"],
        icon: "✅",
      },
      {
        chapter: "บทที่ 5",
        timing: "สัปดาห์ถัดไป",
        title: "ทดสอบว่าระบบป้องกันได้จริง",
        narrative:
          "Agent Pitbull จำลองการโจมตีแบบเดียวกันอีกครั้ง — ทดสอบว่า Shepherd ตรวจจับได้และ Collie ตอบได้เร็วแค่ไหน",
        bullets: [
          "Pitbull (Kali/Caldera) รัน attack simulation ตาม MITRE ATT&CK",
          "ได้ scorecard: Detect ได้ใน 12 วินาที, Response ใน 3 นาที — ดีขึ้นจากครั้งก่อน",
          "รายงานส่งให้ผู้บริหาร — ภาษาคน ไม่ใช่ technical dump",
        ],
        agents: ["Pitbull", "Shepherd", "Collie"],
        icon: "⚔️",
      },
      {
        chapter: "บทที่ 6",
        timing: "หลัง incident — CVE ใน production",
        title: "ซ่อมโค้ด เปิด PR แล้ว redeploy",
        narrative:
          "Shepherd ตรวจพบ CVE ใน container ที่รันอยู่ — Bangkaew แนะนำ patch → Retriever รับงานซ่อม",
        bullets: [
          "Retriever scan repo ที่เกี่ยวข้อง — หา dependency และไฟล์ที่มีช่องโหว่",
          "LLM ที่ลูกค้าเลือก (Claude, Codex, DeepSeek, GLM ฯลฯ) สร้าง patch ตามผล scan",
          "เปิด PR พร้อม scan report + คำอธิบายภาษาคน — ไม่ push ตรง main",
          "ทีม IT review + merge → scan ซ้ำผ่าน → Collie trigger redeploy server",
        ],
        agents: ["Retriever", "Bangkaew", "Collie"],
        icon: "🔧",
      },
    ],
  },
  pack: {
    badge: "The Pack",
    title: "รู้จักฝูง K9 ที่เพิ่งเล่าให้ฟัง",
    description:
      "นี่คือ Agent แต่ละตัวที่ทำงานในเรื่องราว — แต่ละสมาชิกมีบทบาทชัดเจน ทำงานร่วมกันเพื่อปกป้องบ้านดิจิทัลของคุณ",
    agentPrefix: "Agent",
    poweredBy: "ขับเคลื่อนด้วย",
    members: [
      {
        role: "Watchdog",
        agentName: "Shepherd",
        breed: "German Shepherd",
        tool: "Wazuh",
        image: "/pack/shepherd.png",
        imageAlt: "Agent Shepherd — German Shepherd Watchdog ขับเคลื่อนด้วย Wazuh",
        color: "from-blue-500 to-cyan-500",
        borderColor: "border-blue-500/30",
        description:
          "หมาเฝ้าที่เห่าเตือนเมื่อมีอะไรผิดปกติ — Shepherd ของฝูงแกะ คอยเฝ้าระวัง endpoint และ log",
        features: [
          "ตรวจจับ endpoint, server, log และ security event",
          "ส่ง alert เมื่อพบพฤติกรรมผิดปกติ",
        ],
      },
      {
        role: "Pack Leader",
        agentName: "Bangkaew",
        breed: "Thai Bangkaew Dog",
        tool: "Agentic AI",
        image: "/pack/bangkaew.png",
        imageAlt: "Agent Bangkaew — หัวหน้าฝูง AI สายพันธุ์บางแก้ว",
        color: "from-cyan-500 to-teal-500",
        borderColor: "border-cyan-500/30",
        description:
          "หัวหน้าฝูงสายพันธุ์บางแก้ว — คิด วิเคราะห์ และตัดสินใจว่าควรทำอะไร",
        features: [
          "วิเคราะห์ alert และรวมเหตุการณ์ที่เกี่ยวข้องกัน",
          "จัดระดับความรุนแรง",
          "แนะนำ action พร้อมเหตุผล",
        ],
      },
      {
        role: "Fixer",
        agentName: "Retriever",
        breed: "Golden Retriever",
        tool: "GitHub + Semgrep / Trivy",
        image: "/pack/retriever.png",
        imageAlt: "Agent Retriever — Golden Retriever Fixer สแกนโค้ด เปิด PR redeploy",
        color: "from-emerald-500 to-green-500",
        borderColor: "border-emerald-500/30",
        description:
          "Golden Retriever ที่ไปหยิบ fix กลับมา — สแกน code ตั้งแต่ setup, แก้ด้วย LLM ที่ลูกค้าเลือก, เปิด PR ก่อน deploy",
        features: [
          "ผูก GitHub — baseline scan ทุก repo ด้วย Semgrep, Trivy, Gitleaks",
          "LLM pluggable: Claude, Codex, DeepSeek, GLM หรือ local LLM",
          "เปิด PR + rescan ก่อน merge — Collie redeploy หลัง approve",
        ],
      },
      {
        role: "Handler",
        agentName: "Collie",
        breed: "Border Collie",
        tool: "Shuffle",
        image: "/pack/collie.png",
        imageAlt: "Agent Collie — Border Collie Handler ขับเคลื่อนด้วย Shuffle",
        color: "from-violet-500 to-purple-500",
        borderColor: "border-violet-500/30",
        description:
          "Border Collie ที่รับคำสั่งและทำตาม playbook อย่างแม่นยำ — ไม่ลืม ไม่พลาด",
        features: [
          "รับคำสั่งที่ผ่าน approval แล้ว",
          "รัน playbook เช่น แจ้งเตือน, block IP, เปิด ticket, isolate host",
        ],
      },
      {
        role: "Sparring Dog",
        agentName: "Pitbull",
        breed: "American Pitbull Terrier",
        tool: "Kali / Caldera",
        image: "/pack/pitbull.png",
        imageAlt: "Agent Pitbull — Pitbull Sparring Dog สำหรับ Red Team",
        color: "from-amber-500 to-orange-500",
        borderColor: "border-amber-500/30",
        description:
          "Pitbull ที่จำลองการโจมตีเพื่อฝึกและ validate ระบบป้องกัน — ดุ แต่ทำงานให้ทีม",
        features: [
          "จำลองการโจมตีเพื่อทดสอบระบบ",
          "ทดสอบ detection และ response",
          "สร้าง scorecard ว่าระบบป้องกันได้จริงแค่ไหน",
        ],
      },
    ],
  },
  workflow: {
    badge: "Workflow",
    title: "สรุปเรื่องราวเป็น 7 ขั้นตอน — ปลอดภัยและตรวจสอบย้อนหลังได้",
    steps: [
      {
        step: "01",
        title: "Detect",
        subtitle: "ตรวจจับ",
        description: "Wazuh ตรวจจับความผิดปกติ",
        icon: "🔍",
      },
      {
        step: "02",
        title: "Triage",
        subtitle: "จัดลำดับ",
        description: "AI รวมและจัดลำดับ alert",
        icon: "📊",
      },
      {
        step: "03",
        title: "Explain",
        subtitle: "อธิบาย",
        description: "สรุปเหตุการณ์เป็นภาษาคน",
        icon: "💬",
      },
      {
        step: "04",
        title: "Recommend",
        subtitle: "แนะนำ",
        description: "เสนอ action พร้อมเหตุผล",
        icon: "💡",
      },
      {
        step: "05",
        title: "Approve",
        subtitle: "อนุมัติ",
        description: "มนุษย์กดอนุมัติก่อน action สำคัญ",
        icon: "✅",
      },
      {
        step: "06",
        title: "Respond",
        subtitle: "ตอบโต้",
        description: "Shuffle รัน playbook",
        icon: "⚡",
      },
      {
        step: "07",
        title: "Learn",
        subtitle: "เรียนรู้",
        description: "เก็บ incident เป็น memory เพื่อเทียบกับเคสในอนาคต",
        icon: "🧠",
      },
    ],
  },
  features: {
    badge: "Features",
    title: "ฟีเจอร์ที่ออกแบบมาเพื่อทีม IT และผู้บริหาร",
    items: [
      {
        icon: "🔧",
        title: "Code Scan + PR Fix Loop",
        description:
          "Agent Retriever สแกน code ตั้งแต่ setup แก้ด้วย LLM ที่ลูกค้าเลือก เปิด PR ก่อน redeploy",
      },
      {
        icon: "📊",
        title: "Unified Security Dashboard",
        description: "ดู alert, incident และสถานะระบบทั้งหมดในหน้าเดียว",
      },
      {
        icon: "🤖",
        title: "AI Incident Triage",
        description: "AI จัดลำดับและรวม alert ที่เกี่ยวข้องกันอัตโนมัติ",
      },
      {
        icon: "💬",
        title: "Natural Language Security Chat",
        description: "ถามเหตุการณ์เป็นภาษาคน ได้คำตอบที่เข้าใจง่าย",
      },
      {
        icon: "🛡️",
        title: "Human-in-the-loop Remediation",
        description: "action สำคัญต้องผ่านการอนุมัติจากมนุษย์ก่อนเสมอ",
      },
      {
        icon: "📄",
        title: "Thai Incident Report",
        description: "สร้างรายงานเหตุการณ์เป็นภาษาไทยสำหรับผู้บริหาร",
      },
      {
        icon: "🗺️",
        title: "MITRE ATT&CK Coverage Map",
        description: "แสดง coverage ของ detection ตาม MITRE framework",
      },
      {
        icon: "🔴",
        title: "Red Team Validation Loop",
        description: "ทดสอบระบบป้องกันด้วย attack simulation จริง",
      },
      {
        icon: "📝",
        title: "Audit Log & Explainability",
        description: "บันทึกทุก decision พร้อมเหตุผลตรวจสอบย้อนหลังได้",
      },
      {
        icon: "🧠",
        title: "Incident Memory / RAG",
        description: "เก็บประสบการณ์จาก incident เก่าเพื่อช่วยวิเคราะห์เคสใหม่",
      },
    ],
  },
  guardrails: {
    badge: "Guardrails",
    title: "AI ที่ช่วยคิด แต่ไม่สั่งมั่ว",
    description:
      "บางแก้ว K9 ถูกออกแบบให้ AI ทำหน้าที่วิเคราะห์และแนะนำ ไม่ใช่สั่งปิดระบบเองแบบไร้ขอบเขต",
    items: [
      {
        title: "Treat logs as untrusted data",
        subtitle: "ป้องกัน Prompt Injection",
        description:
          "ป้องกัน prompt injection จาก log, filename, user-agent หรือ payload ที่อาจถูกฝังมา",
        icon: "🔒",
      },
      {
        title: "Approval required",
        subtitle: "ต้องอนุมัติก่อนดำเนินการ",
        description:
          "Action ที่มีผลกระทบ เช่น block IP, isolate host หรือ kill process ต้องผ่านการอนุมัติ",
        icon: "✋",
      },
      {
        title: "Explain before execute",
        subtitle: "อธิบายก่อนทำ",
        description:
          "ทุก recommendation ต้องมีเหตุผลประกอบ — ไม่มี black box decision",
        icon: "📖",
      },
      {
        title: "Audit everything",
        subtitle: "บันทึกทุกอย่าง",
        description:
          "ทุก decision, approval และ playbook execution ถูกบันทึกย้อนหลังได้",
        icon: "📋",
      },
      {
        title: "Cost control",
        subtitle: "ควบคุมต้นทุน AI",
        description:
          "Deduplicate และ correlate alert ก่อนส่งเข้า LLM — ไม่เผา token เปล่าๆ",
        icon: "💰",
      },
    ],
  },
  tech: {
    badge: "Technology",
    title: "Built on proven open-source tools",
    description:
      "ใช้เครื่องมือ open-source ที่พิสูจน์แล้วในอุตสาหกรรม — ไม่ต้องเริ่มจากศูนย์",
    stack: [
      { category: "Detection", items: ["Wazuh"] },
      { category: "SOAR", items: ["Shuffle"] },
      {
        category: "Code Security",
        items: ["Semgrep", "Trivy", "Gitleaks", "GitHub"],
      },
      {
        category: "Attack Simulation",
        items: ["Kali Linux", "Caldera", "Atomic Red Team"],
      },
      {
        category: "AI Orchestration",
        items: ["LangGraph", "Claude / Codex / DeepSeek / GLM / Local LLM"],
      },
      {
        category: "Backend",
        items: ["FastAPI", "Redis Streams", "PostgreSQL / TimescaleDB"],
      },
      { category: "Memory", items: ["Qdrant"] },
      { category: "Frontend", items: ["Next.js", "Tailwind CSS"] },
    ],
  },
  useCases: {
    badge: "Use Cases",
    title: "เหมาะกับใคร",
    items: [
      {
        icon: "🏢",
        title: "SME ไม่มีทีม SOC",
        description:
          "บริษัทขนาดเล็กถึงกลางที่ไม่มีทีม SOC เต็มรูปแบบ แต่ต้องการระบบป้องกันที่ใช้งานได้จริง",
      },
      {
        icon: "🖥️",
        title: "ทีม IT ภายใน",
        description:
          "ทีม IT ที่ต้องดูแล server และ endpoint ภายใน ต้องการเครื่องมือที่ช่วยจัดการ security event",
      },
      {
        icon: "🔐",
        title: "เริ่ม Security Automation",
        description:
          "องค์กรที่ต้องการเริ่มใช้ Security Automation อย่างปลอดภัย ด้วย human approval",
      },
      {
        icon: "🔬",
        title: "ทีม R&D / Demo",
        description:
          "ทีม R&D ที่ต้องการ demo Cybersecurity แบบ end-to-end จาก detection ถึง response",
      },
      {
        icon: "👔",
        title: "ผู้บริหาร",
        description:
          "ผู้บริหารที่ต้องการเข้าใจความเสี่ยงไซเบอร์ด้วยภาษาคน ไม่ใช่แค่ technical report",
      },
    ],
  },
  roadmap: {
    badge: "Roadmap",
    title: "เริ่มจาก MVP ที่ทำได้จริง",
    description: "พัฒนาทีละขั้น ทดสอบได้จริง ไม่ใช่แค่ slide deck",
    inProgress: " — In Progress",
    phases: [
      {
        phase: "Phase 1",
        title: "Alert Pipeline",
        description: "Wazuh Alert → FastAPI Webhook → Shuffle Notification",
        status: "current",
      },
      {
        phase: "Phase 2",
        title: "AI Triage",
        description: "AI Triage + Incident Summary",
        status: "upcoming",
      },
      {
        phase: "Phase 3",
        title: "Human Approval",
        description: "Human Approval + Recommended Playbook",
        status: "upcoming",
      },
      {
        phase: "Phase 4",
        title: "Red Team Loop",
        description: "Kali/Caldera Validation Loop",
        status: "upcoming",
      },
      {
        phase: "Phase 5",
        title: "Full Dashboard",
        description: "Dashboard + Report + MITRE Coverage",
        status: "upcoming",
      },
    ],
  },
  cta: {
    title: "ให้บางแก้ว K9 เฝ้าบ้านดิจิทัลขององค์กรคุณ",
    description:
      "ตรวจจับเร็วขึ้น เข้าใจง่ายขึ้น ตอบสนองอย่างปลอดภัย และมี AI เป็นผู้ช่วยวิเคราะห์ทุกเหตุการณ์",
    primary: "ขอ Demo",
    secondary: "ดู Architecture",
  },
  footer: {
    tagline: "Agentic Cybersecurity Guard Platform — หมาเฝ้าระบบไซเบอร์อัจฉริยะ",
    copyright: "© {year} บางแก้ว K9",
  },
};
