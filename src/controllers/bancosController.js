import { prisma } from "../lib/prisma.js";

export async function getBancosActivos(_req, res, next) {
  try {
    const bancos = await prisma.bancos.findMany({
      where: {
        activo: true,
      },
      include: {
        politicas_riesgo: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });

    return res.status(200).json({
      data: bancos,
      count: bancos.length,
    });
  } catch (error) {
    return next(error);
  }
}
