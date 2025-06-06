import React from "react";
import "../Style/Detail.css";
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



function Detail() {
  const { pid } = useParams(); // URL에서 pid 받기
  const location = useLocation(); // MainPage에서 넘겨준 데이터 받기
  const { name, age, sex } = location.state || {}; // state 안에서 값 꺼내기
  const navigate = useNavigate();


  return (
    <div className="screen">
      <div className="view">
        <div className="group">
          <div className="overlap">
            <div className="rectangle"></div>
            <div className="div">
              <div className="overlap-group">
                <div className="rectangle-2"></div>
                <div className="text-wrapper">75</div>
                <div className="text-wrapper-2">높음</div>
             {/*     <img className="line" src="img/line-1-4.svg" alt="line" />*/}
              </div>
              <div className="overlap-group-2">
                <div className="rectangle-3"></div>
                <div className="text-wrapper-3">낮음</div>
              </div>
              <div className="overlap-2">
                <div className="rectangle-4"></div>
                <div className="text-wrapper-3">정상</div>
              </div>
              <div className="text-wrapper-4">pCO2</div>
              <div className="text-wrapper-5">35</div>
              <div className="text-wrapper-6">45</div>
            </div>
            <div className="group-2">
              <div className="overlap-3">
                <div className="overlap-4">
                  <div className="rectangle-5"></div>
                  <div className="text-wrapper-7">높음</div>
                </div>
            {/*     <img className="img" src="img/image.svg" alt="group-img" /> */}
              </div>
              <div className="overlap-5">
                <div className="rectangle-3"></div>
                <div className="text-wrapper-3">낮음</div>
              </div>
              <div className="overlap-6">
                <div className="rectangle-4"></div>
                <div className="text-wrapper-3">정상</div>
              </div>
              <div className="text-wrapper-4">SBP</div>
              <div className="text-wrapper-8">90</div>
              <div className="text-wrapper-9">150</div>
              <div className="text-wrapper-10">140</div>
            </div>
            <div className="group-3">
              <div className="overlap-7">
                <div className="rectangle-5"></div>
                <div className="text-wrapper-7">높음</div>
              </div>
              <div className="overlap-8">
                <div className="overlap-4">
                  <div className="rectangle-3"></div>
                  <div className="text-wrapper-3">낮음</div>
                </div>
            {/*     <img className="line-2" src="img/line-1-2.svg" alt="line-2" /> */}
              </div>
              <div className="overlap-9">
                <div className="rectangle-4"></div>
                <div className="text-wrapper-3">정상</div>
              </div>
              <div className="text-wrapper-4">SpO2</div>
              <div className="text-wrapper-11">95</div>
              <div className="text-wrapper-12">92</div>
              <div className="text-wrapper-13">100</div>
            </div>
            <div className="group-4">
              <div className="overlap-10">
                <div className="rectangle-5"></div>
                <div className="text-wrapper-7">높음</div>
              </div>
              <div className="overlap-11">
                <div className="overlap-4">
                  <div className="rectangle-3"></div>
                  <div className="text-wrapper-3">낮음</div>
                </div>
            {/*     <img className="line-3" src="img/line-1-3.svg" alt="line-3" /> */}
              </div>
              <div className="overlap-12">
                <div className="rectangle-4"></div>
                <div className="text-wrapper-3">정상</div>
              </div>
              <div className="text-wrapper-4">pH</div>
              <div className="text-wrapper-14">7.35</div>
              <div className="text-wrapper-15">7.31</div>
              <div className="text-wrapper-16">7.45</div>
            </div>
            <div className="element">2025-08-06&nbsp;&nbsp;01시31분</div>
            <div className="text-wrapper-17">전체&nbsp;&nbsp;혈액 검사 보기 &gt;</div>
          </div>
        </div>
        <div className="overlap-wrapper">
          <div className="overlap-13">
            <div className="rectangle-6"></div>
            <div className="text-wrapper-18">전체&nbsp;&nbsp;혈액 검사 보기 &gt;</div>
            <div className="div">
              <div className="overlap-14">
                <div className="overlap-4">
                  <div className="rectangle-5"></div>
                  <div className="text-wrapper-7">높음</div>
                </div>
            {/*  */}    <img className="line-4" src="img/line-1.svg" alt="line-4" />
              </div>
              <div className="overlap-group-2">
                <div className="rectangle-3"></div>
                <div className="text-wrapper-3">낮음</div>
              </div>
              <div className="overlap-2">
                <div className="rectangle-4"></div>
                <div className="text-wrapper-3">정상</div>
              </div>
              <div className="text-wrapper-4">pCO2</div>
              <div className="text-wrapper-5">35</div>
              <div className="text-wrapper-19">47</div>
              <div className="text-wrapper-6">45</div>
            </div>
            <div className="group-2">
              <div className="overlap-3">
                <div className="overlap-4">
                  <div className="rectangle-5"></div>
                  <div className="text-wrapper-7">높음</div>
                </div>
            {/*     <img className="line-5" src="img/line-1-5.svg" alt="line-5" /> */}
              </div>
              <div className="overlap-5">
                <div className="rectangle-3"></div>
                <div className="text-wrapper-3">낮음</div>
              </div>
              <div className="overlap-6">
                <div className="rectangle-4"></div>
                <div className="text-wrapper-3">정상</div>
              </div>
              <div className="text-wrapper-4">SBP</div>
              <div className="text-wrapper-8">90</div>
              <div className="text-wrapper-20">141</div>
              <div className="text-wrapper-10">140</div>
            </div>
            <div className="element">2025-08-07&nbsp;&nbsp;13시 07분</div>
          </div>
        </div>
        <div className="text-wrapper-21">비정상 혈액 검사 결과</div>
      </div>
      <div className="frame">
        <div className="group-5">
          <div className="group-wrapper">
            <div className="div-wrapper">
              <div className="text-wrapper-22">Your Name</div>
            </div>
          </div>
          <div className="xnix-line-user-wrapper">
        {/*     <img className="xnix-line-user" src="img/user-5.svg" alt="user" /> */}
          </div>
          <div className="frame-2">
            <div className="overlap-group-3">
              <div className="text-wrapper-23">Number</div>
              <div className="text-wrapper-24">Content</div>
              <div className="text-wrapper-25">Created time</div>
            </div>
            <div className="text-wrapper-26">1</div>
            <div className="text-wrapper-27">2025-08-07 11:53:44</div>
            <div className="text-wrapper-28">2</div>
            <div className="text-wrapper-29">3</div>
            <div className="text-wrapper-30">2025-08-07 10:15:44</div>
            <div className="text-wrapper-31">2025-08-07 10:13:44</div>
            <div className="text-wrapper-32">혈압 호흡 회복중</div>
            <div className="text-wrapper-33">환자 의식 잃어서 대처</div>
            <div className="text-wrapper-34">혈압, 호흡 회복중</div>
          </div>
          <div className="text-wrapper-35">History</div>
          <div className="overlap-15">
            <div className="group-6">
              <div className="frame-wrapper">
                <div className="frame-3">
                  <div className="group-7"></div>
                </div>
              </div>
            </div>
            <div className="frame-4">
              <div className="text-wrapper-36">재진</div>
            </div>
            <div className="group-8">
              <div className="overlap-16">
                <div className="text-wrapper-37">KTAS</div>
                <div className="group-9">
                  <div className="group-10">
                    <div className="text-wrapper-38">Date</div>
                    <div className="overlap-group-4">
                      <div className="text-wrapper-39">Chief Complaint</div>
                      <div className="group-11">
                        <div className="text-wrapper-40">Pain</div>
                        <div className="text-wrapper-41">ADM</div>
                      </div>
                    </div>
                    <div className="text-wrapper-42">Arrival Transport</div>
                  </div>
                </div>
              </div>
              <div className="overlap-17">
                <div className="text-wrapper-43">2</div>
                <div className="group-12">
                  <div className="group-13">
                    <div className="text-wrapper-44">2025-08-06</div>
                    <div className="text-wrapper-45">Chest pain</div>
                    <div className="group-14">
                      <div className="text-wrapper-46">7</div>
                      <div className="text-wrapper-47">38967799</div>
                    </div>
                    <div className="text-wrapper-48">UNKNOWN</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="group-15">
              <div className="overlap-18">
                <div className="frame-5">
                  <p className="p">
                    <span className="span">입실 시 예측 : </span>{" "}
                    <span className="text-wrapper-49">&nbsp;&nbsp;귀가</span>
                  </p>
                  {/* <img
                    className="image"
                    src="img/image-18.png"
                    alt="prediction"
                  /> */}
                  <p>그래프</p>
                  <p className="element-2">
                    <span className="text-wrapper-50">퇴실 시 예측 :</span>{" "}
                    <span className="text-wrapper-51">&nbsp;&nbsp; 일반 병동&nbsp;&nbsp;</span>{" "}
                    <span className="text-wrapper-52">(가용 병상 수: 1 / 20)</span>
                  </p>
                  <p className="LLM">
                    <span className="span">예측 근거 :</span>{" "}
                    <span className="text-wrapper-49">
                      &nbsp;&nbsp;LLM이 왜 이렇게 최종 배체를 예측했는지 이유를 알려주는
                      블록
                    </span>
                  </p>
                </div>
                <div className="frame-6">
                  <div className="text-wrapper-53">최종 배치</div>
                </div>
              </div>
              <div className="text-wrapper-54">Disposition</div>
              <div className="text-wrapper-55">Infomation</div>
            </div>
          </div>
          <div className="overlap-19">
            <div className="text-wrapper-56" onClick={() => navigate('/')}>{name}</div>
            <div className="element-3">{age}&nbsp;&nbsp;|&nbsp;&nbsp;{sex}</div>
          </div>
        </div>
        <div className="overlap-20">
          
         {/*   <img className="xnix-line-right" src="img/right-arrow.svg" alt="right-arrow" />*/}
        </div>
        {/*<img className="xnix-line-arrow-left" src="img/arrow-left-5.svg" alt="left-arrow" /> */}
      </div>
    </div>
  );
};


export default Detail;
