import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { config } from '../config/config';
import { Agenda, Day, Hour } from './agenda.entity';
import { GetAgendaIdByUserIdDto, LinkAgendaToUserDto } from './dto/agenda.dto';
import db from "../config/db";

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

export async function getAgendaFromId(id: string): Promise<Agenda> {
  const sheet = await getSheetById(id);
  if(!sheet) {
    throw new Error("No sheet matching id " + id);
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

export async function getUserAgenda(name: string) : Promise<Agenda> {
  const id = await getIdFromName(name);
  if(!id) {
    throw new Error("No id matching name " + name);
  }
  return getAgendaFromId(id);
}

export async function setAgendaFromId(id: string, agenda: Agenda): Promise<void> {
  const sheet = await getSheetById(id);
  if(!sheet) {
    throw new Error("No sheet matching id " + id);
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

export async function setUserAgenda(name: string, agenda: Agenda): Promise<void> {
  const id = await getIdFromName(name);
  if(!id) {
    throw new Error("No id matching name " + name);
  }
  return setAgendaFromId(id, agenda);
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

async function getNameFromId(id: string): Promise<string | undefined> {
  const slug = id.toLowerCase();

  await doc.loadInfo();
  const nameSheet = doc.sheetsById[1871304734];
  await nameSheet.loadCells(); 

  for(let i = 0 ; i < nameSheet.rowCount ; i++) {
      const name = nameSheet.getCell(i, 1).value;
      if(name?.toString().toLowerCase() == slug) {
        return nameSheet.getCell(i, 0).value?.toString();
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

export function linkAgendaToUser(input: LinkAgendaToUserDto): void {
  const stmt = db.prepare(`
    INSERT INTO Agendas (user_id, agenda_id)
    VALUES (@userId, @agendaId)
    ON CONFLICT(user_id) DO UPDATE SET
      agenda_id = excluded.agenda_id
  `);
  
  stmt.run(input);
}

export function getAgendaIdByUserId(input: GetAgendaIdByUserIdDto): string {
  const stmt = db.prepare(`
    SELECT agenda_id FROM Agendas
    WHERE user_id = @userId
  `);

  const row = stmt.get(input) as any;
  if (!row) {
    throw new Error("User not found");
  }

  return row.agenda_id;
}
