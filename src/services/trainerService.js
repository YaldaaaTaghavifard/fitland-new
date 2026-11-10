
const TRAINER_KEY = "fitland_trainer_workspace";
const MEMBER_KEY = "fitland_member_workspace";
const USERS_KEY = "fitland_users";

const today = () => new Date().toISOString().slice(0, 10);

const defaultTrainerData = {
  "trainer-1": {
    assignedMembers: ["member-1"],

    availability: [
      {
        id: "slot-1",
        date: "2026-11-02",
        start: "09:00",
        end: "12:00",
        status: "available",
      },
      {
        id: "slot-2",
        date: "2026-11-03",
        start: "14:00",
        end: "18:00",
        status: "available",
      },
      {
        id: "slot-3",
        date: "2026-11-04",
        start: "09:00",
        end: "12:00",
        status: "available",
      },
    ],

    followUps: [
      {
        id: "follow-1",
        memberId: "member-1",
        title: "بررسی روند تمرین",
        note: "وضعیت انجام برنامه تمرینی بررسی شود.",
        date: "2026-11-01",
        status: "pending",
      },
    ],
  },
};

function readStorage(key, fallback = {}) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getTrainerData(trainerId) {
  const all = readStorage(TRAINER_KEY, null);

  if (!all) {
    writeStorage(TRAINER_KEY, defaultTrainerData);
    return defaultTrainerData[trainerId] || {
      assignedMembers: [],
      availability: [],
      followUps: [],
    };
  }

  if (!all[trainerId]) {
    all[trainerId] = {
      assignedMembers: [],
      availability: [],
      followUps: [],
    };
    writeStorage(TRAINER_KEY, all);
  }

  return all[trainerId];
}

function updateTrainerData(trainerId, updater) {
  const all = readStorage(TRAINER_KEY, defaultTrainerData);
  const current = getTrainerData(trainerId);
  all[trainerId] = updater(current);
  writeStorage(TRAINER_KEY, all);
  return all[trainerId];
}

function getMemberWorkspace() {
  return readStorage(MEMBER_KEY, {});
}

function saveMemberWorkspace(data) {
  writeStorage(MEMBER_KEY, data);
}

function getUsers() {
  return readStorage(USERS_KEY, []);
}

function getAssignedMemberIds(trainerId) {
  return getTrainerData(trainerId).assignedMembers || [];
}

function getAssignedMembers(trainerId) {
  const assignedIds = getAssignedMemberIds(trainerId);
  const users = getUsers();
  const workspace = getMemberWorkspace();

  return assignedIds
    .map((id) => {
      const user = users.find((item) => item.id === id);
      if (!user || user.role !== "member") return null;

      const data = workspace[id] || {};

      return {
        ...user,
        profile: data.profile || {},
        membership: data.membership || {},
        completedExercises: data.completedExercises || [],
        bookings: data.bookings || [],
        invoices: data.invoices || [],
        trainingPlan: data.trainingPlan || null,
        nutritionPlan: data.nutritionPlan || null,
      };
    })
    .filter(Boolean);
}

function getMemberData(memberId) {
  const workspace = getMemberWorkspace();
  return workspace[memberId] || null;
}

function updateMemberData(memberId, updater) {
  const workspace = getMemberWorkspace();
  const current = workspace[memberId] || {};
  workspace[memberId] = updater(current);
  saveMemberWorkspace(workspace);
  return workspace[memberId];
}

function addFollowUp(trainerId, followUp) {
  return updateTrainerData(trainerId, (current) => ({
    ...current,
    followUps: [
      {
        id: `follow-${Date.now()}`,
        createdAt: today(),
        status: "pending",
        ...followUp,
      },
      ...(current.followUps || []),
    ],
  }));
}

function updateFollowUp(trainerId, followUpId, status) {
  return updateTrainerData(trainerId, (current) => ({
    ...current,
    followUps: current.followUps.map((item) =>
      item.id === followUpId ? { ...item, status } : item
    ),
  }));
}

