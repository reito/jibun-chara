import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: number;
  text: string;
  scores: {
    idol: number;
    career: number;
    mother: number;
  };
}

const questions: Question[] = [
  {
    id: 1,
    text: "人から褒められると嬉しい",
    scores: { idol: 1, career: 0, mother: 0 }
  },
  {
    id: 2,
    text: "飲み会で初対面の人と話すのは得意？",
    scores: { idol: 2, career: 0, mother: 0 }
  },
  {
    id: 3,
    text: "自分の話をするより人の話を聞く方が楽しい。",
    scores: { idol: 0, career: 0, mother: 2 }
  },
  {
    id: 4,
    text: "目標に向かって努力するのが好き",
    scores: { idol: 0, career: 2, mother: 0 }
  },
  {
    id: 5,
    text: "人に頼られるのが嬉しい",
    scores: { idol: 0, career: 0, mother: 1 }
  },
  {
    id: 6,
    text: "新しいことに挑戦するのが好き",
    scores: { idol: 1, career: 1, mother: 0 }
  },
  {
    id: 7,
    text: "人前で話すのは緊張する",
    scores: { idol: 0, career: 0, mother: 1 }
  },
  {
    id: 8,
    text: "計画を立てて行動するのが好き",
    scores: { idol: 0, career: 2, mother: 0 }
  },
  {
    id: 9,
    text: "人を喜ばせるのが好き",
    scores: { idol: 1, career: 0, mother: 1 }
  },
  {
    id: 10,
    text: "自分の意見をはっきり言える",
    scores: { idol: 0, career: 2, mother: 0 }
  },
  {
    id: 11,
    text: "毎日LINEをするのは面倒くさいと感じる。",
    scores: { idol: 0, career: 2, mother: 0 }
  },
  {
    id: 12,
    text: "飲み会の席ではつい気配りして料理を取り分ける？",
    scores: { idol: 0, career: 0, mother: 2 }
  },
  {
    id: 13,
    text: "人前で話すのは緊張する",
    scores: { idol: 0, career: 0, mother: 1 }
  },
  {
    id: 14,
    text: "計画を立てて行動するのが好き",
    scores: { idol: 0, career: 2, mother: 0 }
  },
  {
    id: 15,
    text: "人を喜ばせるのが好き",
    scores: { idol: 1, career: 0, mother: 1 }
  },
  {
    id: 16,
    text: "相手に尽くすよりも、自分が尽くされる方が嬉しい？",
    scores: { idol: 2, career: 0, mother: 0 }
  },
  {
    id: 17,
    text: "たまに自分が何をしたいのかわからなくなる時がある。",
    scores: { idol: 0, career: 0, mother: 2 }
  },
  {
    id: 18,
    text: "人前で話すのは緊張する",
    scores: { idol: 0, career: 0, mother: 1 }
  },
  {
    id: 19,
    text: "計画を立てて行動するのが好き",
    scores: { idol: 0, career: 2, mother: 0 }
  },
  {
    id: 20,
    text: "人を喜ばせるのが好き",
    scores: { idol: 1, career: 0, mother: 1 }
  },
  {
    id: 21,
    text: "計画を立てたり、スケジュール管理が好きだ。",
    scores: { idol: 0, career: 2, mother: 0 }
  },
  {
    id: 22,
    text: "パートナーには優しく甘えさせてほしいと思う。",
    scores: { idol: 2, career: 0, mother: 0 }
  },
  {
    id: 23,
    text: "人前で話すのは緊張する",
    scores: { idol: 0, career: 0, mother: 1 }
  },
  {
    id: 24,
    text: "計画を立てて行動するのが好き",
    scores: { idol: 0, career: 2, mother: 0 }
  },
  {
    id: 25,
    text: "人を喜ばせるのが好き",
    scores: { idol: 1, career: 0, mother: 1 }
  },
  {
    id: 26,
    text: "自分のやるべきことはきっちりこなさないと気が済まない。",
    scores: { idol: 0, career: 2, mother: 0 }
  },
  {
    id: 27,
    text: "誰かが困っていたら放っておけない。",
    scores: { idol: 0, career: 0, mother: 2 }
  },
  {
    id: 28,
    text: "人前で話すのは緊張する",
    scores: { idol: 0, career: 0, mother: 1 }
  },
  {
    id: 29,
    text: "計画を立てて行動するのが好き",
    scores: { idol: 0, career: 2, mother: 0 }
  },
  {
    id: 30,
    text: "人を喜ばせるのが好き",
    scores: { idol: 1, career: 0, mother: 1 }
  }
];

interface QuizFemaleProps {
  basePath: string;
}

