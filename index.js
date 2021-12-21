const fs = require('fs');
const Path = require('path');
const { promises: Fs } = require('fs');
const faker = require('faker/locale/pt_BR');
const ExportToCsv = require('export-to-csv').ExportToCsv;

const file = Path.join(__dirname, 'data.csv');

const generatorData = () => {
  const numberRequests = 600000;
  let userData = [];

  for (let index = 0; index < numberRequests; index++) {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

    const name = `${firstName} ${lastName}`;
    const email = faker.internet.email(firstName, lastName);

    userData.push({ name, email });
  }

  return userData;
};

const exportCSV = (list) => {
  const options = {
    fieldSeparator: ',',
    quoteStrings: '',
    decimalSeparator: '.',
    showLabels: false,
    showTitle: false,
    filename: 'email',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: false,
  };

  try {
    const csv = new ExportToCsv(options);
    return csv.generateCsv(list, true);
  } catch (error) {
    console.log('csv => ' + error.message, userData);
  }
};

const exists = async (path) => {
  try {
    await Fs.access(path);
    return true;
  } catch {
    return false;
  }
};

const removeFile = () => {
  fs.unlink(file, (err) => {
    if (err) {
      throw err;
    }
    console.log('file is deleted');
  });
};

const generator = async () => {
  try {
    const hasFile = await exists(file);
    if (hasFile) {
      removeFile();
    }

    exportData();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const exportData = () => {
  const userData = generatorData();
  const csvData = exportCSV(userData);

  fs.appendFile('data.csv', csvData, (error) => {
    if (error) {
      throw error;
    }

    console.log('data generated');
  });
};

generator();
