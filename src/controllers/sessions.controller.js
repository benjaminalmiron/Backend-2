
import SessionsDAO from "../daos/sessions.dao.js";
import { hash, isValidPassword } from "../utils/hash.js";
import generateToken, { createToken } from "../utils/Token.js";

class SessionsController {
  constructor() {
    this.service = new SessionsDAO();
  }

  register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        
        if (!username || !email || !password) {
            return res.status(400).send("Faltan campos por llenar");
        }

        if (!isNaN(username)) {
            return res.status(400).send("El nombre de usuario no puede ser solo un número");
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send("El correo electrónico debe ser de tipo @gmail.com");
        }

        if (password.length <= 4) {
            return res.status(400).send("La contraseña debe tener más de 4 caracteres");
        }

        const emailFound = await this.service.getUser(email);
        if (emailFound) {
            return res.status(401).send("El correo electrónico ya está registrado");
        }

        const usernameFound = await this.service.getUserByUsername(username);
        if (usernameFound) {
            return res.status(401).send("El nombre de usuario ya está en uso");
        }

        const newUser = { username, email, password: await hash(password) };
        const result = await this.service.createUser(newUser);

        res.status(201).send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error en el servidor");
    }
}

login = async (req, res) => {
    console.log("Solicitud de login recibida:", req.body);
    const { email, password } = req.body;   
    if (!email || !password) {
        return res.status(400).send("Faltan campos por llenar");
    }
    const userFound = await this.service.getUser(email);
    if (!userFound) {
        return res.status(401).send({status: "error", error: "Usuario no encontrado o credenciales incorrectas"});
    }
    if (!isValidPassword(password, userFound.password)) {
        return res.status(401).send({status: "error", error: "Contraseña incorrecta"});
    }

    const token = createToken({
        id: userFound._id,
        email: userFound.email,
        role: userFound.role
    });

    // Establecer la cookie
    res.cookie("cookieHouse", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        samesite: "None",
        secure: true,
        httpOnly: true
    }).redirect("/");  
}

logout = async (req, res) => {
    try {
        console.log("Logout iniciado");

        // Verificar si la cookie existe antes de eliminarla
        console.log("Cookie antes de eliminarla: ", req.cookies.cookieHouse);

        // Eliminar la cookie de la sesión
        res.clearCookie("cookieHouse", {
            path: "/",
            secure: false,  // Cambia a false si no estás usando HTTPS
            httpOnly: true,
            samesite: "Lax"
        });

        // Verificar si la cookie ha sido eliminada
        console.log("Cookie después de eliminarla: ", req.cookies.cookieHouse);

        // Establecer el mensaje flash
        req.flash('success_msg', 'Logout exitoso. Por favor, inicia sesión nuevamente.');

        // Redirigir al login después de hacer logout
        console.log("Redirigiendo al login...");
        res.redirect("/");  // Redirige a la página de login

    } catch (error) {
        console.log("Error en el proceso de logout: ", error);
        res.status(500).send("Error en el servidor al cerrar sesión");
    }
}




}
export default  SessionsController;