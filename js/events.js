// Mock data from the project brief (eventsStore). Images are local copies of the design assets.
const eventsStore = [
  {
    title: "INFJ Personality Type - Coffee Shop Meet & Greet",
    description: "Being an INFJ",
    date: new Date(2024, 2, 23, 15),
    image: "img/ev-519218942.webp",
    type: "offline",
    attendees: 99,
    category: "Hobbies and Passions",
    distance: 50,
  },
  {
    title: "NYC AI Users - AI Tech Talks, Demo & Social: RAG Search and Customer Experience",
    description: "New York AI Users",
    date: new Date(2024, 2, 23, 11, 30),
    image: "img/ev-519111663.webp",
    type: "offline",
    attendees: 43,
    spotsLeft: 2,
    category: "Technology",
    distance: 25,
  },
  {
    title: "Book 40+ Appointments Per Month Using AI and Automation",
    description: "New Jersey Business Network",
    date: new Date(2024, 2, 16, 14),
    image: "img/ev-519405643.webp",
    type: "online",
    category: "Technology",
    distance: 10,
  },
  {
    title: "Dump writing group weekly meetup",
    description: "Dump writing group",
    date: new Date(2024, 2, 13, 11),
    image: "img/ev-519549716.webp",
    imageTall: true,
    type: "online",
    attendees: 77,
    category: "Business",
    distance: 100,
  },
  {
    title: "Over 40s, 50s, & 60s Senior Singles Chat, Meet & Dating Community",
    description: "Over 40s, 50s, 60s Singles Chat, Meet & Dating Community",
    date: new Date(2024, 2, 14, 11),
    image: "img/ev-519527424.webp",
    type: "online",
    attendees: 140,
    category: "Social Activities",
    distance: 74,
  },
  {
    title: "All Nations - Manhattan Missions Church Bible Study",
    description: "Manhattan Bible Study Meetup Group",
    date: new Date(2024, 2, 14, 11),
    image: "img/ev-518898207.webp",
    type: "offline",
    category: "Health and Wellbeing",
    distance: 15,
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n) => String(n).padStart(2, "0");

// Calendar day key, e.g. "2024-03-13"
function dayKey(d) {
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

// "Wed, Mar 13 · 11:30 PM UTC" (time shown as in the design)
function formatDate(d) {
  const h24 = d.getHours();
  const h = h24 % 12 || 12;
  const ampm = h24 >= 12 ? "PM" : "AM";
  return WEEKDAYS[d.getDay()] + ", " + MONTHS[d.getMonth()] + " " + d.getDate() +
    " · " + h + ":" + pad(d.getMinutes()) + " " + ampm + " UTC";
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Category line: distance is shown only for offline events (as in the design)
function categoryText(ev) {
  return ev.type === "offline" ? ev.category + " (" + ev.distance + " km)" : ev.category;
}

function attendeesLine(ev) {
  if (ev.attendees === undefined) return null;
  const p = el("p", "ev-row__att");
  p.textContent = ev.attendees + " attendees";
  if (ev.spotsLeft) {
    p.appendChild(document.createTextNode(" "));
    p.appendChild(el("span", null, "·"));
    p.appendChild(document.createTextNode(" "));
    p.appendChild(el("b", null, ev.spotsLeft + " spots left"));
  }
  return p;
}

function onlineBadge() {
  const badge = el("span", "badge-online");
  const icon = document.createElement("img");
  icon.src = "img/icon-online.svg";
  icon.alt = "";
  badge.appendChild(icon);
  badge.appendChild(document.createTextNode("Online Event"));
  return badge;
}

function desktopRow(ev) {
  const a = el("a", "ev-row");
  a.href = "#";
  const img = el("div", "ev-row__img" + (ev.imageTall ? " ev-row__img--tall" : ""));
  const pic = document.createElement("img");
  pic.src = ev.image;
  pic.alt = "";
  img.appendChild(pic);
  if (ev.type === "online") img.appendChild(onlineBadge());
  a.appendChild(img);

  const body = el("div", "ev-row__body");
  body.appendChild(el("p", "ev-row__date", formatDate(ev.date)));
  body.appendChild(el("h2", "ev-row__title", ev.title));
  body.appendChild(el("p", "ev-row__cat", categoryText(ev)));
  const att = attendeesLine(ev);
  if (att) body.appendChild(att);
  a.appendChild(body);
  return a;
}

function mobileRow(ev) {
  const a = el("a", "m-row m-row--a");
  a.href = "#";
  const img = el("div", "m-row__img");
  const pic = document.createElement("img");
  pic.src = ev.image;
  pic.alt = "";
  img.appendChild(pic);
  a.appendChild(img);

  const body = el("div", "m-row__body");
  body.appendChild(el("p", "m-row__date", formatDate(ev.date)));
  body.appendChild(el("p", "m-row__title", ev.title));
  body.appendChild(el("p", "m-row__cat", categoryText(ev)));
  if (ev.type === "online") {
    const badge = el("p", "m-badge");
    const icon = document.createElement("img");
    icon.src = "img/icon-online.svg";
    icon.alt = "";
    badge.appendChild(icon);
    badge.appendChild(document.createTextNode("Online Event"));
    body.appendChild(badge);
  }
  a.appendChild(body);
  return a;
}

const form = document.getElementById("filters");
const selDay = document.getElementById("f-day");
const selType = document.getElementById("f-type");
const selDistance = document.getElementById("f-distance");
const selCategory = document.getElementById("f-category");
const listDesktop = document.getElementById("ev-list");
const listMobile = document.getElementById("ev-list-mobile");
const emptyMsg = document.getElementById("ev-empty");

// Day options are built from the days that actually have events
const days = [...new Set(eventsStore.map((ev) => dayKey(ev.date)))].sort();
days.forEach((key) => {
  const d = eventsStore.find((ev) => dayKey(ev.date) === key).date;
  selDay.appendChild(el("option", null, MONTHS[d.getMonth()] + " " + d.getDate())).value = key;
});

function matches(ev) {
  if (selDay.value && dayKey(ev.date) !== selDay.value) return false;
  if (selType.value && ev.type !== selType.value) return false;
  if (selDistance.value) {
    // Distance applies to offline events only: within the chosen radius
    if (ev.type !== "offline" || ev.distance > Number(selDistance.value)) return false;
  }
  if (selCategory.value && ev.category !== selCategory.value) return false;
  return true;
}

function render() {
  const items = eventsStore.filter(matches);
  listDesktop.replaceChildren(...items.map(desktopRow));
  listMobile.replaceChildren(...items.map(mobileRow));
  emptyMsg.hidden = items.length > 0;
}

form.addEventListener("change", render);
render();
