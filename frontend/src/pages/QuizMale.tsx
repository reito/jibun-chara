import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BaseProps } from '../types'

interface Question {
  id: number
  text: string
  scores: {
    king: number
    knight: number
    prince: number
  }
}

const questions: Question[] = [
  {
    id: 1,
    text: '友人との飲み会では、自分が話の中心になることが多い。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 2,
    text: '気が付けば、他人の相談にのってアドバイスしていることが多い。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 3,
    text: '新しいことに挑戦するのが好きだ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 4,
    text: '用事がなければ自分からLINEや電話はしないタイプだ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 5,
    text: 'リーダーやキャプテンという立場になることが多い方だ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 6,
    text: '「どうにかなるさ」と考える方だ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 7,
    text: 'デートでは、行き先やスケジュールは自分が決めたい方だ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 8,
    text: '食事に行く際、相手の好きな食べ物を気にかける方だ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 9,
    text: '「突然の予定変更」にも柔軟に対応できる方だ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 10,
    text: '「人の話を最後まで聞く」のが得意だ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 11,
    text: '目標を立てると「絶対に達成する」と意気込む方だ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 12,
    text: '仲間内では「優しい」「気遣いができる」と言われることが多い。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 13,
    text: '旅行では、スケジュールをガチガチに決めるより、現地の雰囲気で動きたい。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 14,
    text: '「自分の意見はしっかり伝えるべき」と思う。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 15,
    text: '家庭より仕事を優先してしまうタイプだ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 16,
    text: '「決められたルール」に縛られるのは苦手だ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 17,
    text: 'わりとコスパ重視なタイプだ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 18,
    text: '「困った時は誰かに相談するのが一番」と思う。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 19,
    text: '「今が楽しければそれでいい」と思うことがある。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 20,
    text: '新しい環境に入ったとき、まずは自分から声をかけることが多い。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 21,
    text: '相手の話をじっくり聞いてから、自分の意見を伝えるタイプだ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 22,
    text: '「ノリで決めたこと」がうまくいくことが多い。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 23,
    text: '「やると決めたら最後までやり遂げるべきだ」と思う。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 24,
    text: '服装はデザインよりも着心地を重視する。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 25,
    text: '「予定がない週末が一番好き」だ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 26,
    text: '結婚したら家事は奥さんに任せたい。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 27,
    text: '何事もNo. 1を目指したいタイプ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 28,
    text: '結婚したら共働き希望。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 29,
    text: 'ルールは忠実に守るタイプだ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 30,
    text: '年上の女性と付き合うことに抵抗がない。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 31,
    text: '普段からオシャレには気を遣っている。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 32,
    text: '食事などに行った際女性に奢ってもらうのには抵抗がある。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 33,
    text: '思い立ったらすぐに行動するタイプだと思う。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 34,
    text: '人から尊敬されたいと思う。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 35,
    text: '人に謝るのはどちらかというと嫌いだ。',
    scores: { king: 2, knight: 0, prince: 0 },
  },
  {
    id: 36,
    text: 'リーダーの立場より支える立場の方があっていると思う。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 37,
    text: '女性に対し引っ張るより合わせてしまうことが多い。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 38,
    text: '家事育児は積極的に協力したいタイプ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 39,
    text: '自分よりは相手を優先するタイプ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 40,
    text: '衝動的な行動はどちらかというと苦手だ。',
    scores: { king: 0, knight: 2, prince: 0 },
  },
  {
    id: 41,
    text: 'まわりから可愛がられるタイプだと思う。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 42,
    text: '責任ある仕事や立場にはできるだけ就きたくない',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 43,
    text: '自分より収入の多い女性と付き合うことに抵抗はない方だ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 44,
    text: '自分の趣味ややりたいことを優先するタイプだ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
  {
    id: 45,
    text: '女性に対して求めるのは癒しだ。',
    scores: { king: 0, knight: 0, prince: 2 },
  },
]

const QuizMale: React.FC<BaseProps> = ({ basePath }) => {
  const navigate = useNavigate()
  const { slug } = useParams<{ slug: string }>()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [progress, setProgress] = useState(0)
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([])

  useEffect(() => {
    // 質問をシャッフル
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
  }, [])

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev, [`q${questionIndex}`]: value }
      const answeredCount = Object.keys(newAnswers).length
      setProgress((answeredCount / questions.length) * 100)
      return newAnswers
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 未回答の質問がないかチェック
    const unansweredQuestions = shuffledQuestions.filter(
      (q) => !answers[`q${q.id}`],
    )
    if (unansweredQuestions.length > 0) {
      const unansweredIndices = unansweredQuestions.map((q) => {
        const index = shuffledQuestions.findIndex((sq) => sq.id === q.id)
        return index + 1
      })
      alert(
        `以下の質問に回答してください：\n質問 ${unansweredIndices.join(', ')}`,
      )
      return
    }

    // 各タイプの質問数をカウント
    const totalQuestions = {
      king: 10,
      knight: 10,
      prince: 10,
    }

    // 各タイプの「そう思う」の回答数をカウント
    const selectedAnswers = { king: 0, knight: 0, prince: 0 }

    shuffledQuestions.forEach((q) => {
      const answer = answers[`q${q.id}`]
      if (answer === 'yes') {
        if (q.scores.king > 0) selectedAnswers.king++
        if (q.scores.knight > 0) selectedAnswers.knight++
        if (q.scores.prince > 0) selectedAnswers.prince++
      }
      // どちらとも言えないは0.5カウント
      else if (answer === 'neutral') {
        if (q.scores.king > 0) selectedAnswers.king += 0.5
        if (q.scores.knight > 0) selectedAnswers.knight += 0.5
        if (q.scores.prince > 0) selectedAnswers.prince += 0.5
      }
    })

    // パーセンテージを計算
    const percentages = {
      king: Math.round((selectedAnswers.king / totalQuestions.king) * 100),
      knight: Math.round(
        (selectedAnswers.knight / totalQuestions.knight) * 100,
      ),
      prince: Math.round(
        (selectedAnswers.prince / totalQuestions.prince) * 100,
      ),
    }

    // 結果ページへ遷移
    navigate(
      `/${slug}/result?gender=male&king=${percentages.king}&knight=${percentages.knight}&prince=${percentages.prince}`,
    )
  }

  return (
    <div
      style={{
        fontFamily: "'Noto Sans JP', sans-serif",
        backgroundColor: '#f0f7f7',
        color: '#333',
        margin: 0,
        padding: 0,
        lineHeight: 1.6,
      }}
    >
      <header
        style={{
          background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
          padding: '20px',
          textAlign: 'center',
          color: '#fff',
          position: 'relative',
          boxShadow: '0 4px 15px rgba(106, 193, 208, 0.2)',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: 700,
            letterSpacing: '1px',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          じぶんキャラ診断
        </h1>
      </header>

      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          backgroundColor: '#fff',
          padding: '10px 5px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        }}
      >
        <a
          href="https://blanca715.com/"
          style={{
            margin: '5px 10px',
            padding: '5px 10px',
            textDecoration: 'none',
            color: '#5fb5d0',
            fontWeight: 500,
            fontSize: '14px',
            position: 'relative',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
          }}
        >
          相談所トップ
        </a>
        <a
          href="https://blanca715.com/category/%e3%82%a4%e3%83%99%e3%83%b3%e3%83%88/"
          style={{
            margin: '5px 10px',
            padding: '5px 10px',
            textDecoration: 'none',
            color: '#5fb5d0',
            fontWeight: 500,
            fontSize: '14px',
            position: 'relative',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
          }}
        >
          イベント情報
        </a>
        <a
          href="https://blanca715.com/contact/"
          style={{
            margin: '5px 10px',
            padding: '5px 10px',
            textDecoration: 'none',
            color: '#5fb5d0',
            fontWeight: 500,
            fontSize: '14px',
            position: 'relative',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
          }}
        >
          無料相談予約
        </a>
        <a
          href="https://blanca715.com/achievement/"
          style={{
            margin: '5px 10px',
            padding: '5px 10px',
            textDecoration: 'none',
            color: '#5fb5d0',
            fontWeight: 500,
            fontSize: '14px',
            position: 'relative',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
          }}
        >
          成婚事例
        </a>
      </nav>

      <main
        style={{
          padding: '20px 15px',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '15px',
            marginBottom: '20px',
            boxShadow: '0 8px 20px rgba(106, 193, 208, 0.1)',
            border: '1px solid rgba(106, 193, 208, 0.1)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              textAlign: 'center',
              margin: 0,
              color: '#5fb5d0',
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '1px',
            }}
          >
            あなたの性格タイプを診断します
          </p>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#e9f5f7',
              borderRadius: '3px',
              marginTop: '12px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(135deg, #6ac1d0 0%, #5fb5d0 100%)',
                width: `${progress}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <p
            style={{
              marginTop: '8px',
              fontSize: '13px',
              color: '#666',
            }}
          >
            回答済み: {Object.keys(answers).length} / {questions.length} 問
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {shuffledQuestions.map((question, index) => (
            <div
              key={question.id}
              style={{
                marginBottom: '20px',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(106, 193, 208, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: '1px solid rgba(106, 193, 208, 0.1)',
              }}
            >
              <p
                style={{
                  fontSize: '16px',
                  marginBottom: '15px',
                  color: '#2c3e50',
                  fontWeight: 500,
                  paddingBottom: '10px',
                  borderBottom: '1px solid rgba(106, 193, 208, 0.1)',
                  lineHeight: 1.6,
                }}
              >
                {index + 1}. {question.text}
              </p>
              {['yes', 'neutral', 'no'].map((value) => (
                <label
                  key={value}
                  style={{
                    display: 'block',
                    margin: '12px 0',
                    cursor: 'pointer',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    transition: 'background-color 0.3s ease',
                    color: '#456',
                    fontSize: '15px',
                  }}
                >
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    value={value}
                    checked={answers[`q${question.id}`] === value}
                    onChange={() => handleAnswerChange(question.id, value)}
                    style={{
                      marginRight: '12px',
                      accentColor: '#5fb5d0',
                      backgroundColor: '#fff',
                      WebkitAppearance: 'none',
                      MozAppearance: 'none',
                      appearance: 'none',
                      width: '16px',
                      height: '16px',
                      border: '2px solid #5fb5d0',
                      borderRadius: '50%',
                      outline: 'none',
                      cursor: 'pointer',
                      position: 'relative',
                      boxSizing: 'border-box',
                    }}
                  />
                  <style>
                    {`
                      input[type="radio"]:checked {
                        background-color: #fff;
                        position: relative;
                      }
                      input[type="radio"]:checked::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 8px;
                        height: 8px;
                        background-color: #5fb5d0;
                        border-radius: 50%;
                      }
                    `}
                  </style>
                  {value === 'yes'
                    ? 'そう思う'
                    : value === 'neutral'
                      ? 'どちらとも言えない'
                      : 'そう思わない'}
                </label>
              ))}
            </div>
          ))}
          <button
            type="submit"
            style={{
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
              width: 'auto',
              minWidth: '200px',
              letterSpacing: '1px',
              boxShadow: '0 5px 15px rgba(106, 193, 208, 0.3)',
              textAlign: 'center',
            }}
          >
            診断結果を見る
          </button>
        </form>
      </main>
    </div>
  )
}

export default QuizMale
