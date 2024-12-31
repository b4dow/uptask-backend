import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const handlerInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let errors = validationResult(req); //? Obtiene los errores de la validación
  if (!errors.isEmpty()) {
    //? Si hay errores
    return res.status(400).json({ errors: errors.array() }); //? Retorna los errores
  }
  next();
};
