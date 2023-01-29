// alert message
const alertMessage = document.querySelector(".alert-message");
if (alertMessage) {
  alertMessage.classList.replace("hidden", "block");
  setTimeout(() => {
    alertMessage.classList.replace("block", "hidden");
  }, 3000);
}

// submit select-avatar form on clicking a input tag
const avatarForm = document.querySelector(".select-avatar-form");
const avatarInput = document.querySelectorAll(".avatar-inputs");
avatarInput.forEach((i) => {
  i.addEventListener("click", () => {
    avatarForm.submit();
  });
});

//  copy post url
//  /confession/:id
const copyLinkDiv = document.querySelectorAll(".copy-link-div");
const linkCopyMsg = document.querySelector(".linked-copied-msg");
copyLinkDiv.forEach((container) => {
  const inputField = container.querySelector(".copy-link-input");
  const copyBtn = container.querySelector(".copyLinkBtn");

  copyBtn.addEventListener("click", () => {
    const protocol = window.location.protocol;
    const host = window.location.host;

    const id = inputField.value;
    const link = `${protocol}//${host}/confession/${id}`;
    navigator.clipboard.writeText(link);

    linkCopyMsg.classList.replace("hidden", "block");
    setTimeout(() => {
      linkCopyMsg.classList.replace("block", "hidden");
    }, 3000);
  });
});

// menu bar
const menuSection = document.querySelector(".menuSection");
const menuBtn = document.querySelector("#menuBtn");
const linkContainer = document.querySelector("#linkContainer");
const closeBtn = document.querySelector(".closeBtn");
document.addEventListener("DOMContentLoaded", () => {
  if (menuSection) {
    document.onclick = function (e) {
      if (e.target.id !== "menuBtn" && e.target.id !== "linkContainer") {
        menuSection.classList.remove("active");
      }
    };
  }
  menuBtn.addEventListener("click", () => {
    menuSection.classList.toggle("active");
  });
  closeBtn.addEventListener("click", () => {
    menuSection.classList.remove("active");
  });
});

// change theme
const themeBtn = document.querySelector("#theme");
const themeIcon = document.querySelector("#themeIcon");

// theme vars
const userTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("prefers-color-scheme: dark").matches;

// switch icon to sun
const switchSun = () => {
  themeIcon.setAttribute("name", "sunny");
  themeBtn.querySelector("span").innerText = "Light";
};
// switch icon to moon
const switchMoon = () => {
  themeIcon.setAttribute("name", "moon");
  themeBtn.querySelector("span").innerText = "Dark";
};
console.log(document.documentElement.classList.contains("dark"));
// initial theme check
const themeCheck = () => {
  if (userTheme === "dark" || (!userTheme && systemTheme)) {
    document.documentElement.classList.add("dark");
    switchMoon();
    return;
  }
  document.documentElement.classList.remove("dark");
  switchSun();
};

const switchTheme = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    switchSun();
    return;
  }
  document.documentElement.classList.add("dark");
  switchMoon();
  localStorage.setItem("theme", "dark");
};

themeBtn.addEventListener("click", () => {
  switchTheme();
});

// check theme on load initially
themeCheck();
