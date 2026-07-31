const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const menu = document.querySelector("[data-menu]");
const dialog = document.querySelector("[data-video-dialog]");
const dialogVideo = document.querySelector("[data-dialog-video]");
const dialogTitle = document.querySelector("[data-dialog-title]");

const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 28);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuButton?.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(open));
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

document.querySelectorAll("[data-video]").forEach((button) => {
  button.addEventListener("click", () => {
    dialogVideo.src = button.dataset.video;
    dialogTitle.textContent = button.dataset.title || "Projeto em vídeo";
    dialog.showModal();
    dialogVideo.play().catch(() => {});
  });
});

const closeDialog = () => {
  dialogVideo.pause();
  dialogVideo.removeAttribute("src");
  dialogVideo.load();
  dialog.close();
};
document.querySelector("[data-dialog-close]")?.addEventListener("click", closeDialog);
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});
dialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDialog();
});

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = new Date().getFullYear();
});
