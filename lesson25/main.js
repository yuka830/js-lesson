const checkBox = document.getElementById("js-checkBox");
const submitBtn = document.getElementById("js-submitBtn");
const scrollEnd = document.getElementById("js-scrollEnd");
const modal = document.getElementById("js-modal");
const openModal = document.getElementById("js-openModal");
const closeModal = document.getElementById("js-closeModalBtn");
const mask = document.getElementById("js-mask");

submitBtn.addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    if (!checkBox.checked) {
      alert("利用規約を全て確認後、チェックボタンを押してから送信して下さい。");
      return;
    }
    document.location.href = "./register-done.html";
  },
  false
);

const observer = new IntersectionObserver((targets) => {
  if (targets[0].intersectionRatio === 1) {
    checkBox.disabled = false;
    checkBox.checked = true;
  }
});
observer.observe(scrollEnd);

const showModal = () => {
  modal.classList.remove("hidden");
  mask.classList.remove("hidden");
};

const hiddenModal = () => {
  modal.classList.add("hidden");
  mask.classList.add("hidden");
};

mask.addEventListener("click", () => {
  closeModal.click();
});

openModal.addEventListener("click", showModal);
closeModal.addEventListener("click", hiddenModal);
