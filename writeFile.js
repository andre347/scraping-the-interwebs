import fs from "fs";

const writeFileFunc = (name, data) => {
  fs.appendFile(name, data, err => {
    if (err) throw err;
    console.log("Saved!");
  });
};

export default writeFileFunc;
