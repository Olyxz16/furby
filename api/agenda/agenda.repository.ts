import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { config } from '../config/config';
import { Agenda, Day, Hour } from './agenda.entity';

const jwt = new JWT({
  email: config.GOOGLE_AUTH_EMAIL,
  key: config.GOOGLE_AUTH_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const doc = new GoogleSpreadsheet(config.GOOGLE_SHEETS_DOC_ID, jwt);

export async function getUsers() : Promise<string[]> {
  await doc.loadInfo();
  const sheet = doc.sheetsById[1871304734];
  await sheet.loadCells(); 

  let result = [];
  for(let i = 0 ; i < sheet.rowCount ; i++) {
      const value = sheet.getCell(i, 0).value;
      if(!value) {
        break;
      }
      result.push(value.toString());
  }

  return result;
}

export async function getUserAgenda(name: string) : Promise<Agenda> {
  const id = await getIdFromName(name);
  if(!id) {
    throw "No id matching name " + name;
  }

  const sheet = await getSheetById(id);
  if(!sheet) {
    throw "No sheet matching name " + name;
  }
  await sheet.loadCells();

  let agenda = new Agenda();
  for(let i = 0; i < 5 ; i++) {
    for(let j = 0; j < 10 ; j++) {
      const day = i as Day;
      const hour = j + 8 as Hour;
      const col = i + 1;
      const row = j + 1;
      
      const value = sheet.getCell(row, col).value;
      if(!value) {
        continue;
      }

      agenda.set(day, hour, value.toString());
    }
  }

  return agenda;
}

export async function setUserAgenda(name: string, agenda: Agenda): Promise<void> {
  const id = await getIdFromName(name);
  if(!id) {
    throw "No id matching name " + name;
  }

  const sheet = await getSheetById(id);
  if(!sheet) {
    throw "No sheet matching name " + name;
  }

  for(let i = 0; i < 5 ; i++) {
    for(let j = 0; j < 10 ; j++) {
      const day = i as Day;
      const hour = j + 8 as Hour;
      const col = i + 1;
      const row = j + 1;
      
      const cell = sheet.getCell(row, col);
      const label = agenda.get(day, hour);
      if (!label) {
        cell.value = "";
      } else {
        cell.value = label;
      }
    }
  }
  
  await sheet.saveUpdatedCells();
}

async function getIdFromName(name: string): Promise<string | undefined> {
  const slug = name.toLowerCase();

  await doc.loadInfo();
  const nameSheet = doc.sheetsById[1871304734];
  await nameSheet.loadCells(); 

  for(let i = 0 ; i < nameSheet.rowCount ; i++) {
      const name = nameSheet.getCell(i, 0).value;
      if(name?.toString().toLowerCase() == slug) {
        return nameSheet.getCell(i, 1).value?.toString();
      }
  }

  return undefined;
}

async function getSheetById(id: string): Promise<GoogleSpreadsheetWorksheet | undefined> {
  for(let i = 0 ; i < doc.sheetCount ; i++) {
    const sheet = doc.sheetsByIndex[i];
    if(sheet.title.split("-")[0] == id) {
      return sheet;
    }
  }
  return undefined;
}
