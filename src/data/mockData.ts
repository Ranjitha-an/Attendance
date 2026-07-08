import imgCircle from "../assets/images/img-circle.svg";
import imgSquare from "../assets/images/img-square.svg";
import imgTriangle from "../assets/images/img-triangle.svg";
import imgDiamond from "../assets/images/img-diamond.svg";
import imgHexagon from "../assets/images/img-hexagon.svg";
import imgCross from "../assets/images/img-cross.svg";
import imgWave from "../assets/images/img-wave.svg";
import imgDouble from "../assets/images/img-double.svg";
import imgPattern9 from "../assets/images/img-pattern9.svg";
import imgPattern10 from "../assets/images/img-pattern10.svg";

import imagesJson from "./json/images.json";
import groupsJson from "./json/groups.json";
import dropdownOptionsJson from "./json/dropdownOptions.json";
import appConfigJson from "./json/appConfig.json";
import attendanceReportJson from "./json/attendanceReport.json";
import studentReportJson from "./json/studentReport.json";
import batchStudentReportJson from "./json/batchStudentReport.json";
import purposeOptionsJson from "./json/purposeOptions.json";

export interface AttendanceImage {
  id: string;
  label: string;
  src: string;
}

export interface AttendanceGroup {
  id: string;
  name: string;
  correctImageId: string;
  studentCount: number;
}

export interface AttendanceRound {
  roundNo: number;
  label: string;
  presentPercent: number;
  absentPercent: number;
  total: number;
}

export interface AttendanceReportRow {
  slNo: number;
  date: string;
  purpose: string;
  course: string;
  batch: string;
  branch: string;
  name?: string;
  attendanceRounds: AttendanceRound[];
}

export interface StudentAttendanceRecord {
  slNo: number;
  date: string;
  purpose: string;
  attendanceNo: string;
  present: "Y" | "N";
  remark: string;
}

export interface StudentReportData {
  studentName: string;
  studentId: string;
  course: string;
  batch: string;
  college: string;
  stream: string;
  overallAttendancePercent: number;
  batchAverage: number;
  records: StudentAttendanceRecord[];
}

export interface BatchStudentEntry {
  studentName: string;
  studentId: string;
  records: StudentAttendanceRecord[];
}

export interface BatchStudentReport {
  course: string;
  batch: string;
  college: string;
  stream: string;
  overallAttendancePercent: number;
  batchAverage: number;
  students: BatchStudentEntry[];
}

export interface PurposeOption {
  value: string;
  label: string;
}

export interface TypedTest {
  name: string;
  testType: string;
}

const IMAGE_FILE_MAP: Record<string, string> = {
  "img-circle.svg": imgCircle,
  "img-square.svg": imgSquare,
  "img-triangle.svg": imgTriangle,
  "img-diamond.svg": imgDiamond,
  "img-hexagon.svg": imgHexagon,
  "img-cross.svg": imgCross,
  "img-wave.svg": imgWave,
  "img-double.svg": imgDouble,
  "img-pattern9.svg": imgPattern9,
  "img-pattern10.svg": imgPattern10,
};

export const ATTENDANCE_IMAGES: AttendanceImage[] = imagesJson.map((img) => ({
  id: img.id,
  label: img.label,
  src: IMAGE_FILE_MAP[img.file] ?? "",
}));

export const ATTENDANCE_GROUPS: AttendanceGroup[] = groupsJson;

export const MAX_GROUPS = appConfigJson.maxGroups;
export const IMAGE_POOL_SIZE = ATTENDANCE_IMAGES.length;

export const COURSES = dropdownOptionsJson.courses;
export const BOOTCAMPS = dropdownOptionsJson.bootcamps;
export const BATCHES = dropdownOptionsJson.batches;
export const COLLEGES = dropdownOptionsJson.colleges;
export const BRANCHES = dropdownOptionsJson.branches;
export const SUBJECTS = dropdownOptionsJson.subjects;
export const TEST_TYPES = dropdownOptionsJson.testTypes;
export const TYPED_TESTS: TypedTest[] = dropdownOptionsJson.tests;
export const BATCH_STUDENT_COUNTS: Record<string, number> = dropdownOptionsJson.batchStudentCounts;
export const LIVE_CLASSES = dropdownOptionsJson.liveClasses;
export const REMARK_OPTIONS = dropdownOptionsJson.remarkOptions;

