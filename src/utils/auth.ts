import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  //Hash password
  const salt = await bcrypt.genSalt(10); // ? Genera un salt es un valor aleatorio y unico para el password con 10 vueltas de encriptación.
  return await bcrypt.hash(password, salt); // ? Hashear la cadena
};

export const checkPassword = async (
  enteredPassword: string,
  storeHash: string
) => {
  return await bcrypt.compare(enteredPassword, storeHash); // ? Compara la contraseña ingresada con la contraseña hasheada en la base de datos.
};
