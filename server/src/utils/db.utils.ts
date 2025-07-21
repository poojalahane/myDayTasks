// Local Imports
import { db } from "../lib/db";


export const dbHealthCheck = async () => {
    try {
        const connection = await db.connect(); 
        if(connection) return "Connection Successful";
        else return "Unable to connect to Db."
    } catch (error) {
        throw new Error("Unable to connect to DB.")
    }
}