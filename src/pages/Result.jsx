import "./Result.css";
import Header from "../components/Header";
import Button from "../components/Button";
import NotFound from "./NotFound";
import { typeData } from "../components/typeData";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { db } from "../../Auth - Do Not Upload/firebase";
import { doc, getDoc } from "firebase/firestore";

const Result = () => {
  const nav = useNavigate();
  const { type } = useParams();
  const [typeValue, setTypeValue] = useState(null);
  const [totalTypeValue, setTotalTypeValue] = useState(0);
  const resultSaveBoxRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "result", "type");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          const specificTypeValue = data[type];
          setTypeValue(specificTypeValue);

          const totalSumValue = Object.values(data).reduce(
            (acc, curr) => acc + curr,
            0
          );
          setTotalTypeValue(totalSumValue);
        } else {
          console.log("no such document");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };
    fetchData();
  }, [type]);

  const typeValueResult =
    typeValue && totalTypeValue
      ? ((typeValue * 100) / totalTypeValue).toFixed(1)
      : 0;

  const filteredTypeData = typeData.filter((data) => data.type === type);

  const handleShareImage = async () => {
    try {
      const resultSaveBox = resultSaveBoxRef.current;

      const canvas = await html2canvas(resultSaveBox);

      canvas.toBlob(async (blob) => {
        const file = new File([blob], `우모고_${type}타입.png`, {
          type: "image/png",
        });

        if (navigator.share) {
          try {
            await navigator.share({
              files: [file],
            });
          } catch (error) {
            console.error("이미지 공유 실패: ", error);
          }
        } else {
          alert("이 브라우저에서는 공유 기능이 지원되지 않습니다.");
        }
      });
    } catch (error) {
      console.error("html2canvas 오류: ", error);
    }
  };

  const validType = "ABCDEFGHIJKLMNOP".split("");

  if (!validType.includes(type)) {
    return <NotFound />;
  }

  return (
    <div className="result">
      <div id="result_save_box" ref={resultSaveBoxRef}>
        <Header />
        {filteredTypeData.map((data) => (
          <div className="result_wrapper" key={data.type}>
            <div className="result_img">
              <img src={`/${data.type}.png`} />
            </div>
            <div className="background_paw">
              <img src="/paw2.png" alt="" />
            </div>
            <div className="result_text">
              <div className="result_species">
                <div>👇 당신의 과거 냥생은</div>
                <div className="species_point">😸 {data.species} 고양이</div>
              </div>
              <div className="result_description1">{data.description1}</div>
              <div className="result_description2">{data.description2}</div>
              <div className="result_description3">{data.description3}</div>
            </div>
            <div className="result_type_wrapper">
              <div className="result_type_box">
                <div>우모고를 이용한</div>
                <div>고양이들 중</div>
                <div>{typeValueResult}%</div>
              </div>
              <div
                className="result_type_box"
                onClick={() => nav(`/result/${data.matchType}`)}
                style={{ cursor: "pointer" }}
              >
                <div>당신과 가장 찰떡인 고양이는 ?</div>
                <div>{data.matchSpecies} ＞</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="border"></p>
      <Button
        onClick={handleShareImage}
        type={"main"}
        text={"결과 공유 및 저장하기"}
      />
    </div>
  );
};

export default Result;
