
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
import os
import time
import json
import re
from langchain.schema import AIMessage
from collections import OrderedDict

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)

# 개선된 프롬프트 템플릿
prompt_template = PromptTemplate(
    input_variables=[
        "gender", "age", "acuity", "pain", "chief_complaint", "arrival_transport",
        "HR", "RR", "SpO2", "SBP", "DBP", "BT",
        "hemoglobin", "wbc", "plateletCount", "redBloodCells", "sedimentationRate",
        "na", "k", "chloride", "ca", "mg", "ureaNitrogen", "creatinine",
        "ast", "alt", "bilirubin", "albumin", "ap", "ggt", "ld", "ammonia",
        "glucose", "lactate", "acetone", "bhb", "crp", "pt", "inrPt", "ptt",
        "dDimer", "troponinT", "ck", "ckmb", "ntprobnp", "amylase", "lipase",
        "ph", "pco2", "po2", "ctco2", "bcb"
    ],
    template="""
너는 경력 20년 이상의 응급의학과 전문의로서, 환자의 안전을 최우선으로 하되 의료 자원의 효율적 배분도 고려한다.



**Disposition 결정 기준:**
- **85-100점: ICU (disposition: 2)**
  - 즉시 생명위험 또는 집중치료 필요
- **45-84점: 일반병동 (disposition: 1)**  
  - 입원 관찰 및 치료 필요
- **0-44점: 귀가 (disposition: 0)**
  - 외래 처치 후 귀가 가능

**임상 판단 우선 원칙:**
1. 생명징후 불안정 → 무조건 ICU
2. 의식저하 + 고령 → ICU 고려
3. 경미한 증상 + 안정된 활력징후 → 귀가
4. 애매한 경우 → 일반병동 (안전 우선)

**필수 출력 형식:**
{{
  "risk_score": (계산된 점수),
  "disposition": (0: 귀가, 1: 일반병동, 2: ICU),
  "clinical_reason": "점수 구성 요소와 임상 판단 근거를 명확히 설명"
}}

**잘못된 판단 예방:**
- 단순 손목 통증, 감기 증상 등 경미한 경우 → ICU 절대 금지
- 생명징후 안정 + 경미한 증상 → 귀가 우선 고려
- 고령이어도 증상이 경미하면 과도한 입원 지양

환자 정보:
- 성별: {gender} (0: 남성, 1: 여성)
- 나이: {age}세
- ESI Acuity: {acuity}
- 통증 점수: {pain}
- 주요 증상: {chief_complaint}
- 도착 경로: {arrival_transport}
- 활력징후: HR={HR}, RR={RR}, SpO2={SpO2}%, SBP={SBP}, DBP={DBP}, BT={BT}°C
- 검사 결과: (해당하는 경우만 고려)
  Hb={hemoglobin}, WBC={wbc}, PLT={plateletCount}, RBC={redBloodCells}, ESR={sedimentationRate}
  Na={na}, K={k}, Cl={chloride}, Ca={ca}, Mg={mg}, BUN={ureaNitrogen}, Cr={creatinine}
  AST={ast}, ALT={alt}, Bilirubin={bilirubin}, Albumin={albumin}, ALP={ap}, GGT={ggt}
  Glucose={glucose}, Lactate={lactate}, CRP={crp}, PT={pt}, PTT={ptt}, D-dimer={dDimer}
  Troponin-T={troponinT}, CK={ck}, CK-MB={ckmb}, NT-proBNP={ntprobnp}
"""
)

# LangChain LLM 객체
llm = ChatOpenAI(
    openai_api_key=os.getenv("OPENAI_API_KEY"),
    model="gpt-4-1106-preview",
    temperature=0.1  # 일관성을 위해 낮게 설정
)

# Chain 구성
chain = prompt_template | llm

def clean_json_codeblock(s):
    s = s.strip()
    if s.startswith("```"):
        s = re.sub(r"^```json\s*|```$", "", s, flags=re.MULTILINE).strip()
    return s

