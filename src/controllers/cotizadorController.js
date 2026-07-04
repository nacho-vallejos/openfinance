import { prisma } from "../lib/prisma.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toNumber(value) {
  if (value === null || value === undefined) return null;
  return Number(value);
}

export async function cotizarCredito(req, res, next) {
  try {
    const { usuario_id } = req.body ?? {};

    if (!usuario_id || !UUID_REGEX.test(usuario_id)) {
      return res.status(400).json({
        error: "BAD_REQUEST",
        message: "El campo usuario_id es obligatorio y debe ser un UUID valido.",
      });
    }

    const perfilUsuario = await prisma.historial_crediticio_usuarios.findFirst({
      where: {
        usuario_id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!perfilUsuario) {
      return res.status(404).json({
        error: "USER_CREDIT_HISTORY_NOT_FOUND",
        message: "No existe historial crediticio para el usuario solicitado.",
      });
    }

    const bancos = await prisma.bancos.findMany({
      where: {
        activo: true,
        politicas_riesgo: {
          some: {
            situacion_bcra_min: {
              lte: perfilUsuario.situacion_bcra_actual,
            },
            situacion_bcra_max: {
              gte: perfilUsuario.situacion_bcra_actual,
            },
            score_veraz_min: {
              lte: perfilUsuario.score_veraz_actual,
            },
            score_veraz_max: {
              gte: perfilUsuario.score_veraz_actual,
            },
          },
        },
      },
      include: {
        politicas_riesgo: {
          where: {
            situacion_bcra_min: {
              lte: perfilUsuario.situacion_bcra_actual,
            },
            situacion_bcra_max: {
              gte: perfilUsuario.situacion_bcra_actual,
            },
            score_veraz_min: {
              lte: perfilUsuario.score_veraz_actual,
            },
            score_veraz_max: {
              gte: perfilUsuario.score_veraz_actual,
            },
          },
          orderBy: {
            multiplicador_riesgo: "asc",
          },
        },
      },
      orderBy: {
        tasa_base_tna: "asc",
      },
    });

    const ofertas = bancos.flatMap((banco) =>
      banco.politicas_riesgo.map((politica) => {
        const tasaBaseTna = toNumber(banco.tasa_base_tna);
        const multiplicadorRiesgo = toNumber(politica.multiplicador_riesgo);
        const limiteAprobado = toNumber(politica.monto_maximo_permitido);

        return {
          banco_id: banco.id,
          codigo_bcra: banco.codigo_bcra,
          banco: banco.nombre,
          politica_riesgo_id: politica.id,
          tasa_base_tna: tasaBaseTna,
          multiplicador_riesgo: multiplicadorRiesgo,
          tna_personalizada: Number((tasaBaseTna * multiplicadorRiesgo).toFixed(2)),
          limite_aprobado: limiteAprobado,
          usuario: {
            usuario_id: perfilUsuario.usuario_id,
            situacion_bcra_actual: perfilUsuario.situacion_bcra_actual,
            score_veraz_actual: perfilUsuario.score_veraz_actual,
            ingresos_mensuales_declarados: toNumber(
              perfilUsuario.ingresos_mensuales_declarados
            ),
            tiene_concursos_quiebras: perfilUsuario.tiene_concursos_quiebras,
          },
        };
      })
    );

    return res.status(200).json({
      data: ofertas,
      count: ofertas.length,
    });
  } catch (error) {
    return next(error);
  }
}
