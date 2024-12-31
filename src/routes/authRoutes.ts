import { Router } from "express";
import { body, param } from "express-validator";
import { AuthController } from "../controllers/AuthController";
import { handlerInputErrors } from "../middleware/validation";

const router: Router = Router();

router.post(
  "/create-account",
  body("name").notEmpty().withMessage("El nombre no puede ir vacio"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    //? value es el valor ingresado , req para comparar con otros campos para hacer la petición
    if (value !== req.body.password) {
      throw new Error("Los passwords no coinciden");
    }
    return true;
  }),
  body("email").isEmail().withMessage("El email no es valido"),
  handlerInputErrors,
  AuthController.createAccount
);

router.post(
  "/confirm-account",
  body("token").notEmpty().withMessage("El token no puede ir vacio"),
  handlerInputErrors,
  AuthController.confirmAccount
);

router.post(
  "/login",
  body("email").isEmail().withMessage("El email no es valido"),
  body("password").notEmpty().withMessage("El password no puede ir vacio"),
  handlerInputErrors,
  AuthController.login
);

router.post(
  "/request-code",
  body("email").isEmail().withMessage("El email no es valido"),
  handlerInputErrors,
  AuthController.requestConfirmationCode
);

router.post(
  "/forgot-password",
  body("email").isEmail().withMessage("El email no es valido"),
  handlerInputErrors,
  AuthController.forgotPassword
);

router.post(
  "/validate-token",
  body("token").notEmpty().withMessage("El token no puede ir vacio"),
  handlerInputErrors,
  AuthController.validateToken
);

router.post(
  "/update-password/:token",
  param("token").isNumeric().withMessage("El token no es valido"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("El password es muy corto, minimo 8 caracteres"),
  body("password_confirmation").custom((value, { req }) => {
    // value es el valor ingresado , req para comparar con otros campos para hacer la petición
    if (value !== req.body.password) {
      throw new Error("Los passwords no coinciden");
    }
    return true;
  }),
  handlerInputErrors,
  AuthController.updatePasswordWithToken
);

export default router;