def validate_and_adjust_result(result_dict, input_data):
    """결과 검증 및 조정"""
    
    # 점수 범위 확인
    score = result_dict.get("risk_score", 0)
    if score < 0:
        score = 0
    elif score > 100:
        score = 100
    
    # Disposition 재검증
    disposition = result_dict.get("disposition")
    
    # 명백한 오판 교정
    chief_complaint = str(input_data.get('chief_complaint', '')).upper()
    age = input_data.get('age', 0)
    acuity = input_data.get('acuity')
    
    # 경미한 증상들
    minor_symptoms = ['HAND PAIN', 'FINGER PAIN', 'MINOR LACERATION', 'COMMON COLD', 
                     'HEADACHE', 'MINOR ABRASION', 'ANKLE SPRAIN']
    
    is_minor = any(symptom in chief_complaint for symptom in minor_symptoms)
    
    # 활력징후 확인
    hr = input_data.get('HR')
    sbp = input_data.get('SBP') 
    spo2 = input_data.get('SpO2')
    
    vital_stable = True
    if hr and (hr < 50 or hr > 120):
        vital_stable = False
    if sbp and (sbp < 90 or sbp > 180):
        vital_stable = False
    if spo2 and spo2 < 90:
        vital_stable = False
    
    # 오판 교정 로직
    if is_minor and vital_stable and age < 65 and acuity and acuity >= 4:
        if disposition == 2:  # ICU로 잘못 판정된 경우
            disposition = 0  # 귀가로 교정
            score = min(score, 35)
    
    # 위험 신호가 있는데 귀가로 판정된 경우
    if (not vital_stable or age >= 80 or (acuity and acuity <= 2)) and disposition == 0:
        disposition = max(disposition, 1)  # 최소 일반병동
    
    # 점수와 disposition 일치성 확인
    if score >= 85 and disposition < 2:
        disposition = 2
    elif score >= 45 and disposition == 0:
        disposition = 1
    elif score < 45 and disposition > 1:
        disposition = min(1, disposition)
    
    return {
        "risk_score": int(score),
        "disposition": int(disposition),
        "clinical_reason": result_dict.get("clinical_reason", "")
    }

@app.route('/predict/admission', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # 입력 데이터 전처리
        input_vars = {
            "gender": data.get('gender', 0),
            "age": data.get('age', 0),
            "acuity": data.get('acuity'),
            "pain": data.get('pain'),
            "chief_complaint": data.get('chief_complaint', ''),
            "arrival_transport": data.get('arrival_transport', ''),
            "HR": data.get('HR'),
            "RR": data.get('RR'),
            "SpO2": data.get('SpO2'),
            "SBP": data.get('SBP'),
            "DBP": data.get('DBP'),
            "BT": data.get('BT'),
            # 모든 검사 결과 포함
            "hemoglobin": data.get('hemoglobin'),
            "wbc": data.get('wbc'),
            "plateletCount": data.get('plateletCount'),
            "redBloodCells": data.get('redBloodCells'),
            "sedimentationRate": data.get('sedimentationRate'),
            "na": data.get('na'),
            "k": data.get('k'),
            "chloride": data.get('chloride'),
            "ca": data.get('ca'),
            "mg": data.get('mg'),
            "ureaNitrogen": data.get('ureaNitrogen'),
            "creatinine": data.get('creatinine'),
            "ast": data.get('ast'),
            "alt": data.get('alt'),
            "bilirubin": data.get('bilirubin'),
            "albumin": data.get('albumin'),
            "ap": data.get('ap'),
            "ggt": data.get('ggt'),
            "ld": data.get('ld'),
            "ammonia": data.get('ammonia'),
            "glucose": data.get('glucose'),
            "lactate": data.get('lactate'),
            "acetone": data.get('acetone'),
            "bhb": data.get('bhb'),
            "crp": data.get('crp'),
            "pt": data.get('pt'),
            "inrPt": data.get('inrPt'),
            "ptt": data.get('ptt'),
            "dDimer": data.get('dDimer'),
            "troponinT": data.get('troponinT'),
            "ck": data.get('ck'),
            "ckmb": data.get('ckmb'),
            "ntprobnp": data.get('ntprobnp'),
            "amylase": data.get('amylase'),
            "lipase": data.get('lipase'),
            "ph": data.get('ph'),
            "pco2": data.get('pco2'),
            "po2": data.get('po2'),
            "ctco2": data.get('ctco2'),
            "bcb": data.get('bcb'),
        }
        
        result = chain.invoke(input_vars)
        
        # AIMessage → content 문자열로 변환
        if isinstance(result, AIMessage):
            result_str = result.content
        else:
            result_str = str(result)

        print("LLM 결과:", result_str)

        result_str = clean_json_codeblock(result_str)
        result_dict = json.loads(result_str)

        # 결과 검증 및 조정
        validated_result = validate_and_adjust_result(result_dict, data)

        # disposition이 정수인지 확인
        if not isinstance(validated_result.get("disposition"), int):
            return jsonify({"error": "disposition은 반드시 숫자(0,1,2)여야 합니다.", "result": validated_result}), 500

        # 순서 맞추기
        ordered_result = OrderedDict([
            ("risk_score", validated_result.get("risk_score")),
            ("disposition", validated_result.get("disposition")),
            ("clinical_reason", validated_result.get("clinical_reason")),
            ("promptNum", validated_result.get("promptNum", 3)),
        ])
        
        return jsonify({"result": ordered_result})
                       
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "서버 내부 오류", "detail": str(e)}), 500

