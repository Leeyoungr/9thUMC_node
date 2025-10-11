---
name: "\U0001FA76 CI/CD 템플릿"
about: ci/cd 템플릿
title: "\U0001FA76 ci/cd :"
labels: "\U0001FA76 CI/CD"
assignees: ''

---

### 📌 개요 (What & Why?)
- CI/CD 파이프라인을 왜, 어떻게 변경하는지 설명해주세요.
- 예: 배포 프로세스 자동화를 통한 휴먼 에러 감소
- 예: 테스트 단계 추가로 코드 안정성 확보

### 🏗️ 파이프라인 변경 사항 (Pipeline Changes)
- CI/CD 워크플로우의 어떤 부분을 변경했는지 구체적으로 작성해주세요.
- **AS-IS:** 수동으로 QA 서버에 배포
- **TO-BE:** `develop` 브랜치에 머지 시 자동으로 QA 서버에 배포

### ⚙️ 설정 변경 (Configuration Changes)
- 변경된 설정 파일, 스크립트, 환경 변수 등을 명시해주세요.
- 예: `.github/workflows/deploy.yml` 파일 수정
- 예: `AWS_SECRET_ACCESS_KEY` 등 환경 변수 추가

### ✅ TODO
- [ ] 작업 1: 배포 스크립트 작성
- [ ] 작업 2: GitHub Actions 워크플로우 설정 파일 수정
- [ ] 작업 3: 클라우드 서비스 설정 (예: AWS S3, EC2)

### 🧪 테스트 계획 (Test Plan)
- 변경된 파이프라인이 정상적으로 작동하는지 어떻게 검증할 것인지 작성해주세요.
- 예: 테스트용 브랜치를 생성하여 PR 및 머지를 통해 파이프라인 트리거
- 예: 빌드, 테스트, 배포 각 단계의 로그를 확인하여 성공 여부 검증

### 📎 참고 자료 (Optional)
- 관련 문서나 참고한 아티클 링크를 첨부해주세요.
