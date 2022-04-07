import Crypto from "./crypto.js";

let ck = {
    enreg: (cname, cvalue, exp) => {
        let d = new Date();
        d.setTime(d.getTime() + (exp * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },
    recup: (cname) => {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    nouvSession: () => {
        let t =  Date.now().toString();
        let sess = Crypto.md5(t);
        ck.enreg("gombo_session", sess, 10);
        return sess;
    },
    session: () => ck.recup("gombo_session")
};

export default ck;