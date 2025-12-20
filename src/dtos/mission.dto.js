export const responseFromMissions = (missions) => {
  return missions.map((m) => ({
    id: m.id,
    reward: m.reward,
    spec: m.spec,
    deadLine: new Date(m.deadLine).toISOString().split("T")[0],
  }));
};
