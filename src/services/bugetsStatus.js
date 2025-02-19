import {getConnection} from '../database/database'

const GetBuget = async () => {
    try {
        const connection = await getConnection();
    } catch (err) {}        
};