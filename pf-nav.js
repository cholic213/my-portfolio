/* Mobile hamburger for the portfolio page.
   The page is rendered (and re-rendered) by support.js, so we drive the
   open state via a class on <body> and use event delegation on document —
   both survive the runtime recreating nav DOM nodes. */
(function () {
  function setOpen(open) {
    document.body.classList.toggle("nav-open", open);
    var t = document.querySelector(".nav-toggle");
    if (t) t.setAttribute("aria-expanded", open ? "true" : "false");
  }

  document.addEventListener("click", function (e) {
    var target = e.target;
    if (!target || !target.closest) return;

    // Hamburger button: toggle
    if (target.closest(".nav-toggle")) {
      e.preventDefault();
      setOpen(!document.body.classList.contains("nav-open"));
      return;
    }

    // A menu link/button while open: close — except the EN/VI language pill
    if (document.body.classList.contains("nav-open")) {
      var item = target.closest(".pf-menu a, .pf-menu button");
      if (item && !target.closest(".pf-lang")) setOpen(false);
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setOpen(false);
  });
})();
