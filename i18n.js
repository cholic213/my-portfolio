/* Lightweight EN/VI switcher for the landing page.
   Content is rendered by support.js, so we wait for the DOM to appear,
   then swap innerHTML per [data-i18n] key and remember the choice. */
(function () {
  var STORE = "site-lang";

  var dict = {
    "nav.role":        { en: "Information Security · Blue Team", vi: "An ninh thông tin · Blue Team" },
    "nav.about":       { en: "About", vi: "Giới thiệu" },
    "nav.capabilities":{ en: "Capabilities", vi: "Năng lực" },
    "nav.focus":       { en: "Focus", vi: "Định hướng" },
    "nav.education":   { en: "Education", vi: "Học vấn" },
    "nav.contact":     { en: "Contact", vi: "Liên hệ" },
    "nav.portfolio":   { en: 'Portfolio <span aria-hidden="true">↗</span>', vi: 'Dự án <span aria-hidden="true">↗</span>' },

    "hero.badge":      { en: "Available for SOC / blue-team internships", vi: "Đang tìm cơ hội thực tập SOC / Blue Team" },
    "hero.tagline":    { en: 'Information Security<span class="sep">/</span>Blue Team<span class="sep">/</span>Aspiring SOC Analyst',
                         vi: 'An ninh thông tin<span class="sep">/</span>Blue Team<span class="sep">/</span>SOC Analyst tương lai' },
    "hero.intro":      { en: 'I focus on <strong>defending systems</strong> and understanding threat landscapes — drawn to threat detection, incident response, and the rhythm of a <strong>Security Operations Center</strong>. Beyond security, I bridge technical analysis with clean <strong>UI/UX design</strong> and build intuitive digital interfaces.',
                         vi: 'Tôi tập trung vào việc <strong>phòng thủ hệ thống</strong> và tìm hiểu bối cảnh các mối đe dọa — hứng thú với phát hiện tấn công, ứng phó sự cố và nhịp vận hành của một <strong>Trung tâm Điều hành An ninh (SOC)</strong>. Ngoài bảo mật, tôi kết nối phân tích kỹ thuật với <strong>thiết kế UI/UX</strong> gọn gàng và xây dựng những giao diện trực quan.' },
    "hero.cta1":       { en: "Get in touch", vi: "Liên hệ" },
    "hero.cta2":       { en: 'View portfolio <span aria-hidden="true">↗</span>', vi: 'Xem dự án <span aria-hidden="true">↗</span>' },

    "about.eyebrow":   { en: "About", vi: "Giới thiệu" },
    "about.p1":        { en: 'A cybersecurity student at the <strong>Posts and Telecommunications Institute of Technology (PTIT)</strong>, specializing in defensive security. My primary focus is <strong>SOC operations</strong> — driving alert triage, threat hunting, and swift incident containment to protect enterprise environments.',
                         vi: 'Sinh viên an toàn thông tin tại <strong>Học viện Công nghệ Bưu chính Viễn thông (PTIT)</strong>, chuyên về an ninh phòng thủ. Trọng tâm chính của tôi là <strong>vận hành SOC</strong> — phân loại cảnh báo, săn tìm mối đe dọa và nhanh chóng khoanh vùng sự cố để bảo vệ môi trường doanh nghiệp.' },
    "about.p2":        { en: "I approach security with a designer's mindset: understanding system architecture, monitoring behaviors, and responding with precision. Bridging <strong>system analysis</strong> with <strong>interface engineering</strong> forms the core of my technical approach.",
                         vi: 'Tôi tiếp cận bảo mật bằng tư duy của một nhà thiết kế: hiểu kiến trúc hệ thống, theo dõi hành vi và phản ứng một cách chính xác. Kết nối <strong>phân tích hệ thống</strong> với <strong>kỹ thuật giao diện</strong> chính là cốt lõi trong cách làm của tôi.' },
    "about.k1":        { en: "Discipline", vi: "Lĩnh vực" },
    "about.v1":        { en: "Defensive Security", vi: "An ninh phòng thủ" },
    "about.k2":        { en: "Focus", vi: "Trọng tâm" },
    "about.k3":        { en: "Education", vi: "Học vấn" },
    "about.k4":        { en: "Also", vi: "Ngoài ra" },

    "cap.eyebrow":     { en: "Capabilities", vi: "Năng lực" },
    "cap.h2":          { en: "Two sides of the screen", vi: "Hai mặt của màn hình" },
    "cap.defend.label":{ en: "01 · Defend", vi: "01 · Phòng thủ" },
    "cap.build.label": { en: "02 · Build", vi: "02 · Xây dựng" },
    "cap.build.h3":    { en: "Interface & Web", vi: "Giao diện & Web" },
    "s.d1":            { en: "SIEM monitoring & log analysis", vi: "Giám sát SIEM & phân tích log" },
    "s.d3":            { en: "Incident response & triage", vi: "Ứng phó & phân loại sự cố" },
    "s.d4":            { en: "Network & packet analysis — Wireshark", vi: "Phân tích mạng & gói tin — Wireshark" },
    "s.d5":            { en: "Threat detection — MITRE ATT&CK", vi: "Phát hiện mối đe dọa — MITRE ATT&CK" },
    "s.d6":            { en: "Linux & system hardening", vi: "Linux & tăng cường hệ thống" },
    "s.b1":            { en: "UI design & prototyping — Figma", vi: "Thiết kế UI & tạo mẫu — Figma" },
    "s.b3":            { en: "Responsive, accessible layouts", vi: "Bố cục responsive, dễ tiếp cận" },
    "s.b4":            { en: "Design system scaling", vi: "Mở rộng design system" },
    "s.b5":            { en: "Web development workflow", vi: "Quy trình phát triển web" },
    "tag.developing":  { en: "Developing", vi: "Đang học" },
    "tag.proficient":  { en: "Proficient", vi: "Thành thạo" },

    "focus.eyebrow":   { en: "Focus", vi: "Định hướng" },
    "focus.h2":        { en: "What I'm working toward", vi: "Điều tôi đang hướng tới" },

    "edu.eyebrow":     { en: "Education", vi: "Học vấn" },
    "edu.h3":          { en: "Posts and Telecommunications Institute of Technology", vi: "Học viện Công nghệ Bưu chính Viễn thông" },
    "edu.meta":        { en: "PTIT · B.Sc. Cybersecurity · 2025 – 2030", vi: "PTIT · Cử nhân An toàn thông tin · 2025 – 2030" },
    "edu.p":           { en: "Studying defensive security foundations — networks, operating systems, and the detection-and-response discipline that runs a SOC.",
                         vi: "Học nền tảng an ninh phòng thủ — mạng máy tính, hệ điều hành và kỷ luật phát hiện–ứng phó vận hành một SOC." },

    "contact.eyebrow": { en: "Contact", vi: "Liên hệ" },
    "contact.h2":      { en: "Open a channel", vi: "Kết nối với tôi" },
    "contact.lead":    { en: "Looking for a blue-team internship or SOC opportunity — and happy to talk design or front-end work too.",
                         vi: "Đang tìm cơ hội thực tập blue-team hoặc SOC — và luôn sẵn lòng trao đổi về thiết kế hay công việc front-end." },

    "foot.credit":     { en: "© 2026 Nguyen Duc Anh — designed & built by hand", vi: "© 2026 Nguyen Duc Anh — thiết kế & xây dựng thủ công" },
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
