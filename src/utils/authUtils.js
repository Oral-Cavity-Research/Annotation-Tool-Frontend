import axios from "axios";
import config from '../config.json';


const trySilentRefresh = async () => {
    try {
        const res = await axios.post(`${config['path']}/auth/refreshToken`,{}, { withCredentials: true });
        if (res.data.success) {
            return res.data;
        }
        return null;
    } catch (err) {
        const mute = err;
    }
};

export {
    trySilentRefresh
}