const axios = require("axios");

let response = null;
new Promise(async (resolve, reject) => {
  try {
    response = await axios.get("https://pro-api.coinmarketcap.com", {
      headers: {
        "X-CMC_PRO_API_KEY": "8290f831-0ed9-4e7c-82c8-ca091978b660",
      },
    });
  } catch (ex) {
    response = null;
    // error
    console.log(ex);
    reject(ex);
  }
  if (response) {
    // success
    const json = response.data;
    console.log(json);
    resolve(json);
  }
});
