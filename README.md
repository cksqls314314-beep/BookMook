# BookMook – 중고서점 (Landing · Book · Cart · Checkout)

첫 번째 이미지의 미니멀 무드를 기본 테마로 유지하고, 상세/장바구니/결제는 디테일만 반영했습니다.

## 빠른 시작
```bash
npm i
cp .env.local.example .env.local
# A 또는 B 중 하나만 채우면 됩니다
# A) NEXT_PUBLIC_SHEETS_CSV_URL = 공개 CSV 주소
# B) GOOGLE_SHEETS_API_KEY / GOOGLE_SHEET_ID / SHEETS_RANGE 설정
npm run dev
# http://localhost:3000
```

## 시트 스키마
```
ISBN | 제목 | 저자 | 등급 | 출간일 | 정가 | 매입가 | 판매가 | 재고수량 | 비고 | 표지URL
```
1행은 헤더, 데이터는 2행부터. 표지는 구글드라이브 URL도 가능(권한: 링크가 있는 모든 사용자-보기).

## 페이지
- `/` 랜딩
- `/book/[isbn]` 상세
- `/cart` 장바구니
- `/checkout` 결제(데모 완료)

## 데이터 연동
### A) 공개 CSV
- 파일 > 웹에 게시 > 링크 > **시트 선택 + CSV** > 생성된 주소를 `NEXT_PUBLIC_SHEETS_CSV_URL`에 저장

### B) Sheets API
- Google Cloud에서 API Key 발급, Google Sheets API 활성화
- 스프레드시트 ID와 `SHEETS_RANGE` 설정

## 실결제 연동(향후)
- `/checkout`의 onSubmit에 토스페이먼츠 호출 로직을 연결하면 됩니다.
