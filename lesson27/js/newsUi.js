import { differenceInDays } from "date-fns";

const jsonUrl = "https://myjson.dit.upm.es/api/bins/g7df";
const newsWrapper = document.getElementById("js-news");
const tabUl = document.getElementById("js-news-tabs");

const createElementWithClassName = (element, name) => {
  const createdElement = document.createElement(element);
  createdElement.classList.add(name);
  return createdElement;
};

//comment-icon
const renderCommentIcon = (element) => {
  const commentSpan = createElementWithClassName("span", "comment-icon");
  const commentImg = document.createElement("img");
  commentImg.src = "./img/comment.png";
  commentSpan.appendChild(commentImg);
  element.appendChild(commentSpan);
};

//new-label
const renderNewLabel = (element) => {
  const newLabel = createElementWithClassName("span", "new-label");
  newLabel.textContent = "NEW!";
  element.appendChild(newLabel);
};

//check days between today and posted date for new-label
const isWithinSpecificDays = (date) => {
  const newLavelPeriod = 3;
  const distanceDate = differenceInDays(new Date(), new Date(date));
  return distanceDate <= newLavelPeriod;
};

//news-img
const creatNewsImg = (element, category) => {
  const imgWrapper = createElementWithClassName("div", "news__img");
  const newsImg = document.createElement("img");
  newsImg.src = `./img/${category}.png`;
  imgWrapper.appendChild(newsImg);
  element.appendChild(imgWrapper);
};

//tab
const renderNewTab = (newsUiItems) => {
  const tabFragment = document.createDocumentFragment();

  newsUiItems.forEach((newsUiItem, index) => {
    const tabLi = createElementWithClassName("li", "tab");
    tabLi.textContent = newsUiItem.category;
    tabLi.dataset.category = newsUiItem.category;
    index === 0 && tabLi.classList.add("is-active");

    tabLi.addEventListener("click", tabSwitch);
    tabFragment.appendChild(tabLi);
  });

  tabUl.appendChild(tabFragment);
};

//news
const createArticleTitles = ({ articles }) => {
  const titleFragment = document.createDocumentFragment();
  articles.forEach((article) => {
    const contentLi = createElementWithClassName("li", "news__item");
    const a = document.createElement("a");
    a.textContent = article.title;
    a.href = "#";
    titleFragment.appendChild(contentLi).appendChild(a);

    isWithinSpecificDays(article.date) && renderNewLabel(contentLi);
    article.comments > 0 && renderCommentIcon(contentLi);
  });
  return titleFragment;
};

const createContentsItem = (newsUiItems) => {
  const contentFragment = document.createDocumentFragment();
  newsUiItems.forEach((newsUiItem, index) => {
    const newsContent = createElementWithClassName("div", "news__content");
    const elementForFlex = createElementWithClassName("div", "flex");
    const contentUl = createElementWithClassName("ul", "js-news__lists");
    const categoryName = newsUiItem.category;
    newsContent.classList.add(`js-${categoryName}`);
    //とりあえず最初のインデックスをアクティブなタブとする
    index === 0 && newsContent.classList.add("is-show");
    creatNewsImg(elementForFlex, categoryName);

    contentFragment
      .appendChild(newsContent)
      .appendChild(elementForFlex)
      .appendChild(contentUl)
      .appendChild(createArticleTitles(newsUiItem));
  });
  return contentFragment;
};

//news
const renderNewContent = (newsUiItems) =>
  newsWrapper.appendChild(createContentsItem(newsUiItems));

//tabSwitch
const tabSwitch = () => {
  tabUl.addEventListener("click", (e) => handleClick(e));
};

const handleClick = (e) => {
  e.preventDefault();
  initNewsElements();
  showNewsElements(e);
};

const showNewsElements = (e) => {
  const eventTarget = e.target;
  const dataCategory = eventTarget.dataset.category;
  eventTarget.classList.add("is-active");
  const target = `.js-${dataCategory}`;
  newsWrapper.querySelector(target).classList.add("is-show");
};

const initNewsElements = () => {
  const activeTab = newsWrapper.querySelector(".is-active");
  const activeContent = newsWrapper.querySelector(".is-show");
  activeTab.classList.remove("is-active");
  activeContent.classList.remove("is-show");
};

const fetchedNewsComponentData = async () => {
  try {
    const response = await fetch(jsonUrl);
    const json = await response.json();
    return json.data;
  } catch (error) {
    newsWrapper.textContent = "データの取得ができませんでした。";
    console.error(error);
  } finally {
    console.log("処理が終了しました。");
  }
};

const createLogoutBtn = () => {
  const btn = createElementWithClassName("button", "btn");
  btn.id = "js-logout";
  btn.textContent = "ログアウト";
  return btn;
};

const renderLogoutBtn = () => {
  const btn = createLogoutBtn();
  btn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "./login.html";
  });
  newsWrapper.after(btn);
};

window.addEventListener("storage", () => {
  if (!localStorage.getItem("token")) window.location.href = "login.html";
});

const init = async () => {
  const newsUiItems = await fetchedNewsComponentData();
  renderNewTab(newsUiItems);
  renderNewContent(newsUiItems);
  renderLogoutBtn();
};

init();
