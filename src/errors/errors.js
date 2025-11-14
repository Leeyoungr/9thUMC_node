import { StatusCodes } from "http-status-codes";

const Errors = {
  // Common Errors
  BAD_REQUEST: {
    code: StatusCodes.BAD_REQUEST,
    message: "잘못된 요청입니다. 입력값을 확인해주세요.",
    description: "필수 파라미터 누락 또는 데이터 형식 오류",
  },

  // User Errors
  LOGIN_FAILED: {
    code: StatusCodes.UNAUTHORIZED,
    message: "이메일 또는 비밀번호가 올바르지 않습니다.",
    description: "로그인 실패: 일치하는 사용자 없음 또는 비밀번호 오류",
  },
  DUPLICATE_USER_EMAIL: {
    code: StatusCodes.CONFLICT,
    message: "이미 사용 중인 이메일입니다.",
    description: "회원가입 실패: 중복된 이메일",
  },

  // Store Errors
  STORE_NOT_FOUND: {
    code: StatusCodes.NOT_FOUND,
    message: "요청하신 매장을 찾을 수 없습니다.",
    description: "존재하지 않는 storeId로 매장 조회 시도",
  },

  // Mission Errors
  MISSION_NOT_FOUND: {
    code: StatusCodes.NOT_FOUND,
    message: "요청하신 미션을 찾을 수 없습니다.",
    description: "존재하지 않는 missionId로 미션 조회 시도",
  },

  USER_MISSION_NOT_FOUND: {
    code: StatusCodes.NOT_FOUND,
    message: "요청하신 사용자 미션을 찾을 수 없습니다.",
    description: "존재하지 않는 userMissionId로 사용자 미션 조회 시도",
  },

  USER_MISSION_ALREADY_IN_PROGRESS: {
    code: StatusCodes.CONFLICT,
    message: "이미 도전중인 미션입니다.",
    description: "도전중인 미션을 다시 도전 처리 시도",
  },

  USER_MISSION_NOT_IN_PROGRESS: {
    code: StatusCodes.CONFLICT,
    message: "진행 중인 미션이 아닙니다.",
    description: "진행 중이지 않은 미션을 완료 처리 시도",
  },

  // Database Errors
  DATABASE_ERROR: {
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "데이터베이스 처리 중 오류가 발생했습니다.",
    description: "쿼리 실행 실패 또는 연결 문제",
  },

  // Fallback Error
  UNHANDLED_ERROR: {
    code: StatusCodes.INTERNAL_SERVER_ERROR,
    message: "서버에서 처리하지 못한 오류가 발생했습니다.",
    description: "예상치 못한 서버 오류",
  },
};

export default Errors;
