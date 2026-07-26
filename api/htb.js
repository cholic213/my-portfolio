// Vercel serverless function: returns live Hack The Box stats.
//
// The HTB app token is read from the HTB_TOKEN environment variable (set in
// Vercel → Project → Settings → Environment Variables). It is NEVER sent to
// the browser — only the aggregate numbers below are returned. Optionally set
// HTB_USER_ID to skip the extra lookup call.
//
// Response: { ok, machines, userOwns, systemOwns, rank, points, ranking }
// On any failure it still returns 200 with { ok:false, error } so the page can
// silently fall back to the manual placeholder.

const BASE = "https://labs.hackthebox.com/api/v4";

module.exports = async (req, res) => {
  const token = process.env.HTB_TOKEN;
  if (!token) {
    res.status(200).json({ ok: false, error: "missing_token" });
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "User-Agent": "portfolio-htb-widget",
  };

  const getJson = async (url) => {
    const r = await fetch(url, { headers });
    if (!r.ok) throw new Error(`${url} -> ${r.status}`);
    return r.json();
  };

  try {
    // 1) Resolve the user id (from env, or derive it from the token).
    let userId = process.env.HTB_USER_ID;
    if (!userId) {
      const info = await getJson(`${BASE}/user/info`);
      userId = info?.info?.id ?? info?.id;
    }
    if (!userId) throw new Error("could_not_resolve_user_id");

    // 2) Fetch the public profile stats for that user.
    const prof = await getJson(`${BASE}/profile/${userId}`);
    const p = prof?.profile ?? prof ?? {};

    const num = (v) => (typeof v === "number" ? v : v != null && !isNaN(+v) ? +v : null);
    const systemOwns = num(p.system_owns);
    const userOwns = num(p.user_owns);
    // "Machines" = machines rooted; fall back to user-owned count.
    const machines = systemOwns != null ? systemOwns : userOwns;

    // Cache at the edge so we hit HTB at most ~once every 10 min.
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");
    res.status(200).json({
      ok: true,
      machines,
      userOwns,
      systemOwns,
      rank: p.rank ?? null,
      points: num(p.points),
      ranking: num(p.ranking),
    });
  } catch (e) {
    res.status(200).json({ ok: false, error: String((e && e.message) || e) });
  }
};