const QuizFemale: React.FC<QuizFemaleProps> = ({ basePath }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // 質問をシャッフル
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  }, []);

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [`q${questionIndex}`]: value };
      const answeredCount = Object.keys(newAnswers).length;
      setProgress((answeredCount / questions.length) * 100);
      return newAnswers;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 未回答の質問がないかチェック
    const unanswered = questions.find(q => !answers[`q${q.id}`]);
    if (unanswered) {
      alert('すべての質問に回答してください。');
      return;
    }

    // スコアの計算
    const scores = {
      idol: 0,
      career: 0,
      mother: 0
    };

    questions.forEach(q => {
      const answer = answers[`q${q.id}`];
      if (answer) {
        scores.idol += q.scores.idol;
        scores.career += q.scores.career;
        scores.mother += q.scores.mother;
      }
    });

    // パーセンテージに変換
    const total = scores.idol + scores.career + scores.mother;
    const percentages = {
      idol: Math.round((scores.idol / total) * 100),
      career: Math.round((scores.career / total) * 100),
      mother: Math.round((scores.mother / total) * 100)
    };

    // 結果ページへ遷移
    navigate(`${basePath}/result?gender=female&idol=${percentages.idol}&career=${percentages.career}&mother=${percentages.mother}`);
  };

  return (
    <div style={{
      fontFamily: "'Noto Sans JP', sans-serif",
      backgroundColor: '#f0f7f7',
      color: '#333',
      margin: 0,
      padding: 0,
      lineHeight: 1.6
    }}>
      <header style={{
        background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
        padding: '20px',
        textAlign: 'center',
        color: '#fff',
        position: 'relative',
        boxShadow: '0 4px 15px rgba(106, 193, 208, 0.2)'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: 700,
          letterSpacing: '1px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          じぶんキャラ診断
        </h1>
      </header>

      <nav style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        backgroundColor: '#fff',
        padding: '10px 5px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
      }}>
        <a href="https://blanca715.com/" style={{
          margin: '5px 10px',
          padding: '5px 10px',
          textDecoration: 'none',
          color: '#5fb5d0',
          fontWeight: 500,
          fontSize: '14px',
          position: 'relative',
          transition: 'all 0.3s ease',
          whiteSpace: 'nowrap'
        }}>相談所トップ</a>
        <a href="https://blanca715.com/category/%e3%82%a4%e3%83%99%e3%83%b3%e3%83%88/" style={{
          margin: '5px 10px',
          padding: '5px 10px',
          textDecoration: 'none',
          color: '#5fb5d0',
          fontWeight: 500,
          fontSize: '14px',
          position: 'relative',
          transition: 'all 0.3s ease',
          whiteSpace: 'nowrap'
        }}>イベント情報</a>
        <a href="https://blanca715.com/contact/" style={{
          margin: '5px 10px',
          padding: '5px 10px',
          textDecoration: 'none',
          color: '#5fb5d0',
          fontWeight: 500,
          fontSize: '14px',
          position: 'relative',
          transition: 'all 0.3s ease',
          whiteSpace: 'nowrap'
        }}>無料相談予約</a>
        <a href="https://blanca715.com/achievement/" style={{
          margin: '5px 10px',
          padding: '5px 10px',
          textDecoration: 'none',
          color: '#5fb5d0',
          fontWeight: 500,
          fontSize: '14px',
          position: 'relative',
          transition: 'all 0.3s ease',
          whiteSpace: 'nowrap'
        }}>成婚事例</a>
      </nav>

      <main style={{
        padding: '20px 15px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '20px',
          boxShadow: '0 8px 20px rgba(106, 193, 208, 0.1)',
          border: '1px solid rgba(106, 193, 208, 0.1)',
          textAlign: 'center'
        }}>
          <p style={{
            textAlign: 'center',
            margin: 0,
            color: '#5fb5d0',
            fontSize: '16px',
            fontWeight: 500,
            letterSpacing: '1px'
          }}>
            あなたの性格タイプを診断します
          </p>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e9f5f7',
            borderRadius: '3px',
            marginTop: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
              width: `${progress}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <p style={{
            marginTop: '8px',
            fontSize: '13px',
            color: '#666'
          }}>
            回答済み: {Object.keys(answers).length} / {questions.length} 問
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {questions.map((question, index) => (
            <div key={index} style={{
              marginBottom: '20px',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 8px 20px rgba(106, 193, 208, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid rgba(106, 193, 208, 0.1)'
            }}>
              <p style={{
                fontSize: '16px',
                marginBottom: '15px',
                color: '#2c3e50',
                fontWeight: 500,
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(106, 193, 208, 0.1)',
                lineHeight: 1.6
              }}>
                {index + 1}. {question.text}
              </p>
              {['yes', 'neutral', 'no'].map((value) => (
                <label key={value} style={{
                  display: 'block',
                  margin: '12px 0',
                  cursor: 'pointer',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease',
                  color: '#456',
                  fontSize: '15px'
                }}>
                  <input
                    type="radio"
                    name={`q${index}`}
                    value={value}
                    checked={answers[`q${index}`] === value}
                    onChange={() => handleAnswerChange(index, value)}
                    style={{
                      marginRight: '12px',
                      transform: 'scale(1.2)',
                      accentColor: '#5fb5d0'
                    }}
                  />
                  {value === 'yes' ? 'はい' : value === 'neutral' ? 'どちらでもない' : 'いいえ'}
                </label>
              ))}
            </div>
          ))}
          <button type="submit" style={{
            background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
            border: 'none',
            padding: '16px 30px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 500,
            cursor: 'pointer',
            borderRadius: '30px',
            transition: 'all 0.3s ease',
            display: 'block',
            margin: '30px auto',
            width: '100%',
            maxWidth: '280px',
            letterSpacing: '1px',
            boxShadow: '0 5px 15px rgba(106, 193, 208, 0.3)'
          }}>
            診断結果を見る
          </button>
        </form>
      </main>
    </div>
  );
};

export default QuizFemale; 