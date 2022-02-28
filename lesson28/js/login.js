const loginWrapper = document.getElementById("js-login");
const loginBtn = document.getElementById("js-loginBtn");
const userNameInput = document.getElementById("userName");
const passInput = document.getElementById("pass");
const mask = document.getElementById("js-mask");

const flags = {
  userName: false,
  pass: false,
};

const createElementWithClassName = (element, name) => {
  const createdElement = document.createElement(element);
  createdElement.classList.add(name);
  return createdElement;
};

const loginHandler = async () => {
  const inputVal = {
    name: userNameInput.value,
    pass: passInput.value,
  };
  try {
    const token = await login(inputVal);
    localStorage.setItem("token", JSON.stringify(token));
  } catch {
    changeModalImgAndErrorText();
    changeErrorLocation();
    return;
  }
  changeModalImgAndText();
  changeSuccessLocation();
};

loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showModal();
  loginHandler();
});

const login = (inputVal) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (checkUserData(inputVal)) {
        resolve({
          token: "far0fja*ff]afaawfqrlzkfq@aq9283af",
          ok: true,
          code: 200,
        });
      } else {
        reject({ ok: false, code: 401 });
      }
    }, 3000);
  });
};

const checkUserData = (inputVal) => {
  const userData = {
    name: "morikenjuku",
    pass: "N302aoe3",
  };
  return inputVal.name === userData.name && inputVal.pass === userData.pass;
};

const changeSuccessLocation = () => {
  setTimeout(() => {
    window.location.href = "./index.html";
  }, 3000);
};

const changeErrorLocation = () => {
  setTimeout(() => {
    window.location.href = "./login-failure.html";
  }, 3000);
};

/* モーダル  */
const careateModal = () => {
  const modal = createElementWithClassName("div", "modal");
  modal.id = "js-modal";
  return modal;
};

const createLoading = () => {
  const loader = createElementWithClassName("div", "loading");
  const img = createElementWithClassName("img", "loading-img");
  img.id = "js-modalImg";
  img.src = "./img/loading-circle.gif";
  loader.appendChild(img);
  return loader;
};

const createText = () => {
  const text = createElementWithClassName("p", "modal-text");
  text.id = "js-modalText";
  text.textContent = "Checking…";
  return text;
};

const showModal = () => {
  const modal = careateModal();
  modal.appendChild(createLoading());
  modal.insertAdjacentElement("beforeend", createText());
  loginWrapper.appendChild(modal);
  mask.classList.remove("hidden");
};

const changeModalImgAndText = () => {
  const img = document.getElementById("js-modalImg");
  const text = document.getElementById("js-modalText");
  img.src = "./img/success.png";
  text.textContent = "Success!";
};

const changeModalImgAndErrorText = () => {
  const img = document.getElementById("js-modalImg");
  const text = document.getElementById("js-modalText");
  img.src = "./img/failure.png";
  text.textContent = "Failed...";
};

/* バリデーション */
const validations = {
  userName: {
    maxLength: 15,
    minLength: 1,
    errorMessage: "※ユーザー名は1文字以上15文字以下です。",
    isValid: (val) => {
      return (
        val.length >= validations.userName.minLength &&
        val.length <= validations.userName.maxLength
      );
    },
  },
  pass: {
    errorMessage: "8文字以上の大小の英数字を交ぜたものにしてください。",
    isValid: (val) =>
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,}$/.test(val),
  },
};

const checkInputVal = (targetForm) => {
  const targetInput = document.getElementById(targetForm.id);
  const result = validations[targetForm.id].isValid(targetForm.value);
  if (result) {
    flags[targetForm.id] = true;
    targetForm.classList.contains("error-shake") &&
      targetForm.classList.remove("error-shake");
    return;
  }
  flags[targetForm.id] = false;
  targetInput.after(createErrorMessage(targetForm));
  targetForm.classList.add("error-shake");
};

const createErrorMessage = (targetForm) => {
  const errorTxt = createElementWithClassName("p", "error-txt");
  errorTxt.textContent = validations[targetForm.id].errorMessage;
  return errorTxt;
};

const validateInputVal = (targetForm) => {
  const errorTxtEle = targetForm.nextElementSibling;
  checkInputVal(targetForm);
  errorTxtEle && errorTxtEle.remove();
  switchLoginBtn();
};

userNameInput.addEventListener("blur", (e) => validateInputVal(e.target));
passInput.addEventListener("blur", (e) => validateInputVal(e.target));

const switchLoginBtn = () => {
  const checkFlags = Object.values(flags).every((val) => val);
  loginBtn.disabled = checkFlags ? false : true;
};
