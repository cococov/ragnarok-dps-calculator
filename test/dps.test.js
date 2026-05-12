const assert = require("node:assert/strict");
const test = require("node:test");

function calculateReference(input) {
  const maxAspdDelay = (200 - 193) / 50;
  const statFactor = Math.sqrt(Math.max(0, input.dex * 2 + input.int) / 530);
  const finalVariableCast = Math.max(
    0,
    input.variableCast * (1 - Math.min(statFactor, 1)) * (1 - input.variableCastReductionPercent / 100),
  );
  const finalFixedCast = Math.max(0, input.fixedCast - input.fixedCastReductionSeconds);
  const totalCastTime = finalVariableCast + finalFixedCast;
  const finalPostCast = Math.max(0, input.postCast * (1 - input.postCastReductionPercent / 100));
  const finalCooldown = Math.max(0, input.cooldown * (1 - input.cooldownReductionFactor));
  const animationDelay = Math.max(0, (200 - input.aspd) / 50);
  const actionInterval = Math.max(finalPostCast, animationDelay, finalCooldown, 0.001);
  const skillsPerSecond = Math.floor((1 / (totalCastTime + actionInterval)) * 10) / 10;
  const bottleneckCandidates = [
    { kind: "variableCast", value: finalVariableCast },
    { kind: "fixedCast", value: finalFixedCast },
    { kind: "cooldown", value: finalCooldown },
    ...(finalPostCast > maxAspdDelay ? [{ kind: "postCast", value: finalPostCast }] : []),
  ];

  const bestStaticCandidate = bottleneckCandidates.reduce((best, current) => {
    if (current.value <= 0) return best;
    if (!best || current.value > best.value) return current;
    return best;
  }, null);

  const bottleneckCandidate =
    input.aspd < 193 && animationDelay > 0 && (!bestStaticCandidate || animationDelay > bestStaticCandidate.value)
      ? { kind: "aspd", value: animationDelay }
      : bestStaticCandidate;

  return {
    dps: input.damage * skillsPerSecond,
    skillsPerSecond,
    finalVariableCast,
    finalFixedCast,
    finalPostCast,
    finalCooldown,
    animationDelay,
    bottleneck: bottleneckCandidate ? bottleneckCandidate.kind : "balanced",
  };
}

test("reference formula matches the imported page calculation", () => {
  const result = calculateReference({
    dex: 120,
    int: 80,
    aspd: 190,
    damage: 1000000,
    variableCast: 0.5,
    fixedCast: 0.5,
    postCast: 0.5,
    cooldown: 0.15,
    variableCastReductionPercent: 20,
    fixedCastReductionSeconds: 0.2,
    postCastReductionPercent: 72,
    cooldownReductionFactor: 0,
    monsterHp: 0,
  });

  assert.equal(result.skillsPerSecond, 1.6);
  assert.equal(result.dps, 1600000);
  assert.equal(Number(result.finalFixedCast.toFixed(3)), 0.3);
  assert.equal(result.bottleneck, "fixedCast");
});

test("aspd cap is not treated as a bottleneck at 193", () => {
  const result = calculateReference({
    dex: 0,
    int: 0,
    aspd: 193,
    damage: 1000000,
    variableCast: 0,
    fixedCast: 0,
    postCast: 0,
    cooldown: 0,
    variableCastReductionPercent: 0,
    fixedCastReductionSeconds: 0,
    postCastReductionPercent: 0,
    cooldownReductionFactor: 0,
    monsterHp: 0,
  });

  assert.equal(result.bottleneck, "balanced");
});

test("variable cast is detected as bottleneck when it remains", () => {
  const result = calculateReference({
    dex: 0,
    int: 0,
    aspd: 193,
    damage: 1000000,
    variableCast: 1,
    fixedCast: 0,
    postCast: 0,
    cooldown: 0,
    variableCastReductionPercent: 0,
    fixedCastReductionSeconds: 0,
    postCastReductionPercent: 0,
    cooldownReductionFactor: 0,
    monsterHp: 0,
  });

  assert.equal(result.bottleneck, "variableCast");
});

test("aspd does not win when it ties the final delay", () => {
  const result = calculateReference({
    dex: 0,
    int: 0,
    aspd: 190,
    damage: 1000000,
    variableCast: 0,
    fixedCast: 0,
    postCast: 0.2,
    cooldown: 0,
    variableCastReductionPercent: 0,
    fixedCastReductionSeconds: 0,
    postCastReductionPercent: 0,
    cooldownReductionFactor: 0,
    monsterHp: 0,
  });

  assert.equal(result.finalPostCast, result.animationDelay);
  assert.equal(result.bottleneck, "postCast");
});

test("delay at 0.14s is not treated as a bottleneck", () => {
  const result = calculateReference({
    dex: 0,
    int: 0,
    aspd: 193,
    damage: 1000000,
    variableCast: 0,
    fixedCast: 0,
    postCast: 0.14,
    cooldown: 0,
    variableCastReductionPercent: 0,
    fixedCastReductionSeconds: 0,
    postCastReductionPercent: 0,
    cooldownReductionFactor: 0,
    monsterHp: 0,
  });

  assert.equal(Number(result.finalPostCast.toFixed(3)), 0.14);
  assert.equal(result.bottleneck, "balanced");
});
