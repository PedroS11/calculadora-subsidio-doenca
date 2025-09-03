import React, { useState, FormEvent } from "react";
import "./style.css";
import { calcularSubsidioBaixa, DoencaTipo } from "./api";

const App: React.FC = () => {
  const [remuneracao, setRemuneracao] = useState<string>("");
  const [diasBaixa, setDiasBaixa] = useState<string>("");
  const [tipoDoenca, setTipoDoenca] = useState<DoencaTipo>("comum");
  const [mesesDescontosEDiasEfetivo, setMesesDescontosEDiasEfetivo] =
    useState<boolean>(false);
  const [familiaresACargo, setFamiliaresACargo] = useState<string>("0");
  const [resultado, setResultado] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const result = calcularSubsidioBaixa({
      familiaresACargo: parseInt(familiaresACargo),
      diasDeBaixa: parseInt(diasBaixa),
      mesesComDescontosEDiasComTrabalhoEfectivo: mesesDescontosEDiasEfetivo,
      remuneracaoSeisMeses: parseFloat(remuneracao),
      tipoDeDoenca: tipoDoenca,
    });

    setResultado(result);
  };

  return (
    <div>
      <h1>Calculadora Subsídio de Doença</h1>
      <form onSubmit={handleSubmit} id="simulador-form">
        <label>
          Remuneração bruta total dos últimos 6 meses (€):
          <input
            type="number"
            step="0.01"
            value={remuneracao}
            onChange={(e) => setRemuneracao(e.target.value)}
            required
          />
        </label>

        <label>
          Dias de baixa:
          <input
            type="number"
            value={diasBaixa}
            onChange={(e) => setDiasBaixa(e.target.value)}
            required
          />
        </label>

        <label>
          Tipo de doença:
          <select
            value={tipoDoenca}
            onChange={(e) => setTipoDoenca(e.target.value as DoencaTipo)}
          >
            <option value="comum">Comum</option>
            <option value="internamento">Internamento</option>
            <option value="tuberculose">Tuberculose</option>
          </select>
        </label>

        <label>
          Tem, no mínimo, 6 meses de descontos em que 12 dias foram como
          efetivo?:
          <input
            type="checkbox"
            checked={mesesDescontosEDiasEfetivo}
            onChange={(e) => setMesesDescontosEDiasEfetivo(e.target.checked)}
          />
        </label>

        <label>
          Familiares a cargo:
          <input
            type="number"
            value={familiaresACargo}
            onChange={(e) => setFamiliaresACargo(e.target.value)}
            required
          />
        </label>

        <button type="submit">Calcular</button>
      </form>

      <div id="resultado">{resultado}</div>
    </div>
  );
};

export default App;