@app.route('/predict/discharge', methods=['POST'])
def predict_discharge():
    try:
        data = request.get_json()

        input_vars = {
            "gender": data.get('gender', 0),
            "age": data.get('age', 0),
            "acuity": data.get('acuity'),
            "pain": data.get('pain'),
            "chief_complaint": data.get('chief_complaint', ''),
            "arrival_transport": data.get('arrival_transport', ''),
            "HR": data.get('HR'),
            "RR": data.get('RR'),
            "SpO2": data.get('SpO2'),
            "SBP": data.get('SBP'),
            "DBP": data.get('DBP'),
            "BT": data.get('BT'),
            # 모든 검사 결과
            "hemoglobin": data.get('hemoglobin'),
            "wbc": data.get('wbc'),
            "plateletCount": data.get('plateletCount'),
            "redBloodCells": data.get('redBloodCells'),
            "sedimentationRate": data.get('sedimentationRate'),
            "na": data.get('na'),
            "k": data.get('k'),
            "chloride": data.get('chloride'),
            "ca": data.get('ca'),
            "mg": data.get('mg'),
            "ureaNitrogen": data.get('ureaNitrogen'),
            "creatinine": data.get('creatinine'),
            "ast": data.get('ast'),
            "alt": data.get('alt'),
            "bilirubin": data.get('bilirubin'),
            "albumin": data.get('albumin'),
            "ap": data.get('ap'),
            "ggt": data.get('ggt'),
            "ld": data.get('ld'),
            "ammonia": data.get('ammonia'),
            "glucose": data.get('glucose'),
            "lactate": data.get('lactate'),
            "acetone": data.get('acetone'),
            "bhb": data.get('bhb'),
            "crp": data.get('crp'),
            "pt": data.get('pt'),
            "inrPt": data.get('inrPt'),
            "ptt": data.get('ptt'),
            "dDimer": data.get('dDimer'),
            "troponinT": data.get('troponinT'),
            "ck": data.get('ck'),
            "ckmb": data.get('ckmb'),
            "ntprobnp": data.get('ntprobnp'),
            "amylase": data.get('amylase'),
            "lipase": data.get('lipase'),
            "ph": data.get('ph'),
            "pco2": data.get('pco2'),
            "po2": data.get('po2'),
            "ctco2": data.get('ctco2'),
            "bcb": data.get('bcb'),
        }

        result = chain.invoke(input_vars)
        
        if isinstance(result, AIMessage):
            result_str = result.content
        else:
            result_str = str(result)
            
        result_str = clean_json_codeblock(result_str)
        result_dict = json.loads(result_str)
        
        # 결과 검증 및 조정
        validated_result = validate_and_adjust_result(result_dict, data)
        
        if not isinstance(validated_result.get("disposition"), int):
            return jsonify({"error": "disposition은 반드시 숫자(0,1,2)여야 합니다.", "result": validated_result}), 500
            
        ordered_result = OrderedDict([
            ("risk_score", validated_result.get("risk_score")),
            ("disposition", validated_result.get("disposition")),
            ("clinical_reason", validated_result.get("clinical_reason")),
            ("promptNum", validated_result.get("promptNum", 3)),
        ])
        
        return jsonify({"result": ordered_result})
        
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "서버 내부 오류", "detail": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
