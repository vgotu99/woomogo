import "./Main.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../Auth - Do Not Upload/firebase";
import { doc, getDoc } from "firebase/firestore";

const Main = ({ switchMainView }) => {
  const [totalUser, setTotalUser] = useState(0);
  const [copyButtonText, setCopyButtonText] = useState("링크 복사하기");
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "result", "type");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();

          const totalSumValue = Object.values(data).reduce(
            (acc, curr) => acc + curr,
            0
          );
          setTotalUser(totalSumValue);
        } else {
          console.log("no such document");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };
    fetchData();
  }, []);

  const copyUrl = () => {
    const link = "https://woomogo.vercel.app";
    navigator.clipboard.writeText(link).then(() => {
      setCopyButtonText("복사되었어요!");
      setTimeout(() => {
        setCopyButtonText("링크 복사하기");
      }, 3000);
    });
  };

  return (
    <div className="main">
      <div className="main_img">
        <img src="./main.png" alt="" />
      </div>
      <div>우리는 모두 고양이였다는 사실!! 알고 계신가요?!</div>
      <div>과거 당신의 냥생 시절 모습을 확인해보세요!</div>
      <Button
        onClick={() => switchMainView("testGuide")}
        type={"main"}
        text={"과거로 이동하기"}
      />
      <p className="test_start_text">😺 과거로 이동하기 버튼을 눌러주세요!</p>
      <div>👏 지금까지 {totalUser}명이 과거 냥생을 확인했어요!</div>
      <Button onClick={copyUrl} type={"main"} text={copyButtonText} />
      <Button
        onClick={() => nav("/feedback")}
        type={"main"}
        text={"개발자에게 한마디"}
      />
    </div>
  );
};

export default Main;
