const loginBtn = document.getElementById("js-loginBtn");
const userNameInput = document.getElementById("userName");
const passInput = document.getElementById("pass");

const flags = {
  userName: false,
  pass: false
};

const createElementWithClassName = (element, name) => {
  const createdElement = document.createElement(element);
  createdElement.classList.add(name);
  return createdElement;
};

const loginHandler = async (e) => {
  e.preventDefault();
  const inputVal = {
    name: userNameInput.value,
    pass: passInput.value
  };

  let result;
  try {
    const token = await login(inputVal);
    localStorage.setItem("token", JSON.stringify(token));
    result = true;
  } catch {
    result = false;
  } finally {
    changeLocation(result);
  }
};

loginBtn.addEventListener("click", loginHandler);

const login = (inputVal) => {
  return new Promise((resolve, reject) => {
    if (checkUserData(inputVal)) {
      resolve({
        token: "far0fja*ff]afaawfqrlzkfq@aq9283af",
        ok: true,
        code: 200
      });
    } else {
      reject({ ok: false, code: 401 });
    }
  });
};

const checkUserData = (inputVal) => {
  const userData = {
    name: "morikenjuku",
    pass: "N302aoe3"
  };
  return inputVal.name === userData.name && inputVal.pass === userData.pass;
};

const changeLocation = (result) => {
  window.location.href = result ? "./news.html" : "./login-failure.html";
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
    }
  },
  pass: {
    errorMessage: "8文字以上の大小の英数字を交ぜたものにしてください。",
    isValid: (val) =>
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{8,}$/.test(val)
  }
};

const checkInputVal = (targetForm) => {
  const targetInput = document.getElementById(targetForm.id);
  const result = validations[targetForm.id].isValid(targetForm.value);
  if (result) {
    flags[targetForm.id] = true;
    return;
  }
  flags[targetForm.id] = false;
  targetInput.after(createErrorMessage(targetForm));
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
