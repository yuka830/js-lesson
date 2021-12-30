const jsonUrl = "https://myjson.dit.upm.es/api/bins/dx91";
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
    return json.usersTableData;
  } catch (e) {
    tableWrap.textContent = "データの取得ができませんでした。";
    console.error(e);
  } finally {
    loaded();
  }
};

/**
 * Rendering table using title data and users data in the same JSON file
 * @param {Object} usersTableData array of title data and users data
 */
const renderTable = (usersTableData) => {
  const table = createTable();
  table.appendChild(createTableHeader(usersTableData.title));
  table.appendChild(createTableData(usersTableData.usersData));
  tableWrap.appendChild(table);
};

const createTable = () => {
  const table = createElementWithClassName("table", "users-table");
  table.id = "js-table";
  return table;
};

const createTableHeader = (title) => {
  const trOfThead = document.createElement("tr");
  const fragment = document.createDocumentFragment();
  /**
   *Creating table header with title data
   * @param {Number, String} val each value of table title
   */
  title.forEach((val) => {
    const th = createElementWithClassName("th", "users-table__th");
    th.textContent = val;
    fragment.appendChild(th);
  });
  trOfThead.appendChild(fragment);
  return trOfThead;
};

const createTableData = (usersData) => {
  const fragment = document.createDocumentFragment();
  usersData.forEach((userData) => {
    const trOfTdata = document.createElement("tr");
   /**
   *Creating table data with user data
   * @param {Array} userData an array includes objects of user data
   * @param {String} key key of each user data
   */ 
    Object.keys(userData).forEach((key) => {
      const td = createElementWithClassName("td", "users-table__td");
      td.textContent = userData[key];
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
