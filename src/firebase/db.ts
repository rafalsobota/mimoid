import { app } from "./app";
import { getDatabase } from "firebase/database";

export const db = getDatabase(app, 'https://mimoid-default-rtdb.europe-west1.firebasedatabase.app');