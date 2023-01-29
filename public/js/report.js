// report post
const reportBtnDiv = document.querySelectorAll(".report-btn-div");
const reportReasonsSection = document.querySelector("#report-reasons-section");
const reportCancel = document.querySelector("#caneclBtn");
const inputCheckbox = document.querySelectorAll("input[type=checkbox]");
reportBtnDiv.forEach((container) => {
  const reportBtn = container.querySelector("#reportBtn");
  let postId;
  reportBtn.addEventListener("click", (e) => {
    postId = reportBtn.dataset.id;
    document.querySelector("#reportForm").setAttribute("data-post", postId);
    reportReasonsSection.classList.replace("hidden", "flex");
  });
});

reportCancel.addEventListener("click", () => {
  reportReasonsSection.classList.replace("flex", "hidden");
});
// select only one checkbox
for (let i = 0; i < inputCheckbox.length; i++) {
  inputCheckbox[i].addEventListener("click", (e) => {
    for (let j = 0; j < inputCheckbox.length; j++) {
      inputCheckbox.item(j).checked = false;
    }
    e.target.checked = true;
  });
}
// prevent report form from submitting without selecting a checkbox
const reportForm = document.querySelector("#reportForm");

reportForm.addEventListener("submit", (e) => {
  const checkbox = reportForm.querySelectorAll("input[type=checkbox]");
  const postId = reportForm.dataset.post;
  let isChecked = false;
  let reason;
  for (let i = 0; i < checkbox.length; i++) {
    if (checkbox.item(i).checked) {
      isChecked = true;
      reason = checkbox.item(i).value;
      break;
    }
  }
  if (!isChecked) {
    alert("Please select an option");
    e.preventDefault();
  }
  handleReportFormSubmit(postId, reason);
});

function handleReportFormSubmit(postId, reason) {
  fetch("/report_post", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId: postId, reason: reason }),
  })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}
