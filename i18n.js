/* Lightweight EN/VI switcher for the landing page.
   Content is rendered by support.js, so we wait for the DOM to appear,
   then swap innerHTML per [data-i18n] key and remember the choice. */
(function () {
  var STORE = "site-lang";

  var dict = {
    "nav.role":        { 
      en: "Information Security · Blue Team", 
      vi: "An toàn thông tin · Blue Team" 
    },
    "nav.about":       { en: "About", vi: "Giới thiệu" },
    "nav.capabilities":{ en: "Capabilities", vi: "Năng lực" },
    "nav.focus":       { en: "Focus", vi: "Định hướng" },
    "nav.education":   { en: "Education", vi: "Học vấn" },
    "nav.contact":     { en: "Contact", vi: "Liên hệ" },
    "nav.portfolio":   { 
      en: 'Portfolio <span aria-hidden="true">↗</span>', 
      vi: 'Dự án <span aria-hidden="true">↗</span>' 
    },

    "hero.badge":      { 
      en: "Available for SOC / Blue Team Internships", 
      vi: "Sẵn sàng cho vị trí Thực tập sinh SOC / Blue Team" 
    },
    "hero.tagline":    { 
      en: 'Information Security<span class="sep">/</span>Blue Team<span class="sep">/</span>Aspiring SOC Analyst',
      vi: 'An toàn thông tin<span class="sep">/</span>Blue Team<span class="sep">/</span>Định hướng SOC Analyst' 
    },
    "hero.intro":      { 
      en: 'Defending digital assets through log correlation, threat detection, and analytical rigor. Combining defensive security workflows with secure front-end architecture to build intuitive operational tooling.',
      vi: 'Bảo vệ tài sản số thông qua phân tích log, phát hiện mối đe dọa và tư duy kỹ thuật chỉn chu. Kết hợp quy trình an ninh phòng thủ với kiến trúc Web an toàn nhằm tối ưu giao diện vận hành.' 
    },
    "hero.cta1":       { en: "Get in touch", vi: "Liên hệ ngay" },
    "hero.cta2":       { 
      en: 'View portfolio <span aria-hidden="true">↗</span>', 
      vi: 'Xem danh mục dự án <span aria-hidden="true">↗</span>' 
    },

    "about.eyebrow":   { en: "About", vi: "Giới thiệu" },
    "about.p1":        { 
      en: 'Cybersecurity student at <strong>Posts and Telecommunications Institute of Technology (PTIT)</strong>, Hanoi. My core focus is <strong>SOC Operations &amp; Defensive Security</strong> — centered on alert triage, telemetry analysis, event correlation, and mapping adversary techniques to detection rules.',
      vi: 'Sinh viên An toàn thông tin tại <strong>Học viện Công nghệ Bưu chính Viễn thông (PTIT)</strong>. Trọng tâm của tôi là <strong>Vận hành SOC &amp; An ninh Phòng thủ</strong> — tập trung vào phân loại cảnh báo, phân tích telemetry, đối soát log và gắn kỹ thuật tấn công với quy tắc phát hiện.' 
    },
    "about.p2":        { 
      en: 'I approach security with a structural engineering perspective: understanding low-level OS mechanisms, inspecting web attack vectors, and visualizing telemetry clearly. Combining <strong>threat detection logic</strong> with <strong>secure interface engineering</strong> forms the backbone of my technical methodology.',
      vi: 'Tôi tiếp cận an toàn thông tin dưới góc nhìn kiến trúc kỹ thuật: hiểu cơ chế hệ điều hành, phân tích lỗ hổng ứng dụng Web và trực quan hóa dữ liệu giám sát. Sự kết hợp giữa <strong>tư duy phát hiện đe dọa</strong> và <strong>kỹ thuật phát triển giao diện an toàn</strong> tạo nên nền tảng chuyên môn của tôi.' 
    },
    "about.k1":        { en: "Discipline", vi: "Lĩnh vực" },
    "about.v1":        { en: "Defensive Security", vi: "An ninh Phòng thủ" },
    "about.k2":        { en: "Focus", vi: "Trọng tâm" },
    "about.k3":        { en: "Education", vi: "Đào tạo" },
    "about.k4":        { en: "Edge", vi: "Điểm mạnh" },

    "cap.eyebrow":     { en: "Capabilities", vi: "Năng lực" },
    "cap.h2":          { 
      en: "Core Competencies & Technical Capabilities", 
      vi: "Năng lực Chuyên môn & Kỹ năng Kỹ thuật" 
    },
    "cap.defend.label":{ en: "01 · Defend", vi: "01 · An ninh Phòng thủ" },
    "cap.build.label": { en: "02 · Build", vi: "02 · Xây dựng Giao diện" },
    "cap.build.h3":    { 
      en: "Secure Web & Interface Engineering", 
      vi: "Lập trình Web & Giao diện An toàn" 
    },
    "s.d1":            { 
      en: "Log Analysis & Telemetry — Windows Event Logs, Sysmon, Syslog", 
      vi: "Phân tích Log & Dữ liệu sự cố — Windows Event Logs, Sysmon, Syslog" 
    },
    "s.d2":            { 
      en: "SIEM Querying & Monitoring — Splunk, ELK Stack", 
      vi: "Vận hành & Truy vấn SIEM — Splunk, ELK Stack" 
    },
    "s.d3":            { 
      en: "Alert Triage & Incident Verification", 
      vi: "Phân loại Cảnh báo & Xác minh Sự cố" 
    },
    "s.d4":            { 
      en: "Network & Packet Forensics — Wireshark, tcpdump", 
      vi: "Phân tích Mạng & Gói tin PCAP — Wireshark, tcpdump" 
    },
    "s.d5":            { 
      en: "Threat Mapping & Detection — MITRE ATT&CK Framework", 
      vi: "Phát hiện Mối đe dọa — Khung chuẩn MITRE ATT&CK" 
    },
    "s.d6":            { 
      en: "OS Hardening & Baseline Configuration — Linux & Windows", 
      vi: "Gia cố Hệ thống & Cấu hình Baseline — Linux & Windows" 
    },
    "s.b1":            { 
      en: "Front-end Architecture — HTML5, CSS3, JavaScript (ES6+), TypeScript", 
      vi: "Kiến trúc Front-end — HTML5, CSS3, JavaScript (ES6+), TypeScript" 
    },
    "s.b2":            { 
      en: "UI/UX & Dashboard Prototyping — Figma, Design Systems", 
      vi: "Thiết kế UI/UX & Dashboard — Figma, Design Systems" 
    },
    "s.b3":            { 
      en: "Web App Security — CSP, Input Sanitization, RBAC UI", 
      vi: "Bảo mật Ứng dụng Web — Thiết lập CSP, Lọc đầu vào, Phân quyền RBAC" 
    },
    "s.b4":            { 
      en: "Performance Optimization & WCAG Accessibility", 
      vi: "Tối ưu Hiệu năng & Chuẩn Tiếp cận WCAG" 
    },
    "tag.developing":  { en: "Active Learning", vi: "Đang trau dồi" },
    "tag.proficient":  { en: "Core", vi: "Nền tảng" },

    "focus.eyebrow":   { en: "Focus", vi: "Định hướng" },
    "focus.h2":        { 
      en: "Technical Competencies & Focus Domains", 
      vi: "Lĩnh vực Chuyên môn & Định hướng Phát triển" 
    },

    "edu.eyebrow":     { en: "Education", vi: "Học vấn" },
    "edu.h3":          { 
      en: "Posts and Telecommunications Institute of Technology", 
      vi: "Học viện Công nghệ Bưu chính Viễn thông" 
    },
    "edu.meta":        { 
      en: "PTIT · B.Sc. and engineer in Information Security · 2025 – 2030", 
      vi: "PTIT · Cử nhân và Kỹ sư An toàn thông tin · 2025 – 2030" 
    },
    "edu.p":           { 
      en: "Building core competencies in defensive security — computer networking fundamentals, OS internals, vulnerability analysis, and security operations protocols.",
      vi: "Xây dựng nền tảng vững chắc về an ninh phòng thủ — mạng máy tính, cấu trúc hệ điều hành, phân tích lỗ hổng và quy trình vận hành giám sát an toàn thông tin." 
    },

    "contact.eyebrow": { en: "Contact", vi: "Liên hệ" },
    "contact.h2":      { en: "Get in touch", vi: "Kết nối với tôi" },
    "contact.lead":    { 
      en: "Open for SOC / Blue Team Internship opportunities. Always eager to connect regarding log triage, detection logic, or secure web architecture.",
      vi: "Tôi đang tìm kiếm vị trí Thực tập sinh SOC / Blue Team. Rất vui được trao đổi về đối soát log, logic phát hiện cảnh báo hoặc phát triển giao diện an toàn." 
    },

    "foot.credit":     { 
      en: "© 2026 Nguyen Duc Anh — Designed by Duc Anh", 
      vi: "© 2026 Nguyễn Đức Anh — Thiết kế bởi Đức Anh" 
    },
    "foot.top":        { en: "Back to top ↑", vi: "Lên đầu trang ↑" }
  };

  function apply(lang) {
    if (lang !== "vi") lang = "en";
    document.documentElement.setAttribute("lang", lang);
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var t = dict[el.getAttribute("data-i18n")];
      if (t && t[lang] != null) el.innerHTML = t[lang];
    }
    var btns = document.querySelectorAll("[data-lang-btn]");
    for (var j = 0; j < btns.length; j++) {
      btns[j].setAttribute("aria-pressed", btns[j].getAttribute("data-lang-btn") === lang ? "true" : "false");
    }
    try { localStorage.setItem(STORE, lang); } catch (e) {}
  }

  function detect() {
    var stored = null;
    try { stored = localStorage.getItem(STORE); } catch (e) {}
    if (stored) return stored;
    var nav = (navigator.language || "").toLowerCase();
    return nav.indexOf("vi") === 0 ? "vi" : "en";
  }

  function init() {
    var btns = document.querySelectorAll("[data-lang-btn]");
    if (!btns.length || !document.querySelector("[data-i18n]")) return false;
    for (var i = 0; i < btns.length; i++) {
      (function (b) {
        b.addEventListener("click", function () { apply(b.getAttribute("data-lang-btn")); });
      })(btns[i]);
    }
    apply(detect());
    return true;
  }

  var tries = 0;
  var iv = setInterval(function () {
    if (init() || ++tries > 120) clearInterval(iv);
  }, 40);
})();