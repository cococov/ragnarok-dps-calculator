"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { calculateDps, type SkillTimingInput } from "@/lib/dps";
import { skillPresets } from "@/lib/skills";

type CalculatorInput = Omit<SkillTimingInput, "dex" | "int" | "magicStrings"> & {
  dexBase: number;
  dexExtra: number;
  intBase: number;
  intExtra: number;
};

type NumericField = keyof CalculatorInput;

const CUSTOM_SKILL_ID = "custom-skill";
const skillTimingFields: NumericField[] = ["variableCast", "fixedCast", "postCast", "cooldown"];

const initialInput: CalculatorInput = {
  dexBase: 0,
  dexExtra: 0,
  intBase: 0,
  intExtra: 0,
  aspd: 0,
  damage: 0,
  variableCast: 0,
  fixedCast: 0,
  postCast: 0,
  cooldown: 0,
  variableCastReductionPercent: 0,
  fixedCastReductionSeconds: 0,
  postCastReductionPercent: 0,
  cooldownReductionFactor: 0,
  monsterHp: 0,
};

const fieldGroups: Array<{
  title: string;
  fields: Array<{ key: NumericField; label: string; suffix?: string; step?: string; min?: number }>;
}> = [
  {
    title: "ASPD y Daño",
    fields: [
      { key: "aspd", label: "ASPD", min: 0 },
      { key: "damage", label: "Daño por skill", min: 0 },
    ],
  },
  {
    title: "Parámetros de skill",
    fields: [
      { key: "variableCast", label: "Variable Cast", suffix: "s", step: "0.05", min: 0 },
      { key: "fixedCast", label: "Fixed Cast", suffix: "s", step: "0.05", min: 0 },
      { key: "postCast", label: "Delay", suffix: "s", step: "0.05", min: 0 },
      { key: "cooldown", label: "Cooldown", suffix: "s", step: "0.05", min: 0 },
    ],
  },
  {
    title: "Reducciones",
    fields: [
      { key: "variableCastReductionPercent", label: "Variable Cast", suffix: "%", min: 0 },
      { key: "fixedCastReductionSeconds", label: "Fixed Cast", suffix: "s", step: "0.05", min: 0 },
      { key: "postCastReductionPercent", label: "Delay", suffix: "%", min: 0 },
      { key: "cooldownReductionFactor", label: "Cooldown", suffix: "x", step: "0.05", min: 0 },
    ],
  },
];

const formatNumber = (value: number, digits = 0) =>
  new Intl.NumberFormat("es-CL", { maximumFractionDigits: digits }).format(value);

const formatSeconds = (value: number) => `${value.toFixed(3)}s`;

function bottleneckCopy(bottleneck: ReturnType<typeof calculateDps>["bottleneck"]) {
  if (bottleneck === "variableCast") {
    return {
      title: "Cuello de botella: Variable Cast",
      text: "La parte variable del casteo sigue marcando el ritmo. Más DEX, INT o reducción de VCT lo bajan.",
    };
  }

  if (bottleneck === "fixedCast") {
    return {
      title: "Cuello de botella: Fixed Cast",
      text: "La parte fija del casteo sigue siendo el límite principal. Reduce Fixed Cast para acelerar la skill.",
    };
  }

  if (bottleneck === "cooldown") {
    return {
      title: "Cuello de botella: cooldown",
      text: "La recarga final está marcando el ritmo. Reducir cooldown dará el mayor aumento de DPS.",
    };
  }

  if (bottleneck === "postCast") {
    return {
      title: "Cuello de botella: Delay",
      text: "El Delay final todavía supera lo que puede cubrir el ASPD al cap de 193. Bajar de 0.140s ya no cambia esa parte.",
    };
  }

  if (bottleneck === "aspd") {
    return {
      title: "Cuello de botella: ASPD",
      text: "La animación por ASPD está frenando la rotación. Mientras estés por debajo del cap de 193, subir ASPD acelera el casteo repetido.",
    };
  }

  return {
    title: "Tiempos equilibrados",
    text: "Los delays principales están empatados o casi anulados. El siguiente salto depende de daño o animación.",
  };
}

