import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { password, email } = req.body;

      //? Prevenir usuario duplicado
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error("El Usuario ya esta registrado");
        return res.status(409).json({ error: error.message });
      }
      //? Crear usuario
      const user = new User(req.body);
      //? Hashear password
      user.password = await hashPassword(password);

      //? Generar Token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      //? Enviar email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      //? hacer ambas consultas al mismo tiempo
      await Promise.allSettled([user.save(), token.save()]);
      res.send("Cuenta creada, revisa tu email para confirmarla");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });
      // validamos si el token no existe me saldra un mensaje de error que el token no es valida
      if (!tokenExists) {
        const error = new Error("El token no es valido");
        return res.status(404).json({ error: error.message });
      }
      // validamos si el token existe hara una busqueda a partir del user_id para asi confirmar el usuario
      const user = await User.findById(tokenExists.user);
      user.confirmed = true;

      //guarda las consultas del user y el token exists en la base datos haciendo una promesa asincronica
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.send("Cuenta confirmada correctamente");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("Usuario no encontrado");
        return res.status(404).json({ error: error.message });
      }
      if (!user.confirmed) {
        const token = new Token();
        token.user = user.id;
        token.token = generateToken();
        await token.save();

        // enviar email
        AuthEmail.sendConfirmationEmail({
          email: user.email,
          name: user.name,
          token: token.token,
        });

        const error = new Error(
          "La cuenta no ha sido confirmada, hemos enviado un email de confirmación"
        );
        return res.status(401).json({ error: error.message });
      }
      // Revisar password
      const isPasswordCorrect = await checkPassword(password, user.password);
      if (!isPasswordCorrect) {
        const error = new Error("Password Incorrecto");
        return res.status(401).json({ error: error.message });
      }
      res.send("Autenticado...");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static requestConfirmationCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El Usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      if (user.confirmed) {
        const error = new Error("El Usuario ya esta confirmado");
        return res.status(403).json({ error: error.message });
      }

      // Generar Token
      const token = new Token();
      token.token = generateToken();
      token.user = user.id;

      // Enviar email
      AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      // hacer ambas consultas al mismo tiempo
      await Promise.allSettled([user.save(), token.save()]);
      res.send("Se envió un nuevo token a tu email");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };

  static forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Usuario existe
      const user = await User.findOne({ email });
      if (!user) {
        const error = new Error("El Usuario no esta registrado");
        return res.status(404).json({ error: error.message });
      }

      // Generar Token
      const token = new Token();
      token.token = generateToken();
      await token.save();

      // Enviar email
      AuthEmail.sendPasswordResetToken({
        email: user.email,
        name: user.name,
        token: token.token,
      });

      res.send("Revisa tu email para instrucciones.");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static validateToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ token });
      // validamos si el token no existe me saldra un mensaje de error que el token no es valida
      if (!tokenExists) {
        const error = new Error("El token no es valido");
        return res.status(404).json({ error: error.message });
      }
      res.send("Token válido, define tu nueva password");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
  static updatePasswordWithToken = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
      const tokenExists = await Token.findOne({ token });
      console.log(tokenExists);
      // validamos si el token no existe me saldra un mensaje de error que el token no es valida
      if (!tokenExists) {
        const error = new Error("El token no es valido");
        return res.status(404).json({ error: error.message });
      }

      const user = await User.findById(tokenExists.user);
      user.password = await hashPassword(password);
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      res.send("El password se modifico correctamente.");
    } catch (error) {
      res.status(500).json({ error: "Hubo un error" });
    }
  };
}
