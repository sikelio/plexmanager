// Dependencies
import axios from "axios";

export const fetchAuthors = async (setAuthors) => {
    try {
        const data = await axios.get('https://api.github.com/repos/sikelio/plexmanager/contributors');
        setAuthors(data.data);
    } catch (e) {}
}
