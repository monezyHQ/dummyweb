(() => {
  const KEY = "mandir.v1";
  const IST = "Asia/Kolkata";

  const TEMPLES = [
    { id: "tirupati", name: "Tirumala", hi: "तिरुमला", place: "Tirupati, Andhra Pradesh", deity: "Sri Venkateswara", yt: "UCS2Y83GD-fc7qqgNW5uj41g", donate: "https://www.tirumala.org", aarti: ["03:30", "12:00", "18:00", "19:30"], prasad: [{ id: "laddu", name: "Srivari laddu", note: "TTD official counter / post" }], seva: true },
    { id: "somnath", name: "Somnath", hi: "सोमनाथ", place: "Prabhas Patan, Gujarat", deity: "Bhagwan Somnath", yt: "UC2x4cIbyH67XPtBJua7ZAXg", donate: "https://www.somnath.org", aarti: ["06:00", "12:00", "19:00"], prasad: [{ id: "dry", name: "Dry prasad" }] },
    { id: "shirdi", name: "Shirdi", hi: "शिर्डी", place: "Shirdi, Maharashtra", deity: "Sai Baba", yt: "UCKGvJDh7g_Kzocbwy7aKicA", donate: "https://sai.org.in", aarti: ["04:30", "12:00", "19:00", "22:00"], prasad: [{ id: "udi", name: "Udi & prasad" }] },
    { id: "mahakal", name: "Mahakaleshwar", hi: "महाकालेश्वर", place: "Ujjain, Madhya Pradesh", deity: "Mahakaleshwar", yt: "UC2acL93AShyrNvAWt9S-tDg", donate: "https://shrimahakaleshwar.com", aarti: ["04:00", "12:00", "19:00"], prasad: [{ id: "bhasma", name: "Bhasma darshan prasad" }] },
    { id: "kashi", name: "Kashi Vishwanath", hi: "काशी विश्वनाथ", place: "Varanasi, Uttar Pradesh", deity: "Vishwanath", yt: "UCTFNs9od-yreZs1cAdALwow", donate: "https://shrikashivishwanath.org", aarti: ["03:00", "11:30", "19:00"], prasad: [{ id: "dry", name: "Temple prasad" }] },
    { id: "siddhi", name: "Siddhivinayak", hi: "सिद्धिविनायक", place: "Mumbai, Maharashtra", deity: "Ganesha", yt: "UC21V41QALQSEaJM8MCJgShg", donate: "https://www.siddhivinayak.org", aarti: ["05:30", "12:20", "19:30", "21:30"], prasad: [{ id: "modak", name: "Modak & dry prasad" }] },
    { id: "mayapur", name: "ISKCON Mayapur", hi: "मायापुर", place: "Mayapur, West Bengal", deity: "Radha Madhava", yt: "UC3gdxSJ3NFo1mFxwXvQ196Q", donate: "https://www.mayapur.com", aarti: ["04:30", "07:00", "12:00", "19:00"], prasad: [{ id: "maha", name: "Maha prasad" }] },
    { id: "vaishno", name: "Vaishno Devi", hi: "वैष्णो देवी", place: "Katra, Jammu", deity: "Mata Vaishno Devi", yt: "UCLD6niYb2HF44LxErB_PgdQ", donate: "https://www.maavaishnodevi.org", aarti: ["04:00", "12:00", "18:00"], prasad: [{ id: "dry", name: "Mishri prasad" }] },
    { id: "harmandir", name: "Harmandir Sahib", hi: "हरिमंदर साहिब", place: "Amritsar, Punjab", deity: "Guru Granth Sahib", yt: "UCjWRdUwKYTc-7JlFRHdmuJQ", donate: "https://sgpc.net", aarti: ["03:00", "18:00"], prasad: [{ id: "karah", name: "Karah prasad" }], quiet: true }
  ];

  const DEITIES = [
    { id: "ganesha", name: "Ganesha", glyph: "🐘" },
    { id: "shiva", name: "Shiva", glyph: "🌙" },
    { id: "vishnu", name: "Vishnu", glyph: "🌀" },
    { id: "devi", name: "Devi", glyph: "🪷" },
    { id: "krishna", name: "Krishna", glyph: "🦚" },
    { id: "hanuman", name: "Hanuman", glyph: "🙏" },
    { id: "sai", name: "Sai", glyph: "🔥" }
  ];

  const MANTRAS = [
    { id: "shiva", text: "Om Namah Shivaya" },
    { id: "ganesha", text: "Om Gan Ganapataye Namah" },
    { id: "narayana", text: "Om Namo Narayanaya" },
    { id: "krishna", text: "Hare Krishna Maha-mantra" },
    { id: "gayatri", text: "Gayatri Mantra" },
    { id: "devi", text: "Om Aim Hreem Kleem" }
  ];

  const FESTS = [
    { id: "shivaratri", name: "Maha Shivaratri", date: "2026-02-15", temples: ["somnath", "mahakal", "kashi"], kind: "major" },
    { id: "holi", name: "Holi", date: "2026-03-03", temples: [], kind: "major" },
    { id: "ramnavami", name: "Ram Navami", date: "2026-03-26", temples: ["tirupati"], kind: "major" },
    { id: "hanuman", name: "Hanuman Jayanti", date: "2026-04-02", temples: [], kind: "major" },
    { id: "akshaya", name: "Akshaya Tritiya", date: "2026-04-19", temples: [], kind: "major" },
    { id: "gurupurnima", name: "Guru Purnima", date: "2026-07-29", temples: ["mayapur", "harmandir"], kind: "purnima" },
    { id: "rakhi", name: "Raksha Bandhan", date: "2026-08-28", temples: [], kind: "purnima" },
    { id: "janmashtami", name: "Janmashtami", date: "2026-09-04", temples: ["mayapur", "tirupati"], kind: "major" },
    { id: "ganesh", name: "Ganesh Chaturthi", date: "2026-09-14", temples: ["siddhi"], kind: "major" },
    { id: "navratri", name: "Sharad Navratri begins", date: "2026-10-11", temples: ["vaishno"], kind: "major" },
    { id: "durga", name: "Durga Ashtami", date: "2026-10-18", temples: ["vaishno"], kind: "major" },
    { id: "dussehra", name: "Dussehra", date: "2026-10-20", temples: [], kind: "major" },
    { id: "karwa", name: "Karwa Chauth", date: "2026-11-01", temples: [], kind: "major" },
    { id: "diwali", name: "Diwali", date: "2026-11-08", temples: [], kind: "major" },
    { id: "govardhan", name: "Govardhan Puja", date: "2026-11-09", temples: ["mayapur"], kind: "major" },
    { id: "bhai", name: "Bhai Dooj", date: "2026-11-10", temples: [], kind: "major" },
    { id: "kartik", name: "Kartik Purnima", date: "2026-11-24", temples: ["somnath", "kashi"], kind: "purnima" },
    { id: "ekadashi-sep", name: "Parsva Ekadashi", date: "2026-09-07", temples: ["tirupati", "mayapur"], kind: "ekadashi" },
    { id: "ekadashi-sep2", name: "Indira Ekadashi", date: "2026-09-22", temples: ["tirupati", "mayapur"], kind: "ekadashi" },
    { id: "ekadashi-oct", name: "Papankusha Ekadashi", date: "2026-10-07", temples: ["tirupati"], kind: "ekadashi" },
    { id: "ekadashi-oct2", name: "Rama Ekadashi", date: "2026-10-21", temples: ["tirupati"], kind: "ekadashi" },
    { id: "purnima-sep", name: "Bhadrapada Purnima", date: "2026-09-26", temples: [], kind: "purnima" },
    { id: "purnima-oct", name: "Ashwin Purnima", date: "2026-10-26", temples: [], kind: "purnima" }
  ];

  const AMTS = [11, 51, 101, 251, 501, 1100];
  const $ = (id) => document.getElementById(id);
  const todayISO = () => new Date().toLocaleDateString("en-CA", { timeZone: IST });
  const temple = (id) => TEMPLES.find((t) => t.id === id);

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

  const state = Object.assign({
    temples: ["tirupati", "somnath"],
    deities: ["ganesha", "shiva"],
    fav: "tirupati",
    notify: true,
    notifyFests: [],
    streak: { count: 0, last: "", days: {} },
    rituals: {},
    jaap: { mantra: "shiva", count: 0, day: "", total: 0 },
    prayers: [],
    donations: [],
    prasad: [],
    diyacount: 0,
    onboarded: false
  }, load());

  let audioCtx;
  let petalAnim = 0;
  let petals = [];
  let dust = [];
  let dustRaf = 0;

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2800);
  }

  function greet() {
    const h = Number(new Date().toLocaleString("en-GB", { timeZone: IST, hour: "2-digit", hour12: false }).slice(0, 2));
    if (h < 5) return "Shubh nisha";
    if (h < 12) return "Shubh prabhat";
    if (h < 17) return "Shubh din";
    return "Shubh sandhya";
  }

  function nextAarti(t) {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: IST, hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
    const hh = Number(parts.find((p) => p.type === "hour").value);
    const mm = Number(parts.find((p) => p.type === "minute").value);
    const cur = hh * 60 + mm;
    for (const slot of t.aarti) {
      const [H, M] = slot.split(":").map(Number);
      if (H * 60 + M >= cur) return slot;
    }
    return t.aarti[0] + " tomorrow";
  }

  function markDarshan() {
    const d = todayISO();
    if (state.streak.last === d) return;
    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yest = y.toLocaleDateString("en-CA", { timeZone: IST });
    state.streak.count = state.streak.last === yest ? state.streak.count + 1 : 1;
    state.streak.last = d;
    state.streak.days[d] = true;
    ritualDone("darshan");
    save(state);
    renderStreak();
  }

  function ritualDone(id) {
    const d = todayISO();
    state.rituals[d] = state.rituals[d] || {};
    state.rituals[d][id] = true;
    save(state);
    renderRituals();
  }

  function weekDots() {
    const dots = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toLocaleDateString("en-CA", { timeZone: IST });
      dots.push(!!state.streak.days[iso]);
    }
    return dots;
  }

  function renderStreak() {
    const n = state.streak.count;
    $("streakCopy").textContent = n
      ? `You have come for darshan ${n} morning${n === 1 ? "" : "s"} in a row.`
      : "Begin with one quiet visit today.";
    $("streakDots").innerHTML = weekDots().map((on) => `<li class="${on ? "on" : ""}"></li>`).join("");
  }

  function renderHome() {
    $("greet").textContent = greet();
    const fav = temple(state.fav) || temple(state.temples[0]) || TEMPLES[0];
    $("heroName").textContent = fav.name;
    $("heroMeta").textContent = `${fav.place} · Next aarti ${nextAarti(fav)} IST`;
    $("heroLive").innerHTML = `<i></i> Live darshan`;
    $("heroEnter").onclick = () => { showView("darshan"); selectTemple(fav.id); };
    $("pinTemples").innerHTML = state.temples.map((id) => {
      const t = temple(id);
      if (!t) return "";
      return `<button type="button" class="t-card ${id === state.fav ? "fav" : ""}" data-id="${id}"><b>${t.name}</b><small>${t.place.split(",")[0]}</small></button>`;
    }).join("");
    $("pinTemples").onclick = (e) => {
      const b = e.target.closest("[data-id]");
      if (!b) return;
      showView("darshan");
      selectTemple(b.dataset.id);
    };
    $("homeDeities").innerHTML = DEITIES.filter((d) => state.deities.includes(d.id)).map((d) =>
      `<div class="deity pin"><i>${d.glyph}</i><span>${d.name}</span></div>`
    ).join("") || `<p class="lede">Pin a deity in Edit.</p>`;
    renderStreak();
    renderRituals();
    const next = upcomingFests()[0];
    if (next) {
      $("nextFest").innerHTML = `<span>${relDate(next.date)}</span><b>${next.name}</b><span>${next.kind === "ekadashi" ? "Ekadashi" : next.kind === "purnima" ? "Purnima" : "Festival"}</span>`;
      $("nextFest").onclick = () => showView("cal");
    }
  }

  function renderRituals() {
    const d = todayISO();
    const done = state.rituals[d] || {};
    const items = [
      { id: "darshan", label: "Sit for live darshan", go: () => showView("darshan") },
      { id: "diya", label: "Light a diya", go: () => { showView("puja"); openRitual("diya"); } },
      { id: "jaap", label: "One mala of jaap", go: () => showView("puja") },
      { id: "pray", label: "A private sankalp", go: () => openRitual("pray") }
    ];
    $("rituals").innerHTML = items.map((it) =>
      `<li class="${done[it.id] ? "done" : ""}"><span>${it.label}</span><button type="button" data-r="${it.id}">${done[it.id] ? "Done" : "Begin"}</button></li>`
    ).join("");
    $("rituals").onclick = (e) => {
      const b = e.target.closest("[data-r]");
      if (!b) return;
      items.find((i) => i.id === b.dataset.r)?.go();
    };
  }

  function upcomingFests() {
    const t = todayISO();
    return FESTS.filter((f) => f.date >= t).sort((a, b) => a.date.localeCompare(b.date));
  }

  function relDate(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    const opts = { day: "numeric", month: "short" };
    if (iso === todayISO()) return "Today";
    return dt.toLocaleDateString("en-IN", opts);
  }

  function renderCal() {
    $("festList").innerHTML = upcomingFests().map((f) => {
      const on = state.notifyFests.includes(f.id);
      const pin = f.temples.some((id) => state.temples.includes(id));
      return `<li class="fest-item"><div class="d">${relDate(f.date)}</div><div><b>${f.name}</b><span>${f.kind}${pin ? " · for a temple you keep" : ""}</span></div>
        <button type="button" class="bell-mini ${on ? "on" : ""}" data-fest="${f.id}" aria-label="Remind">${on ? "●" : "○"}</button></li>`;
    }).join("");
    $("festList").onclick = (e) => {
      const b = e.target.closest("[data-fest]");
      if (!b) return;
      const id = b.dataset.fest;
      const i = state.notifyFests.indexOf(id);
      if (i >= 0) state.notifyFests.splice(i, 1);
      else {
        state.notifyFests.push(id);
        requestNotify();
        toast("We’ll remind you on this device, if permission is granted.");
      }
      save(state);
      renderCal();
    };
  }

  function selectTemple(id) {
    const t = temple(id);
    if (!t) return;
    state.fav = id;
    save(state);
    [...$("templeSelect").children].forEach((b) => b.classList.toggle("on", b.dataset.id === id));
    const liveUrl = `https://www.youtube.com/channel/${t.yt}/live`;
    $("aartiLine").innerHTML = `${t.hi} · ${t.deity} · next aarti ${nextAarti(t)} IST · <a href="${liveUrl}" target="_blank" rel="noopener">YouTube live</a>`;
    $("ytOpen").href = liveUrl;
    $("veilCopy").textContent = t.quiet
      ? "A still hall. Offerings stay off here — sit and listen."
      : "If the stream is dark, the next aarti will open the doors.";
    $("playerVeil").classList.remove("off");
    const src = `https://www.youtube-nocookie.com/embed/live_stream?channel=${t.yt}&autoplay=1&mute=0&rel=0&modestbranding=1&playsinline=1`;
    $("yt").src = src;
    setTimeout(() => $("playerVeil").classList.add("off"), 2200);
    markDarshan();
    $("favTempleBtn").classList.toggle("on", state.temples.includes(id));
    renderOfferQuiet(t);
  }

  function renderOfferQuiet(t) {
    document.querySelectorAll(".offer-bar [data-offer]").forEach((b) => {
      b.disabled = !!t.quiet;
      b.style.opacity = t.quiet ? .35 : 1;
    });
  }

  function renderTempleChips() {
    $("templeSelect").innerHTML = TEMPLES.map((t) =>
      `<button type="button" data-id="${t.id}" class="${t.id === state.fav ? "on" : ""}">${t.name}</button>`
    ).join("");
    $("templeSelect").onclick = (e) => {
      const b = e.target.closest("[data-id]");
      if (b) selectTemple(b.dataset.id);
    };
  }

  function showView(name) {
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("hidden", v.dataset.view !== name));
    document.querySelectorAll(".dock [data-nav]").forEach((b) => b.classList.toggle("on", b.dataset.nav === name));
    if (name === "home") renderHome();
    if (name === "darshan") { renderTempleChips(); selectTemple(state.fav); }
    if (name === "puja") renderJaap();
    if (name === "seva") renderSeva();
    if (name === "cal") renderCal();
  }

  function openModal(html) {
    $("modalCard").innerHTML = html + `<p style="margin-top:16px"><button type="button" class="text-btn" id="closeModal">Close</button></p>`;
    $("modal").classList.remove("hidden");
    $("closeModal").onclick = closeModal;
    $("modal").onclick = (e) => { if (e.target.id === "modal") closeModal(); };
  }
  function closeModal() { $("modal").classList.add("hidden"); }

  function ensureAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }

  function playBell() {
    const ctx = ensureAudio();
    const now = ctx.currentTime;
    [528, 792, 1056, 396].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = i ? "sine" : "triangle";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.18 / (i + 1), now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 2.4 + i * 0.15);
      o.connect(g).connect(ctx.destination);
      o.start(now);
      o.stop(now + 3);
    });
    navigator.vibrate?.(40);
    $("bellRipple").classList.remove("go");
    void $("bellRipple").offsetWidth;
    $("bellRipple").classList.add("go");
    ritualDone("bell");
    toast("The bell has spoken. Stay a moment.");
  }

  function showerFlowers() {
    const c = $("petals");
    const r = c.getBoundingClientRect();
    c.width = r.width; c.height = r.height;
    const ctx = c.getContext("2d");
    for (let i = 0; i < 48; i++) {
      petals.push({
        x: Math.random() * c.width,
        y: -20 - Math.random() * 80,
        s: 6 + Math.random() * 10,
        v: 0.8 + Math.random() * 1.6,
        a: Math.random() * 6,
        col: Math.random() > 0.4 ? "#E08A3A" : "#F4E4C1"
      });
    }
    if (!petalAnim) petalAnim = requestAnimationFrame(tickPetals);
    ritualDone("flower");
    toast("Pushpa offered.");
    function tickPetals() {
      ctx.clearRect(0, 0, c.width, c.height);
      petals.forEach((p) => {
        p.y += p.v; p.x += Math.sin(p.y / 20) * 0.6; p.a += 0.04;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.s, p.s * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      petals = petals.filter((p) => p.y < c.height + 20);
      if (petals.length) petalAnim = requestAnimationFrame(tickPetals);
      else { ctx.clearRect(0, 0, c.width, c.height); petalAnim = 0; }
    }
  }

  function lightDiya() {
    if (state.diyacount >= 7) state.diyacount = 0;
    state.diyacount += 1;
    save(state);
    $("diyaLayer").innerHTML = Array.from({ length: state.diyacount }, () => `<div class="vdiya"><div class="flame"></div></div>`).join("");
    ritualDone("diya");
    const ctx = ensureAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 180;
    o.type = "sine";
    g.gain.value = 0.04;
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.4);
    toast("A lamp is lit.");
  }

  function openRitual(kind) {
    if (kind === "flower") { showView("darshan"); showerFlowers(); return; }
    if (kind === "diya") { showView("darshan"); lightDiya(); return; }
    if (kind === "bell") { showView("darshan"); playBell(); return; }
    if (kind === "pray") {
      const list = state.prayers.slice(-5).reverse().map((p) => `<li>${p.text} <small>· ${p.date}</small></li>`).join("") || "<li>None yet — they stay only here.</li>";
      openModal(`<p class="kicker">Sankalp</p><h2 class="view-title">Write what you will not announce.</h2>
        <textarea class="sankalp" id="sankalpText" maxlength="400" placeholder="A name, a hope, a thank you…"></textarea>
        <button type="button" class="btn gold full" id="savePray" style="margin-top:12px">Keep on this device</button>
        <ul class="history">${list}</ul>`);
      $("savePray").onclick = () => {
        const text = $("sankalpText").value.trim();
        if (!text) return;
        state.prayers.push({ text, date: todayISO() });
        save(state);
        ritualDone("pray");
        closeModal();
        toast("Held privately on this device.");
      };
    }
  }

  function renderMala() {
    const svg = $("malaSvg");
    const beads = [];
    for (let i = 0; i < 108; i++) {
      const a = (i / 108) * Math.PI * 2 - Math.PI / 2;
      const r = 82;
      const x = 100 + Math.cos(a) * r;
      const y = 100 + Math.sin(a) * r;
      const on = i < state.jaap.count;
      beads.push(`<circle cx="${x}" cy="${y}" r="${i === state.jaap.count % 108 ? 4.2 : 3.1}" fill="${on ? "#E4C27A" : "rgba(247,239,227,.22)"}"/>`);
    }
    svg.innerHTML = `<circle cx="100" cy="100" r="62" fill="none" stroke="rgba(228,194,122,.15)"/>` + beads.join("");
    $("jaapCount").textContent = state.jaap.count;
    $("jaapDay").textContent = `Today: ${state.jaap.total} · A mala is 108`;
  }

  function renderJaap() {
    if (state.jaap.day !== todayISO()) { state.jaap.count = 0; state.jaap.total = 0; state.jaap.day = todayISO(); save(state); }
    $("mantraSel").innerHTML = MANTRAS.map((m) => `<option value="${m.id}" ${m.id === state.jaap.mantra ? "selected" : ""}>${m.text}</option>`).join("");
    $("mantraName").textContent = MANTRAS.find((m) => m.id === state.jaap.mantra).text;
    renderMala();
  }

  function tickJaap() {
    if (state.jaap.day !== todayISO()) { state.jaap.count = 0; state.jaap.total = 0; state.jaap.day = todayISO(); }
    state.jaap.count = (state.jaap.count % 108) + 1;
    state.jaap.total += 1;
    if (state.jaap.count === 108) {
      ritualDone("jaap");
      toast("One mala complete. Rest the breath.");
    }
    save(state);
    renderMala();
    navigator.vibrate?.(12);
    const ctx = ensureAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 520 + (state.jaap.count % 12) * 8;
    o.type = "sine";
    g.gain.value = 0.03;
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + 0.12);
  }

  function renderSeva() {
    $("donateTemple").innerHTML = TEMPLES.map((t) => `<button type="button" data-id="${t.id}" class="${t.id === state.fav ? "on" : ""}">${t.name}</button>`).join("");
    $("donateAmts").innerHTML = AMTS.map((n) => `<button type="button" data-amt="${n}">₹${n}</button>`).join("");
    let amt = 101;
    let tid = state.fav;
    $("donateTemple").onclick = (e) => {
      const b = e.target.closest("[data-id]");
      if (!b) return;
      tid = b.dataset.id;
      [...$("donateTemple").children].forEach((x) => x.classList.toggle("on", x === b));
    };
    $("donateAmts").onclick = (e) => {
      const b = e.target.closest("[data-amt]");
      if (!b) return;
      amt = Number(b.dataset.amt);
      $("donateCustom").value = "";
      [...$("donateAmts").children].forEach((x) => x.classList.toggle("on", x === b));
    };
    $("donateGo").onclick = () => {
      const custom = Number($("donateCustom").value);
      const value = custom > 0 ? custom : amt;
      const t = temple(tid);
      state.donations.unshift({ temple: t.name, value, date: todayISO() });
      save(state);
      renderDonateHist();
      toast(`₹${value} noted. Opening ${t.name}’s official page.`);
      window.open(t.donate, "_blank", "noopener");
    };
    renderDonateHist();
    $("prasadTemple").innerHTML = TEMPLES.filter((t) => t.prasad).map((t) => `<option value="${t.id}">${t.name}</option>`).join("");
    const fillItems = () => {
      const t = temple($("prasadTemple").value);
      $("prasadItem").innerHTML = (t.prasad || []).map((p) => `<option value="${p.id}">${p.name}</option>`).join("");
    };
    $("prasadTemple").onchange = fillItems;
    fillItems();
    $("prasadGo").onclick = () => {
      const t = temple($("prasadTemple").value);
      const item = $("prasadItem").selectedOptions[0]?.textContent;
      const name = $("prasadName").value.trim();
      const addr = $("prasadAddr").value.trim();
      if (!name || !addr) { toast("Name and address help the trust reach you."); return; }
      state.prasad.unshift({ temple: t.name, item, name, date: todayISO() });
      save(state);
      renderPrasadHist();
      toast("Request saved on this device. Fulfilment is with the temple trust.");
    };
    renderPrasadHist();
  }

  function renderDonateHist() {
    $("donateHist").innerHTML = state.donations.slice(0, 5).map((d) => `<li>₹${d.value} · ${d.temple} · ${d.date}</li>`).join("") || "<li>No offerings yet.</li>";
  }
  function renderPrasadHist() {
    $("prasadHist").innerHTML = state.prasad.slice(0, 5).map((d) => `<li>${d.item} · ${d.temple} · ${d.date}</li>`).join("") || "<li>No prasad requests yet.</li>";
  }

  function requestNotify() {
    if (!("Notification" in window)) return Promise.resolve(false);
    if (Notification.permission === "granted") return Promise.resolve(true);
    return Notification.requestPermission().then((p) => p === "granted");
  }

  function scheduleAartiPings() {
    if (!state.notify || Notification.permission !== "granted") return;
    const t = temple(state.fav);
    if (!t) return;
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: IST, hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    const cur = Number(parts.find((p) => p.type === "hour").value) * 60 + Number(parts.find((p) => p.type === "minute").value);
    t.aarti.forEach((slot) => {
      const [H, M] = slot.split(":").map(Number);
      let diff = H * 60 + M - cur;
      if (diff < 1 || diff > 12 * 60) return;
      setTimeout(() => {
        new Notification(`Darshan · ${t.name}`, { body: `Aarti begins now (${slot} IST).`, silent: false });
        toast(`${t.name} aarti is beginning.`);
      }, diff * 60 * 1000);
    });
  }

  function renderOnboard() {
    $("obTemples").innerHTML = TEMPLES.map((t) =>
      `<button type="button" class="pick ${state.temples.includes(t.id) ? "on" : ""}" data-id="${t.id}"><b>${t.name}</b><div class="lede" style="margin:0;font-size:12px">${t.place}</div></button>`
    ).join("");
    $("obTemples").onclick = (e) => {
      const b = e.target.closest("[data-id]");
      if (!b) return;
      const id = b.dataset.id;
      const i = state.temples.indexOf(id);
      if (i >= 0) { if (state.temples.length > 1) state.temples.splice(i, 1); }
      else state.temples.push(id);
      renderOnboard();
    };
    $("obDeities").innerHTML = DEITIES.map((d) =>
      `<button type="button" class="deity ${state.deities.includes(d.id) ? "on" : ""}" data-did="${d.id}"><i>${d.glyph}</i><span>${d.name}</span></button>`
    ).join("");
    $("obDeities").onclick = (e) => {
      const b = e.target.closest("[data-did]");
      if (!b) return;
      const id = b.dataset.did;
      const i = state.deities.indexOf(id);
      if (i >= 0) state.deities.splice(i, 1);
      else state.deities.push(id);
      renderOnboard();
    };
  }

  function startDust() {
    const c = $("dust");
    const ctx = c.getContext("2d");
    const resize = () => { c.width = innerWidth; c.height = innerHeight; };
    resize();
    addEventListener("resize", resize);
    dust = Array.from({ length: 40 }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight,
      r: Math.random() * 1.4 + 0.3, v: Math.random() * 0.25 + 0.05
    }));
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = "rgba(228,194,122,.45)";
      dust.forEach((p) => {
        p.y -= p.v; if (p.y < 0) p.y = c.height;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      dustRaf = requestAnimationFrame(tick);
    };
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) tick();
  }

  function enterApp() {
    $("splash").classList.add("hidden");
    if (!state.onboarded) {
      $("onboard").classList.remove("hidden");
      renderOnboard();
      return;
    }
    $("app").classList.remove("hidden");
    showView("home");
    scheduleAartiPings();
  }

  $("enterBtn").onclick = enterApp;
  $("obGo").onclick = async () => {
    state.onboarded = true;
    state.notify = $("obNotify").checked;
    state.fav = state.temples[0];
    save(state);
    if (state.notify) await requestNotify();
    $("onboard").classList.add("hidden");
    $("app").classList.remove("hidden");
    showView("home");
    scheduleAartiPings();
  };

  $("notifyBtn").onclick = async () => {
    const ok = await requestNotify();
    state.notify = ok;
    save(state);
    toast(ok ? "Aarti reminders are on for your favourite temple." : "Reminders need notification permission.");
    scheduleAartiPings();
  };

  $("editPins").onclick = () => {
    state.onboarded = false;
    save(state);
    $("app").classList.add("hidden");
    $("onboard").classList.remove("hidden");
    renderOnboard();
  };

  document.querySelector(".dock").onclick = (e) => {
    const b = e.target.closest("[data-nav]");
    if (b) showView(b.dataset.nav);
  };

  document.querySelector(".offer-bar").onclick = (e) => {
    const b = e.target.closest("[data-offer]");
    if (b) openRitual(b.dataset.offer);
    if (e.target.closest("#favTempleBtn")) {
      const id = state.fav;
      const i = state.temples.indexOf(id);
      if (i >= 0) state.temples.splice(i, 1);
      else state.temples.push(id);
      if (!state.temples.length) state.temples.push(id);
      save(state);
      toast(state.temples.includes(id) ? "Pinned. We’ll watch this aarti." : "Unpinned.");
      requestNotify();
    }
  };

  document.querySelectorAll(".puja-tile").forEach((b) => {
    b.onclick = () => openRitual(b.dataset.ritual);
  });

  $("malaBtn").onclick = tickJaap;
  $("mantraSel").onchange = () => {
    state.jaap.mantra = $("mantraSel").value;
    $("mantraName").textContent = MANTRAS.find((m) => m.id === state.jaap.mantra).text;
    save(state);
  };

  addEventListener("keydown", (e) => {
    if (e.code === "Space" && !$("view-puja").classList.contains("hidden") && document.activeElement.tagName !== "TEXTAREA" && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      tickJaap();
    }
  });

  startDust();
})();
