// email input
const emailInput = document.querySelector(".emailInput");
const passwordInput = document.querySelector(".passwordInput");
const nextBtn = document.querySelector(".nextBtn");
const otpDiv = document.querySelector(".otpDiv");

nextBtn.disabled = true;
nextBtn.style.opacity = 0.7;

window.addEventListener("load", (e) => {
  otpDiv.classList.remove("active");
});

// disable next button if email input field is empty
emailInput.addEventListener("input", (e) => {
  if (e.currentTarget.value !== "" || e.currentTarget.value.length !== 0) {
    nextBtn.disabled = false;
    nextBtn.style.opacity = 1;
  } else {
    nextBtn.disabled = true;
    nextBtn.style.opacity = 0.7;
  }
});
nextBtn.addEventListener("click", (e) => {
  otpDiv.classList.add("active");
  nextBtn.innerText = "Submit";
  emailInput.readOnly = true;
  emailInput.style.opacity = 0.8;
  passwordInput.focus();
});

passwordInput.addEventListener("input", (e) => {
  if (e.currentTarget.value.length <= 6 || e.currentTarget.value === "") {
    nextBtn.disabled = true;
    nextBtn.style.opacity = 0.8;
  } else {
    nextBtn.disabled = false;
    nextBtn.style.opacity = 1;
    nextBtn.setAttribute("type", "submit");
  }
});
