export type SetupMode = "bootcamp" | "test" | "onsite";

export interface TrainerSetupState {
  setupMode: SetupMode;
  course: string;
  batches: string[];
  purposeDetail: string;
  testType?: string;
  dateTime: string;
  totalStudents: number;
  groupSizes: number[];
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
