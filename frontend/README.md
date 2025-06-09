# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

CREATE TABLE LAB_RESULTS (
	LAB_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
	VISIT_ID VARCHAR(20) NOT NULL,
	LAB_TIME DATETIME NOT NULL,
	
	-- 혈액검사
	WBC DECIMAL(10,3) COMMENT '백혈구 수 (10^3/μL)',
	HEMOGLOBIN DECIMAL(10,3) COMMENT '헤모글로빈 (g/dL)',
	PLATELET_COUNT DECIMAL(10,3) COMMENT '혈소판 수 (10^3/μL)',
	
	-- 전해질
	NA DECIMAL(10,3) COMMENT '나트륨 (mEq/L)',
	K DECIMAL(10,3) COMMENT '칼륨 (mEq/L)',
	CHLORIDE DECIMAL(10,3) COMMENT '염화물 (mEq/L)',
	CA DECIMAL(10,3) COMMENT '칼슘 (mg/dL)',
	
	-- 신장기능
	UREA_NITROGEN DECIMAL(10,3) COMMENT '혈중요소질소 (mg/dL)',
	CREATININE DECIMAL(10,3) COMMENT '크레아티닌 (mg/dL)',
	
	-- 간기능
	AST DECIMAL(10,3) COMMENT '아스파르테이트 아미노전이효소 (U/L)',
	ALT DECIMAL(10,3) COMMENT '알라닌 아미노전이효소 (U/L)',
	BILIRUBIN DECIMAL(10,3) COMMENT '총 빌리루빈 (mg/dL)',
	ALBUMIN DECIMAL(10,3) COMMENT '알부민 (g/dL)',
	
	-- 대사
	GLUCOSE DECIMAL(10,3) COMMENT '혈당 (mg/dL)',
	
	-- 염증
	CRP DECIMAL(10,3) COMMENT 'C반응성단백질 (mg/L)',
	
	-- 혈액응고
	PT DECIMAL(10,3) COMMENT '프로트롬빈 시간 (초)',
	INR_PT DECIMAL(10,3) COMMENT '국제정규화비율',
	PTT DECIMAL(10,3) COMMENT '부분혈전형성시간 (초)',
	D_DIMER DECIMAL(10,3) COMMENT 'D-다이머 (mg/L)',
	
	-- 심장표지자
	TROPONIN_T DECIMAL(10,3) COMMENT '트로포닌 T (ng/mL)',
	
	-- 대사/관류
	LACTATE DECIMAL(10,3) COMMENT '젖산 (mmol/L)',
	
	FOREIGN KEY (VISIT_ID) REFERENCES EMERGENCY_VISIT (VISIT_ID)
);


CREATE TABLE MEDICAL_HISTORY (
	HISTORY_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
	VISIT_ID VARCHAR(20) NOT NULL,
	USER_ID VARCHAR(20) NOT NULL,
	RECORD_TIME DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONTENT TEXT NOT NULL,
   FOREIGN KEY (VISIT_ID) REFERENCES EMERGENCY_VISIT (VISIT_ID),
   FOREIGN KEY (USER_ID) REFERENCES USER (USER_ID)
);

```
CREATE TABLE AI_PREDICTION (
	PRE_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
	VISIT_ID VARCHAR(20) NOT NULL,
	PRE_TYPE VARCHAR(20) NOT NULL CHECK (PRE_TYPE IN ('ADMISSION', 'DISCHARGE')),
	PRE_TIME DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRE_DISPOSITION TINYINT(1) NOT NULL CHECK (PRE_DISPOSITION IN (0, 1, 2)),
	PRE_SCORE INT,
	REASON TEXT,
	FOREIGN KEY (VISIT_ID) REFERENCES EMERGENCY_VISIT (VISIT_ID)
);


CREATE TABLE BED_INFO (
	BED_NUMBER VARCHAR(10) PRIMARY KEY,
	BED_TYPE VARCHAR(20) NOT NULL,
	LOCATION VARCHAR(50),
	STATUS VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (STATUS IN ('AVAILABLE', 'OCCUPIED')),
	MAX_CAPACITY INT NOT NULL
);
```