export default function DpsCalculator() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });
  const [selectedSkillId, setSelectedSkillId] = useState(CUSTOM_SKILL_ID);
  const [input, setInput] = useState<CalculatorInput>(initialInput);
  const [magicStrings, setMagicStrings] = useState(false);
  const timingInput = useMemo<SkillTimingInput>(
    () => ({
      ...input,
      dex: input.dexBase + input.dexExtra,
      int: input.intBase + input.intExtra,
      magicStrings,
    }),
    [input, magicStrings],
  );
  const statFormulaTotal = timingInput.dex * 2 + timingInput.int;
  const statFormulaMissing = Math.max(0, 530 - statFormulaTotal);
  const result = useMemo(() => calculateDps(timingInput), [timingInput]);
  const selectedSkill = skillPresets.find((skill) => skill.id === selectedSkillId);
  const isCustomSkill = selectedSkillId === CUSTOM_SKILL_ID;
  const analysis = bottleneckCopy(result.bottleneck);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setField = (key: NumericField, rawValue: string) => {
    if (!isCustomSkill && skillTimingFields.includes(key)) return;

    const value = Number.parseFloat(rawValue);
    setInput((current) => ({ ...current, [key]: Number.isNaN(value) ? 0 : value }));
  };

  const applyCustomSkill = () => {
    setSelectedSkillId(CUSTOM_SKILL_ID);
    setInput((current) => ({
      ...current,
      variableCast: 0,
      fixedCast: 0,
      postCast: 0,
      cooldown: 0,
    }));
  };

  const applyPreset = (skillId: string) => {
    const preset = skillPresets.find((skill) => skill.id === skillId);
    if (!preset) return;

    setSelectedSkillId(skillId);
    setInput((current) => ({
      ...current,
      variableCast: preset.variableCast,
      fixedCast: preset.fixedCast,
      postCast: preset.postCast,
      cooldown: preset.cooldown,
    }));
  };

  return (
    <main className="shell">
      <div className="themeToggleWrap">
        <button
          aria-pressed={theme === "light"}
          className="themeToggle"
          onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
          type="button"
        >
          <span className={theme === "dark" ? "active" : ""}>Oscuro</span>
          <span className={theme === "light" ? "active" : ""}>Claro</span>
        </button>
      </div>
      <section className="hero" aria-labelledby="page-title">
        <div>
          <div className="heroTopline">
            <p className="eyebrow">Ragnarok Online</p>
          </div>
          <h1 id="page-title">Calculadora de DPS</h1>
          <p className="intro">
            Prueba skills, aplica presets conocidos y encuentra qué limita tu dps:
            ASPD, Delay, cooldown o casteo.
          </p>
        </div>
      </section>

      <section className="workspace" aria-label="Calculadora">
        <aside className="panel presetPanel" aria-label="Presets de skills">
          <div className="panelHeader">
            <div>
              <h2>Presets</h2>
              <p>{selectedSkill?.name ?? "Skill libre"}</p>
            </div>
          </div>

          <div className="presetGrid">
            <button
              className={isCustomSkill ? "presetButton active" : "presetButton"}
              onClick={applyCustomSkill}
              title="Skill libre"
              type="button"
            >
              <span className="customPresetIcon">0</span>
              <span>Skill libre</span>
            </button>
            {skillPresets.map((skill) => (
              <button
                className={skill.id === selectedSkillId ? "presetButton active" : "presetButton"}
                key={skill.id}
                onClick={() => applyPreset(skill.id)}
                title={skill.name}
                type="button"
              >
                <Image src={skill.iconUrl} alt="" width={44} height={44} />
                <span>{skill.name}</span>
              </button>
            ))}
          </div>
        </aside>

        <form className="panel formPanel">
          <fieldset className="fieldGroup">
            <legend className="legendWithHelp">
              <span>Atributos</span>
              <span className="helpTooltipWrap">
                <button
                  aria-label="Información sobre atributos"
                  className="helpTooltipButton"
                  type="button"
                >
                  ?
                </button>
                <span className="helpTooltip" role="tooltip">
                  Atributos de tu personaje que afectan el variable cast. Formula 2xDEX + INT = 530
                </span>
              </span>
            </legend>
            <div className="statFormulaStack">
              <div className="statFormula">
                <span className="statFormulaLabel">INT</span>
                <label className="field">
                  <span>Base</span>
                  <div className="inputWrap">
                    <input
                      min={0}
                      onChange={(event) => setField("intBase", event.target.value)}
                      step="1"
                      type="number"
                      value={input.intBase}
                    />
                  </div>
                </label>
                <span className="statFormulaOperator">+</span>
                <label className="field">
                  <span>Extra</span>
                  <div className="inputWrap">
                    <input
                      min={0}
                      onChange={(event) => setField("intExtra", event.target.value)}
                      step="1"
                      type="number"
                      value={input.intExtra}
                    />
                  </div>
                </label>
                <span className="statFormulaOperator">=</span>
                <label className="field">
                  <span>Total</span>
                  <div className="inputWrap readonly">
                    <input readOnly tabIndex={-1} type="number" value={timingInput.int} />
                  </div>
                </label>
              </div>

              <div className="statFormula">
                <span className="statFormulaLabel">DEX</span>
                <label className="field">
                  <span>Base</span>
                  <div className="inputWrap">
                    <input
                      min={0}
                      onChange={(event) => setField("dexBase", event.target.value)}
                      step="1"
                      type="number"
                      value={input.dexBase}
                    />
                  </div>
                </label>
                <span className="statFormulaOperator">+</span>
                <label className="field">
                  <span>Extra</span>
                  <div className="inputWrap">
                    <input
                      min={0}
                      onChange={(event) => setField("dexExtra", event.target.value)}
                      step="1"
                      type="number"
                      value={input.dexExtra}
                    />
                  </div>
                </label>
                <span className="statFormulaOperator">=</span>
                <label className="field">
                  <span>Total</span>
                  <div className="inputWrap readonly">
                    <input readOnly tabIndex={-1} type="number" value={timingInput.dex} />
                  </div>
                </label>
              </div>
            </div>
            <p className="statFormulaNote">
              {formatNumber(statFormulaTotal)} / 530
              {statFormulaMissing > 0 ? ` - faltan ${formatNumber(statFormulaMissing)} puntos` : " - objetivo alcanzado"}
            </p>
          </fieldset>

          {fieldGroups.map((group) => (
            <fieldset className="fieldGroup" key={group.title}>
              <legend
                className={
                  group.title === "ASPD y Daño" ||
                  group.title === "Parámetros de skill" ||
                  group.title === "Reducciones"
                    ? "legendWithHelp"
                    : undefined
                }
              >
                <span>{group.title}</span>
                {group.title === "ASPD y Daño" ? (
                  <span className="helpTooltipWrap">
                    <button
                      aria-label="Información sobre ASPD y Daño"
                      className="helpTooltipButton"
                      type="button"
                    >
                      ?
                    </button>
                    <span className="helpTooltip" role="tooltip">
                      ASPD total y daño por casteo de tu personaje.
                    </span>
                  </span>
                ) : null}
                {group.title === "Parámetros de skill" ? (
                  <span className="helpTooltipWrap">
                    <button
                      aria-label="Información sobre parámetros de skill"
                      className="helpTooltipButton"
                      type="button"
                    >
                      ?
                    </button>
                    <span className="helpTooltip" role="tooltip">
                      Parametros de casteo de la skill a probar.
                    </span>
                  </span>
                ) : null}
                {group.title === "Reducciones" ? (
                  <span className="helpTooltipWrap">
                    <button
                      aria-label="Información sobre reducciones"
                      className="helpTooltipButton"
                      type="button"
                    >
                      ?
                    </button>
                    <span className="helpTooltip" role="tooltip">
                      Reducciones gobales y de skill que tiene tu personaje, puedes verlo en tu equipo.
                    </span>
                  </span>
                ) : null}
              </legend>
              <div className="fieldGrid">
                {group.fields.map((field) => {
                  const isLockedSkillTiming = !isCustomSkill && skillTimingFields.includes(field.key);

                  return (
                    <label className="field" key={field.key}>
                      <span>{field.label}</span>
                      <div className={isLockedSkillTiming ? "inputWrap disabled" : "inputWrap"}>
                        <input
                          disabled={isLockedSkillTiming}
                          min={field.min}
                          onChange={(event) => setField(field.key, event.target.value)}
                          step={field.step ?? "1"}
                          type="number"
                          value={input[field.key]}
                        />
                        {field.suffix ? <small>{field.suffix}</small> : null}
                      </div>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <fieldset className="fieldGroup compact">
            <legend className="legendWithHelp">
              <span>Buffs</span>
              <span className="helpTooltipWrap">
                <button
                  aria-label="Información sobre buffs"
                  className="helpTooltipButton"
                  type="button"
                >
                  ?
                </button>
                <span className="helpTooltip" role="tooltip">
                  Buff que tiene tu personaje que afectan el spam de la skill.
                </span>
              </span>
            </legend>
            <label className="magicStringsOption">
              <input
                checked={magicStrings}
                onChange={(event) => setMagicStrings(event.target.checked)}
                type="checkbox"
              />
              <img
                alt=""
                aria-hidden="true"
                className="magicStringsIcon"
                height={20}
                src="https://irowiki.org/w/images/c/c0/Magic_Strings.png"
                width={20}
              />
              <span>Magic Strings</span>
            </label>
          </fieldset>

          <fieldset className="fieldGroup compact">
            <legend className="legendWithHelp">
              <span>Objetivo (opcional)</span>
              <span className="helpTooltipWrap">
                <button
                  aria-label="Información sobre objetivo opcional"
                  className="helpTooltipButton"
                  type="button"
                >
                  ?
                </button>
                <span className="helpTooltip" role="tooltip">
                  Vida de la mob que quieres simular, para calcular en cuanto tiempo muere.
                </span>
              </span>
            </legend>
            <label className="field">
              <span>Monster HP</span>
              <div className="inputWrap">
                <input
                  min={0}
                  onChange={(event) => setField("monsterHp", event.target.value)}
                  step="1000"
                  type="number"
                  value={input.monsterHp}
                />
                <small>HP</small>
              </div>
            </label>
          </fieldset>
        </form>

        <section className="panel resultsPanel" aria-label="Resultados">
          <div className="resultPrimary">
            <span>DAÑO POR SEGUNDO (DPS)</span>
            <strong>{formatNumber(result.dps)}</strong>
            <p>{result.skillsPerSecond.toFixed(1)} skills/s</p>
          </div>

          <div className="analysisBox">
            <h2>{analysis.title}</h2>
            <p>{analysis.text}</p>
          </div>

          <dl className="statList">
            <div>
              <dt>Total DEX</dt>
              <dd>{formatNumber(timingInput.dex)}</dd>
            </div>
            <div>
              <dt>Total INT</dt>
              <dd>{formatNumber(timingInput.int)}</dd>
            </div>
            <div>
              <dt>Final Variable Cast</dt>
              <dd>{formatSeconds(result.finalVariableCast)}</dd>
            </div>
            <div>
              <dt>Final Fixed Cast</dt>
              <dd>{formatSeconds(result.finalFixedCast)}</dd>
            </div>
            <div>
              <dt>Total Cast Time</dt>
              <dd>{formatSeconds(result.totalCastTime)}</dd>
            </div>
            <div>
              <dt>Final Delay</dt>
              <dd>{formatSeconds(result.finalPostCast)}</dd>
            </div>
            <div>
              <dt>Final Cooldown</dt>
              <dd>{formatSeconds(result.finalCooldown)}</dd>
            </div>
            <div>
              <dt>ASPD Delay</dt>
              <dd>{formatSeconds(result.animationDelay)}</dd>
            </div>
            <div>
              <dt>Time per Skill</dt>
              <dd>{formatSeconds(result.totalTimePerSkill)}</dd>
            </div>
            <div>
              <dt>Required ASPD</dt>
              <dd>{result.aspdNeeded}</dd>
            </div>
            <div>
              <dt>Time to Kill</dt>
              <dd>{result.timeToKill ? formatSeconds(result.timeToKill) : "Sin HP objetivo"}</dd>
            </div>
          </dl>
        </section>
      </section>
    </main>
  );
}
