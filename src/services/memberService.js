import { initialMemberData } from "../data/memberSeed";

const MEMBER_DATA_KEY = "fitland_member_data";

function readAllData() {
  const savedData = localStorage.getItem(MEMBER_DATA_KEY);

  if (!savedData) {
    localStorage.setItem(
      MEMBER_DATA_KEY,
      JSON.stringify(initialMemberData)
    );

    return initialMemberData;
  }

  try {
    return JSON.parse(savedData);
  } catch {
    localStorage.setItem(
      MEMBER_DATA_KEY,
      JSON.stringify(initialMemberData)
    );

    return initialMemberData;
  }
}

function saveAllData(data) {
  localStorage.setItem(MEMBER_DATA_KEY, JSON.stringify(data));
}

export const memberService = {
  getMember(memberId) {
    const data = readAllData();
    return data[memberId] || null;
  },

  getProfile(memberId) {
    return this.getMember(memberId)?.profile || null;
  },

  updateProfile(memberId, updatedProfile) {
    const data = readAllData();

    if (!data[memberId]) {
      return { success: false, message: "اطلاعات عضو پیدا نشد." };
    }

    data[memberId].profile = {
      ...data[memberId].profile,
      ...updatedProfile,
    };

    saveAllData(data);

    return {
      success: true,
      data: data[memberId].profile,
      message: "اطلاعات پروفایل ذخیره شد.",
    };
  },

  getMembership(memberId) {
    return this.getMember(memberId)?.membership || null;
  },

  getPayments(memberId) {
    return this.getMember(memberId)?.payments || [];
  },

  getBookings(memberId) {
    return this.getMember(memberId)?.bookings || [];
  },

  getActivities(memberId) {
    return this.getMember(memberId)?.activities || [];
  },
};