const jsonUrl = "https://myjson.dit.upm.es/api/bins/cpch";
const tableWrap = document.getElementById("js-table-wrapper");

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
      resolve(fetch(jsonUrl));
    }, sec);
  });
};

const fetchUsersTableData = async () => {
  try {
    const response = await fetchDataInSecond(3000, jsonUrl);
    const json = await response.json();
    return json.data;
  } catch (e) {
    tableWrap.textContent = "データの取得ができませんでした。";
    console.error(e);
  } finally {
    loaded();
  }
};

/**
 * Rendering table using users data from JSON file
 * @param {Object} usersTableData array of users data
 */
const renderTable = (usersTableData) => {
  const table = createTable();
  table.appendChild(createTableHeader(usersTableData));
  table.appendChild(createTableData(usersTableData));
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
  const trOfThead = document.createElement("tr");
  const fragment = document.createDocumentFragment();
  /**
   *Extract key from usersData
   * @param {Object} usersData[0] value from one of userData in the object
   * @param {String} key key of userData
   */
  Object.keys(usersData[0]).forEach((key) => {
    const th = createElementWithClassName("th", "users-table__th");
    th.textContent = formingTableHeaderNameWithKey(key);
    fragment.appendChild(th);
  });
  trOfThead.appendChild(fragment);
  return trOfThead;
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
      console.error();
  }
};

/**
 *Creating table data with value of usersData
 * @param {Array} usersData The Array of usersData
 */

 const createTableData = (usersData) => {
  const fragment = document.createDocumentFragment();
  usersData.forEach((userData) => {
    const trOfTdata = document.createElement("tr");
    /**
     *Extract value from each of usersData
     * @param {Object} userData the object of each users data
     * @param {String,Number} val value of each users data
     */

    Object.values(userData).forEach((val) => {
      const td = createElementWithClassName("td", "users-table__td");
      td.textContent = val;
      trOfTdata.appendChild(td);
    });
    fragment.appendChild(trOfTdata);
  });
  return fragment;
};

const init = async () => {
  tableWrap.insertAdjacentElement("beforebegin", createLoader());
  loading();
  let usersTableData;
  try {
    usersTableData = await fetchUsersTableData();
  } catch (e) {
    console.error(e);
  } finally {
    console.log("処理が完了しました。");
  }
  if (usersTableData.length === 0) {
    tableWrap.textContent = "データがありません。";
    return;
  } else {
    renderTable(usersTableData);
  }
};
init();
