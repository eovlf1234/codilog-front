export const coordiSort = [
    { label: "최신순", value: "LATEST" },
    { label: "오래된순", value: "OLDEST" }
] as const;

export const likeCoordiSort = [
    ...coordiSort,
    { label: "좋아요\n최신순", value: "LIKE_LATEST" },
    { label: "좋아요\n오래된순", value: "LIKE_OLDEST" }
] as const;

// 정렬값 타입 자동 추출 (설정한 값들만 사용가능)
export type CoordiSort = typeof coordiSort[number]["value"];

export type LikeCoordiSort = typeof likeCoordiSort[number]["value"];