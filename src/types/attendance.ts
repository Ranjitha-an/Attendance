export interface TrainerSetupState {
  mode: "bootcamp" | "others";
  course: string;
  batches: string[];
  purpose: string;
  purposeDetail: string;
  dateTime: string;
  groupCount: number;
}

export interface StudentInfoState {
  studentName: string;
  studentId: string;
  groupId: string;
}

export interface AttendanceSessionState {
  currentRound: number;
  timerSeconds: number;
  isActive: boolean;
}
