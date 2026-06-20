import { interventions } from "./data.js";

const activeFilters = { kategorie: [], status: [] };

const grid = document.getElementById("grid");

const shapes = document.querySelectorAll(".shape");

const configs = [
  { x: .2, y: -0.1 },
  { x: .1, y: 0.10 },
  { x: -0.05, y: 0.15 },
  { x: .1, y: -0.1 },
  { x: 0.3, y: 0.50 },
  { x: .02, y: -0.15 },
  { x: 1.2, y: 0.15 }
];

let targetScroll = 0;
let currentScroll = 0;

window.addEventListener("scroll", () => {
  targetScroll = window.scrollY;
});

function animate() {
  currentScroll += (targetScroll - currentScroll) * 0.08;

  shapes.forEach((shape, i) => {
    const cfg = configs[i];

    const moveX = currentScroll * cfg.x;
    const moveY = currentScroll * cfg.y;

    shape.style.transform =
      `translate(${moveX}px, ${moveY}px)`;
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("scroll", () => {
  requestAnimationFrame(updateParallax);
});

function renderFilters() {
  const kategorien = ["Irritation", "Verstärkung", "Zuspitzung", "Support", "Physische Erfahrung"];
  const status = ["in umsetzung", "pausiert", "abgeschlossen", "wird nicht umgesetzt"];

  document.getElementById("filter-kategorie").innerHTML =
    kategorien.map(v =>
      `<button class="filter-btn" data-type="kategorie" data-value="${v}">${v}</button>`
    ).join("");

  document.getElementById("filter-status").innerHTML =
    status.map(v =>
      `<button class="filter-btn" data-type="status" data-value="${v}">${v}</button>`
    ).join("");
}

function render() {
  grid.innerHTML = "";

  const filtered = interventions.filter(item => {
    const catMatch =
      activeFilters.kategorie.length === 0 ||
      item.kategorie.some(c => activeFilters.kategorie.includes(c));

    const statusMatch =
      activeFilters.status.length === 0 ||
      activeFilters.status.includes(item.status);

    return catMatch && statusMatch;
  });

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => openDetail(item);

    const cats = item.kategorie.map(c =>
      `<span class="kategorie">${c}</span>`
    ).join("");

    card.innerHTML = `
      <img src="${item.images ? item.images[0] : item.img}">
      <div class="card-content">
        ${cats}
        <h2>${item.title}</h2>
        <span class="status" data-status="${item.status}">${item.status}</span>
      </div>
    `;

    grid.appendChild(card);
  });

  document.querySelectorAll(".filter-btn").forEach(btn => {
    const val = btn.dataset.value;
    const type = btn.dataset.type;

    const active = activeFilters[type].includes(val);
    btn.classList.toggle("active", active);
  });
}

function toggleFilter(type, value) {
  const arr = activeFilters[type];
  const i = arr.indexOf(value);
  i > -1 ? arr.splice(i, 1) : arr.push(value);
  render();
}

function openDetail(item) {
  document.getElementById("detail-title").innerText = item.title;

  // TEXT
  document.getElementById("detail-text").innerHTML = item.text;

  // IMAGES
  const imageContainer = document.getElementById("detail-images");
  imageContainer.innerHTML = "";

  const images = item.images || (item.img ? [item.img] : []);

  images.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;

    if (index === 0) {
      img.classList.add("hero");
    }

    if (index === 1 || index === 2) {
      img.classList.add("feature");
    }

    imageContainer.appendChild(img);
  });

  // KATEGORIEN
  const catEl = document.getElementById("detail-kategorie");
  catEl.innerHTML = "";

  item.kategorie.forEach(c => {
    const span = document.createElement("span");
    span.className = "kategorie";
    span.textContent = c;
    catEl.appendChild(span);
  });

  // STATUS
  const statusEl = document.getElementById("detail-status");
  statusEl.innerText = item.status;
  statusEl.setAttribute("data-status", item.status);

  // OPEN
  document.getElementById("overlay").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeDetail() {
  document.getElementById("overlay").classList.remove("active");
  document.body.style.overflow = "auto";
}

document.addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  toggleFilter(btn.dataset.type, btn.dataset.value);
});

document.getElementById("closeBtn").addEventListener("click", closeDetail);

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeDetail();
});

renderFilters();
render();
