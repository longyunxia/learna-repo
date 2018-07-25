const fs = require('fs-extra');
const chalk = require('chalk');
exports.run = function (name) {
  const newDir = './' + name;
  fs.pathExists(newDir, (err, exists) => {
    if (exists) {
      console.log(chalk.red(`${newDir} already existed`))
    } else {
      fs.copy(__dirname + '/template/', newDir, err => {
        if (err) return console.error(err);
        console.log(chalk.green(`${newDir} has created`))
      });
    }
  });
};




