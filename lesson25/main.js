const checkBox = document.getElementById("js-checkBox");
const submitBtn = document.getElementById("js-submitBtn");
const scrollEnd = document.getElementById("js-scrollEnd");
const modal = document.getElementById("js-modal");
const openModal = document.getElementById("js-openModal");
const closeModal = document.getElementById("js-closeModalBtn");
const mask = document.getElementById("js-mask");

const flags = {
  userName: false,
  email: false,
  pass: false,
  checkBox: false
};

const createElementWithClassName = (element, name) => {
  const createdElement = document.createElement(element);
  createdElement.classList.add(name);
  return createdElement;
};

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

const checkInputVal = (targetForm) => {
  const targetVal = targetForm.value;
  let result;

  switch (targetForm.id) {
    case "userName":
      const minLength = 1;
      const maxLength = 15;
      result = targetVal.length >= minLength && targetVal.length <= maxLength;
      break;
    case "email":
      const emailValid = /^\w[\w_.-]*@.+\..+/;
      result = emailValid.test(targetVal);
      break;
    case "pass":
      const passValid = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\w{8,}/;
      result = passValid.test(targetVal);
      break;
    default:
      console.error(`は見つかりませんでした`);
  }

  result ? (flags[targetForm.id] = true) : (flags[targetForm.id] = false);
  return result;
};

const createErrorMessage = (targetFormId) => {
  const errorTxt = createElementWithClassName("p", "error-txt");
  errorTxt.id = "js-errorTxt";

  switch (targetFormId) {
    case "userName":
      errorTxt.textContent = "ユーザー名は15文字以下にしてください。";
      break;
    case "email":
      errorTxt.textContent = "メールアドレスの形式になっていません。";
      break;
    case "pass":
      errorTxt.textContent =
        "8文字以上の大小の英数字を交ぜたものにしてください。";
      break;
    default:
      console.error(`は見つかりませんでした`);
  }

  return errorTxt;
};

const renderErrorMessage = (targetFormId) => {
  const errorTxt = createErrorMessage(targetFormId);
  const targetInput = document.getElementById(targetFormId);
  targetInput.after(errorTxt);
};

//It's called in the HTML file
const validateInputVal = (targetForm) => {
  const check = checkInputVal(targetForm);
  const errorTxtEle = targetForm.nextElementSibling;
  !check && !errorTxtEle && renderErrorMessage(targetForm.id);
  check && errorTxtEle && errorTxtEle.remove();
  switchSbumitBtn();
};

const observer = new IntersectionObserver((targets) => {
  if (targets[0].intersectionRatio === 1) {
    checkBox.disabled = false;
    checkBox.checked = true;
    flags.checkBox = true;
  }
  switchSbumitBtn();
});
observer.observe(scrollEnd);

const switchSbumitBtn = () => {
  const checkFlags = Object.values(flags).every((val) => val);
  checkFlags ? (submitBtn.disabled = false) : (submitBtn.disabled = true);
};

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
