export type SkillTimingInput = {
  dex: number;
  int: number;
  aspd: number;
  damage: number;
  variableCast: number;
  fixedCast: number;
  postCast: number;
  cooldown: number;
  variableCastReductionPercent: number;
  fixedCastReductionSeconds: number;
  postCastReductionPercent: number;
  cooldownReductionFactor: number;
  monsterHp: number;
  magicStrings?: boolean;
};

export type DpsResult = {
  finalVariableCast: number;
  finalFixedCast: number;
  totalCastTime: number;
  finalPostCast: number;
  finalCooldown: number;
  animationDelay: number;
  actionInterval: number;
  totalTimePerSkill: number;
  rawSkillsPerSecond: number;
  skillsPerSecond: number;
  dps: number;
  timeToKill: number | null;
  aspdNeeded: number;
  bottleneck: "variableCast" | "fixedCast" | "cooldown" | "postCast" | "aspd" | "balanced";
};

const clampMinimum = (value: number, minimum = 0) => Math.max(minimum, value);
const MAX_ASPD_DELAY = (200 - 193) / 50;

export function calculateDps(input: SkillTimingInput): DpsResult {
  const statFactor = Math.sqrt(clampMinimum(input.dex * 2 + input.int) / 530);
  const variableCastFactor = 1 - Math.min(statFactor, 1);
  const equipmentVariableCastFactor = 1 - input.variableCastReductionPercent / 100;

  const finalVariableCastWithoutBuff = clampMinimum(
    input.variableCast * variableCastFactor * equipmentVariableCastFactor,
  );
  const finalVariableCast = clampMinimum(
    finalVariableCastWithoutBuff * (input.magicStrings ? 0.8 : 1),
  );
  const finalFixedCast = clampMinimum(input.fixedCast - input.fixedCastReductionSeconds);
  const totalCastTime = finalVariableCast + finalFixedCast;
  const effectivePostCastReductionPercent = Math.min(
    100,
    input.postCastReductionPercent + (input.magicStrings ? 30 : 0),
  );
  const finalPostCast = clampMinimum(input.postCast * (1 - effectivePostCastReductionPercent / 100));
  const finalCooldown = clampMinimum(input.cooldown * (1 - input.cooldownReductionFactor));
  const animationDelay = clampMinimum((200 - input.aspd) / 50);
  const actionInterval = Math.max(finalPostCast, animationDelay, finalCooldown, 0.001);
  const totalTimePerSkill = totalCastTime + actionInterval;
  const rawSkillsPerSecond = totalTimePerSkill > 0 ? 1 / totalTimePerSkill : 0;
  const skillsPerSecond = Math.floor(rawSkillsPerSecond * 10) / 10;
  const dps = input.damage * skillsPerSecond;
  const timeToKill = input.monsterHp > 0 && dps > 0 ? input.monsterHp / dps : null;
  const aspdNeeded = Math.ceil(
    Math.min(193, Math.max(0, 200 - 50 * Math.max(finalPostCast, finalCooldown))),
  );

  const bottleneckCandidates: Array<{
    kind: Exclude<DpsResult["bottleneck"], "balanced" | "aspd">;
    value: number;
  }> = [
    { kind: "variableCast", value: finalVariableCast },
    { kind: "fixedCast", value: finalFixedCast },
    { kind: "cooldown", value: finalCooldown },
    ...(finalPostCast > MAX_ASPD_DELAY ? [{ kind: "postCast" as const, value: finalPostCast }] : []),
  ];

  const bestStaticCandidate = bottleneckCandidates.reduce<(typeof bottleneckCandidates)[number] | null>(
    (best, current) => {
      if (current.value <= 0) return best;
      if (!best || current.value > best.value) return current;
      return best;
    },
    null,
  );

  const aspdBottleneck: DpsResult["bottleneck"] | null =
    input.aspd < 193 && animationDelay > 0 && (!bestStaticCandidate || animationDelay > bestStaticCandidate.value)
      ? "aspd"
      : null;

  const bottleneckCandidate = aspdBottleneck ? { kind: aspdBottleneck, value: animationDelay } : bestStaticCandidate;

  const bottleneck: DpsResult["bottleneck"] = bottleneckCandidate ? bottleneckCandidate.kind : "balanced";

  return {
    finalVariableCast,
    finalFixedCast,
    totalCastTime,
    finalPostCast,
    finalCooldown,
    animationDelay,
    actionInterval,
    totalTimePerSkill,
    rawSkillsPerSecond,
    skillsPerSecond,
    dps,
    timeToKill,
    aspdNeeded,
    bottleneck,
  };
}
