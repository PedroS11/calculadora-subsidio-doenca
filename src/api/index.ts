export type DoencaTipo = "comum" | "internamento" | "tuberculose";

interface BaixaInputs {
  remuneracaoSeisMeses: number;
  diasDeBaixa: number;
  tipoDeDoenca?: DoencaTipo;
  mesesComDescontosEDiasComTrabalhoEfectivo: boolean;
  familiaresACargo?: number;
}

const IAS = 522.2;
const VALOR_MINIMO_DIARIO = (IAS * 0.3) / 30;
const DIAS_CARENCIAS = 3;
const MAX_DIAS_PAGOS = 365;

const calcularRemuneracaoReferenciaDiaria = (
  remuneracaoBrutaSeisMeses: number,
): number => remuneracaoBrutaSeisMeses / 180;

const obterPercentagem = (dias: number, tipo: DoencaTipo = "comum"): number => {
  if (tipo === "tuberculose") return 100;
  if (tipo === "internamento") {
    if (dias <= 30) return 60;
    if (dias <= 90) return 70;
    if (dias <= 365) return 75;
    return 80;
  }

  if (dias <= 30) return 55;
  if (dias <= 90) return 60;
  if (dias <= 365) return 70;
  return 75;
};

const calcularDiasPagos = (diasTotais: number, tipo: DoencaTipo): number => {
  if (tipo === "tuberculose" || tipo === "internamento") {
    return Math.min(diasTotais, MAX_DIAS_PAGOS);
  }

  if (diasTotais <= DIAS_CARENCIAS) return 0;
  return Math.min(diasTotais - DIAS_CARENCIAS, MAX_DIAS_PAGOS);
};

const aplicarMajoracao = (
  valorBase: number,
  diasBaixa: number,
  familiaresACargo = 0,
): { valorFinal: number; majPercentual: number } => {
  if (diasBaixa <= 30 || familiaresACargo <= 0) {
    return { valorFinal: valorBase, majPercentual: 0 };
  }

  const majPercentual = familiaresACargo === 1 ? 0.05 : 0.1;
  const valorFinal = valorBase * (1 + majPercentual);
  return { valorFinal, majPercentual };
};

export const calcularSubsidioBaixa = (inputs: BaixaInputs): string => {
  const {
    remuneracaoSeisMeses,
    diasDeBaixa,
    tipoDeDoenca = "comum",
    mesesComDescontosEDiasComTrabalhoEfectivo,
    familiaresACargo = 0,
  } = inputs;

  if (!mesesComDescontosEDiasComTrabalhoEfectivo) {
    return "❌ Não elegível para subsídio de doença (carência mínima não cumprida).";
  }

  const rrd = calcularRemuneracaoReferenciaDiaria(remuneracaoSeisMeses);
  const percentagem = obterPercentagem(diasDeBaixa, tipoDeDoenca);
  const diasPagos = calcularDiasPagos(diasDeBaixa, tipoDeDoenca);

  let valorDiaBase = rrd * (percentagem / 100);

  // Aplica majoração de 5% ou 10% se aplicável
  const { valorFinal: valorComMaj, majPercentual } = aplicarMajoracao(
    valorDiaBase,
    diasDeBaixa,
    familiaresACargo,
  );

  // Aplica mínimo diário garantido
  const valorDiaFinal = Math.max(valorComMaj, VALOR_MINIMO_DIARIO);
  const totalSubsidio = valorDiaFinal * diasPagos;

  const output: string[] = [];
  output.push(`✅ Subsídio total a receber: €${totalSubsidio.toFixed(2)}`);

  if (majPercentual > 0) {
    output.push(
      `📈 Majoração aplicada: +${(majPercentual * 100).toFixed(0)}% no valor diário por dependente(s) a cargo.`,
    );
  }

  if (valorComMaj < VALOR_MINIMO_DIARIO) {
    output.push(
      `ℹ️ O valor diário foi ajustado para o mínimo legal (€${VALOR_MINIMO_DIARIO.toFixed(2)}).`,
    );
  }

  return output.join("\n");
};
