import axios from "axios";

const trySilentRefresh = async () => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_BE_URL}/auth/refreshToken`,{}, { withCredentials: true });
        if (res.data.success) {
            return res.data;
        }
        return null;
    } catch (err) {
        //ignore
    }
};

export {
    trySilentRefresh
}