function addAvailability(trainerId, slot) {
  const current = getTrainerData(trainerId);

  const overlapping = current.availability.some(
    (item) =>
      item.date === slot.date &&
      item.status === "available" &&
      slot.start < item.end &&
      slot.end > item.start
  );

  if (overlapping) {
    return { success: false, message: "این بازه با زمان آزاد دیگری هم‌پوشانی دارد." };
  }

  updateTrainerData(trainerId, (data) => ({
    ...data,
    availability: [
      ...data.availability,
      { id: `slot-${Date.now()}`, status: "available", ...slot },
    ],
  }));

  return { success: true };
}

function removeAvailability(trainerId, slotId) {
  const current = getTrainerData(trainerId);
  const slot = current.availability.find((item) => item.id === slotId);

  if (!slot || slot.status !== "available") {
    return { success: false, message: "این بازه قابل حذف نیست." };
  }

  updateTrainerData(trainerId, (data) => ({
    ...data,
    availability: data.availability.filter((item) => item.id !== slotId),
  }));

  return { success: true };
}

function getAllBookings(trainerId) {
  return getAssignedMembers(trainerId).flatMap((member) =>
    (member.bookings || []).map((booking) => ({
      ...booking,
      memberId: member.id,
      memberName: member.name,
    }))
  );
}

function getMonthlyReport(trainerId, year, month) {
  const members = getAssignedMembers(trainerId);
  const prefix = `${year}-${String(month).padStart(2, "0")}`;

  const memberReports = members.map((member) => {
    const bookings = (member.bookings || []).filter(
      (item) => item.date?.startsWith(prefix)
    );

    const completed = (member.completedExercises || []).length;

    const activities = member.activities || [];

    const monthlyActivities = activities.filter(
      (item) =>
        item.date?.startsWith(prefix) ||
        item.createdAt?.startsWith(prefix)
    );

    return {
      memberId: member.id,
      memberName: member.name,
      completedExercises: completed,
      bookings: bookings.length,
      monthlyActivities: monthlyActivities.length,
      hasActivity: bookings.length > 0 || monthlyActivities.length > 0,
    };
  });

  return {
    year,
    month,
    totalMembers: members.length,
    activeMembers: memberReports.filter((item) => item.hasActivity).length,
    inactiveMembers: memberReports.filter((item) => !item.hasActivity).length,
    totalBookings: memberReports.reduce(
      (sum, item) => sum + item.bookings,
      0
    ),
    totalCompletedExercises: memberReports.reduce(
      (sum, item) => sum + item.completedExercises,
      0
    ),
    members: memberReports,
  };
}

export const trainerService = {
  getTrainerData,
  getAssignedMembers,
  getMemberData,
  getAssignedMemberIds,
  getAllBookings,
  addFollowUp,
  updateFollowUp,
  addAvailability,
  removeAvailability,
  getMonthlyReport,

  updateTrainingPlan(memberId, plan) {
    return updateMemberData(memberId, (current) => ({
      ...current,
      trainingPlan: plan,
    }));
  },

  updateNutritionPlan(memberId, plan) {
    return updateMemberData(memberId, (current) => ({
      ...current,
      nutritionPlan: plan,
    }));
  },

  assignMember(trainerId, memberId) {
    const current = getTrainerData(trainerId);

    if (current.assignedMembers.includes(memberId)) {
      return { success: false, message: "این عضو قبلاً به مربی اختصاص یافته است." };
    }

    updateTrainerData(trainerId, (data) => ({
      ...data,
      assignedMembers: [...data.assignedMembers, memberId],
    }));

    return { success: true };
  },

  removeMember(trainerId, memberId) {
    updateTrainerData(trainerId, (data) => ({
      ...data,
      assignedMembers: data.assignedMembers.filter((id) => id !== memberId),
    }));
  },

  getFollowUps(trainerId) {
    return getTrainerData(trainerId).followUps || [];
  },

  getAvailability(trainerId) {
    return getTrainerData(trainerId).availability || [];
  },
};
