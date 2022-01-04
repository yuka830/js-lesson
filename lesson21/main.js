const jsonUrl = "https://myjson.dit.upm.es/api/bins/4gct";
const tableWrap = document.getElementById("js-table-wrapper");
let sortState = "both";
let newUsersData = [];

const createElementWithClassName = (element, name) => {
  const createdElement = document.createElement(element);
  createdElement.classList.add(name);
  return createdElement;
};

const createLoader = () => {
  const loader = document.createElement("div");
  const loaderImage = document.createElement("img");
  loader.id = "js-loader";
  loaderImage.src = "img/loading-circle.gif";
  loader.appendChild(loaderImage);
  return loader;
};

const loading = () => {
  const loader = document.getElementById("js-loader");
  loader.classList.add("loading");
};

const loaded = () => {
  const loader = document.getElementById("js-loader");
  loader.classList.add("loaded");
};

const fetchDataInSecond = (sec, jsonUrl) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fetchJson(jsonUrl));
    }, sec);
  });
};

const fetchJson = async (jsonUrl) => {
  const response = await fetch(jsonUrl);
  if (response.ok) {
    const json = await response.json();
    return json;
  } else {
    throw new Error(`サーバーリクエストに失敗しました: ${response.status}`);
  }
};

const fetchUsersData = async () => {
  try {
    const json = await fetchDataInSecond(3000, jsonUrl);
    return json.data;
  } catch (e) {
    tableWrap.textContent = "データの取得ができませんでした。";
    console.error(e);
  }
};

/**
 * Rendering table using users data from JSON file
 * @param {Object} usersData array of users data
 */
const renderTable = (usersData) => {
  const table = createTable();
  table.appendChild(createTableHeader(usersData));
  table.appendChild(createTableData(usersData));
  tableWrap.appendChild(table);
};

const createTable = () => {
  const table = createElementWithClassName("table", "users-table");
  table.id = "js-table";
  return table;
};

/**
 *Creating table header with key of usersData
 * @param {Array} usersData The Array of usersData
 */
const createTableHeader = (usersData) => {
  const trOfThead = createElementWithClassName("tr", "users-table__tr-th");
  const fragment = document.createDocumentFragment();
  AddTextContentToThead(usersData, fragment);
  trOfThead.appendChild(fragment);
  return trOfThead;
};

/**
 *Extract key from usersData
 * @param {Object} usersData[0] value from one of userData in the object
 * @param {String} key key of userData
 */
const AddTextContentToThead = (usersData, fragment) => {
  Object.keys(usersData[0]).forEach((key) => {
    const th = createElementWithClassName("th", "users-table__th");
    th.textContent = formingTableHeaderNameWithKey(key);
    th.id = key;
    fragment.appendChild(th);
  });
};

const formingTableHeaderNameWithKey = (key) => {
  switch (key) {
    case "id":
      return "ID";
    case "name":
      return "名前";
    case "sex":
      return "性別";
    case "age":
      return "年齢";
    default:
      console.error(`${key}は見つかりませんでした`);
  }
};

/**
 *Creating table data with value of usersData
 * @param {Array} usersData The Array of usersData
 */

const createTableData = (usersData) => {
  const fragment = document.createDocumentFragment();
  usersData.forEach((userData, index) => {
    const trOfTdata = createElementWithClassName("tr", "users-table__tr-td");
    const usersIndex = ++index;
    /**
     *Extract value from each of usersData
     * @param {Object} userData the object of each users data
     * @param {String,Number} val value of each users data
     */

    Object.keys(userData).forEach((key) => {
      const td = createElementWithClassName("td", "users-table__td");
      key === "id"
        ? (td.textContent = usersIndex)
        : (td.textContent = userData[key]);
      trOfTdata.appendChild(td);
    });
    fragment.appendChild(trOfTdata);
  });
  return fragment;
};

const createSortBtn = () => {
  const btn = createElementWithClassName("button", "sort-btn");
  const sortArrow = createElementWithClassName("img", "sort-img");
  // bothのイメージをデフォルトとする
  sortArrow.src = "./img/both.svg";
  btn.appendChild(sortArrow);
  return btn;
};

const renderSortBtn = () => {
  const btn = createSortBtn();
  const targetEle = document.getElementById("id");
  targetEle.appendChild(btn);
};

const clickSortBtn = () => {
  const sortArrow = document.querySelector(".sort-btn");
  sortArrow.addEventListener("click", () => {
    changeSortStateAndArrowImg(sortArrow);
    rerenderTableData(newUsersData);
  });
};

const getNewUsersData = () => {
  const trOfTdata = document.querySelectorAll(".users-table__tr-td");
  return (newUsersData = Array.from(trOfTdata));
};

const changeSortStateAndArrowImg = (sortArrow) => {
  if (sortState === "both") {
    sortState = "asc";
    sortArrow.src = "/img/asc.svg";
  } else if (sortState === "asc") {
    sortState = "desc";
    sortArrow.src = "/img/desc.svg";
  } else {
    sortState = "both";
    sortArrow.src = "/img/both.svg";
  }
};

const rerenderTableData = (newUsersData) => {
  const table = document.getElementById("js-table");
  const th = document.getElementById("id");
  const colNum = th.cellIndex;
  if (sortState === "both") {
    sortInit(newUsersData);
  } else if (sortState === "asc") {
    sortAsc(newUsersData, colNum);
  } else {
    sortDesc(newUsersData, colNum);
  }
  table.append(...newUsersData);
};

const sortAsc = (usersData, colNum) => {
  usersData.sort((a, b) => {
    return a.cells[colNum].innerHTML - b.cells[colNum].innerHTML;
  });
};

const sortDesc = (usersData, colNum) => {
  usersData.sort((a, b) => {
    return b.cells[colNum].innerHTML - a.cells[colNum].innerHTML;
  });
};

const sortInit = (usersData) => {
  usersData.sort(() => {
    return 0.5 - Math.random();
  });
};

const init = async () => {
  tableWrap.insertAdjacentElement("beforebegin", createLoader());
  loading();
  let usersData;
  try {
    usersData = await fetchUsersData();
  } catch (e) {
    console.error(e);
    tableWrap.textContent = `エラーが発生しました: ${e.message}`;
  } finally {
    loaded();
    console.log("処理が完了しました。");
  }
  if (usersData.length === 0) {
    tableWrap.textContent = "データがありません。";
    return;
  }
  renderTable(usersData);
  renderSortBtn(usersData);
  clickSortBtn();
  getNewUsersData();
  rerenderTableData(newUsersData);
};
init();