export const PURPOSE_OPTIONS: PurposeOption[] = purposeOptionsJson;

export const DEFAULT_TIMER_SECONDS = appConfigJson.defaultTimerSeconds;
export const EXTEND_SECONDS = appConfigJson.extendSeconds;
export const MAX_ATTENDANCE_ROUNDS = appConfigJson.maxAttendanceRounds;
export const BOOTCAMP_COURSE = appConfigJson.bootcampCourse;
export const BOOTCAMP_BATCH = appConfigJson.bootcampBatch;
export const MAX_STUDENTS_PER_GROUP = appConfigJson.maxStudentsPerGroup;
export const MIN_GROUPS = appConfigJson.minGroups;
export const BOOTCAMP_STUDENT_COUNT = appConfigJson.bootcampStudentCount;

export const MOCK_ATTENDANCE_REPORT: AttendanceReportRow[] = attendanceReportJson;
export const MOCK_STUDENT_REPORT: StudentReportData = studentReportJson as StudentReportData;
export const MOCK_BATCH_STUDENT_REPORT: BatchStudentReport =
  batchStudentReportJson as BatchStudentReport;

export function getImageById(id: string): AttendanceImage | undefined {
  return ATTENDANCE_IMAGES.find((img) => img.id === id);
}

export function getGroupById(id: string): AttendanceGroup | undefined {
  return ATTENDANCE_GROUPS.find((group) => group.id === id);
}

export function getTestsForType(testType: string): string[] {
  return TYPED_TESTS.filter((t) => t.testType === testType).map((t) => t.name);
}

export function getTotalStudentsForBatches(batches: string[]): number {
  return batches.reduce((sum, batch) => sum + (BATCH_STUDENT_COUNTS[batch] ?? 0), 0);
}

export function computeGroupSplit(
  totalStudents: number,
  maxPerGroup = MAX_STUDENTS_PER_GROUP,
  minGroups = MIN_GROUPS,
): number[] {
  if (totalStudents <= 0) return [];

  const neededForCap = Math.ceil(totalStudents / maxPerGroup);
  const groupCount = Math.min(MAX_GROUPS, Math.max(minGroups, neededForCap));
  const base = Math.floor(totalStudents / groupCount);
  const remainder = totalStudents % groupCount;
  const smallerGroupCount = groupCount - remainder;

  return Array.from({ length: groupCount }, (_, i) =>
    i < smallerGroupCount ? base : base + 1,
  );
}

export function generateGroups(
  count: number,
  groupSizes?: number[],
  totalStudents = 200,
): AttendanceGroup[] {
  const safeCount = Math.max(1, Math.min(count, MAX_GROUPS));
  const shuffledImages = [...ATTENDANCE_IMAGES].sort(() => Math.random() - 0.5);

  if (groupSizes && groupSizes.length > 0) {
    const sizes = groupSizes.slice(0, safeCount);
    return sizes.map((studentCount, i) => ({
      id: `group-${i + 1}`,
      name: `Group ${i + 1}`,
      correctImageId: shuffledImages[i % shuffledImages.length].id,
      studentCount,
    }));
  }

  const base = Math.floor(totalStudents / safeCount);
  const remainder = totalStudents % safeCount;

  return Array.from({ length: safeCount }, (_, i) => ({
    id: `group-${i + 1}`,
    name: `Group ${i + 1}`,
    correctImageId: shuffledImages[i % shuffledImages.length].id,
    studentCount: base + (i < remainder ? 1 : 0),
  }));
}

export function buildStudentImageSet(correctImageId: string): AttendanceImage[] {
  const correct = getImageById(correctImageId);
  if (!correct) return [];

  const decoys = ATTENDANCE_IMAGES.filter((img) => img.id !== correctImageId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);

  return [correct, ...decoys].sort(() => Math.random() - 0.5);
}

export function formatCurrentDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function getRoundStats(roundNo: number): { presentPercent: number; absentPercent: number } {
  const stats = appConfigJson.roundStats;
  return stats[roundNo - 1] ?? stats[0];
}
