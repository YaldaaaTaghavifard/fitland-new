import { initialFitnessData } from "../data/fitnessSeed";

const FITNESS_KEY = "fitland_fitness_data";

function getAllData() {
  const saved = localStorage.getItem(FITNESS_KEY);

  if (!saved) {
    localStorage.setItem(FITNESS_KEY, JSON.stringify(initialFitnessData));
    return initialFitnessData;
  }

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.setItem(FITNESS_KEY, JSON.stringify(initialFitnessData));
    return initialFitnessData;
  }
}

function saveAllData(data) {
  localStorage.setItem(FITNESS_KEY, JSON.stringify(data));
}

function ensureMember(data, memberId) {
  if (!data[memberId]) {
    data[memberId] = {
      trainingPlan: null,
      nutritionPlan: null,
      measurements: [],
    };
  }

  return data[memberId];
}

export const fitnessService = {
  getMemberFitness(memberId) {
    const data = getAllData();
    return data[memberId] || null;
  },

  getTrainingPlan(memberId) {
    return this.getMemberFitness(memberId)?.trainingPlan || null;
  },

  getNutritionPlan(memberId) {
    return this.getMemberFitness(memberId)?.nutritionPlan || null;
  },

  getMeasurements(memberId) {
    const records = this.getMemberFitness(memberId)?.measurements || [];

    return [...records].sort((a, b) => a.date.localeCompare(b.date));
  },

  addMeasurement(memberId, measurement) {
    const data = getAllData();
    const member = ensureMember(data, memberId);

    const record = {
      ...measurement,
      id: `measurement-${Date.now()}`,
    };

    member.measurements = [...(member.measurements || []), record];

    saveAllData(data);

    return {
      success: true,
      data: record,
    };
  },

  deleteMeasurement(memberId, measurementId) {
    const data = getAllData();
    const member = data[memberId];

    if (!member) {
      return { success: false, message: "اطلاعات عضو پیدا نشد." };
    }

    member.measurements = (member.measurements || []).filter(
      (item) => item.id !== measurementId
    );

    saveAllData(data);

    return { success: true };
  },
};