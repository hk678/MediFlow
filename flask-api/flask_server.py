from openai import OpenAI
from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv

# .env 파일에서 API 키 불러오기
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)

# LLM 프롬프트  (role prompting + few shot + chain of thought + output formatting )

system_prompt = """
너는 경력 15년 이상의 응급의학과 전문의야.
아래처럼 환자 정보가 주어지면, 1차 퇴실 배치(위험도, 배치 장소,clinical_reason)을 에측하는데,
clinical_reason 항목에 반드시 임상적으로 왜 이런 결론에 도달했는지 논리적 근거(chain of thought)를 구체적으로 서술하면서 100자 이내로 작성해.
아래 예시를 참고해서 동일한 형식의 JSON으로 답변해.

예시1)
환자 정보:
- 성별: 남성
- 나이: 68
- 중증도: 높음
- 통증: 심함
- 주요 증상: 흉통
- 도착 경로: 119

{
  "risk_level": "높음",
  "disposition": "ICU",
  "clinical_reason": "고령, 심한 흉통, 119 이송, 활력징후 불안정으로 급성 심근경색 위험 매우 높아 집중치료 필요"
}

예시2)
환자 정보:
- 성별: 여성
- 나이: 23
- 중증도: 낮음
- 통증: 없음
- 주요 증상: 인후통
- 도착 경로: 도보

{
  "risk_level": "낮음",
  "disposition": "귀가",
  "clinical_reason": "젊은 여성, 경미한 인후통 외 특이 증상과 위험 요인 없어 귀가 조치 가능"
}

예시3)
환자 정보:
- 성별: 남성
- 나이: 45
- 중증도: 보통
- 통증: 복부 불편감
- 주요 증상: 우상복부 통증
- 도착 경로: 도보


{
  "risk_level": "보통",
  "disposition": "일반병동",
  "clinical_reason": "중년 남성, 12시간 이상 지속된 우상복부 통증으로 담낭염 가능성 있어 입원 후 추가 평가 필요"
}

이제 아래 환자 정보를 참고해서 위 예시와 동일한 형식으로 답해.
"""


@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    prompt = f"""
환자 정보:
- 성별: {data['gender']}
- 나이: {data['age']}
- 중증도: {data['acuity']}
- 통증: {data['pain']}
- 주요 증상: {data['chief_complaint']}
- 도착 경로: {data['arrival_transport']}
"""
    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
    )
    result = response.choices[0].message.content
    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
